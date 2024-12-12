import { CategoryStats } from '../categoryStats';
import { TransactionType } from '../../types/transactionType';
import { MonthlySummary } from '../monthlySummary';

export interface IAnalyticsService {
    getBalanceService(userId: string, type: TransactionType[]): Promise<number>;

    getCategoryStatsService(userId: string): Promise<CategoryStats[]>;

    getMonthlySummaryTransactionsService(
        userId: string
    ): Promise<MonthlySummary>;
}
