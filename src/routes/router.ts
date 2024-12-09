import { Router } from 'express';
import userRouter from './userRoutes';
import swaggerRouter from './swaggerRoutes';
import transactionRouter from './transactionRoutes';
import { verifyToken } from '../middleware/authMiddleware';

/**
 * Sets up all application routes
 * @param router Main application router
 */
export const setupRoutes = (router: Router): void => {
    router.use('/users', userRouter);
    router.use('/transactions', verifyToken, transactionRouter);
    router.use('/swagger', verifyToken, swaggerRouter);
};
