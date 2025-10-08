import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { WhatsAppParser } from "./parser";
import { AnalyticsEngine } from "./analytics";
import { randomUUID } from "crypto";
import { validateCoupon, markCouponAsUsed, isCouponUsed } from "./coupons";
import { createWhatsAppSession, getSession, disconnectSession, forceGenerateAnalytics } from "./whatsapp-connector";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!req.file.mimetype.includes('text') && !req.file.originalname.endsWith('.txt')) {
        return res.status(400).json({ error: "Invalid file type. Please upload a WhatsApp chat export (.txt file)" });
      }

      const content = req.file.buffer.toString('utf-8');

      const parser = new WhatsAppParser();
      const messages = parser.parse(content);

      if (messages.length === 0) {
        return res.status(400).json({ error: "No messages found in file" });
      }

      const userName = req.body.userName as string | undefined;
      const analyticsEngine = new AnalyticsEngine(messages, userName);

      if (!userName) {
        const participants = analyticsEngine.getParticipants();
        if (participants.length > 1) {
          return res.json({
            requiresUserSelection: true,
            participants,
          });
        }
      }

      const analytics = analyticsEngine.generateAnalytics();

      const id = randomUUID();
      await storage.saveAnalytics(id, analytics);

      res.json({ id, analytics });
    } catch (error) {
      console.error('Error processing upload:', error);
      res.status(500).json({ error: "Failed to process file" });
    }
  });

  app.get("/api/analytics/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analytics = await storage.getAnalytics(id);

      if (!analytics) {
        return res.status(404).json({ error: "Analytics not found" });
      }

      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/validate-coupon", async (req, res) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ error: "Coupon code is required" });
      }

      if (isCouponUsed(code)) {
        return res.status(400).json({ error: "This coupon has already been used" });
      }

      const isValid = validateCoupon(code);

      if (!isValid) {
        return res.status(400).json({ error: "Invalid coupon code" });
      }

      const sessionId = randomUUID();
      markCouponAsUsed(code);

      res.json({ 
        valid: true, 
        sessionId,
        message: "Coupon validated successfully" 
      });
    } catch (error) {
      console.error('Error validating coupon:', error);
      res.status(500).json({ error: "Failed to validate coupon" });
    }
  });

  app.post("/api/whatsapp/check-session", async (req, res) => {
    try {
      const { couponCode } = req.body;

      if (!couponCode) {
        return res.status(400).json({ error: "Coupon code is required" });
      }

      const existingSessionId = (await import("./whatsapp-connector")).couponToSessionMap.get(couponCode);

      if (!existingSessionId) {
        return res.status(404).json({ error: "No session found for this coupon code" });
      }

      const session = getSession(existingSessionId);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({ 
        sessionId: existingSessionId,
        isPaired: session.isPaired,
        isReady: session.isReady,
        messageCount: session.messages.length
      });
    } catch (error) {
      console.error('Error checking session:', error);
      res.status(500).json({ error: "Failed to check session" });
    }
  });

  app.post("/api/whatsapp/connect", async (req, res) => {
    try {
      const { sessionId, couponCode } = req.body;

      if (!sessionId || !couponCode) {
        return res.status(400).json({ error: "Session ID and coupon code are required" });
      }

      const session = await createWhatsAppSession(sessionId, couponCode);

      res.json({ 
        success: true,
        message: "WhatsApp session initiated",
        isPaired: session.isPaired,
        isReady: session.isReady
      });
    } catch (error) {
      console.error('Error connecting WhatsApp:', error);
      res.status(500).json({ error: "Failed to connect WhatsApp" });
    }
  });

  app.get("/api/whatsapp/qr/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = getSession(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({ 
        qrCode: session.qrCode,
        isReady: session.isReady,
        isPaired: session.isPaired,
        messageCount: session.messages.length,
        analyticsId: session.analyticsId
      });
    } catch (error) {
      console.error('Error fetching QR code:', error);
      res.status(500).json({ error: "Failed to fetch QR code" });
    }
  });

  app.post("/api/whatsapp/disconnect/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      disconnectSession(sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error disconnecting:', error);
      res.status(500).json({ error: "Failed to disconnect" });
    }
  });

  app.post("/api/whatsapp/generate-analytics/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const analyticsId = await forceGenerateAnalytics(sessionId);

      if (!analyticsId) {
        return res.status(400).json({ error: "No messages to analyze" });
      }

      res.json({ analyticsId });
    } catch (error) {
      console.error('Error generating analytics:', error);
      res.status(500).json({ error: "Failed to generate analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
