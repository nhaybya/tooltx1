import { users, type User, type InsertUser, keys, type Key, type InsertKey } from "@shared/schema";
import { db } from "./db";
import { eq, gt } from "drizzle-orm";

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createKey(key: Omit<InsertKey, "createdAt">): Promise<Key>;
  getKey(key: string): Promise<Key | undefined>;
  getActiveKeys(): Promise<Key[]>;
  deleteKey(key: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async createKey(insertKey: Omit<InsertKey, "createdAt">): Promise<Key> {
    const [key] = await db.insert(keys).values({
      key: insertKey.key,
      expiryTime: insertKey.expiryTime,
      duration: insertKey.duration
    }).returning();
    
    return key;
  }
  
  async getKey(keyString: string): Promise<Key | undefined> {
    const [key] = await db.select().from(keys).where(eq(keys.key, keyString));
    return key;
  }
  
  async getActiveKeys(): Promise<Key[]> {
    const now = new Date();
    return await db.select().from(keys).where(gt(keys.expiryTime, now));
  }
  
  async deleteKey(keyString: string): Promise<void> {
    await db.delete(keys).where(eq(keys.key, keyString));
  }
}

export const storage = new DatabaseStorage();
