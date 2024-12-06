import { logger } from "../utils/logger";
import dbClient from "./dbClient";

/**
 * @description Initializes the database connection
 * @returns {Promise<void>} Promise that resolves when the database connection is established
 */
export const dbInit = async (): Promise<void> => {
    try {
        await dbClient.$connect();
        logger.info("Database connected successfully.");
    } catch (error) {
        logger.error("Database connection error: " + error);
        process.exit(1);
    }

    dbClient.$on("error", (error: any) => {
        logger.error("Database error:", error);
    });

    const gracefulShutdown = async (): Promise<never> => {
        logger.warn("Shutting down. Closing database connection...");

        try {
            await dbClient.$disconnect();

            logger.warn("Database connection closed.");
            process.exit(0);
        } catch (error) {
            logger.error("Error disconnecting from database:", error);
            process.exit(1);
        }
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
};
