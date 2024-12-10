import dbClient from '../database/dbClient';
import { TransactionType } from '../types/transactionType';

/**
 * Get aggregate income or expense.
 */
export const getAggregateAmount = async (
    userId: string,
    type: TransactionType
) => {
    const result = await dbClient.transaction.aggregate({
        where: { userId, type },
        _sum: { amount: true },
    });

    return result._sum.amount || 0;
};

/**
 * Get grouped expense statistics by category.
 */
export const getExpenseStatsByCategory = async (userId: string) => {
    return await dbClient.transaction.groupBy({
        by: ['category'],
        where: { userId, type: 'EXPENSE' as TransactionType },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
    });
};

/**
 * Get all transactions for a user.
 */
export const getAllTransactions = async (userId: string) => {
    return await dbClient.transaction.findMany({
        where: { userId },
        select: { amount: true, date: true, type: true },
        orderBy: { date: 'asc' },
    });
};
