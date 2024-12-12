import { Transaction } from '@prisma/client';
import { CategoryStats } from '../categoryStats';
import { TransactionType } from '../../types/transactionType';

export interface IAnalyticsRepository {
    getBalance(userId: string, type: TransactionType): Promise<number>;

    getCategoryStats(userId: string): Promise<CategoryStats[]>;

    getMonthlySummaryTransactions(userId: string): Promise<Transaction[]>;
}
