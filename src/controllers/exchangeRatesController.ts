import { Request, Response, NextFunction } from 'express';
import { ResultError } from '../utils/customErrors/resultError';
import { ExchangeRatesService } from '../services/exchangeRatesService';

const transactionService = ExchangeRatesService.getInstance();

/**
 * @description Get transactions in selected currency
 * @route GET /api/v1/exchange-rates
 */
export const exchangeRatesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { currency, symbols } = req.query;

    if (!currency || typeof currency !== 'string') {
        return next(new ResultError('Currency is required', 400));
    }

    if (!symbols || typeof symbols !== 'string') {
        return next(
            new ResultError('Target currencies (symbols) are required', 400)
        );
    }

    try {
        const exchangeRates = await transactionService.fetchExchangeRateService(
            currency as string,
            symbols as string
        );

        res.status(200).json({
            currency,
            transactionsByCurrency: exchangeRates,
        });
    } catch (error) {
        next(error);
    }
};
