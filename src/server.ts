import { config } from 'dotenv';

import http from 'http';
import { expressConfig } from './express';
import { dbInit } from './database/dbInit';
import { logger } from './utils/logger/logger';
import redisClient from './redis/redisClient';

if (process.env.NODE_ENV !== 'production') {
    config();
}

/**
 * @description Start the server
 * @returns void
 */
const start = async (): Promise<void> => {
    const app = expressConfig();

    await dbInit();

    try {
        if (redisClient.isOpen) {
            logger.info('Redis client is ready to use.');
        } else {
            logger.error('Redis is not connected.');
        }
    } catch (error) {
        logger.error('Failed to connect to Redis:', error);
    }

    const server = http.createServer(app);
    const PORT = process.env.PORT || process.env.SERVER_DEV_PORT;

    server.listen(PORT, () => {
        logger.warn(`Server running on port ${PORT}`);
    });
};

start();
