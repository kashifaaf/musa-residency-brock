import { pgTable, text, timestamp, integer, boolean, decimal, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  bio: text('bio'),
  location: text('location'),
  workInfo: text('work_info'),
  socialMedia: text('social_media'),
  profilePhoto: text('profile_photo'),
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
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  maxGuests: integer('max_guests').notNull(),
  amenities: text('amenities').array(),
  photos: text('photos').array().default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  homeId: uuid('home_id').references(() => homes.id).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isBooked: boolean('is_booked').default(false),
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
  guestCount: integer('guest_count').notNull(),
  message: text('message'),
  status: text('status').notNull().default('pending'), // pending, approved, declined, paid, cancelled
  paymentIntentId: text('payment_intent_id'),
  hostResponseDeadline: timestamp('host_response_deadline').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingRequestId: uuid('booking_request_id').references(() => bookingRequests.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  homes: many(homes),
  guestBookings: many(bookingRequests, { relationName: 'guest' }),
  hostBookings: many(bookingRequests, { relationName: 'host' }),
  messages: many(messages),
}));

export const homesRelations = relations(homes, ({ one, many }) => ({
  host: one(users, {
    fields: [homes.hostId],
    references: [users.id],
  }),
  availability: many(availability),
  bookingRequests: many(bookingRequests),
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