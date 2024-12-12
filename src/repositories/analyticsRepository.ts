import dbClient from '../database/dbClient';
import { IAnalyticsRepository } from '../interfaces/analyticsRepository.interface';
import { CategoryStats } from '../interfaces/categoryStats';
import { Transaction } from '../interfaces/transaction';
import { TransactionType } from '../types/transactionType';

export class AnalyticsRepository implements IAnalyticsRepository {
    /**
     * Get aggregate income or expense.
     */
    async getBalance(userId: string, type: TransactionType): Promise<number> {
        const result = await dbClient.transaction.aggregate({
            where: { userId, type },
            _sum: { amount: true },
        });

        return result._sum.amount || 0;
    }

    /**
     * Get grouped expense statistics by category.
     */
    async getCategoryStats(userId: string): Promise<CategoryStats[]> {
        const groupedTransactions = await dbClient.transaction.groupBy({
            by: ['category'],
            where: { userId, type: 'EXPENSE' as TransactionType },
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
        });

        return groupedTransactions.map((item) => ({
            category: item.category,
            totalAmount: item._sum.amount || 0,
        }));
    }

    /**
     * Get all transactions for a user.
     */
    async getMonthlySummaryTransactions(
        userId: string
    ): Promise<Transaction[]> {
        return await dbClient.transaction.findMany({
            where: { userId },
            select: {
                id: true,
                category: true,
                userId: true,
                amount: true,
                date: true,
                description: true,
                type: true,
            },
            orderBy: { date: 'asc' },
        });
    }
}
