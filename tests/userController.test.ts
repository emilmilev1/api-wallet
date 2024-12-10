import dbClient from '../src/database/dbClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { registerUser, loginUser } from '../src/controllers/userController';
import { ResultError } from '../src/utils/customErrors/resultError';
import { Request, Response, NextFunction } from 'express';

jest.mock('../src/database/dbClient', () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('User Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            req.body = {
                name: 'Bob',
                email: 'bob123@gmail.com',
                password: 'password123',
            };

            (dbClient.user.findUnique as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (dbClient.user.create as jest.Mock).mockResolvedValue({
                id: '1',
                email: 'bob123@gmail.com',
                name: 'Bob',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await registerUser(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User created successfully',
                user: expect.objectContaining({
                    id: '1',
                    email: 'bob123@gmail.com',
                    name: 'Bob',
                }),
            });
        });

        it('should return an error if user already exists', async () => {
            req.body = {
                name: 'Bob',
                email: 'bob123@gmail.com',
                password: 'password123',
            };

            (dbClient.user.findUnique as jest.Mock).mockResolvedValue({
                email: 'bob123@gmail.com',
            });

            await registerUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(
                new ResultError('User already exists', 409)
            );
        });

        it('should return an error if name, email, or password is missing', async () => {
            req.body = { name: 'Bob' };

            await registerUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(
                new ResultError('Name, email, and password are required', 400)
            );
        });
    });

    describe('loginUser', () => {
        it('should login successfully and return a token', async () => {
            req.body = { email: 'bob123@gmail.com', password: 'password123' };

            (dbClient.user.findUnique as jest.Mock).mockResolvedValue({
                id: '1',
                email: 'bob123@gmail.com',
                name: 'Bob',
                password: 'hashedPassword',
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mockToken');

            await loginUser(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                token: 'mockToken',
            });
        });

        it('should return an error if email or password is invalid', async () => {
            req.body = {
                email: 'wrong@example.com',
                password: 'wrongPassword',
            };

            (dbClient.user.findUnique as jest.Mock).mockResolvedValue(null);

            await loginUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(
                new ResultError('Invalid email or password', 401)
            );
        });

        it('should return an error if password is incorrect', async () => {
            req.body = { email: 'bob123@gmail.com', password: 'wrongPassword' };

            (dbClient.user.findUnique as jest.Mock).mockResolvedValue({
                id: '1',
                email: 'bob123@gmail.com',
                name: 'Bob',
                password: 'hashedPassword',
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await loginUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(
                new ResultError('Invalid email or password', 401)
            );
        });

        it('should return an error if email or password is missing', async () => {
            req.body = { email: 'bob123@gmail.com' };

            await loginUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(
                new ResultError('Email and password are required', 400)
            );
        });
    });
});
