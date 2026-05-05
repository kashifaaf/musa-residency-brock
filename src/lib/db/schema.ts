import { pgTable, text, timestamp, integer, boolean, uuid, decimal } from "drizzle-orm/pg-core"
import { eq } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  bio: text("bio"),
  location: text("location"),
  workInfo: text("work_info"),
  socialMedia: text("social_media"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const homes = pgTable("homes", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostId: uuid("host_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  amenities: text("amenities").array(),
  photos: text("photos").array(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const availability = pgTable("availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  homeId: uuid("home_id").notNull().references(() => homes.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  homeId: uuid("home_id").notNull().references(() => homes.id),
  guestId: uuid("guest_id").notNull().references(() => users.id),
  hostId: uuid("host_id").notNull().references(() => users.id),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status", { enum: ["pending", "approved", "declined", "cancelled", "completed"] }).notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  requestMessage: text("request_message"),
  responseMessage: text("response_message"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export const insertHomeSchema = createInsertSchema(homes)
export const selectHomeSchema = createSelectSchema(homes)

export const insertBookingSchema = createInsertSchema(bookings)
export const selectBookingSchema = createSelectSchema(bookings)

export type User = z.infer<typeof selectUserSchema>
export type Home = z.infer<typeof selectHomeSchema>
export type Booking = z.infer<typeof selectBookingSchema>
export type Message = z.infer<typeof createSelectSchema<typeof messages>>