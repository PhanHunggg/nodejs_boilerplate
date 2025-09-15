"use strict";
const development = {
  app: {
    port: process.env.DEV_APP_PORT,
    name: process.env.DEV_APP_NAME,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    pass: process.env.DEV_DB_PASS,
    name: process.env.DEV_DB_NAME,
    port: process.env.DEV_DB_PORT,
    user: process.env.DEV_DB_USER
  },
};

const production = {
  app: {
    port: process.env.PRO_APP_PORT,
    name: process.env.PRO_APP_NAME,
  },
  db: {
    host: process.env.PRO_DB_HOST,
    pass: process.env.PRO_DB_PASS,
    name: process.env.PRO_DB_NAME,
    port: process.env.PRO_DB_PORT,
    user: "rootuser" // Thêm username cho production
  },
};

const config = { development, production };
const env = process.env.NODE_ENV || "development";

module.exports = config[env];