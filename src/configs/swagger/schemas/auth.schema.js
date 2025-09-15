/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the user
 *           example: 60d21b4667d0d8992e610c85
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: johndoe123
 *         displayName:
 *           type: string
 *           description: The display name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           description: The email of the user (optional)
 *           example: john@example.com
 *         refId:
 *           type: string
 *           description: The unique referral ID of the user
 *           example: "1234567"
 *         balance:
 *           type: number
 *           description: The user's account balance
 *           example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *           example: "2023-09-14T14:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *           example: "2023-09-14T14:30:00Z"
 * 
 *     UserTokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         tokens:
 *           $ref: '#/components/schemas/UserTokens'
 * 
 *     RegistrationResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         tokens:
 *           $ref: '#/components/schemas/UserTokens'
 * 
 *     RegistrationRequest:
 *       type: object
 *       required:
 *         - username
 *         - displayName
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Unique username for the user
 *           example: johndoe123
 *         displayName:
 *           type: string
 *           description: User's display name
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (optional)
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: Password123!
 * 
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's username for login
 *           example: johndoe123
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: Password123!
 * 
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         code:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Error message
 *         stack:
 *           type: object
 *           description: Stack trace (only available in development environment)
 */