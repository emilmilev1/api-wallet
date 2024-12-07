import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ResultError } from './resultError';

export const errorHandler: ErrorRequestHandler = (
    err: Error | ResultError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (res.headersSent) {
        return next(err);
    }

    console.error(err);

    if (err instanceof ResultError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Internal server error.' });
    }
};
