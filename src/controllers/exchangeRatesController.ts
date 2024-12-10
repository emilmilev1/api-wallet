import { Request, Response, NextFunction } from 'express';
import { fetchExchangeRatesData } from '../external/fetchExchangeRatesData';
import { ResultError } from '../utils/customErrors/resultError';

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
        const targetSymbols = symbols.split(',');

        const exchangeRates = await fetchExchangeRatesData(
            currency as string,
            targetSymbols as string[]
        );
        if (!exchangeRates) {
            res.status(500).json({ error: 'Failed to fetch exchange rates' });
        }

        const exchangeRate = exchangeRates[currency as string];

        if (!exchangeRate) {
            res.status(400).json({ error: 'Invalid currency code' });
        }

        res.status(200).json({
            currency,
            transactionsByCurrency: exchangeRates,
        });
    } catch (error) {
        next(error);
    }
};
