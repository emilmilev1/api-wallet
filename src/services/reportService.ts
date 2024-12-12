import { Parser } from 'json2csv';
import { fetchExchangeRatesData } from '../external/fetchExchangeRatesData';
import { ResultError } from '../utils/customErrors/resultError';
import { IReportService } from '../interfaces/service/reportService.interface';

export class ReportService implements IReportService {
    // singleton
    private static reportServiceInstance: ReportService;

    public constructor() {}

    public static getInstance(): ReportService {
        if (ReportService.reportServiceInstance == null) {
            ReportService.reportServiceInstance = new ReportService();
        }

        return ReportService.reportServiceInstance;
    }

    fetchExchangeRatesDataService = async (
        baseCurrency: string,
        symbols: string
    ): Promise<any> => {
        const targetSymbols = symbols.split(',');

        const exchangeRates = await fetchExchangeRatesData(
            baseCurrency,
            targetSymbols
        );

        if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
            throw new ResultError('Failed to fetch exchange rates', 500);
        }

        const data = Object.entries(exchangeRates).map(([symbol, rate]) => ({
            currency: symbol,
            rate,
        }));

        const fields = ['currency', 'rate'];
        const json2csvParser = new Parser({ fields });
        const csvData = json2csvParser.parse(data);

        return csvData;
    };
}
