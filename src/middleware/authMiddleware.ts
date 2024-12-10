import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResultError } from '../utils/customErrors/resultError';
import dbClient from '../database/dbClient';
import { JWTDecoded } from '../types/jwtToken';
import { UserDb } from '../types/userDb';

const secret = process.env.JWT_SECRET as string;

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ResultError('Authorization token is required', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secret) as JWTDecoded;

        const user: UserDb | null = await dbClient.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return next(
                new ResultError('User not found or invalid token', 404)
            );
        }

        req.user = decoded;

        next();
    } catch (error) {
        return next(new ResultError('Invalid or expired token', 403));
    }
};
