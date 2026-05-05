import { pgTable, text, timestamp, decimal, boolean, integer, uuid, primaryKey } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  bio: text("bio"),
  location: text("location"),
  workInfo: text("work_info"),
  socialMedia: text("social_media"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const accounts = pgTable("accounts", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}))

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
})

export const homes = pgTable("homes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  amenities: text("amenities"),
  images: text("images").array(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const availability = pgTable("availability", {
  id: uuid("id").defaultRandom().primaryKey(),
  homeId: uuid("home_id").notNull().references(() => homes.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  homeId: uuid("home_id").notNull().references(() => homes.id, { onDelete: "cascade" }),
  guestId: text("guest_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  hostId: text("host_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  guests: integer("guests").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, declined, paid, cancelled
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  responseDeadline: timestamp("response_deadline").notNull(),
})

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})