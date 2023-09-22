import bcrypt from 'bcryptjs';
import DBStorage from '../utils/db.js';
import Session from '../utils/session.js';
import Cookies from '../utils/cookies.js';
import User from "../utils/models/users.js";

const db = new DBStorage();

export default class UsersController {
	static async logout(req, res){
		const userSessionToken = req.cookies.session;

		if (!userSessionToken) {
			return res.status(401).redirect('/auth/login');
		}

		try {
			const userId = await Session.getUser(userSessionToken);
			console.log(userId);
			if (!userId) {
				return res.status(401).redirect('/auth/login');
			}

			await Session.deleteUser(userSessionToken);
			// Sending cookies to browser
			res.clearCookie('session', { path: '/auth'});
			return res.status(204).redirect('/');
		}
		catch (error) {
			console.error(`Redis Session Key Retrieval Error: ${error.message}`);
		}
	}
	
	static async updateUser(req, res){
		const userSessionToken = req.cookies.get.session;

		if (!userSessionToken) {
			return res.status(401).redirect('/auth/login');
		}

		// Establish a connection to the database
		await db.connect();
		// console.log(`Is database connection alive? ${db.isAlive()}`);

		const userId = Session.getUser(userSessionToken).userId;
		if (!userId) {
			// await db.closeConnection();
			// console.log(`Is database connection alive? ${db.isAlive()}`);

			return res.status(401).redirect('/auth/login');
		}

		const user = await User.findOneById({ _id: userId });

		if (!user) {
			// await db.closeConnection();
			// console.log(`Is database connection alive? ${db.isAlive()}`);

			console.error('User Retrieval Error');
			return res.status(404).redirect('/auth/login');
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
			return res.status(401).redirect('/auth/login');
		}

		const userId = Session.getUser(userSessionToken).userId;
		if (!userId) {
			return res.status(401).redirect('/auth/login');
		}

		await db.connect();
		// console.log(`Is database connection alive? ${db.isAlive()}`);

		await User.deleteOne({ _id: userId });
		await Session.deleteUser(userSessionToken);

		// await db.closeConnection();
		// console.log(`Is database connection alive? ${db.isAlive()}`);

		return res.status(204).redirect('/');
	}

	static async googleUser(req, res){}

	static async githubUser(req, res){}
}
