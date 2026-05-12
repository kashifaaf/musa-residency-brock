import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  json,
  uuid,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["guest", "host", "both"]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "approved",
  "declined",
  "cancelled",
  "completed",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "authorized",
  "captured",
  "refunded",
  "failed",
]);
export const listingStatusEnum = pgEnum("listing_status", [
  "draft",
  "published",
  "paused",
  "archived",
]);

// Users table
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified"),
    name: text("name"),
    image: text("image"),
    bio: text("bio"),
    location: text("location"),
    workInfo: text("work_info"),
    socialLinks: json("social_links").$type<Record<string, string>>(),
    role: userRoleEnum("role").notNull().default("guest"),
    isVerified: boolean("is_verified").notNull().default(false),
    responseRate: decimal("response_rate", { precision: 5, scale: 2 }),
    avgResponseTime: integer("avg_response_time"), // in minutes
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

// Listings table
export const listings = pgTable(
  "listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hostId: text("host_id")
      .notNull()
      .references(() => users.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    country: text("country").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    propertyType: text("property_type").notNull(),
    maxGuests: integer("max_guests").notNull().default(2),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }).notNull(),
    amenities: json("amenities").$type<string[]>().notNull().default([]),
    creativeAmenities: json("creative_amenities").$type<string[]>().notNull().default([]),
    houseRules: text("house_rules"),
    neighborhoodDescription: text("neighborhood_description"),
    pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
    minimumStay: integer("minimum_stay").notNull().default(30),
    status: listingStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    hostIdx: index("listings_host_idx").on(table.hostId),
    locationIdx: index("listings_location_idx").on(table.city, table.country),
    statusIdx: index("listings_status_idx").on(table.status),
  })
);

// Listing photos table
export const listingPhotos = pgTable(
  "listing_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: text("caption"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    listingIdx: index("photos_listing_idx").on(table.listingId),
  })
);

// Availability table
export const availability = pgTable(
  "availability",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    isBlocked: boolean("is_blocked").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    listingDateIdx: index("availability_listing_date_idx").on(
      table.listingId,
      table.startDate,
      table.endDate
    ),
  })
);

// Bookings table
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id),
    guestId: text("guest_id")
      .notNull()
      .references(() => users.id),
    hostId: text("host_id")
      .notNull()
      .references(() => users.id),
    checkIn: timestamp("check_in").notNull(),
    checkOut: timestamp("check_out").notNull(),
    guestCount: integer("guest_count").notNull().default(1),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    status: bookingStatusEnum("status").notNull().default("pending"),
    guestMessage: text("guest_message"),
    hostMessage: text("host_message"),
    declinedAt: timestamp("declined_at"),
    approvedAt: timestamp("approved_at"),
    cancelledAt: timestamp("cancelled_at"),
    cancelledBy: text("cancelled_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    guestIdx: index("bookings_guest_idx").on(table.guestId),
    hostIdx: index("bookings_host_idx").on(table.hostId),
    listingIdx: index("bookings_listing_idx").on(table.listingId),
    statusIdx: index("bookings_status_idx").on(table.status),
    datesIdx: index("bookings_dates_idx").on(table.checkIn, table.checkOut),
  })
);

// Payments table
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id),
    stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("USD"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    authorizedAt: timestamp("authorized_at"),
    capturedAt: timestamp("captured_at"),
    refundedAt: timestamp("refunded_at"),
    failureReason: text("failure_reason"),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    bookingIdx: index("payments_booking_idx").on(table.bookingId),
    stripeIdx: uniqueIndex("payments_stripe_idx").on(table.stripePaymentIntentId),
  })
);

// Messages table
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id),
    receiverId: text("receiver_id")
      .notNull()
      .references(() => users.id),
    content: text("content").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    bookingIdx: index("messages_booking_idx").on(table.bookingId),
    receiverIdx: index("messages_receiver_idx").on(table.receiverId),
    unreadIdx: index("messages_unread_idx").on(table.receiverId, table.isRead),
  })
);

// Sessions table (for auth)
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

// Accounts table (for OAuth)
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
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
  (table) => ({
    userIdx: index("accounts_user_idx").on(table.userId),
    providerIdx: uniqueIndex("accounts_provider_idx").on(
      table.provider,
      table.providerAccountId
    ),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  bookingsAsGuest: many(bookings, {
    relationName: "guestBookings",
  }),
  bookingsAsHost: many(bookings, {
    relationName: "hostBookings",
  }),
  sentMessages: many(messages, {
    relationName: "sentMessages",
  }),
  receivedMessages: many(messages, {
    relationName: "receivedMessages",
  }),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  host: one(users, {
    fields: [listings.hostId],
    references: [users.id],
  }),
  photos: many(listingPhotos),
  availability: many(availability),
  bookings: many(bookings),
}));

export const listingPhotosRelations = relations(listingPhotos, ({ one }) => ({
  listing: one(listings, {
    fields: [listingPhotos.listingId],
    references: [listings.id],
  }),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  listing: one(listings, {
    fields: [availability.listingId],
    references: [listings.id],
  }),
}));

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
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));