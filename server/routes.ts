import type { Express } from "express";
import { storage } from "./supabaseStorage";
import { 
  insertUpcomingEventSchema, 
  insertPastEventSchema, 
  insertCalendarEventSchema,
  insertUnifiedEventSchema,
  insertSponsorSchema,
  insertSponsorFlyerSchema,
  insertAboutContentSchema
} from "@shared/schema";

export function registerRoutes(app: Express) {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await storage.verifyAdmin(username, password);
      if (admin) {
        req.session.adminId = admin.id;
        req.session.save((err) => {
          if (err) {
            console.error('[Auth] Session save error:', err);
            return res.status(500).json({ error: "Failed to save session" });
          }
          console.log('[Auth] Session saved successfully. SessionID:', req.sessionID, 'AdminID:', admin.id);
          res.json({ success: true, username: admin.username });
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('[Auth] Logout error:', err);
        return res.status(500).json({ error: "Failed to destroy session" });
      }
      console.log('[Auth] Session destroyed successfully');
      res.json({ success: true });
    });
  });
  
  app.get("/api/auth/check", async (req, res) => {
    const isAdmin = !!req.session.adminId;
    console.log('[Auth] Check request - SessionID:', req.sessionID, 'AdminID:', req.session.adminId, 'IsAdmin:', isAdmin);
    if (isAdmin) {
      res.json({ isAdmin: true });
    } else {
      res.json({ isAdmin: false });
    }
  });
  
  app.get("/api/events/unified", async (req, res) => {
    const events = await storage.getUnifiedEvents();
    res.json(events);
  });
  
  app.post("/api/events/unified", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const validated = insertUnifiedEventSchema.parse(req.body);
      const event = await storage.addUnifiedEvent(validated);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.patch("/api/events/unified/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      const validated = insertUnifiedEventSchema.partial().parse(req.body);
      await storage.updateUnifiedEvent(id, validated);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.delete("/api/events/unified/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      await storage.deleteUnifiedEvent(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.get("/api/sponsors", async (req, res) => {
    const sponsors = await storage.getSponsors();
    res.json(sponsors);
  });
  
  app.post("/api/sponsors", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const validated = insertSponsorSchema.parse(req.body);
      const sponsor = await storage.addSponsor(validated);
      res.json(sponsor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.patch("/api/sponsors/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      const validated = insertSponsorSchema.partial().parse(req.body);
      await storage.updateSponsor(id, validated);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.delete("/api/sponsors/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      await storage.deleteSponsor(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.get("/api/sponsor-flyer", async (req, res) => {
    const flyer = await storage.getSponsorFlyer();
    res.json(flyer);
  });
  
  app.post("/api/sponsor-flyer", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const validated = insertSponsorFlyerSchema.parse(req.body);
      const flyer = await storage.setSponsorFlyer(validated);
      res.json(flyer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.get("/api/about-content", async (req, res) => {
    const content = await storage.getAllAboutContent();
    res.json(content);
  });
  
  app.get("/api/about-content/:section", async (req, res) => {
    const content = await storage.getAboutContent(req.params.section);
    res.json(content);
  });
  
  app.post("/api/about-content", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const validated = insertAboutContentSchema.parse(req.body);
      const content = await storage.setAboutContent(validated);
      res.json(content);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.patch("/api/about-content/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      const validated = insertAboutContentSchema.partial().parse(req.body);
      await storage.updateAboutContent(id, validated);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  app.get("/api/events/upcoming", async (req, res) => {
    const events = await storage.getUpcomingEvents();
    res.json(events);
  });

  app.get("/api/events/past", async (req, res) => {
    const events = await storage.getPastEvents();
    res.json(events);
  });

  app.get("/api/events/calendar", async (req, res) => {
    const events = await storage.getCalendarEvents();
    res.json(events);
  });

  app.post("/api/events/upcoming", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const validated = insertUpcomingEventSchema.parse(req.body);
      const event = await storage.addUpcomingEvent(validated);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/events/past", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { winners, ...eventData } = req.body;
      const validated = insertPastEventSchema.parse(eventData);
      const event = await storage.addPastEvent(validated, winners || []);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/events/calendar", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const validated = insertCalendarEventSchema.parse(req.body);
      const event = await storage.addCalendarEvent(validated);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/events/upcoming/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      const validated = insertUpcomingEventSchema.partial().parse(req.body);
      await storage.updateUpcomingEvent(id, validated);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/events/past/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      const { winners, ...eventData } = req.body;
      const validated = insertPastEventSchema.partial().parse(eventData);
      await storage.updatePastEvent(id, validated, winners);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/events/calendar/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      const validated = insertCalendarEventSchema.partial().parse(req.body);
      await storage.updateCalendarEvent(id, validated);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/events/upcoming/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      await storage.deleteUpcomingEvent(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/events/past/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      await storage.deletePastEvent(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/events/calendar/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      await storage.deleteCalendarEvent(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
}
