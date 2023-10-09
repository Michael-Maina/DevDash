import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'qs';
import Cookies from '../utils/cookies.js';
import DBStorage from '../utils/db.js';
import PortHandler from '../utils/portHandler.js';
import Session from '../utils/session.js';
import User from "../utils/models/users.js";

const db = new DBStorage();

export default class GoogleAuthController {
  static async getUser(req, res) {
    // Get code from query string
    const code = req.query.code;

    // Get the id and access token using the code
    const rootUrl = process.env.GOOGLE_GET_TOKENS_URL;

    const values = {
      code,
      client_id: process.env.GOOGLE_TEST_CLIENT_ID,
      client_secret: process.env.GOOGLE_TEST_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_TEST_REDIRECT_URI,
      grant_type: 'authorization_code',
    };

    try {
      const result = await axios.post(rootUrl, qs.stringify(values), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const idToken = result.data.id_token;
      const accessToken = result.data.access_token;
      const refreshToken = result.data.refresh_token;
      const expiresIn = result.data.expires_in;
     
      // Get the user with ID token
      // Access token used with network request to Google API
      const googleUser = jwt.decode(idToken);
      if (!googleUser.email_verified) {
        return res.status(403).redirect('/auth/signup');
      }

      // Upsert the user into the database
      await db.connect()
      const schemaVersion = process.env.SCHEMA_VERSION || 1.0;

      // Create user port and add to assigned ports set in Redis
      const portsAssigned = process.env.REDIS_PORTS_ASSIGNED;
      const userPort = await PortHandler.assignPort();
      await PortHandler.setPort(portsAssigned, userPort);

      const newUser = await User.findOneAndUpdate(
        { email: googleUser.email },
        {
          first_name: googleUser.given_name,
          last_name: googleUser.family_name,
          email: googleUser.email,
          login: 'Google',
          refresh_token: refreshToken,
          port: userPort,
          schema_version: schemaVersion,
        },
        {
          upsert: true,
          new: true,
        }
      );

      // Add googleUser tokens to req object
      const userId = newUser._id.toString();

      // Create a session for the user
      const expiration = expiresIn / 3600; // Convert expires_in from seconds to hours
      const userSessionToken = await Session.setUser(userId, expiration, accessToken);
      
      const portsUsed = process.env.REDIS_PORTS_IN_USE;
      await PortHandler.setPort(portsUsed, userPort);

      // Set cookies
      const cookies = await Cookies.setCookies(userSessionToken, expiration, userPort);
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      expiryDate.toUTCString();

      // Sending cookies to browser
      res.set('Set-Cookie', [...cookies]);
      res.set('Set-Cookie', [`refresh_token=${refreshToken}`, `Expires=${expiryDate}`]);

      // Redirect back to the client
      return res.status(200).redirect(`/user/${userId}/explore`);
    } catch(error) {
      console.error(error, ': Failed to fetch Google OAuth Tokens');
      return res.status(400).redirect('/auth/signup');
    }
  }
}
