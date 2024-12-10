import express, { Application, Request, Router } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { setupRoutes } from './routes/router';
import { errorHandler } from './utils/customErrors/errorHandler';

/**
 * @description Configures the express application
 * @returns {Application} app
 */
export const expressConfig = (): Application => {
    const router: Router = express.Router();
    const app: Application = express();

    const limiter = rateLimit({
        windowMs: 10 * 60 * 1000, // 10 min
        max: 100,
        message: 'Too many requests from this IP, please try again later.',
        keyGenerator: (req: Request) => req.ip || 'unknown',
    });
    app.use(limiter);

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'"],
                    connectSrc: ["'self'"],
                },
            },
            referrerPolicy: { policy: 'strict-origin' },
        })
    );

    app.use(
        cors({
            origin: ['http://localhost:3000'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            exposedHeaders: ['Authorization'],
        })
    );

    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/v1', router);
    setupRoutes(router);

    app.use(errorHandler);

    return app;
};
