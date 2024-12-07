import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * @swagger Swagger options
 */
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Wallet API',
        version: '1.0.0',
        description: 'API for managing personal budgets',
    },
    servers: [
        {
            url: 'http://localhost:9000/api/v1/swagger/docs',
            description: 'Local development server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
};

const swaggerDocs = swaggerJsDoc({
    definition: swaggerDefinition,
    apis: ['src/routes/swaggerRoutes.ts'],
});

const swaggerObj = {
    swaggerUi,
    swaggerDocs,
};

export default swaggerObj;
