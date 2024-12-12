import dbClient from '../database/dbClient';
import { ITipsRepository } from '../interfaces/repository/tipsRepository.interface';

export class TipsRepository implements ITipsRepository {
    /**
     * Get average expenses grouped by category.
     */
    async getAverageExpenses(): Promise<any> {
        return await dbClient.transaction.groupBy({
            by: ['category'],
            where: { type: 'EXPENSE' },
            _avg: { amount: true },
            orderBy: { _avg: { amount: 'desc' } },
        });
    }
}
