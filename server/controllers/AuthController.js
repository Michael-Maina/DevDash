import bcrypt from 'bcryptjs';
import DBStorage from '../utils/db.js';
import User from "../utils/models/users.js";
import PortHandler from '../utils/portHandler.js';

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

		try {
			// Establish a connection to the database
			await db.connect();

			const schemaVersion = process.env.SCHEMA_VERSION || 1.0;

			// Create user port and add to assigned ports set in Redis
			const portsAssigned = process.env.REDIS_PORTS_ASSIGNED;
			const userPort = await PortHandler.assignPort();
			await PortHandler.setPort(portsAssigned, userPort);

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, async (err, hash) => {
					if (err) {
						console.error('Password Encryption Error');
						return res.status(500).redirect('/');
					}

					const hashedPassword = hash;
					const newUser = new User({
						first_name: firstName,
						last_name: lastName,
						email: email,
						password: hashedPassword,
						port: userPort,
						schema_version: schemaVersion,
					});

					if (!newUser) {
						console.error('User Creation Error');
						return res.status(400).redirect('/');
					}

					// Save new user in database
					await newUser.save();

					return res.status(200).redirect('/user/login');
				});
			});
		} catch(error) {
			console.error(`${this.signup.name}: ${error.message}`);
			return res.status(400).redirect('/auth/signup');
		}
	}
}
