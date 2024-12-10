import express from 'express';
import { exchangeRatesController } from '../controllers/exchangeRatesController';
import { downloadTransactionsReport } from '../controllers/reportController';

const exchangeRatesRouter = express.Router();

/**
 * @description Get exchange rates
 * @route GET /api/v1/exchange-rates
 */
exchangeRatesRouter.get('/', exchangeRatesController);

/**
 * @description Download transactions report in CSV format
 * @route GET /api/v1/report
 */
exchangeRatesRouter.get('/report', downloadTransactionsReport);

export default exchangeRatesRouter;
