import { fetchExchangeRatesData } from '../external/fetchExchangeRatesData';
import { IExchangeRatesService } from '../interfaces/service/exchangeRatesService.interface';
import { ResultError } from '../utils/customErrors/resultError';

export class ExchangeRatesService implements IExchangeRatesService {
    // singleton
    static exchangeRatesServiceInstance: ExchangeRatesService;

    private constructor() {}

    public static getInstance(): ExchangeRatesService {
        if (ExchangeRatesService.exchangeRatesServiceInstance == null) {
            ExchangeRatesService.exchangeRatesServiceInstance =
                new ExchangeRatesService();
        }

        return ExchangeRatesService.exchangeRatesServiceInstance;
    }

    fetchExchangeRateService = async (
        currency: string,
        symbols: string
    ): Promise<Record<string, number>> => {
        const targetSymbols = symbols.split(',');

        const exchangeRates = await fetchExchangeRatesData(
            currency,
            targetSymbols
        );
        if (!exchangeRates) {
            throw new ResultError('Failed to fetch exchange rates', 500);
        }

        const exchangeRate = exchangeRates[currency as string];
        if (!exchangeRate) {
            throw new ResultError('Invalid currency code', 400);
        }

        return exchangeRates;
    };
}
