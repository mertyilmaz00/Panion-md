import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WAMessage,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import QRCode from "qrcode";
import { WhatsAppParser } from "./parser";
import { AnalyticsEngine } from "./analytics";
import { storage } from "./storage";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

interface SessionData {
  socket: any | null;
  qrCode: string | null;
  pairingCode: string | null;
  isReady: boolean;
  analyticsId: string | null;
  messages: any[];
  couponCode: string;
  phoneNumber?: string;
  isPaired: boolean;

  // 👇 Add this line
  reconnecting?: boolean;
}

const sessions = new Map<string, SessionData>();
export const couponToSessionMap = new Map<string, string>(); // Maps coupon codes to session IDs

export async function createWhatsAppSession(
  sessionId: string,
  couponCode: string,
  phoneNumber?: string,
) {
  // Check if this coupon already has an active session
  const existingSessionId = couponToSessionMap.get(couponCode);
  if (existingSessionId && sessions.has(existingSessionId)) {
    const existingSession = sessions.get(existingSessionId)!;

    // If switching pairing method or reconnecting
    if (phoneNumber !== existingSession.phoneNumber) {
      // Close existing socket if it exists
      if (existingSession.socket) {
        try {
          existingSession.socket.end();
          existingSession.socket = null;
        } catch (error) {
          console.error("Error closing existing socket:", error);
        }
      }
      existingSession.phoneNumber = phoneNumber;
      existingSession.qrCode = null;
      existingSession.pairingCode = null;
      await connectToWhatsApp(existingSessionId, existingSession, phoneNumber);
    } else if (!existingSession.socket || !existingSession.isReady) {
      await connectToWhatsApp(existingSessionId, existingSession, phoneNumber);
    }
    return existingSession;
  }

  if (sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!;

    // If switching pairing method
    if (phoneNumber && phoneNumber !== session.phoneNumber) {
      if (session.socket) {
        try {
          session.socket.end();
          session.socket = null;
        } catch (error) {
          console.error("Error closing existing socket:", error);
        }
      }
      session.phoneNumber = phoneNumber;
      session.qrCode = null;
      session.pairingCode = null;
      await connectToWhatsApp(sessionId, session, phoneNumber);
    }
    return session;
  }

  const session: SessionData = {
    socket: null,
    qrCode: null,
    pairingCode: null,
    isReady: false,
    analyticsId: null,
    messages: [],
    couponCode,
    phoneNumber,
    isPaired: false,
  };

  sessions.set(sessionId, session);
  couponToSessionMap.set(couponCode, sessionId);

  // Create auth directory for this session
  const authDir = path.join(process.cwd(), ".auth", sessionId);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await connectToWhatsApp(sessionId, session, phoneNumber);

  return session;
}

async function connectToWhatsApp(
  sessionId: string,
  session: SessionData,
  phoneNumber?: string,
) {
  const authDir = path.join(process.cwd(), ".auth", sessionId);

  // 🔧 1. Ensure auth directory exists
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const credsPath = path.join(authDir, "creds.json");
  const hasExistingCreds = fs.existsSync(credsPath);

  // 🔧 2. Remove the logic that *always deletes auth* unless paired
  if (!hasExistingCreds) {
    console.log(
      "No existing credentials found — starting new session:",
      sessionId,
    );
  } else {
    console.log("Reusing saved credentials for session:", sessionId);
  }

  // 🔧 3. Create persistent auth state (Baileys built-in)
  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "22.04.4"],
    connectTimeoutMs: 60000,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // 🔧 4. Handle QR code — but only generate new one if not yet paired
    if (qr && !session.isPaired) {
      try {
        session.qrCode = await QRCode.toDataURL(qr);
        session.pairingCode = null;
        console.log("QR Code generated for session:", sessionId);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    }

    if (connection === "close") {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      console.log("Connection closed. Status:", statusCode);

      if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
        console.log("Session logged out or rejected, clearing credentials...");
        try {
          if (fs.existsSync(authDir)) {
            fs.rmSync(authDir, { recursive: true, force: true });
            fs.mkdirSync(authDir, { recursive: true });
          }
        } catch (error) {
          console.error("Error clearing auth:", error);
        }

        session.isPaired = false;
        session.isReady = false;
      } else if (
        statusCode === DisconnectReason.connectionClosed ||
        statusCode === DisconnectReason.connectionLost ||
        statusCode === 515
      ) {
        if (!session.reconnecting) {
          session.reconnecting = true;
          console.log("Connection lost, attempting reconnection...");

          setTimeout(async () => {
            try {
              await connectToWhatsApp(sessionId, session, phoneNumber);
              console.log("✅ Reconnection successful for session:", sessionId);
            } catch (err) {
              console.error("Reconnection attempt failed:", err);
            } finally {
              session.reconnecting = false;
            }
          }, 5000);
        } else {
          console.log(
            "Reconnection already in progress, skipping duplicate attempt.",
          );
        }
      }
    } else if (connection === "open") {
      console.log("✅ WhatsApp connected successfully for session:", sessionId);
      session.isReady = true;
      session.isPaired = true;
      session.qrCode = null;
      session.pairingCode = null;
    }
  });

  // 🔧 5. Save credentials persistently
  sock.ev.on("creds.update", saveCreds);

  // 🔧 6. Keep existing message event handling
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type === "notify") {
      for (const msg of messages) await processMessage(msg, session);
    }
  });

  session.socket = sock;
}

async function processMessage(msg: WAMessage, session: SessionData) {
  try {
    const messageContent =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      "";

    // Get sender information - prioritize pushName, then extract phone number from participant
    let sender = "Unknown";

    if (msg.key.remoteJid?.includes("@g.us")) {
      // Group message
      if (msg.pushName) {
        sender = msg.pushName;
      } else if (msg.key.participant) {
        // Extract phone number from participant JID
        const participantPn = msg.key.participantPn;
        if (participantPn) {
          // Use the actual phone number if available
          sender = participantPn.split("@")[0];
        } else {
          // Fallback to extracting from participant
          sender = msg.key.participant.split("@")[0];
        }
      }
    } else {
      // Direct message
      if (msg.pushName) {
        sender = msg.pushName;
      } else if (msg.key.remoteJid) {
        sender = msg.key.remoteJid.split("@")[0];
      }
    }

    const formattedMessage = {
      timestamp: new Date((msg.messageTimestamp as number) * 1000),
      sender: sender,
      content: messageContent,
      type: getMessageType(msg),
      isDeleted: false,
    };

    session.messages.push(formattedMessage);

    // Auto-generate analytics after collecting messages
    if (session.messages.length > 0 && session.messages.length % 50 === 0) {
      await generateAnalyticsForSession(session);
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
}

function getMessageType(msg: WAMessage): string {
  if (msg.message?.conversation || msg.message?.extendedTextMessage)
    return "text";
  if (msg.message?.imageMessage) return "image";
  if (msg.message?.videoMessage) return "video";
  if (msg.message?.audioMessage) return "audio";
  if (msg.message?.documentMessage) return "document";
  if (msg.message?.stickerMessage) return "sticker";
  return "text";
}

async function generateAnalyticsForSession(session: SessionData) {
  if (session.messages.length === 0) return;

  try {
    const analyticsEngine = new AnalyticsEngine(session.messages);
    const analytics = analyticsEngine.generateAnalytics();

    const id = randomUUID();
    await storage.saveAnalytics(id, analytics);
    session.analyticsId = id;

    console.log("Analytics generated, ID:", id);
  } catch (error) {
    console.error("Error generating analytics:", error);
  }
}

export function getSession(sessionId: string): SessionData | undefined {
  const session = sessions.get(sessionId);
  // Return session even if it exists but isn't connected yet
  if (session) {
    return session;
  }
  return undefined;
}

export function disconnectSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (session?.socket) {
    try {
      session.socket.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
    sessions.delete(sessionId);
    if (session.couponCode) {
      couponToSessionMap.delete(session.couponCode);
    }
  }
}

export async function forceGenerateAnalytics(sessionId: string) {
  const session = sessions.get(sessionId);
  if (session) {
    await generateAnalyticsForSession(session);
    return session.analyticsId;
  }
  return null;
}

export function checkExistingSession(couponCode: string) {
  const sessionId = couponToSessionMap.get(couponCode);
  if (sessionId) {
    const session = sessions.get(sessionId);
    return session?.isPaired || false;
  }
  return false;
}
