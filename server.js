import express from "express";
import cors from "cors";
import prisma from "./prisma/PrismaClient.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import postRouter from "./router/PostRoute.js";
app.use("/posts", postRouter);

import userRouter from "./router/UserRoute.js";
app.use("/users", userRouter);

// Start server
const server = app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}, shutting down gracefully`);
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
