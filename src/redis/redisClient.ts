import { createClient } from 'redis';
import { logger } from '../utils/logger/logger';

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (error) => {
    console.error('Redis client error:', error);
});

redisClient.on('connect', () => {
    logger.info('Redis client connected successfully');
});

(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error('Failed to connect to Redis:', error);
    }
})();

export default redisClient;
