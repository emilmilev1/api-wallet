import axios from 'axios';
import { ResultError } from '../utils/customErrors/resultError';
import { ExchangeRatesResponse } from '../interfaces/exchangeRatesResponse';

/**
 * Fetch exchange rates from the external API.
 * @param {string} baseCurrency - The base currency for the exchange rates.
 * @returns {Promise<Record<string, number>>} A promise that resolves with exchange rates.
 */
export const fetchExchangeRatesData = async (
    baseCurrency: string,
    symbols: string[],
): Promise<Record<string, number>> => {
    try {
        const response = await axios.get<ExchangeRatesResponse>(
            process.env.EXCHANGE_RATES_API_URL as string,
            {
                params: {
                    access_key: process.env.EXCHANGE_RATES_API_KEY,
                    params: { base: baseCurrency, symbols: symbols.join(',') },
                },
            },
        );

        if (response.status !== 200) {
            throw new ResultError('Failed to fetch exchange rates', 403);
        }

        const { rates } = response.data;
        if (!rates || typeof rates !== 'object') {
            throw new ResultError('Invalid exchange rates data received', 500);
        }

        return rates;
    } catch (error) {
        const err = error as Error;

        throw new ResultError(
            err.message || 'Error fetching exchange rates',
            500,
        );
    }
};
