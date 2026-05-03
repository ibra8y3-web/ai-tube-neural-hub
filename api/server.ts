import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// --- Routes & Services ---
import brandRoutes from "../server/routes/brandRoutes.js";
import aiRoutes from "../server/routes/aiRoutes.js";
import tubeRoutes from "../server/routes/tubeRoutes.js";
import socialRoutes from "../server/routes/socialRoutes.js";
import cliRoutes from "../server/routes/cliRoutes.js";
import { startTelegramBot } from "../server/services/telegramBot.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- API Routes ---
app.use("/api", brandRoutes);
app.use("/api", aiRoutes);
app.use("/api", tubeRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/cli", cliRoutes);

// Try to start the Telegram bot, but don't block
try {
  startTelegramBot().catch(e => console.error("Bot error", e));
} catch (e) {
  console.error("Failed to start bot", e);
}

// Export the Express API for Vercel
export default app;
