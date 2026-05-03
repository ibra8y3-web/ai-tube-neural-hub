import express from "express";
import { socialService } from "../services/socialService.js";

const router = express.Router();

router.post("/connect", async (req, res) => {
  const { platform, email, password, userId, token } = req.body;
  if (!platform || !email || !password) return res.status(400).json({ error: "Missing login fields" });
  
  try {
    const session = await socialService.connect(userId || "default", platform, email, password, token);
    res.json({ success: true, session });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/status/:userId", (req, res) => {
  res.json(socialService.getStatus(req.params.userId || "default"));
});

router.post("/reply", async (req, res) => {
  const { platform, replyText, userId } = req.body;
  try {
    const result = await socialService.reply(userId || "default", platform, replyText);
    res.json(result);
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
});

export default router;

