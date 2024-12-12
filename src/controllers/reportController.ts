import { Request, Response, NextFunction } from 'express';
import { ResultError } from '../utils/customErrors/resultError';
import { ReportService } from '../services/reportService';

const reportService = ReportService.getInstance();

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
        const csvData = await reportService.fetchExchangeRatesDataService(
            baseCurrency,
            symbols
        );

        res.header('Content-Type', 'text/csv');
        res.attachment('transactions_report.csv');
        res.status(200).send(csvData);
    } catch (error) {
        next(error);
    }
};
