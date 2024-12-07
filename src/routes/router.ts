import { Router } from "express";
import swaggerObj from "../swagger";
import { verifyToken } from "../middleware/authMiddleware";

/**
 * @param router
 * @returns void
 */
export const setupRoutes = (router: Router): void => {
    // Swagger documentation route
    router.use(
        "/docs",
        verifyToken,
        swaggerObj.swaggerUi.serve,
        swaggerObj.swaggerUi.setup(swaggerObj.swaggerDocs)
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
     *       - BearerAuth: []  # This indicates JWT token is required
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
     */
    router.get("/health", verifyToken, (req, res) => {
        res.status(200).json({ message: "API is healthy!" });
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
     *       - BearerAuth: []  # This indicates JWT token is required
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
     */
    router.get("/example", verifyToken, (req, res) => {
        res.status(200).json({ message: "Example route!" });
    });
};
