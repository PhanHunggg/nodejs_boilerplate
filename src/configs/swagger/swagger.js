const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import all route documentations
require('./routes/auth.routes');

// Import all schema definitions
require('./schemas/auth.schema');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Go -E API',
      version: '1.0.0',
      description: 'API documentation for Go -E platform',
      contact: {
        name: 'API Support',
        email: 'support@basagishop.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
      {
        url: 'https://api.basagishop.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication and authorization operations',
      },
      // Other module tags will be added here
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  code: {
                    type: 'integer',
                    example: 400,
                  },
                  message: {
                    type: 'string',
                    example: 'Bad Request',
                  },
                },
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  code: {
                    type: 'integer',
                    example: 401,
                  },
                  message: {
                    type: 'string',
                    example: 'Unauthorized',
                  },
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  code: {
                    type: 'integer',
                    example: 404,
                  },
                  message: {
                    type: 'string',
                    example: 'Resource not found',
                  },
                },
              },
            },
          },
        },
        Conflict: {
          description: 'Conflict',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  code: {
                    type: 'integer',
                    example: 409,
                  },
                  message: {
                    type: 'string',
                    example: 'Resource already exists',
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  code: {
                    type: 'integer',
                    example: 500,
                  },
                  message: {
                    type: 'string',
                    example: 'Internal Server Error',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/configs/swagger/routes/*.js', './src/configs/swagger/schemas/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
  specs,
};