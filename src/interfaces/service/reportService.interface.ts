export interface IReportService {
    fetchExchangeRatesDataService: (
        baseCurrency: string,
        symbols: string
    ) => Promise<string>;
}
