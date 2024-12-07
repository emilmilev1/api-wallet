import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

/**
 * @swagger Swagger options
 */
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Wallet API",
            version: "1.0.0",
            description: "API for managing personal budgets",
        },
        servers: [
            {
                url: "http://localhost:9000/api",
                description: "Local development server",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        securityDefinitions: {
            BearerAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
                description:
                    "JWT Authorization header using the Bearer scheme. Example: `Bearer <token>`",
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ["src/routes/router.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerObj = {
    swaggerUi,
    swaggerDocs,
};

export default swaggerObj;
