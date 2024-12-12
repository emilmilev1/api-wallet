import { constants } from '../common/constants';
import { AverageExpense } from '../interfaces/averageExpense';
import { ITipsService } from '../interfaces/service/tipsService.interface';
import { TipsRepository } from '../repositories/tipsRepository';

export class TipsService implements ITipsService {
    // DI
    private tipsRepository: TipsRepository;

    constructor(tipsRepository: TipsRepository) {
        this.tipsRepository = tipsRepository;
    }

    async getRandomFinancialTipService(): Promise<any> {
        const randomIndex: number = Math.floor(
            Math.random() * constants.FINANCIAL_TIPS.length
        );

        const randomTip: string = constants.FINANCIAL_TIPS[randomIndex];

        return randomTip;
    }

    async fetchAverageExpensesService(): Promise<AverageExpense[]> {
        const averages = await this.tipsRepository.getAverageExpenses();

        const averageExpenses: AverageExpense[] = averages.map(
            (avg: { category: any; _avg: { amount: any } }) => ({
                category: avg.category,
                averageAmount: avg._avg.amount || 0,
            })
        );

        return averageExpenses;
    }
}
