"use strict";

const mongoose = require("mongoose");
const {
  db: { host, pass, name, port, user },
} = require("../configs/config.mongodb");
const config = require("../configs/config");

// const connectString = `mongodb://${host}:${port}/${name}?authSource=admin`;
const connectString = config.mongoose.url;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    // if (1 === 1) {
    //   mongoose.set("debug", true);
    //   mongoose.set("debug", { color: true });
    // }

    const mongooseOptions = {
      ...config.mongoose.options,
    };

    mongoose
      .connect(connectString, {
        ...mongooseOptions,
      })
      .then((_) => {
        console.log("Connection Mongodb success");
      })
      .catch((err) => console.log("MongoDB connection error:", err.message));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;