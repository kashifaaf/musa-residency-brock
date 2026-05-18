import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  date,
  jsonb,
  pgEnum,
  primaryKey,
  index,
  numeric,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── Enums ──────────────────────────────────────────────────

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "approved",
  "declined",
  "expired",
  "cancelled",
  "completed",
])

export const paymentStatusEnum = pgEnum("payment_status", [
  "authorized",
  "captured",
  "refunded",
  "failed",
])

// ─── NextAuth Required Tables ───────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  bio: text("bio"),
  location: text("location"),
  workInfo: text("work_info"),
  socialLinks: jsonb("social_links").$type<Record<string, string>>(),
  isHost: boolean("is_host").default(false).notNull(),
  responseRate: numeric("response_rate", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
)

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
)

// ─── Home Listings ──────────────────────────────────────────

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    hostId: uuid("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    city: text("city").notNull(),
    country: text("country").notNull(),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),
    pricePerNight: integer("price_per_night").notNull(),
    maxGuests: integer("max_guests").default(2).notNull(),
    bedrooms: integer("bedrooms").default(1).notNull(),
    bathrooms: integer("bathrooms").default(1).notNull(),
    amenities: jsonb("amenities").$type<string[]>().default([]),
    creativeAmenities: jsonb("creative_amenities").$type<string[]>().default([]),
    houseRules: text("house_rules"),
    minStayNights: integer("min_stay_nights").default(30).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (listing) => [
    index("listings_host_id_idx").on(listing.hostId),
    index("listings_city_idx").on(listing.city),
    index("listings_country_idx").on(listing.country),
    index("listings_published_idx").on(listing.isPublished),
  ]
)

// ─── Listing Photos ─────────────────────────────────────────

export const listingPhotos = pgTable(
  "listing_photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: text("caption"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (photo) => [index("photos_listing_id_idx").on(photo.listingId)]
)

// ─── Availability ───────────────────────────────────────────

export const availability = pgTable(
  "availability",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    startDate: date("start_date", { mode: "date" }).notNull(),
    endDate: date("end_date", { mode: "date" }).notNull(),
    isAvailable: boolean("is_available").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (avail) => [
    index("availability_listing_id_idx").on(avail.listingId),
    index("availability_dates_idx").on(avail.startDate, avail.endDate),
  ]
)

// ─── Bookings ───────────────────────────────────────────────

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hostId: uuid("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    totalPrice: integer("total_price").notNull(),
    status: bookingStatusEnum("status").default("pending").notNull(),
    guestMessage: text("guest_message"),
    hostResponseNote: text("host_response_note"),
    respondBy: timestamp("respond_by", { mode: "date" }).notNull(),
    respondedAt: timestamp("responded_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (booking) => [
    index("bookings_listing_id_idx").on(booking.listingId),
    index("bookings_guest_id_idx").on(booking.guestId),
    index("bookings_host_id_idx").on(booking.hostId),
    index("bookings_status_idx").on(booking.status),
  ]
)

// ─── Payments ───────────────────────────────────────────────

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
    amount: integer("amount").notNull(),
    currency: text("currency").default("usd").notNull(),
    status: paymentStatusEnum("status").default("authorized").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (payment) => [
    index("payments_booking_id_idx").on(payment.bookingId),
    index("payments_stripe_id_idx").on(payment.stripePaymentIntentId),
  ]
)

// ─── Messages ───────────────────────────────────────────────

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (message) => [
    index("messages_booking_id_idx").on(message.bookingId),
    index("messages_sender_id_idx").on(message.senderId),
  ]
)

// ─── Relations ──────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  listings: many(listings),
  bookingsAsGuest: many(bookings, { relationName: "guestBookings" }),
  bookingsAsHost: many(bookings, { relationName: "hostBookings" }),
  sentMessages: many(messages),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const listingsRelations = relations(listings, ({ one, many }) => ({
  host: one(users, {
    fields: [listings.hostId],
    references: [users.id],
  }),
  photos: many(listingPhotos),
  availability: many(availability),
  bookings: many(bookings),
}))

export const listingPhotosRelations = relations(listingPhotos, ({ one }) => ({
  listing: one(listings, {
    fields: [listingPhotos.listingId],
    references: [listings.id],
  }),
}))

export const availabilityRelations = relations(availability, ({ one }) => ({
  listing: one(listings, {
    fields: [availability.listingId],
    references: [listings.id],
  }),
}))

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  listing: one(listings, {
    fields: [bookings.listingId],
    references: [listings.id],
  }),
  guest: one(users, {
    fields: [bookings.guestId],
    references: [users.id],
    relationName: "guestBookings",
  }),
  host: one(users, {
    fields: [bookings.hostId],
    references: [users.id],
    relationName: "hostBookings",
  }),
  payment: one(payments),
  messages: many(messages),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}))