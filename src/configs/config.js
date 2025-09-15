const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_SECRET_ADMIN: Joi.string().required().description('JWT secret key for admin'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    TESTNET: Joi.boolean().description('BSC ENVIRONMENT'),
    LOGIN_SIGN: Joi.string().description('sign login'),
    REGISTER_SIGN: Joi.string().description('sign register'),
    UPDATE_SIGN: Joi.string().description('sign update'),
    S3_ACCESS_KEY: Joi.string().description('Access key s3'),
    S3_SECRET_KEY: Joi.string().description('Access secret key s3'),
    S3_URI: Joi.string().description('S3 uri'),
    BOT_TELEGRAM_TOKEN: Joi.string().description('BOT TOKEN TELEGRAM'),
    OAUTH_CLIENT_ID: Joi.string().description('oauth client id'),
    GOOGLE_CLIENT_ID: Joi.string().description('google client id'),
    GOOGLE_CLIENT_SECRET: Joi.string().description('google client secret id'),
    CALLBACK_URL: Joi.string().description('google url'),
    FE_URL_LOGIN: Joi.string().description('fe login url'),
    BINANCE_API_KEY: Joi.string().description('binance api key'),
    BINANCE_API_KEY_USD: Joi.string().description('binance api key usd'),
    BINANCE_API_KEY_REFRESH: Joi.string().description('binance api key refresh'),

    // auto paymnt
    PAY_PRIVATE_KEY: Joi.string().description('Binance privatekey from env'),
    PAY_WALLET: Joi.string().description('pay wallet'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  fe_url: {
    url_login: envVars.FE_URL_LOGIN,
  },
  headers: {
    secretKey: envVars.HEADER_SECRET_KEY,
  },
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'development' ? '-beta' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  social: {
    google_auth: envVars.OAUTH_CLIENT_ID,
    google_map: envVars.VITE_GOOGLE_MAPS_API_KEY,
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: envVars.CALLBACK_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    secretAdmin: envVars.JWT_SECRET_ADMIN,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  web3: {
    testNet: envVars.TESTNET,
    binanceApiKey: envVars.BINANCE_API_KEY,
    binanceApiKeyUsd: envVars.BINANCE_API_KEY_USD,
    binanceApiKeyRefresh: envVars.BINANCE_API_KEY_REFRESH,
    etherscanApiKey: envVars.ETHERSCAN_API_KEY,
  },
  binance: {
    payPrivateKey: envVars.PAY_PRIVATE_KEY,
    payWallet: envVars.PAY_WALLET,
  },
  sign: {
    login: envVars.LOGIN_SIGN,
    register: envVars.REGISTER_SIGN,
    update: envVars.UPDATE_SIGN,
  },
  url: {
    backend: envVars.BACKEND_URL,
    webFrontend: '',
  },
  s3: {
    accessKey: envVars.S3_ACCESS_KEY,
    secretKey: envVars.S3_SECRET_KEY,
    uri: envVars.S3_URI,
  }
};
