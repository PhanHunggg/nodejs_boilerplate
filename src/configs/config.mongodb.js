"use strict";
const development = {
  db: {
    host: process.env.DEV_DB_HOST,
    pass: process.env.DEV_DB_PASS,
    name: process.env.DEV_DB_NAME,
    port: process.env.DEV_DB_PORT,
    user: process.env.DEV_DB_USER
  },
};

const production = {
  db: {
    host: process.env.PRO_DB_HOST,
    pass: process.env.PRO_DB_PASS,
    name: process.env.PRO_DB_NAME,
    port: process.env.PRO_DB_PORT,
    user: "rootuser"
  },
};

const config = { development, production };
const env = process.env.NODE_ENV || "development";

module.exports = config[env];