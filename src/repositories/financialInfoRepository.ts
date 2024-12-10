import dbClient from '../database/dbClient';

/**
 * Get average expenses grouped by category.
 */
export const fetchAverageExpenses = async () => {
    return await dbClient.transaction.groupBy({
        by: ['category'],
        where: { type: 'EXPENSE' },
        _avg: { amount: true },
        orderBy: { _avg: { amount: 'desc' } },
    });
};
