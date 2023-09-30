import { createClient } from 'redis';
import { promisify } from 'util';


class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis Client Connection Error: ${error.message}`);
    });

    this.client.on('connect', () => {
      console.log("Redis Client connected succesfully");
    });

    this.connectAsync();
  }

  async connectAsync() {
    await this.client.connect();
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    // const getAsync = promisify(this.client.get).bind(this.client);
    try {
      const value = await this.client.get(key);
      return value;
    } catch(error) {
      console.error('Redis Key Retrieval Error');
      throw error;
    }
  }

  async set(key, value, time) {
    // const asyncSet = promisify(this.client.set).bind(this.client);
    try {
      await this.client.set(key, value, {
        EX: time
      });
      return;
    } catch(error) {
      console.error('Redis Key Setting Error');
      throw error;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch(error) {
      console.error('Redis Key Deletion Error');
      throw error;
    }
    return;
  }

  async checkExpiration(key) {
    // const asyncTtl = promisify(this.client.ttl).bind(this.client);
    try {
      const remainingTime = await this.client.ttl(key);
      return remainingTime;
    } catch(error) {
      console.error('Redis TTL Retrieval Error');
      throw error;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
