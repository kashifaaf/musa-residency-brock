import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image"),
  bio: text("bio"),
  location: varchar("location", { length: 255 }),
  workInfo: text("work_info"),
  socialMedia: jsonb("social_media").$type<{ [platform: string]: string }>(),
  emailVerified: timestamp("email_verified"),
  isArtist: boolean("is_artist").default(false),
  artistInfo: jsonb("artist_info").$type<{
    medium?: string[]
    portfolio?: string
    statement?: string
    experience?: string
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const homes = pgTable("homes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  houseRules: text("house_rules"),
  photos: jsonb("photos").$type<string[]>().default([]),
  pricePerNight: integer("price_per_night").notNull(),
  isActive: boolean("is_active").default(true),
  creativeSpace: boolean("creative_space").default(false),
  creativeAmenities: jsonb("creative_amenities").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const availability = pgTable("availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  homeId: uuid("home_id").notNull().references(() => homes.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  homeId: uuid("home_id").notNull().references(() => homes.id, { onDelete: "cascade" }),
  guestId: uuid("guest_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  hostId: uuid("host_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  guestMessage: text("guest_message"),
  hostResponse: text("host_response"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Home = typeof homes.$inferSelect
export type NewHome = typeof homes.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Availability = typeof availability.$inferSelect
export type NewAvailability = typeof availability.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert