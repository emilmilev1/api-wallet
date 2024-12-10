import redisClient from '../../redis/redisClient';

/**
 * Retrieve cached data by key.
 */
export const getCache = async (key: string): Promise<string | null> => {
    return await redisClient.get(key);
};

/**
 * Store data in cache with expiration.
 */
export const setCache = async (key: string, value: string, ttl: number) => {
    await redisClient.set(key, value, { EX: ttl });
};
