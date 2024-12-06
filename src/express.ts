import express, {
    Application,
    Request,
    Response,
    NextFunction,
    Router,
} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { setupRoutes } from "./routes/router";

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
        message: "Too many requests from this IP, please try again later.",
        keyGenerator: (req: Request) => req.ip || "unknown",
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
            referrerPolicy: { policy: "strict-origin" },
        })
    );

    app.use(
        cors({
            origin: ["http://localhost:3000"],
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            exposedHeaders: ["Authorization"],
        })
    );

    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    setupRoutes(router);
    app.use(router);

    app.use(
        (err: Error, req: Request, res: Response, next: NextFunction): void => {
            if (res.headersSent) {
                return next(err);
            }

            console.error(err.stack);

            if (
                err instanceof SyntaxError &&
                "status" in err &&
                (err as any).status === 400 &&
                "body" in err
            ) {
                res.status(400).json({ error: "Bad JSON" });
            } else {
                res.status(500).send("Internal Server Error");
            }
        }
    );

    return app;
};
