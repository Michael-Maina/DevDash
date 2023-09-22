import { createClient } from 'redis';
import { promisify } from 'util';


class RedisClient {
  constructor() {
    (async () => {
      this.client = createClient();
      await this.client.connect();
      this.client.on('error', (error) => {
        console.log(`Redis Client Connection Error: ${error.message}`);
      });

      this.client.on('connect', () => {
        console.log("Redis Client connected succesfully");
    });
  })();
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const value = await getAsync(key);
    return value;
  }

  async set(key, value, time) {
    const asyncSet = promisify(this.client.set).bind(this.client);
    await asyncSet(key, value, {
      EX: time
    });
    return;
  }

  async del(key) {
    this.client.del(key);
    return;
  }

  async checkExpiration(key) {
    const asyncTtl = promisify(this.client.ttl).bind(this.client);
    const remainingTime = await asyncTtl(key);
    return remainingTime;
  }
}

const redisClient = new RedisClient();
export default redisClient;
