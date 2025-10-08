import { type User, type InsertUser, type AnalyticsData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  saveAnalytics(id: string, data: AnalyticsData): Promise<void>;
  getAnalytics(id: string): Promise<AnalyticsData | undefined>;
  deleteAnalytics(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analytics: Map<string, AnalyticsData>;

  constructor() {
    this.users = new Map();
    this.analytics = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveAnalytics(id: string, data: AnalyticsData): Promise<void> {
    this.analytics.set(id, data);
  }

  async getAnalytics(id: string): Promise<AnalyticsData | undefined> {
    return this.analytics.get(id);
  }

  async deleteAnalytics(id: string): Promise<void> {
    this.analytics.delete(id);
  }
}

export const storage = new MemStorage();
