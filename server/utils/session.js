import { v4 as uuidv4 } from 'uuid';
import redisClient from './redis.js';

class Session {
  static async setUser(value, expiration, access_token) {
    // Access token for users with Google
    if (access_token) {
      var token = access_token;
    } else {
      var token = uuidv4().toString();
    }
    const session_key = `user_${token}`;
    const valueStr = value.toString();

    // Convert expiration time from hours to seconds
    const expSeconds = expiration * 60 * 60;

    try {
      redisClient.set(session_key, valueStr, expSeconds)
      console.log('Redis Setting Key Successful');
      return token;
    }
    catch (error) {
      console.error(`Redis Setting Key Error: ${error.message}`);
      throw error;
    };
  }

  static async getUser(token) {
    // Retrieve user access token and remaining time till expiration
    const session_key = `user_${token}`;
    try {
      const userId = await redisClient.get(session_key);
      const remTime = await redisClient.checkExpiration(session_key);

      return { userId, remTime };
    }
    catch (error) {
      console.error(`Redis Key Retrieval Error: ${error.message}`);
      throw error;
    }
  }

  static async deleteUser(token) {
    const session_key = `user_${token}`;
    try {
      await redisClient.del(session_key);
      console.log('Redis Key Deletion Successful');
      return;
    }
    catch (error) {
      console.error(`Redis Key Deletion Error: ${error.message}`);
      throw error;
    }
  }
}

export default Session;
