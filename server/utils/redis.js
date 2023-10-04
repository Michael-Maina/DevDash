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
      return;
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

  async setAdd(key, value) {
    // Add value as a member to the set key
    try {
      const result = await this.client.sAdd(key, value);
      if (result === 0) {
        console.log(`${value} already exists in ${key}`);
      }
      return;
    } catch(error) {
      console.error('Redis Setting Set Member Error');
      throw error;
    }
  }

  async setIsMember(key, value) {
    // Check if value is a member of the set key
    try {
      const result = await this.client.sIsMember(key, value);
      if (result === 0) {
        return false;
      } else {
        return true;
      }
    } catch(error) {
      console.error('Redis Setting Set Member Error');
      throw error;
    }
  }

  async setRemove(key, value) {
    // Remove the value as a member of the set key
    try {
      await this.client.sRem(key, value);
      return;
    } catch(error) {
      console.error('Redis Setting Set Member Error');
      throw error;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
