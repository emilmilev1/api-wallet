import { config } from 'dotenv';

import http from 'http';
import { expressConfig } from './express';
import { dbInit } from './database/dbInit';
import { logger } from './utils/logger/logger';

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

    const server = http.createServer(app);
    const PORT = process.env.PORT || process.env.SERVER_DEV_PORT;

    server.listen(PORT, () => {
        logger.warn(`Server running on port ${PORT}`);
    });
};

start();
