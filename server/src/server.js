import "dotenv/config";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { registerSocket } from "./socket/index.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { csrfGuard, csrfToken } from "./middleware/csrf.js";
import { sanitizeInput } from "./middleware/xss.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }
});

app.set("io", io);
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(rateLimit({ windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000), max: Number(process.env.RATE_LIMIT_MAX || 250) }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(sanitizeInput);
app.use(hpp());
app.use(compression());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "ok", name: "SportX API" }));
app.get("/api/csrf-token", csrfToken);
app.use("/api", csrfGuard);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

registerSocket(io);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => server.listen(port, () => console.log(`SportX API running on ${port}`)))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
