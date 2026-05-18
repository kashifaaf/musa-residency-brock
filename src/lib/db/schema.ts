import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
  date,
  decimal,
  primaryKey,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── NextAuth Required Tables ─────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  // Extended profile fields
  bio: text("bio"),
  location: varchar("location", { length: 255 }),
  occupation: varchar("occupation", { length: 255 }),
  socialLinks: text("social_links"), // JSON string of social media links
  phone: varchar("phone", { length: 50 }),
  isHost: boolean("is_host").default(false),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("100.00"),
  responsePenalty: integer("response_penalty").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
)

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
)

// ─── Home Listings ────────────────────────────────────────────────────────────

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    hostId: uuid("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    address: text("address"),
    city: varchar("city", { length: 255 }).notNull(),
    state: varchar("state", { length: 255 }),
    country: varchar("country", { length: 255 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    propertyType: varchar("property_type", { length: 100 }), // apartment, house, studio, etc.
    bedrooms: integer("bedrooms").default(1),
    bathrooms: integer("bathrooms").default(1),
    maxGuests: integer("max_guests").default(2),
    amenities: text("amenities"), // JSON string array
    creativeAmenities: text("creative_amenities"), // JSON string: studio space, instruments, easels, etc.
    houseRules: text("house_rules"),
    pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    minimumStay: integer("minimum_stay").default(1),
    maximumStay: integer("maximum_stay").default(365),
    isPublished: boolean("is_published").default(false),
    isVerified: boolean("is_verified").default(false),
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

// ─── Listing Photos ───────────────────────────────────────────────────────────

export const listingPhotos = pgTable(
  "listing_photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: varchar("caption", { length: 255 }),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (photo) => [index("photos_listing_id_idx").on(photo.listingId)]
)

// ─── Availability ─────────────────────────────────────────────────────────────

export const availability = pgTable(
  "availability",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    startDate: date("start_date", { mode: "date" }).notNull(),
    endDate: date("end_date", { mode: "date" }).notNull(),
    isAvailable: boolean("is_available").default(true),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (avail) => [
    index("availability_listing_id_idx").on(avail.listingId),
    index("availability_dates_idx").on(avail.startDate, avail.endDate),
  ]
)

// ─── Bookings ─────────────────────────────────────────────────────────────────

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
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    // pending -> approved -> paid -> active -> completed
    // pending -> declined
    // pending -> expired (auto-decline after 24h)
    // approved -> cancelled
    guestMessage: text("guest_message"),
    hostMessage: text("host_message"),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
    stripePaymentStatus: varchar("stripe_payment_status", { length: 50 }),
    respondedAt: timestamp("responded_at", { mode: "date" }),
    paidAt: timestamp("paid_at", { mode: "date" }),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (booking) => [
    index("bookings_listing_id_idx").on(booking.listingId),
    index("bookings_guest_id_idx").on(booking.guestId),
    index("bookings_host_id_idx").on(booking.hostId),
    index("bookings_status_idx").on(booking.status),
    index("bookings_expires_at_idx").on(booking.expiresAt),
  ]
)

// ─── Messages ─────────────────────────────────────────────────────────────────

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
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (message) => [
    index("messages_booking_id_idx").on(message.bookingId),
    index("messages_sender_id_idx").on(message.senderId),
  ]
)

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  listings: many(listings),
  bookingsAsGuest: many(bookings, { relationName: "guestBookings" }),
  bookingsAsHost: many(bookings, { relationName: "hostBookings" }),
  messages: many(messages),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const listingsRelations = relations(listings, ({ one, many }) => ({
  host: one(users, { fields: [listings.hostId], references: [users.id] }),
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
  messages: many(messages),
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