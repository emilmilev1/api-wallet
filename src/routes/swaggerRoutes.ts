import { Router } from 'express';
import swaggerObj from '../swagger';
import { verifyToken } from '../middleware/authMiddleware';
import { ApiResponse } from '../types/apiResponse';

const swaggerRouter = Router();

/**
 * @description This route serves the Swagger UI
 * @param router
 * @returns void
 */
swaggerRouter.use(
    '/docs',
    swaggerObj.swaggerUi.serve,
    swaggerObj.swaggerUi.setup(
        swaggerObj.swaggerDocs,
        swaggerObj.swaggerUiOptions
    )
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Allows a user to log in by providing credentials (email & password)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful!
 *                 token:
 *                   type: string
 *                   example: "Bearer <JWT_TOKEN>"
 *       400:
 *         description: Bad Request - Invalid credentials
 *       401:
 *         description: Unauthorized
 */
swaggerRouter.post('/users/login', (req, res) => {
    const response = {
        message: 'Login successful!',
        token: 'Bearer <JWT_TOKEN>',
    };
    res.status(200).json(response);
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: User registration
 *     description: Allows a user to register by providing details (email, password, etc.)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration successful!
 *       400:
 *         description: Bad Request - Invalid data
 */
swaggerRouter.post('/users/register', (req, res) => {
    const response: ApiResponse = {
        status: 'success',
        message: 'Registration successful!',
    };
    res.status(201).json(response);
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Allows an authenticated user to create a new transaction
 *     tags:
 *       - Transactions
 *     security:
 *       - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: INCOME
 *               amount:
 *                 type: integer
 *                 example: 1000
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-12"
 *               description:
 *                 type: string
 *                 example: "Test transaction"
 *               userId:
 *                 type: string
 *                 example: "6d389103-3ea4-438c-b822-7d645ae2cfe9"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction created successfully
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "dad99e10-3eb6-43dd-bde4-9e8fefc1b72b"
 *                     amount:
 *                       type: integer
 *                       example: 1000
 *                     category:
 *                       type: string
 *                       example: Salary
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-12-12"
 *                     description:
 *                       type: string
 *                       example: "Test transaction"
 *                     userId:
 *                       type: string
 *                       example: "6d389103-3ea4-438c-b822-7d645ae2cfe9"
 *       400:
 *         description: Bad Request - Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
swaggerRouter.post('/transactions', verifyToken, (req, res) => {
    const transactionData = req.body;
    const response: ApiResponse = {
        status: 'success',
        message: 'Transaction created successfully',
        data: {
            id: 'some-generated-id',
            ...transactionData,
        },
    };
    res.status(201).json(response);
});

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     description: Fetch the details of a specific transaction by its ID
 *     tags:
 *       - Transactions
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the transaction to fetch
 *         schema:
 *           type: string
 *           example: "dad99e10-3eb6-43dd-bde4-9e8fefc1b72b"
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "dad99e10-3eb6-43dd-bde4-9e8fefc1b72b"
 *                 amount:
 *                   type: integer
 *                   example: 1000
 *                 category:
 *                   type: string
 *                   example: Salary
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-12-12"
 *                 description:
 *                   type: string
 *                   example: "Test transaction"
 *                 userId:
 *                   type: string
 *                   example: "6d389103-3ea4-438c-b822-7d645ae2cfe9"
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
swaggerRouter.get('/transactions/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const response: ApiResponse = {
        status: 'success',
        data: {
            id,
            amount: 1000,
            category: 'Salary',
            date: '2024-12-12',
            description: 'Test transaction',
            userId: '6d389103-3ea4-438c-b822-7d645ae2cfe9',
        },
        message: 'success',
    };
    res.status(200).json(response);
});

export default swaggerRouter;
