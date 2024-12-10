import { Request, Response, NextFunction } from 'express';
import { AverageExpense } from '../interfaces/averageExpense';
import { constants } from '../common/constants';
import { fetchAverageExpenses } from '../repositories/financialInfoRepository';

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
        const randomIndex: number = Math.floor(
            Math.random() * constants.FINANCIAL_TIPS.length
        );

        const randomTip: string = constants.FINANCIAL_TIPS[randomIndex];

        res.status(200).json({ tips: randomTip });
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
        const averages = await fetchAverageExpenses();

        const averageExpenses: AverageExpense[] = averages.map(
            (avg: { category: any; _avg: { amount: any } }) => ({
                category: avg.category,
                averageAmount: avg._avg.amount || 0,
            })
        );

        res.status(200).json({ averageExpenses });
    } catch (error) {
        next(error);
    }
};
