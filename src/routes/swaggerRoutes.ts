import { Router } from 'express';
import swaggerObj from '../swagger';
import { verifyToken } from '../middleware/authMiddleware';

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
        swaggerObj.swaggerUiOptions,
    ),
);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     description:
 *       - Returns the health status of the API
 *     tags:
 *       - Health
 *     security:
 *       - Authorization: []
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is healthy!
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
swaggerRouter.get('/health', verifyToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is healthy!',
        time: new Date().toISOString(),
    });
});

/**
 * @swagger
 * /example:
 *   get:
 *     summary: Example route
 *     description: Returns an example message
 *     tags:
 *       - Example
 *     security:
 *       - Authorization: []
 *     responses:
 *       200:
 *         description: Example response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Example route!
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
swaggerRouter.get('/example', verifyToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Example route!',
        data: { example: true },
    });
});

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Protected route
 *     description: Accessible only with a valid Bearer token
 *     tags:
 *       - Protected
 *     security:
 *       - Authorization: []
 *     responses:
 *       200:
 *         description: Protected resource accessed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access granted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
swaggerRouter.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Access granted',
        user: req.user,
    });
});

export default swaggerRouter;
