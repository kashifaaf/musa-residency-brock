import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb,
  decimal,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const listingStatusEnum = pgEnum('listing_status', ['draft', 'active', 'inactive', 'archived']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'approved', 'declined', 'cancelled', 'completed']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'authorized', 'captured', 'refunded', 'failed']);
export const notificationTypeEnum = pgEnum('notification_type', ['booking_request', 'booking_approved', 'booking_declined', 'booking_cancelled', 'payment_success', 'payment_failed']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  name: text('name'),
  image: text('image'),
  bio: text('bio'),
  location: text('location'),
  workInfo: text('work_info'),
  socialMediaProfiles: jsonb('social_media_profiles').$type<Record<string, string>>().default({}),
  stripeCustomerId: text('stripe_customer_id'),
  hostVisibilityScore: decimal('host_visibility_score', { precision: 3, scale: 2 }).default('1.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

// Sessions table for NextAuth
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

// Accounts table for NextAuth
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  providerIdx: uniqueIndex('accounts_provider_provider_account_id_idx').on(table.provider, table.providerAccountId),
}));

// Verification tokens for NextAuth
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
}, (table) => ({
  tokenIdx: uniqueIndex('verification_tokens_identifier_token_idx').on(table.identifier, table.token),
}));

// Listings table
export const listings = pgTable('listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  hostId: uuid('host_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  maxGuests: integer('max_guests').notNull().default(2),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: decimal('bathrooms', { precision: 3, scale: 1 }).notNull(),
  amenities: jsonb('amenities').$type<string[]>().default([]),
  houseRules: text('house_rules'),
  creativeFeatures: jsonb('creative_features').$type<string[]>().default([]),
  pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  status: listingStatusEnum('status').notNull().default('draft'),
  viewCount: integer('view_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  hostIdx: index('listings_host_id_idx').on(table.hostId),
  statusIdx: index('listings_status_idx').on(table.status),
  locationIdx: index('listings_location_idx').on(table.location),
}));

// Listing Photos table
export const listingPhotos = pgTable('listing_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  key: text('key').notNull(),
  caption: text('caption'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  listingIdx: index('listing_photos_listing_id_idx').on(table.listingId),
  orderIdx: index('listing_photos_order_idx').on(table.orderIndex),
}));

// Availability table
export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isBlocked: boolean('is_blocked').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  listingIdx: index('availability_listing_id_idx').on(table.listingId),
  dateIdx: index('availability_dates_idx').on(table.startDate, table.endDate),
}));

// Bookings table
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  hostId: uuid('host_id').notNull().references(() => users.id),
  guestId: uuid('guest_id').notNull().references(() => users.id),
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out').notNull(),
  guestCount: integer('guest_count').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  status: bookingStatusEnum('status').notNull().default('pending'),
  guestMessage: text('guest_message'),
  hostMessage: text('host_message'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),
  approvedAt: timestamp('approved_at'),
  declinedAt: timestamp('declined_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancelledBy: uuid('cancelled_by').references(() => users.id),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  listingIdx: index('bookings_listing_id_idx').on(table.listingId),
  hostIdx: index('bookings_host_id_idx').on(table.hostId),
  guestIdx: index('bookings_guest_id_idx').on(table.guestId),
  statusIdx: index('bookings_status_idx').on(table.status),
  dateIdx: index('bookings_dates_idx').on(table.checkIn, table.checkOut),
}));

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  receiverId: uuid('receiver_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  bookingIdx: index('messages_booking_id_idx').on(table.bookingId),
  senderIdx: index('messages_sender_id_idx').on(table.senderId),
  receiverIdx: index('messages_receiver_id_idx').on(table.receiverId),
  readIdx: index('messages_read_idx').on(table.read),
}));

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  relatedBookingId: uuid('related_booking_id').references(() => bookings.id),
  relatedListingId: uuid('related_listing_id').references(() => listings.id),
  read: boolean('read').notNull().default(false),
  emailSent: boolean('email_sent').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notifications_user_id_idx').on(table.userId),
  readIdx: index('notifications_read_idx').on(table.read),
  typeIdx: index('notifications_type_idx').on(table.type),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  bookingsAsHost: many(bookings, { relationName: 'host' }),
  bookingsAsGuest: many(bookings, { relationName: 'guest' }),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'receiver' }),
  notifications: many(notifications),
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
  host: one(users, {
    fields: [bookings.hostId],
    references: [users.id],
    relationName: 'host',
  }),
  guest: one(users, {
    fields: [bookings.guestId],
    references: [users.id],
    relationName: 'guest',
  }),
  messages: many(messages),
  notifications: many(notifications),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  booking: one(bookings, {
    fields: [notifications.relatedBookingId],
    references: [bookings.id],
  }),
  listing: one(listings, {
    fields: [notifications.relatedListingId],
    references: [listings.id],
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

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type ListingPhoto = typeof listingPhotos.$inferSelect;
export type NewListingPhoto = typeof listingPhotos.$inferInsert;
export type Availability = typeof availability.$inferSelect;
export type NewAvailability = typeof availability.$inferInsert;