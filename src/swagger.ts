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
                url: "http://localhost:9000",
                description: "Local development server",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
