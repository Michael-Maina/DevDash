import { v4 as uuidv4 } from 'uuid';
import redisClient from './redis.js';

class Session {
  static async setUser(value, expiration) {
    const token = uuidv4().toString();
    const session_key = `user_${token}`;
    const valueStr = value.toString();

    // Convert expiration time from hours to seconds
    const expSeconds = expiration * 60 * 60;

    console.log(`Redis connection: ${redisClient.isAlive()}`);

    try {
      redisClient.set(session_key, valueStr, expSeconds)
      console.log('Redis Setting Key Successful');
      return token;
    }
    catch (error) {
      console.error(`Redis Setting Key Error: ${error.message}`);
    };
    // console.log('After setting token');
  }

  static async getUser(token) {
    // Retrieve user access token and remaining time till expiration
    const session_key = `user_${token}`;
    try {
      const userId = redisClient.get(session_key);
      console.log(`Found user id: ${userId}`);

      const remTime = redisClient.checkExpiration(session_key);
      console.log(`Found remaining time: ${remTime}`);  

      return { userId, remTime };
    }
    catch (error) {
      console.error(`Redis Key Retrieval Error: ${error.message}`);
    }
  }

  static async deleteUser(token) {
    const session_key = `user_${token}`;
    try {
      await redisClient.del(session_key);
      console.error('Redis Key Deletion Successful');
      return;
    }
    catch (error) {
      console.error(`Redis Key Deletion Error: ${error.message}`);
    }
  }
}

export default Session;
