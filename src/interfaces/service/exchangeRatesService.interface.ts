export interface IExchangeRatesService {
    fetchExchangeRateService: (
        currency: string,
        targetSymbols: string
    ) => Promise<Record<string, number>>;
}
