export interface ExchangeRatesResponse {
    rates: Record<string, number>;
    base: string;
    date: string;
}
