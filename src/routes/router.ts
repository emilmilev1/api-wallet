import { Router } from 'express';

import { verifyToken } from '../middleware/authMiddleware';

import userRouter from './userRoutes';
import infoRouter from './infoRoutes';
import transactionRouter from './transactionRoutes';
import analyticsRouter from './analyticsRoutes';
import swaggerRouter from './swaggerRoutes';

/**
 * Sets up all application routes
 * @param router Main application router
 */
export const setupRoutes = (router: Router): void => {
    router.use('/users', userRouter);
    router.use('/transactions', verifyToken, transactionRouter);
    router.use('/analytics', verifyToken, analyticsRouter);
    router.use('/swagger', verifyToken, swaggerRouter);

    router.use('/info', infoRouter);
};
