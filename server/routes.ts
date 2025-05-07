import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for keys
  app.get('/api/keys', async (req, res) => {
    try {
      const keys = await storage.getActiveKeys();
      res.json(keys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch keys" });
    }
  });

  app.post('/api/keys', async (req, res) => {
    try {
      const { key, duration } = req.body;
      
      if (!key || !duration) {
        return res.status(400).json({ message: "Key and duration are required" });
      }
      
      const expiryTime = new Date(Date.now() + duration * 60 * 1000);
      
      const createdKey = await storage.createKey({
        key,
        expiryTime,
        duration
      });
      
      res.status(201).json(createdKey);
    } catch (error) {
      res.status(500).json({ message: "Failed to create key" });
    }
  });

  app.delete('/api/keys/:key', async (req, res) => {
    try {
      const { key } = req.params;
      
      await storage.deleteKey(key);
      
      res.status(200).json({ message: "Key deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete key" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
