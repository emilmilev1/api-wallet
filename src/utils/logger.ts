import { createLogger, format, transports, Logger } from "winston";

/**
 * @description Winston logger instance configuration
 * @type {Logger}
 * @returns Winston logger instance
 */
export const logger: Logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf((info) => {
            const { timestamp, level, message } = info;
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
    ],
});
