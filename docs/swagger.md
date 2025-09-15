# Guide to Integrating New Modules in Swagger Documentation

This document provides a step-by-step guide for adding new modules to the existing Swagger/OpenAPI documentation structure for the Marketplace backend project.

## Overview

The Marketplace API documentation is built using Swagger/OpenAPI 3.0.0 specification. The documentation is generated from JSDoc comments and structured schema definitions. The current setup includes modules for:

- Authentication
- Users
- Advertisements
- Ad Features
- Ad Alerts
- Ad Quota

## Architecture

The Swagger documentation follows a modular architecture:

```
src/configs/swagger/
├── swagger.ts              # Main configuration file
├── schemas/                # Schema definitions
│   ├── users.schema.ts     # User-related schemas
│   ├── ads.schema.ts       # Advertisement-related schemas
│   └── ...
└── routes/                 # Route documentation
    ├── users.routes.ts     # User-related endpoints
    ├── ads.routes.ts       # Advertisement-related endpoints
    └── ...
```

## Integration Steps

Follow these steps to add a new module to the Swagger documentation:

### 1. Define Module Tag

First, add a new tag in the `swagger.ts` file:

```typescript
// In src/config/swagger/swagger.ts, under the tags array
{
  name: 'New Module',
  description: 'Description of the new module and its endpoints',
},
```

### 2. Create Schema Definitions

Create a new schema file in the `src/config/swagger/schemas/` directory:

```typescript
// src/config/swagger/schemas/new-module.schema.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     NewEntityName:
 *       type: object
 *       required:
 *         - requiredField1
 *         - requiredField2
 *       properties:
 *         field1:
 *           type: string
 *           description: Description of field1
 *         field2:
 *           type: number
 *           description: Description of field2
 *         nestedObject:
 *           type: object
 *           properties:
 *             nestedField:
 *               type: string
 *               description: Description of nested field
 *     
 *     NewEntityRequest:
 *       type: object
 *       required:
 *         - requiredRequestField
 *       properties:
 *         requestField:
 *           type: string
 *           description: Description of request field
 */
```

### 3. Document Routes and Endpoints

Create a new routes file in the `src/config/swagger/routes/` directory:

```typescript
// src/config/swagger/routes/new-module.routes.ts

/**
 * @swagger
 * /new-module/endpoint:
 *   get:
 *     summary: Brief description of what this endpoint does
 *     description: Detailed description of the endpoint functionality
 *     tags: [New Module]
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Description of the parameter
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Success response description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Operation successful
 *                 metaData:
 *                   $ref: '#/components/schemas/NewEntityName'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   post:
 *     summary: Create a new entity
 *     description: Detailed description of the creation process
 *     tags: [New Module]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewEntityRequest'
 *     responses:
 *       201:
 *         description: Entity created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Entity created successfully
 *                 metaData:
 *                   $ref: '#/components/schemas/NewEntityName'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
```

### 4. Import New Files in Swagger Configuration

Update the main Swagger configuration file to import your new schema and routes:

```typescript
// In src/config/swagger/swagger.ts
import './routes/new-module.routes';
import './schemas/new-module.schema';
```

## Response Format

All API responses follow a consistent format:

```typescript
{
  code: number,       // HTTP status code
  status: boolean,    // true for success, false for errors
  message: string,    // A human-readable message (already i18n translated)
  metaData: object    // The actual response data
}
```

### Common Response Patterns

For successful operations:

```typescript
{
  "code": 200,
  "status": true,
  "message": "Operation successful",
  "metaData": {
    // Your response data here
  }
}
```

For errors:

```typescript
{
  "code": 400, // or any other error code
  "status": false,
  "message": "Error message here"
}
```

## Best Practices

1. **Consistent Naming**: Use consistent naming conventions for schema definitions and endpoints.
   - For schemas: Use PascalCase (e.g., `UserProfile`)
   - For endpoints: Use kebab-case (e.g., `/user-profiles`)

2. **Detailed Descriptions**: Provide clear and concise descriptions for:
   - Tags
   - Endpoints
   - Parameters
   - Request bodies
   - Response schemas
   - Properties

3. **Group Related Endpoints**: Use the same tag for related endpoints to keep the documentation organized.

4. **Use References**: Leverage the `$ref` syntax to reference reusable schemas instead of redefining them.

5. **Document Authentication**: Always specify the security requirements for each endpoint.

6. **Document Error Responses**: Include all possible error responses, not just the success case.

7. **Provide Examples**: Add examples to make the documentation more understandable.

8. **i18n Considerations**: Remember that messages are automatically translated based on the client's locale preference. Document example values in the default language (English).

## Authentication

The API supports two authentication methods:

1. **Bearer Token**: Pass the JWT token in the `Authorization` header.
2. **Cookie Authentication**: Use the `accessToken` cookie.

Make sure to specify the appropriate security requirement for each endpoint.

## Localization Support

The API integrates with i18next for localization. When documenting response messages, note that they will be automatically translated based on the client's locale preference (extracted from the `Accept-Language` header, query parameter, or user profile).

## Testing Documentation

After adding new module documentation:

1. Start the server: `yarn dev`
2. Open the Swagger UI: http://localhost:3003/api-docs
3. Verify that:
   - Your new module appears in the tag list
   - All endpoints are correctly documented
   - Schema definitions are accurate
   - You can expand/collapse operations and models
   - Authentication works correctly

## Troubleshooting

Common issues and solutions:

1. **Documentation Not Appearing**: 
   - Check that you've imported your files in `swagger.ts`
   - Verify the JSDoc comments have the correct format with `@swagger` annotation

2. **Schema References Not Working**:
   - Ensure the schema path is correct (e.g., `#/components/schemas/YourSchema`)
   - Check for typos in schema names

3. **Syntax Errors**:
   - Look for mismatched indentation in JSDoc comments
   - Check for missing or extra asterisks (*) in comments

4. **Duplicate Route Definitions**:
   - Each path+method combination should be defined only once
   - Check for duplicate route definitions across files

## Complete Example

Here's a complete example of adding a "Transactions" module:

1. **Add Tag in swagger.ts**:
```typescript
{
  name: 'Transactions',
  description: 'Payment transaction management endpoints',
},
```

2. **Create Schema File (transactions.schema.ts)**:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Transaction ID
 *         amount:
 *           type: number
 *           description: Transaction amount
 *         currency:
 *           type: string
 *           enum: [USDT, EDC, XinCoin]
 *           description: Currency type
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           description: Transaction status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 */
```

3. **Create Routes File (transactions.routes.ts)**:
```typescript
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: List transactions
 *     description: Retrieve a list of user transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Transactions retrieved successfully
 *                 metaData:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 */
```

4. **Update swagger.ts**:
```typescript
import './routes/transactions.routes';
import './schemas/transactions.schema';
```

By following this pattern, you can seamlessly extend the API documentation with new modules while maintaining consistency and clarity.
