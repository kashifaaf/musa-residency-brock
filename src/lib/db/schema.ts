import { pgTable, text, timestamp, uuid, boolean, integer, decimal, jsonb, index, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password"),
  name: text("name"),
  bio: text("bio"),
  location: text("location"),
  workInfo: text("work_info"),
  socialMedia: jsonb("social_media").$type<{ instagram?: string; website?: string; linkedin?: string }>(),
  profileImageUrl: text("profile_image_url"),
  isArtist: boolean("is_artist").default(false).notNull(),
  artistType: text("artist_type"), // visual, writer, musician, etc
  portfolioUrl: text("portfolio_url"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
}));

// Sessions table (for Lucia auth)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

// Homes/listings table
export const homes = pgTable("homes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  homeType: text("home_type").notNull(), // apartment, house, studio, etc
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]).notNull(),
  creativeAmenities: jsonb("creative_amenities").$type<string[]>().default([]).notNull(), // studio space, instruments, etc
  houseRules: text("house_rules"),
  localArtScene: text("local_art_scene"), // recommendations for local art venues
  isPublished: boolean("is_published").default(false).notNull(),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("100.00"),
  avgResponseTime: integer("avg_response_time"), // in hours
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("homes_user_id_idx").on(table.userId),
  locationIdx: index("homes_location_idx").on(table.city, table.country),
  publishedIdx: index("homes_published_idx").on(table.isPublished),
}));

// Home images table
export const homeImages = pgTable("home_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  homeId: uuid("home_id").notNull().references(() => homes.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  key: text("key").notNull(), // for deletion from storage
  caption: text("caption"),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  homeIdIdx: index("home_images_home_id_idx").on(table.homeId),
}));

// Availability calendar
export const availability = pgTable("availability", {
  id: uuid("id").defaultRandom().primaryKey(),
  homeId: uuid("home_id").notNull().references(() => homes.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  minStay: integer("min_stay").default(7).notNull(), // minimum days
  maxStay: integer("max_stay").default(90), // maximum days
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  homeIdIdx: index("availability_home_id_idx").on(table.homeId),
  datesIdx: index("availability_dates_idx").on(table.startDate, table.endDate),
}));

// Booking requests
export const bookingRequests = pgTable("booking_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  homeId: uuid("home_id").notNull().references(() => homes.id),
  guestId: uuid("guest_id").notNull().references(() => users.id),
  hostId: uuid("host_id").notNull().references(() => users.id),
  checkIn: timestamp("check_in", { withTimezone: true }).notNull(),
  checkOut: timestamp("check_out", { withTimezone: true }).notNull(),
  guests: integer("guests").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, approved, declined, expired, cancelled, completed
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  hostRespondedAt: timestamp("host_responded_at", { withTimezone: true }),
  requestExpiresAt: timestamp("request_expires_at", { withTimezone: true }).notNull(), // 24 hours from creation
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  homeIdIdx: index("booking_requests_home_id_idx").on(table.homeId),
  guestIdIdx: index("booking_requests_guest_id_idx").on(table.guestId),
  hostIdIdx: index("booking_requests_host_id_idx").on(table.hostId),
  statusIdx: index("booking_requests_status_idx").on(table.status),
  datesIdx: index("booking_requests_dates_idx").on(table.checkIn, table.checkOut),
}));

// Messages
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingRequestId: uuid("booking_request_id").references(() => bookingRequests.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  recipientId: uuid("recipient_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  bookingRequestIdIdx: index("messages_booking_request_id_idx").on(table.bookingRequestId),
  recipientIdIdx: index("messages_recipient_id_idx").on(table.recipientId),
  senderIdIdx: index("messages_sender_id_idx").on(table.senderId),
}));

// Email verification tokens
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tokenIdx: uniqueIndex("email_verification_tokens_token_idx").on(table.token),
  userIdIdx: index("email_verification_tokens_user_id_idx").on(table.userId),
}));

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tokenIdx: uniqueIndex("password_reset_tokens_token_idx").on(table.token),
  userIdIdx: index("password_reset_tokens_user_id_idx").on(table.userId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  homes: many(homes),
  bookingRequestsAsGuest: many(bookingRequests),
  sentMessages: many(messages),
}));

export const homesRelations = relations(homes, ({ one, many }) => ({
  user: one(users, {
    fields: [homes.userId],
    references: [users.id],
  }),
  images: many(homeImages),
  availability: many(availability),
  bookingRequests: many(bookingRequests),
}));

export const homeImagesRelations = relations(homeImages, ({ one }) => ({
  home: one(homes, {
    fields: [homeImages.homeId],
    references: [homes.id],
  }),
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
    relationName: "guest",
  }),
  host: one(users, {
    fields: [bookingRequests.hostId],
    references: [users.id],
    relationName: "host",
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