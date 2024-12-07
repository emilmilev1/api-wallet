import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../interfaces/user';
import dbClient from '../database/dbClient';
import { constants } from '../common/constants';
import { ResultError } from '../utils/customErrors/resultError';

/**
 * @description Register a new user
 * @param req
 * @param res
 * @param next
 * @route POST /api/v1/users/register
 */
export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(
            new ResultError('Name, email, and password are required', 400),
        );
    }

    try {
        const existingUser: User | null = await dbClient.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return next(new ResultError('User already exists', 409));
        }

        const hashedPassword = await bcrypt.hash(
            password,
            constants.BCRYPT_SALT_ROUNDS,
        );

        const newUser = await dbClient.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error: any) {
        const err = error as Error;

        next(err);
    }
};

/**
 * @description Login a user
 * @param req
 * @param res
 * @param next
 * @route POST /api/v1/users/login
 */
export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ResultError('Email and password are required', 400));
    }

    try {
        const user: User | null = await dbClient.user.findUnique({
            where: { email },
        });
        if (!user) {
            return next(new ResultError('Invalid email or password', 401));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new ResultError('Invalid email or password', 401));
        }

        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        const token = jwt.sign(userData, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });
        if (!token) {
            return next(new ResultError('Error creating token', 500));
        }

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next(error);
    }
};
