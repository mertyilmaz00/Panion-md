import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface ParsedMessage {
  timestamp: Date;
  sender: string;
  content: string;
  type: 'text' | 'media' | 'voice' | 'video' | 'document' | 'call' | 'system';
  mediaType?: 'photo' | 'video' | 'voice' | 'document';
  isDeleted?: boolean;
}

export interface ContactStats {
  name: string;
  messages: number;
  percentage: number;
  avgResponse: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  messagesSent: number;
  messagesReceived: number;
}

export interface ActivityData {
  hourlyActivity: number[][];
  peakHours: string;
  mostActiveDay: string;
  leastActiveDay: string;
  dailyOpens: number;
  averageSessionDuration: string;
}

export interface MediaStats {
  photos: number;
  videos: number;
  voiceNotes: number;
  documents: number;
  totalSize: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  topEmojis: Array<{ emoji: string; count: number }>;
  topKeywords: string[];
}

export interface CallStats {
  voiceCalls: number;
  videoCalls: number;
  missedCalls: number;
  avgVoiceDuration: string;
  avgVideoDuration: string;
  topCallers: Array<{ name: string; calls: number; type: string; duration: string }>;
}

export interface AnalyticsData {
  totalMessages: number;
  messagesSent: number;
  messagesReceived: number;
  totalOnlineTime: string;
  mostActiveTime: string;
  topContact: string;
  contacts: ContactStats[];
  activity: ActivityData;
  media: MediaStats;
  sentiment: SentimentData;
  calls: CallStats;
  wellbeingScore: number;
  insights: string[];
  dateRange: {
    start: string;
    end: string;
  };
}
