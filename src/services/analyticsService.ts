import { IAnalyticsService } from '../interfaces/service/analyticsService.interface';
import { Transaction } from '@prisma/client';
import { CategoryStats } from '../interfaces/categoryStats';
import { TransactionType } from '../types/transactionType';
import { AnalyticsRepository } from '../repositories/analyticsRepository';
import { getCache, setCache } from '../utils/cache/cacheUtils';
import { MonthlySummary } from '../interfaces/monthlySummary';

export class AnalyticsService implements IAnalyticsService {
    // DI
    private analyticsRepository: AnalyticsRepository;

    constructor(analyticsRepository: AnalyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    async getBalanceService(
        userId: string,
        type: TransactionType[]
    ): Promise<number> {
        const [income, expense] = await Promise.all(
            type.map((t) => {
                return this.analyticsRepository.getBalance(userId, t);
            })
        );

        const currentBalance = income - expense;

        return currentBalance;
    }

    async getCategoryStatsService(userId: string): Promise<CategoryStats[]> {
        const cacheKey = `categoryStats:${userId}`;

        const cachedStats = await getCache(cacheKey);
        if (cachedStats) {
            return JSON.parse(cachedStats);
        }

        const stats = await this.analyticsRepository.getCategoryStats(userId);

        const formattedStats: CategoryStats[] = stats.map((stat) => ({
            category: stat.category,
            totalAmount: stat.totalAmount || 0,
        }));

        // Cache will expire in 1 hour.
        await setCache(cacheKey, JSON.stringify(formattedStats), 3600);

        return formattedStats;
    }

    async getMonthlySummaryTransactionsService(
        userId: string
    ): Promise<MonthlySummary> {
        const transactions: Transaction[] =
            await this.analyticsRepository.getMonthlySummaryTransactions(
                userId
            );

        const summary: MonthlySummary = transactions.reduce(
            (
                acc: MonthlySummary,
                transaction: {
                    type: TransactionType;
                    amount: number;
                    date: Date;
                }
            ) => {
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

        return summary;
    }
}
