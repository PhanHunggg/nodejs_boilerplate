"use strict";
require("dotenv").config();
const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Wsv Go -E start with: http://localhost:${PORT}`);
  console.log(`Wsv Go -E Swagger start with: http://localhost:${PORT}/api-docs`);
});

process.on("SIGINT", async () => {
  console.log("Closing server...");

  await mongoose.connection.close(); // Đóng MongoDB
  console.log("MongoDB disconnected");

  server.close(() => {
    console.log("Exit Server Express");
    process.exit(0);
  });
});
