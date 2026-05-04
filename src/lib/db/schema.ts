import { pgTable, text, timestamp, uuid, boolean, integer, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  bio: text('bio'),
  location: text('location'),
  workInfo: text('work_info'),
  socialMedia: text('social_media'),
  profileImageUrl: text('profile_image_url'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const homes = pgTable('homes', {
  id: uuid('id').primaryKey().defaultRandom(),
  hostId: uuid('host_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }).notNull(),
  maxGuests: integer('max_guests').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const homePhotos = pgTable('home_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  homeId: uuid('home_id').references(() => homes.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const homeAvailability = pgTable('home_availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  homeId: uuid('home_id').references(() => homes.id, { onDelete: 'cascade' }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookingRequests = pgTable('booking_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  homeId: uuid('home_id').references(() => homes.id).notNull(),
  guestId: uuid('guest_id').references(() => users.id).notNull(),
  hostId: uuid('host_id').references(() => users.id).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // pending, approved, declined, cancelled, completed
  guestMessage: text('guest_message'),
  hostResponse: text('host_response'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingRequestId: uuid('booking_request_id').references(() => bookingRequests.id, { onDelete: 'cascade' }).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  hostedHomes: many(homes, { relationName: 'host' }),
  bookingRequests: many(bookingRequests, { relationName: 'guest' }),
  hostedBookings: many(bookingRequests, { relationName: 'host' }),
  messages: many(messages),
}));

export const homesRelations = relations(homes, ({ one, many }) => ({
  host: one(users, {
    fields: [homes.hostId],
    references: [users.id],
    relationName: 'host',
  }),
  photos: many(homePhotos),
  availability: many(homeAvailability),
  bookingRequests: many(bookingRequests),
}));

export const homePhotosRelations = relations(homePhotos, ({ one }) => ({
  home: one(homes, {
    fields: [homePhotos.homeId],
    references: [homes.id],
  }),
}));

export const homeAvailabilityRelations = relations(homeAvailability, ({ one }) => ({
  home: one(homes, {
    fields: [homeAvailability.homeId],
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
    relationName: 'guest',
  }),
  host: one(users, {
    fields: [bookingRequests.hostId],
    references: [users.id],
    relationName: 'host',
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
  }),
}));