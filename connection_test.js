import redisClient from './utils/redis';
import dbClient from './utils/db';

function getStatus() {
    const redis = redisClient.isAlive();
    const db = dbClient.isAlive();

    console.log({ redis, db });
}
getStatus();
