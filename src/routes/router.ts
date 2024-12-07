import { Router } from 'express';
import userRouter from './userRoutes';
import swaggerRouter from './swaggerRoutes';

/**
 * Sets up all application routes
 * @param router Main application router
 */
export const setupRoutes = (router: Router): void => {
    router.use('/swagger', swaggerRouter);
    router.use('/users', userRouter);
};
