import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * @swagger Swagger options
 */
const swaggerDefinition = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wallet API',
            version: '1.0.0',
            description: 'API for managing personal budgets',
        },
        components: {
            securitySchemes: {
                Authorization: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    value: '',
                },
            },
        },
        servers: [
            {
                url: 'http://localhost:9000/api/v1/swagger',
                description: 'Local development server',
            },
        ],
        security: [
            {
                Authorization: [],
            },
        ],
    },
    apis: ['src/routes/swaggerRoutes.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerDefinition);

const swaggerUiOptions = {
    explorer: true,
};

const swaggerObj = {
    swaggerUi,
    swaggerDocs,
    swaggerUiOptions,
};

export default swaggerObj;
