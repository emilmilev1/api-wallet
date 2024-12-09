import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import {
    getBalance,
    getCategoryStats,
    getMonthlySummary,
} from '../controllers/analyticsController';

const analyticsRouter = express.Router();

/**
 * @route GET /api/v1/transactions/balance
 * @description Get current balance
 */
analyticsRouter.get('/balance', verifyToken, getBalance);

/**
 * @route GET /api/v1/stats
 * @description Get statistics
 */
analyticsRouter.get('/stats', verifyToken, getCategoryStats);

/**
 * @route GET /api/v1/monthly
 * @description Get monthly income and expenses
 */
analyticsRouter.get('/monthly', verifyToken, getMonthlySummary);

export default analyticsRouter;
