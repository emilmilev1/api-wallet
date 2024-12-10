import request from 'supertest';
import start from '../../src/server';
import redisClient from '../../src/redis/redisClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let app: any = start();

jest.mock('../../src/middleware/authMiddleware', () => ({
    verifyToken: jest.fn((req, res, next) => next()),
}));

const newUser = {
    name: 'John Doe',
    email: 'john.doe1@example.com',
    password: 'password123',
};

describe('E2E Tests for Register and Login Routes', () => {
    afterAll(async () => {
        await redisClient.disconnect();
    });

    it('should register a new user', async () => {
        prisma.user.create.mockResolvedValue(newUser);

        const response = await request(app)
            .post('/api/v1/users/register')
            .send({
                name: 'John Doe',
                email: 'john.doe1@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.email).toBe(newUser.email);
    });

    it('should log in an existing user', async () => {
        await request(app).post('/api/v1/users/register').send(newUser);

        const response = await request(app).post('/api/v1/users/login').send({
            email: newUser.email,
            password: newUser.password,
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.token).toBeDefined();
    });

    it('should return 409 if user already exists during registration', async () => {
        await request(app).post('/api/v1/users/register').send(newUser);

        const response = await request(app)
            .post('/api/v1/users/register')
            .send(newUser);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('User already exists');
    });

    it('should return 401 for invalid credentials during login', async () => {
        await request(app).post('/api/v1/users/register').send(newUser);

        const response = await request(app).post('/api/v1/users/login').send({
            email: newUser.email,
            password: 'wrongpassword',
        });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 400 if name, email, or password is missing during registration', async () => {
        const response = await request(app)
            .post('/api/v1/users/register')
            .send({
                email: 'john.doe1@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toBe('Name, email, and password are required');
    });

    it('should return 400 if email or password is missing during login', async () => {
        const response = await request(app).post('/api/v1/users/login').send({
            email: 'john.doe1@example.com',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email and password are required');
    });
});
