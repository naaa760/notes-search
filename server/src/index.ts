import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import notesRouter from "./routes/notes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS configuration
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/notes", notesRouter);

// After creating the PrismaClient instance
prisma
  .$connect()
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });

// Add this near the top after imports
const handleError = (err: any) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    code: err.code,
  });
  return {
    error: err.message || "Internal Server Error",
    code: err.code,
  };
};

// Update your error middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const error = handleError(err);
    res.status(500).json(error);
  }
);

// Add this after your routes but before error handling
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Add this before the error handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
