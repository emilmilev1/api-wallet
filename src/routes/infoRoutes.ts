import express from 'express';
import {
    getAverageExpenses,
    getFinancialTips,
} from '../controllers/tipsController';

const infoRouter = express.Router();

/**
 * @route GET /api/v1/info/finance-tips
 * @description Get financial tips
 */
infoRouter.get('/finance-tip', getFinancialTips);

/**
 * @route GET /api/v1/info/average-expenses
 * @description Get average expenses by category
 */
infoRouter.get('/average-expenses', getAverageExpenses);

export default infoRouter;
