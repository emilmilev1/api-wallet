import { Request, Response, NextFunction } from 'express';
import dbClient from '../database/dbClient';
import { ResultError } from '../utils/customErrors/resultError';
import { Transaction } from '../interfaces/transaction';
import { TransactionType } from '../types/transactionType';
import { CategoryStats } from '../interfaces/categoryStats';
import { MonthlySummary } from '../interfaces/monthlySummary';
import redisClient from '../redis/redisClient';

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
        const incomes = await dbClient.transaction.aggregate({
            where: { userId, type: 'INCOME' as TransactionType },
            _sum: { amount: true },
        });

        const expenses = await dbClient.transaction.aggregate({
            where: { userId, type: 'EXPENSE' as TransactionType },
            _sum: { amount: true },
        });

        const currentBalance =
            (incomes._sum.amount || 0) - (expenses._sum.amount || 0);

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
        const cachedStats = await redisClient.get(cacheKey);
        if (cachedStats) {
            res.status(200).json({ stats: JSON.parse(cachedStats) });
        }

        const stats = await dbClient.transaction.groupBy({
            by: ['category'],
            where: { userId, type: 'EXPENSE' as TransactionType },
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
        });

        const formattedStats: CategoryStats[] = stats.map(
            (stat: { category: string; _sum: { amount: number | null } }) => ({
                category: stat.category,
                totalAmount: stat._sum.amount || 0,
            })
        );

        await redisClient.set(cacheKey, JSON.stringify(formattedStats), {
            EX: 3600,
        }); // It will expire in 1 hour.

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
        const transactions = await dbClient.transaction.findMany({
            where: { userId },
            select: { amount: true, date: true, type: true },
            orderBy: { date: 'asc' },
        });

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
