import bcrypt from 'bcryptjs';
import DBStorage from '../utils/db.js';
import Session from '../utils/session.js';
import Cookies from '../utils/cookies.js';
import User from "../utils/models/users.js";
import PortHandler from '../utils/portHandler.js';

const db = new DBStorage();

export default class UsersController {
	static async login(req, res){
		const { email, password } = req.body;

		if (!email) {
			return res.status(400).send({ error :"Missing email" });
		}
		if (!password) {
			return res.status(400).send({ error : "Missing password" });
		}

		// Establish a connection to the database
		await db.connect();

		const user = await User.findOne({ email }).exec();

		if (!user) {
			console.error(`${this.login.name}: User Retrieval Error`);
			return res.status(404).redirect('/user/signup');
		}

		// Check if user is already signed in
		const session_key = req.cookies.session;
		if (session_key) {
			let userSessionToken = await Session.getUser(session_key);
			if (userSessionToken)
				console.log('Session Token found');
				return res.status(200).redirect(`/user/${user._id}/explore`);
		}

		const hashedPassword = user.password;
		bcrypt.compare(password, hashedPassword, async (err, result) => {
			if (err) {
				console.error(`${this.login.name}: Password Decryption Error`);
				return res.status(500).redirect('/');
			}
			else if (result === true) {
				// Set session token, pass expiration time in hours
				try {
					const expiration = process.env.SESSION_EXPIRATION || 24;
					const userSessionToken = await Session.setUser(user._id, expiration);

					// Add user's assigned port to ports in use
					const portsUsed = process.env.REDIS_PORTS_IN_USE;
					await PortHandler.setPort(portsUsed, user.port);

					const cookies = await Cookies.setCookies(
						userSessionToken, expiration, user.port
						);

					// Sending cookies to browser
					res.set('Set-Cookie', [...cookies]);

					return res.status(200).redirect(`/user/${user._id}/explore`);
				} catch (error) {
						console.error(`${this.login.name}: ${error.message}`);
						return res.status(401).redirect('/user/login');
				}
			}
			else {
				return res.status(401).send('Error: Incorrect password');
			}
		})
  }

	static async logout(req, res){
		const userSessionToken = req.cookies.session;

		if (!userSessionToken) {
			return res.status(401).redirect('/user/login');
		}

		try {
			var userId = await Session.getUser(userSessionToken);
			if (!userId) {
				return res.status(401).redirect('/user/login');
			}

			await Session.deleteUser(userSessionToken);
			// Deleting cookies from browser
			res.clearCookie('session', { path: '/user'});
			if (req.cookies.port) {
				res.clearCookie('port', { path: '/user'});

				const portsUsed = process.env.REDIS_PORTS_IN_USE;
				await PortHandler.delPort(portsUsed, req.cookies.port);
			}
			return res.status(204).redirect('/');
		}
		catch (error) {
			console.error(`Logout: ${error.message}`);
			return res.status(401).redirect(`/user/${userId}/explore`);
		}
	}
	
	static async updateUser(req, res){
		const userSessionToken = req.cookies.session;

		if (!userSessionToken) {
			console.log('No session cookie found');
			return res.status(401).redirect('/user/login');
		}

		// Establish a connection to the database
		await db.connect();

		const userId = (await Session.getUser(userSessionToken)).userId;
		if (!userId) {
			return res.status(401).redirect('/user/login');
		}

		const user = await User.findById({ _id: userId });

		if (!user) {
			console.error('User Retrieval Error');
			return res.status(404).redirect('/user/login');
		}

		const { email, password, firstName, lastName } = req.body;
		if (email) {
			await User.updateOne(
				{ _id: userId }, { email }, { updated_at: new Date() });
		}
		if (password) {
			let hashedPassword;
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, async (err, hash) => {
					if (err) {
						console.error('Password Encryption Error');
						return res.status(500).redirect('/');
					}
					hashedPassword = hash;
					await User.updateOne(
						{ _id: userId }, { password: hashedPassword }, { updated_at: new Date() });
					});
			});
		}
		if (firstName) {
			await User.updateOne(
				{ _id: userId }, { first_name: firstName }, { updated_at: new Date() });
		}
		if (lastName) {
			await User.updateOne(
				{ _id: userId }, { last_name: lastName }, { updated_at: new Date() });
		}

		return res.status(200).send('User details updated successfully');
	}

	static async deleteUser(req, res){
		const userSessionToken = req.cookies.session;

		if (!userSessionToken) {
			console.log('Session token missing');
			return res.status(401).redirect('/user/login');
		}

		const userId = (await Session.getUser(userSessionToken)).userId;
		if (!userId) {
			console.log("You're not logged in");
			return res.status(401).redirect('/user/login');
		}

		await db.connect();

		await User.deleteOne({ _id: userId });
		await Session.deleteUser(userSessionToken);

		// Delete user's port from both sets in Redis
		const portsUsed = process.env.REDIS_PORTS_IN_USE;
		await PortHandler.setRemove(portsUsed, req.cookies.port);
		const portsAssigned = process.env.REDIS_PORTS_ASSIGNED;
		await PortHandler.setRemove(portsAssigned, req.cookies.port);

		return res.status(204).redirect('/');
	}

	static async googleLogin(req, res) {
		const refresh_token = req.cookies.refresh_token;
		if (!refresh_token) {
			console.error('Missing User Refresh Token from Google Login');
			return res.status(403).redirect('/auth/signup');
		}

    try {
			const rootUrl = process.env.GOOGLE_GET_TOKENS_URL;
			const refresh_token = req.cookies.refresh_token;
			const user = await User.findOne({ refresh_token }).exec();
			const userId = user._id.toString();
			const values = {
      	client_id: process.env.GOOGLE_TEST_CLIENT_ID,
      	client_secret: process.env.GOOGLE_TEST_CLIENT_SECRET,
    	  refresh_token,
  	    grant_type: 'refresh_token',
	    };

      const result = await axios.post(rootUrl, qs.stringify(values), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = result.data.access_token;
      const expiresIn = result.data.expires_in;

			// Create a session for the user
			const expiration = expiresIn / 3600; // Convert expires_in from seconds to hours
			const userSessionToken = await Session.setUser(userId, expiration, accessToken);
			
			const portsUsed = process.env.REDIS_PORTS_IN_USE;
			await PortHandler.setPort(portsUsed, user.port);

			// Set cookies
			const cookies = await Cookies.setCookies(userSessionToken, expiration, userPort);

			// Sending cookies to browser
			res.set('Set-Cookie', [...cookies]);

			// Redirect back to the client
			return res.status(200).redirect(`/user/${userId}/explore`);
		} catch(error) {
			console.error(`${this.googleLogin.name}: ${error.message}`);
			return res.status(401).redirect('/user/login');
		}
	}
}
