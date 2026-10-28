
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import prisma from "./config/prisma";
import chatRoutes from "./routes/chat.routes";
import userRoutes from "./routes/user.routes";
import { firestore } from "./config/firebase";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.use("/chat", chatRoutes);
app.use("/user", userRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Chat Backend API is running",
  });
});

app.get("/api/health/firebase", async (_req, res) => {
  try {
    await firestore.listCollections();

    res.status(200).json({
      success: true,
      message: "Firebase Firestore connection successful",
    });
  } catch (error) {
    console.error("Firebase connection error:", error);

    res.status(500).json({
      success: false,
      message: "Firebase Firestore connection failed",
    });
  }
});

app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "PostgreSQL connection successful",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "PostgreSQL connection failed",
    });
  }
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Chat Backend running on port ${PORT}`);
});
