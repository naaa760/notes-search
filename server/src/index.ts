import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import notesRouter from "./routes/notes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://notes-search-tlv4.vercel.app",
      "https://notes-search-qmee.vercel.app",
      "https://notes-search-324z.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Add this as a middleware before routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/notes", notesRouter);

// Move this near the top, after creating the prisma client
// and before defining routes
prisma
  .$connect()
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    // Don't exit in production, but log error
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
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
