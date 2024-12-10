import { Request, Response, NextFunction } from 'express';
import { ResultError } from '../utils/customErrors/resultError';
import { Transaction } from '../interfaces/transaction';
import { CategoryStats } from '../interfaces/categoryStats';
import { MonthlySummary } from '../interfaces/monthlySummary';
import { getCache, setCache } from '../utils/cache/cacheUtils';
import {
    getAggregateAmount,
    getAllTransactions,
    getExpenseStatsByCategory,
} from '../repositories/analyticsRepository';

/**
 * @description Get current balance
 * @route GET /api/v1/transactions/balance
 */
export const getBalance = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user.id;

    try {
        const [income, expense] = await Promise.all([
            getAggregateAmount(userId, 'INCOME'),
            getAggregateAmount(userId, 'EXPENSE'),
        ]);

        const currentBalance = income - expense;

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
    const userId = req.user.id;
    const cacheKey = `categoryStats:${userId}`;

    try {
        const cachedStats = await getCache(cacheKey);
        if (cachedStats) {
            res.status(200).json({ stats: JSON.parse(cachedStats) });
        }

        const stats = await getExpenseStatsByCategory(userId);

        const formattedStats: CategoryStats[] = stats.map(
            (stat: { category: any; _sum: { amount: any } }) => ({
                category: stat.category,
                totalAmount: stat._sum.amount || 0,
            })
        );

        // Cache will expire in 1 hour.
        await setCache(cacheKey, JSON.stringify(formattedStats), 3600);

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
    const userId = req.user.id;

    try {
        const transactions = await getAllTransactions(userId);

        const summary: MonthlySummary = transactions.reduce(
            (acc: MonthlySummary, transaction: Transaction) => {
                const month = transaction.date.toISOString().slice(0, 7);

                if (!acc[month]) {
                    acc[month] = { income: 0, expense: 0 };
                }

                if (transaction.type === 'INCOME') {
                    acc[month].income += transaction.amount;
                } else if (transaction.type === 'EXPENSE') {
                    acc[month].expense += transaction.amount;
                }

                return acc;
            },
            {} as MonthlySummary
        );

        res.status(200).json({ monthlySummary: summary });
    } catch (error) {
        next(error);
    }
};
