import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

// --- Routes & Services ---
import brandRoutes from "./server/routes/brandRoutes.js";
import aiRoutes from "./server/routes/aiRoutes.js";
import tubeRoutes from "./server/routes/tubeRoutes.js";
import socialRoutes from "./server/routes/socialRoutes.js";
import cliRoutes from "./server/routes/cliRoutes.js";
import { startTelegramBot } from "./server/services/telegramBot.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
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

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    console.log(">>> [Server] Initializing Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
      },
    });
    app.use(vite.middlewares);

    // Serve index.html for non-API routes
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });

    console.log(">>> [Server] Vite middleware attached.");
  } else {
    // Production: Serve static files from 'dist'
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(">>> [Server] Running in production mode.");
  }

  // --- Start Server ---
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> [Server] Ready and listening at http://0.0.0.0:${PORT}`);
    
    // --- Start Telegram Bot (non-blocking) ---
    startTelegramBot().catch(err => {
      console.error(">>> [Bot] Failed to start:", err.message);
    });
  });
}

startServer().catch(err => {
  console.error(">>> [Server] Critical failed to start:", err);
  process.exit(1);
});
