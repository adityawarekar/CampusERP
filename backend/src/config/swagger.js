import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "CampusERP API",
            version: "1.0.0",
            description: "REST API for CampusERP College Management System"
        },

        servers: [
            {
                url: "http://localhost:5000"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;