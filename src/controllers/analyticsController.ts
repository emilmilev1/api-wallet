import { Request, Response, NextFunction } from 'express';
import { ResultError } from '../utils/customErrors/resultError';
import { TransactionType } from '@prisma/client';
import { MonthlySummary } from '../interfaces/monthlySummary';
import { getService } from '../di/container';
import { IAnalyticsService } from '../interfaces/analyticsService.interface';

const analyticsService = getService<IAnalyticsService>('AnalyticsService');

/**
 * @description Get current balance
 * @route GET /api/v1/transactions/balance
 */
export const getBalance = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new ResultError('User not authenticated', 401));
    }
    const userId = req.user.id;

    try {
        const currentBalance = await analyticsService.getBalanceService(
            userId,
            ['INCOME', 'EXPENSE']
        );

        res.status(200).json({ currentBalance });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Get expense statistics by category
 * @route GET /api/v1/transactions/stats
 */
export const getCategoryStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new ResultError('User not authenticated', 401));
    }
    const userId = req.user.id;

    try {
        const formattedStats =
            await analyticsService.getCategoryStatsService(userId);

        res.status(200).json({ stats: formattedStats });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Get monthly income and expenses
 * @route GET /api/v1/transactions/monthly
 */
export const getMonthlySummary = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new ResultError('User not authenticated', 401));
    }
    const userId = req.user.id;

    try {
        const summary =
            await analyticsService.getMonthlySummaryTransactionsService(userId);

        res.status(200).json({ monthlySummary: summary });
    } catch (error) {
        next(error);
    }
};
