import { Request, Response, NextFunction } from 'express';
import { Parser } from 'json2csv';
import { ResultError } from '../utils/customErrors/resultError';
import { fetchExchangeRatesData } from '../external/fetchExchangeRatesData';

/**
 * @description Download transactions report in CSV format
 * @route GET /api/v1/transactions/report
 */
export const downloadTransactionsReport = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { baseCurrency, symbols } = req.query;

    if (!baseCurrency || typeof baseCurrency !== 'string') {
        return next(new ResultError('Base currency is required', 400));
    }

    if (!symbols || typeof symbols !== 'string') {
        return next(
            new ResultError('Target currencies (symbols) are required', 400)
        );
    }

    try {
        const targetSymbols = symbols.split(',');

        const exchangeRates = await fetchExchangeRatesData(
            baseCurrency,
            targetSymbols
        );

        if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
            return next(new ResultError('Failed to fetch exchange rates', 500));
        }

        const data = Object.entries(exchangeRates).map(([symbol, rate]) => ({
            currency: symbol,
            rate,
        }));

        const fields = ['currency', 'rate'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('transactions_report.csv');
        res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
};
