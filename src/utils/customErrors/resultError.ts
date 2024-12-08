import { IResultError } from '../../interfaces/resultError';

export class ResultError extends Error implements IResultError {
    statusCode: number;
    message: string;

    /**
     * @description Custom error class
     * @param {number} statusCode - Error status code
     * @param {string} message - Error message
     */
    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
    }
}
