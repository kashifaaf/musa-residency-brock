import { pgTable, text, timestamp, uuid, boolean, integer, decimal, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  location: text("location"),
  workInfo: text("work_info"),
  profileImage: text("profile_image"),
  socialLinks: jsonb("social_links").$type<{
    website?: string;
    instagram?: string;
    linkedin?: string;
  }>(),
  isHost: boolean("is_host").default(false).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  responseRate: decimal("response_rate", { precision: 3, scale: 2 }),
  avgResponseTime: integer("avg_response_time"), // in hours
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
}));

// Homes table
export const homes = pgTable("homes", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostId: uuid("host_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  propertyType: text("property_type").notNull(), // apartment, house, studio, loft
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: decimal("bathrooms", { precision: 2, scale: 1 }).notNull(),
  maxGuests: integer("max_guests").notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]).notNull(),
  houseRules: jsonb("house_rules").$type<string[]>().default([]).notNull(),
  photos: jsonb("photos").$type<Array<{
    url: string;
    caption?: string;
    order: number;
  }>>().default([]).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  hostIdx: index("homes_host_id_idx").on(table.hostId),
  locationIdx: index("homes_location_idx").on(table.city, table.country),
  activeIdx: index("homes_active_idx").on(table.isActive),
}));

// Availability table
export const availability = pgTable("availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  homeId: uuid("home_id").references(() => homes.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isBlocked: boolean("is_blocked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  homeIdx: index("availability_home_id_idx").on(table.homeId),
  dateIdx: index("availability_dates_idx").on(table.startDate, table.endDate),
}));

// Booking requests table
export const bookingRequests = pgTable("booking_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  homeId: uuid("home_id").references(() => homes.id).notNull(),
  guestId: uuid("guest_id").references(() => users.id).notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  guestCount: integer("guest_count").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, approved, declined, expired, cancelled
  paymentStatus: text("payment_status").default("pending"), // pending, authorized, captured, refunded
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  responseDeadline: timestamp("response_deadline").notNull(),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  homeIdx: index("booking_requests_home_id_idx").on(table.homeId),
  guestIdx: index("booking_requests_guest_id_idx").on(table.guestId),
  statusIdx: index("booking_requests_status_idx").on(table.status),
  datesIdx: index("booking_requests_dates_idx").on(table.checkIn, table.checkOut),
}));

// Messages table
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingRequestId: uuid("booking_request_id").references(() => bookingRequests.id).notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  recipientId: uuid("recipient_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  bookingIdx: index("messages_booking_id_idx").on(table.bookingRequestId),
  recipientIdx: index("messages_recipient_idx").on(table.recipientId, table.isRead),
}));

// Email notifications table
export const emailNotifications = pgTable("email_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // booking_request, booking_approved, booking_declined, etc
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("email_notifications_user_idx").on(table.userId),
  typeIdx: index("email_notifications_type_idx").on(table.type),
}));

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  homes: many(homes),
  bookingRequests: many(bookingRequests),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "recipient" }),
  emailNotifications: many(emailNotifications),
}));

export const homesRelations = relations(homes, ({ one, many }) => ({
  host: one(users, {
    fields: [homes.hostId],
    references: [users.id],
  }),
  availability: many(availability),
  bookingRequests: many(bookingRequests),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  home: one(homes, {
    fields: [availability.homeId],
    references: [homes.id],
  }),
}));

export const bookingRequestsRelations = relations(bookingRequests, ({ one, many }) => ({
  home: one(homes, {
    fields: [bookingRequests.homeId],
    references: [homes.id],
  }),
  guest: one(users, {
    fields: [bookingRequests.guestId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  bookingRequest: one(bookingRequests, {
    fields: [messages.bookingRequestId],
    references: [bookingRequests.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: "recipient",
  }),
}));

export const emailNotificationsRelations = relations(emailNotifications, ({ one }) => ({
  user: one(users, {
    fields: [emailNotifications.userId],
    references: [users.id],
  }),
}));