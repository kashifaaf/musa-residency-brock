import { pgTable, text, timestamp, decimal, boolean, uuid, integer } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  bio: text("bio"),
  location: text("location"),
  workInfo: text("work_info"),
  socialMediaUrl: text("social_media_url"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const accounts = pgTable("accounts", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
})

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
})

export const homes = pgTable("homes", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostId: text("host_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  amenities: text("amenities").array(),
  images: text("images").array().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const availability = pgTable("availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  homeId: uuid("home_id").notNull().references(() => homes.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  homeId: uuid("home_id").notNull().references(() => homes.id),
  guestId: text("guest_id").notNull().references(() => users.id),
  hostId: text("host_id").notNull().references(() => users.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, cancelled, completed
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  requestMessage: text("request_message"),
  responseMessage: text("response_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  respondedAt: timestamp("responded_at"),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Home = typeof homes.$inferSelect
export type NewHome = typeof homes.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Availability = typeof availability.$inferSelect
export type NewAvailability = typeof availability.$inferInsert