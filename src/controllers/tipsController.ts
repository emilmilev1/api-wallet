import { Request, Response, NextFunction } from 'express';
import dbClient from '../database/dbClient';
import { AverageExpense } from '../interfaces/averageExpense';

/**
 * @description Get a random financial tip
 * @route GET /api/v1/info/finance-tips
 * @access Public
 */
export const getFinancialTips = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const financialTips: string[] = [
            'Set aside at least 20% of your income for savings and investments.',
            'Track your spending regularly to identify unnecessary expenses.',
            'Limit dining out expenses to 10% of your monthly budget.',
            'Shop during sales and use discounts to save on grocery expenses.',
            'Avoid borrowing money to buy depreciating assets like cars and gadgets.',
            'Invest in your education and skills to increase your earning potential.',
            'Start a side hustle or freelance work to earn extra income.',
            'Avoid emotional spending by waiting 24 hours before making a purchase.',
            'Use cash or debit cards instead of credit cards to avoid debt.',
            'Review your insurance coverage to ensure you are not overpaying for premiums.',
        ];

        const randomIndex: number = Math.floor(
            Math.random() * financialTips.length
        );
        const randomTip: string = financialTips[randomIndex];

        const data = {
            tips: randomTip,
        };

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Get average expenses by category
 * @route GET /api/v1/info/average-expenses
 * @access Public
 */
export const getAverageExpenses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const averages = await dbClient.transaction.groupBy({
            by: ['category'],
            where: { type: 'EXPENSE' },
            _avg: { amount: true },
            orderBy: { _avg: { amount: 'desc' } },
        });

        const data: { averageExpenses: AverageExpense[] } = {
            averageExpenses: averages.map(
                (avg: {
                    category: string;
                    _avg: { amount: number | null };
                }) => ({
                    category: avg.category,
                    averageAmount: avg._avg.amount || 0,
                })
            ),
        };

        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
};
