import { AverageExpense } from '../averageExpense';

export interface ITipsService {
    getRandomFinancialTipService: () => Promise<string>;

    fetchAverageExpensesService: () => Promise<AverageExpense[]>;
}
