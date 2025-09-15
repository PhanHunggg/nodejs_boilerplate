"use strict";

const mongoose = require("mongoose");
const {
  db: { host, pass, name, port, user },
} = require("../configs/config.mongodb");

// Cập nhật connection string với username và password
const connectString = `mongodb://${host}:${port}/${name}?authSource=admin`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    // if (1 === 1) {
    //   mongoose.set("debug", true);
    //   mongoose.set("debug", { color: true });
    // }

    mongoose
      .connect(connectString, {
        authSource: "admin",
        user: user,
        pass: pass
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