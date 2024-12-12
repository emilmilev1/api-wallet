import { Request, Response, NextFunction } from 'express';
import { ITipsService } from '../interfaces/service/tipsService.interface';
import { getService } from '../di/container';

const tipService = getService<ITipsService>('TipsService');

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
        const randomTip = await tipService.getRandomFinancialTipService();

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
        const averageExpenses = await tipService.fetchAverageExpensesService();

        res.status(200).json({ averageExpenses });
    } catch (error) {
        next(error);
    }
};
