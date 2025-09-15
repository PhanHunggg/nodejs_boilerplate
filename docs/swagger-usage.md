# Swagger Integration for Go -E API

This documentation explains how to use and extend the Swagger API documentation for the Go -E backend.

## Accessing Swagger UI

Once the server is running, you can access the Swagger UI at:

```plaintext
http://localhost:3000/api-docs
```

The Swagger UI allows you to:

- Explore available API endpoints
- View request and response schemas
- Test API endpoints directly from the browser

## Project Structure

The Swagger integration follows a modular architecture:

```plaintext
src/configs/swagger/
├── swagger.js              # Main configuration file
├── schemas/                # Schema definitions
│   └── auth.schema.js      # Authentication-related schemas
└── routes/                 # Route documentation
    └── auth.routes.js      # Authentication endpoints
```

## Adding New Endpoints

To document new endpoints:

1. Create or update schema files in `src/configs/swagger/schemas/`
2. Create or update route documentation in `src/configs/swagger/routes/`
3. Register new files in `src/configs/swagger/swagger.js` by adding import statements

## Best Practices

1. **Keep Documentation Updated**: Always update the Swagger documentation when adding or changing API endpoints
2. **Be Descriptive**: Provide clear descriptions for all parameters and responses
3. **Include Examples**: Add example values to make the API easier to understand
4. **Document Error Responses**: Include all possible error responses for each endpoint
5. **Maintain Consistency**: Follow the established pattern for API documentation

## Example Usage

The Swagger documentation for the Authentication module provides examples of how to document:

- Request schemas
- Response schemas
- Path parameters
- Query parameters
- Error responses

## Authentication

The API uses JWT authentication. In Swagger UI, you can:

1. Login using the `/auth/login` endpoint
2. Copy the returned access token
3. Click the "Authorize" button and paste the token
4. Use authenticated endpoints

## Further Documentation

For more details about the OpenAPI specification, visit:

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger JSDoc Documentation](https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md)