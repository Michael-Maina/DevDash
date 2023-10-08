import bcrypt from 'bcryptjs';
import DBStorage from '../utils/db.js';
import Session from '../utils/session.js';
import Cookies from '../utils/cookies.js';
import User from "../utils/models/users.js";

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
		// console.log(`Is database connection alive? ${db.isAlive()}`);

		const user = await User.findOne({ email }).exec();

		if (!user) {
			// await db.closeConnection();

			console.error('User Retrieval Error');
			return res.status(404).redirect('/user/signup');
		}

		// Check if user is already signed in
		const session_key = req.cookies.session;
		console.log(`Session_cookie: ${session_key}`);
		if (session_key) {
			let userSessionToken = await Session.getUser(session_key);
			// userSessionToken.then((res) => console.log(`This is the promise: ${res}`));
			console.log(`Checking if user signed in: ${userSessionToken.userId}`);
			if (userSessionToken)
				return res.status(200).redirect(`/user/${user._id}/explore`);
		}

		const hashedPassword = user.password;
		bcrypt.compare(password, hashedPassword, async (err, result) => {
			if (err) {
				// await db.closeConnection();
				// console.log(`Is database connection alive? ${db.isAlive()}`);

				console.error('Password Decryption Error');
				return res.status(500).redirect('/');
			}
			else if (result === true) {
				// Set session token, pass expiration time in hours
				try {
					const expiration = process.env.SESSION_EXPIRATION || 24;
					const userSessionToken = await Session.setUser(user._id, expiration);

					const cookies = await Cookies.setCookies(userSessionToken, expiration);

					// Sending cookies to browser
					res.set('Set-Cookie', [...cookies]);
					// await db.closeConnection();
					// console.log(`Is database connection alive? ${db.isAlive()}`);

					return res.status(200).redirect(`/user/${user._id}/explore`);
				} catch (error) {
						console.error(`Session Key Creation Error: ${error.message}`);
				}
			}
			else {
				// await db.closeConnection();
				// console.log(`Is database connection alive? ${db.isAlive()}`);

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
			const userId = await Session.getUser(userSessionToken);
			console.log(userId);
			if (!userId) {
				return res.status(401).redirect('/user/login');
			}

			await Session.deleteUser(userSessionToken);
			// Sending cookies to browser
			res.clearCookie('session', { path: '/user'});
			return res.status(204).redirect('/');
		}
		catch (error) {
			console.error(`Redis Session Key Retrieval Error: ${error.message}`);
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
		// console.log(`Is database connection alive? ${db.isAlive()}`);

		const userId = (await Session.getUser(userSessionToken)).userId;
		if (!userId) {
			// await db.closeConnection();
			// console.log(`Is database connection alive? ${db.isAlive()}`);

			return res.status(401).redirect('/user/login');
		}

		const user = await User.findById({ _id: userId });

		if (!user) {
			// await db.closeConnection();
			// console.log(`Is database connection alive? ${db.isAlive()}`);

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
						// await db.closeConnection();
						// console.log(`Is database connection alive? ${db.isAlive()}`);

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

		// Close connection to the database
		// await db.closeConnection();
		// console.log(`Is database connection alive? ${db.isAlive()}`);

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
		// console.log(`Is database connection alive? ${db.isAlive()}`);

		await User.deleteOne({ _id: userId });
		await Session.deleteUser(userSessionToken);

		// await db.closeConnection();
		// console.log(`Is database connection alive? ${db.isAlive()}`);

		return res.status(204).redirect('/');
	}

	static async googleLogin(req, res) {
		/** 
		 * Receives userTokenData from middleware
		 * Sets access_token as session token
		 * If access_token expired, use refresh token to acquire a new one
		 * Automatically sign in user and redirect to explore page
		 * 
		*/

		// Check if user is already signed in
		const session_key = req.cookies.session;
		console.log(`Session_cookie: ${session_key}`);
		if (session_key) {
		  let userSessionToken = await Session.getUser(session_key);
		  console.log(`Checking if user signed in: ${userSessionToken.userId}`);

		  if (userSessionToken)
		    return res.status(200).redirect(`/user/${userSessionToken.userId}/explore`);
		}

		const userTokenData = req.userTokenData;
		console.log(`User Token Data: ${userTokenData}`);
		if (!userTokenData) {
			console.error('Missing User Token Data from Google Login');
			return res.status(403).redirect('/user/login');
		}

		// Create a session for the user
		const expiration = userTokenData.expires_in / 3600; // Convert expires_in from seconds to hours
		const userSessionToken = await Session.setUser(userTokenData.userId, expiration);

		// Set cookies
		const cookies = await Cookies.setCookies(userSessionToken, expiration);

		// Sending cookies to browser
		res.set('Set-Cookie', [...cookies]);
		// await db.closeConnection();
		// console.log(`Is database connection alive? ${db.isAlive()}`);

		// Redirect back to the client
		return res.status(200).redirect(`/user/${userTokenData.userId}/explore`);
	}
}
