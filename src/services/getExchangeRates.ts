import { fetchExchangeRatesData } from '../external/fetchExchangeRatesData';

/**
 * Service to get exchange rates and process them for the application.
 * @param {string} baseCurrency - The base currency for the exchange rates.
 * @param {string[]} symbols - List of target currencies.
 * @returns {Promise<Record<string, number>>} Processed exchange rates.
 */
export const getExchangeRates = async (
    baseCurrency: string,
    symbols: string[]
): Promise<Record<string, number>> => {
    return await fetchExchangeRatesData(baseCurrency, symbols);
};
