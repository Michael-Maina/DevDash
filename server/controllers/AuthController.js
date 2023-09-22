import bcrypt from 'bcryptjs';
import DBStorage from '../utils/db.js';
import Session from '../utils/session.js';
import Cookies from '../utils/cookies.js';
import User from "../utils/models/users.js";

const db = new DBStorage();

export default class AuthController {
  static async signup(req, res){
		const { email, password, firstName, lastName } = req.body;

		if (!email) {
			return res.status(400).send({ error :"Missing email" });
		}
		if (!password) {
			return res.status(400).send({ error : "Missing password" });
		}
		if (!firstName) {
			return res.status(400).send({ error :"Missing first name" });
		}
		if (!lastName) {
			return res.status(400).send({ error : "Missing last name" });
		}

		// Establish a connection to the database
		await db.connect();
		console.log(`Is database connection alive? ${db.isAlive()}`);

		const schemaVersion = process.env.SCHEMA_VERSION || 1.0;

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, async (err, hash) => {
				if (err) {
					// await db.closeConnection();
					console.error('Password Encryption Error');
					return res.status(500).redirect('/');
				}
				const hashedPassword = hash;
				const newUser = new User({
					first_name: firstName,
					last_name: lastName,
					email: email,
					password: hashedPassword,
					salt: salt,
					schema_version: schemaVersion,
				});

				if (!newUser) {
					// await db.closeConnection();

					console.error('User Creation Error');
					return res.status(400).redirect('/');
				}

				// Save new user in database and close connection
				await newUser.save();
				// await db.closeConnection();
				// console.log(`Is database connection alive? ${db.isAlive()}`);

				return res.redirect(302, '/auth/login');
			});
		});
	}

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
			return res.status(404).redirect('/auth/login');
		}

		// Check if user is already signed in
		const session_key = req.cookies.session;
		// console.log(`Session_cookie: ${session_key}`);
		if (session_key) {
			let userSessionToken = await Session.getUser(session_key);
			// console.log(`Checking if user signed in: ${userSessionToken.userId}`);
			if (userSessionToken)
				return res.status(200).redirect(`/${user._id}/explore`);
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

					return res.status(200).redirect(`/${user._id}/explore`);
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
}
