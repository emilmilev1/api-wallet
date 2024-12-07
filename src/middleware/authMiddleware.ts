import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResultError } from '../utils/customErrors/resultError';

const secret = process.env.JWT_SECRET as string;

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ResultError('Authorization token is required', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        console.log('User:', req.user);
        next();
    } catch (error) {
        return next(new ResultError('Invalid or expired token', 403));
    }
};
