import { integer, text, pgTable, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const unifiedEvents = pgTable("unified_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  time: text("time"),
  description: text("description"),
  imagePaths: text("image_paths"),
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: text("recurrence_pattern"),
  participants: text("participants"),
  rounds: text("rounds"),
  rating: text("rating"),
  winners: text("winners"),
  registrationLink: text("registration_link"),
  registrationLinkLabel: text("registration_link_label"),
  infoLink: text("info_link"),
  infoLinkLabel: text("info_link_label"),
  externalLink: text("external_link"),
  externalLinkLabel: text("external_link_label"),
});

export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoPath: text("logo_path"),
  order: integer("order").default(0),
});

export const sponsorFlyer = pgTable("sponsor_flyer", {
  id: serial("id").primaryKey(),
  pdfPath: text("pdf_path").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
});

export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull().unique(),
  content: text("content").notNull(),
  imagePath: text("image_path"),
});

export const upcomingEvents = pgTable("upcoming_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location"),
  description: text("description"),
  imagePaths: text("image_paths"),
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: text("recurrence_pattern"),
  registrationLink: text("registration_link"),
  registrationLinkLabel: text("registration_link_label"),
  infoLink: text("info_link"),
  infoLinkLabel: text("info_link_label"),
  externalLink: text("external_link"),
  externalLinkLabel: text("external_link_label"),
});

export const pastEvents = pgTable("past_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  participants: text("participants"),
  rounds: text("rounds"),
  rating: text("rating"),
  description: text("description"),
  imagePaths: text("image_paths"),
  registrationLink: text("registration_link"),
  registrationLinkLabel: text("registration_link_label"),
  infoLink: text("info_link"),
  infoLinkLabel: text("info_link_label"),
  externalLink: text("external_link"),
  externalLinkLabel: text("external_link_label"),
});

export const pastEventWinners = pgTable("past_event_winners", {
  id: serial("id").primaryKey(),
  pastEventId: integer("past_event_id").notNull(),
  place: text("place").notNull(),
  name: text("name").notNull(),
  score: text("score"),
});

export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location"),
  description: text("description"),
  eventType: text("event_type", { enum: ["meeting", "tournament", "social", "deadline"] }).default("meeting"),
  colorCode: text("color_code").default("green"),
  imagePaths: text("image_paths"),
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: text("recurrence_pattern"),
  registrationLink: text("registration_link"),
  registrationLinkLabel: text("registration_link_label"),
  infoLink: text("info_link"),
  infoLinkLabel: text("info_link_label"),
  externalLink: text("external_link"),
  externalLinkLabel: text("external_link_label"),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true });
export const insertUnifiedEventSchema = createInsertSchema(unifiedEvents).omit({ id: true });
export const insertSponsorSchema = createInsertSchema(sponsors).omit({ id: true });
export const insertSponsorFlyerSchema = createInsertSchema(sponsorFlyer).omit({ id: true });
export const insertAboutContentSchema = createInsertSchema(aboutContent).omit({ id: true });
export const insertUpcomingEventSchema = createInsertSchema(upcomingEvents).omit({ id: true });
export const insertPastEventSchema = createInsertSchema(pastEvents).omit({ id: true });
export const insertPastEventWinnerSchema = createInsertSchema(pastEventWinners).omit({ id: true });
export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({ id: true });

export const insertUnifiedEventFormSchema = insertUnifiedEventSchema;

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type InsertUnifiedEvent = z.infer<typeof insertUnifiedEventSchema>;
export type InsertUnifiedEventForm = z.infer<typeof insertUnifiedEventFormSchema>;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type InsertSponsorFlyer = z.infer<typeof insertSponsorFlyerSchema>;
export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type InsertUpcomingEvent = z.infer<typeof insertUpcomingEventSchema>;
export type InsertPastEvent = z.infer<typeof insertPastEventSchema>;
export type InsertPastEventWinner = z.infer<typeof insertPastEventWinnerSchema>;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type UnifiedEvent = typeof unifiedEvents.$inferSelect;
export type Sponsor = typeof sponsors.$inferSelect;
export type SponsorFlyer = typeof sponsorFlyer.$inferSelect;
export type AboutContent = typeof aboutContent.$inferSelect;
export type UpcomingEvent = typeof upcomingEvents.$inferSelect;
export type PastEvent = typeof pastEvents.$inferSelect;
export type PastEventWinner = typeof pastEventWinners.$inferSelect;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

export type PastEventWithWinners = PastEvent & {
  winners: PastEventWinner[];
};
