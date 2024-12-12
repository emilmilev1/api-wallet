import request from 'supertest';
import dotenv from 'dotenv';
import dbClient from '../../src/database/dbClient';

dotenv.config();

const baseUrl = process.env.BASE_URL || 'http://localhost:9000/api/v1';

describe('User Authentication E2E Tests', () => {
    beforeAll(() => {});

    afterEach(() => {
        jest.clearAllMocks();
        dbClient.$disconnect();
    });

    function generateRandomNumber() {
        return Math.floor(Math.random() * 10000);
    }

    describe('POST /users/register', () => {
        it('should successfully register a new user', async () => {
            const randomNumber = generateRandomNumber();

            const newUser = {
                name: 'Test User',
                email: `test${randomNumber}@example.com`,
                password: 'password123',
            };

            const response = await request(baseUrl)
                .post('/users/register')
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
            expect(response.body.user.email).toBe(newUser.email);
        });

        it('should return error if the user already exists', async () => {
            const existingUser = {
                id: '1',
                name: 'Test User',
                email: 'test11@example.com',
                password: 'password123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const response = await request(baseUrl)
                .post('/users/register')
                .send(existingUser);

            expect(response.status).toBe(409);
            expect(response.body.error).toBe('User already exists');
        });

        it('should return error if name, email, or password are missing', async () => {
            const response = await request(baseUrl)
                .post('/users/register')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                'Name, email, and password are required'
            );
        });
    });

    describe('POST /users/login', () => {
        it('should successfully login and return a token', async () => {
            const user = {
                id: '1',
                email: 'testuser@example.com',
                name: 'Test User',
                password: 'testpassword',
            };

            const validPassword = 'testpassword';

            // mock bcrypt and JWT
            const response = await request(baseUrl)
                .post('/users/login')
                .send({ email: user.email, password: validPassword });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toMatch(
                /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/
            );
        });

        it('should return error if the user does not exist', async () => {
            const nonExistentUser = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            const response = await request(baseUrl)
                .post('/users/login')
                .send(nonExistentUser);

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid email or password');
        });

        it('should return error if password is incorrect', async () => {
            const user = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                password: 'hashedPassword',
            };
            const invalidPassword = 'wrongPassword';

            const response = await request(baseUrl)
                .post('/users/login')
                .send({ email: user.email, password: invalidPassword });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid email or password');
        });

        it('should return error if email or password are missing', async () => {
            const response = await request(baseUrl)
                .post('/users/login')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email and password are required');
        });
    });
});
