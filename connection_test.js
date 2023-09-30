import redisClient from './server/utils/redis';
import dbClient from './server/utils/db';

function getStatus() {
    const redis = redisClient.isAlive();
    const db = dbClient.isAlive();

    console.log({ redis, db });
}
getStatus();
