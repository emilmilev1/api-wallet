export class ResultError extends Error {
    statusCode: number;

    /**
     * @description Custom error class
     * @param {string} message - Error message
     * @param {number} statusCode - Error status code
     */
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
