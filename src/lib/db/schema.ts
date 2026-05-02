import { pgTable, text, timestamp, boolean, integer, decimal } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio'),
  location: text('location'),
  workInfo: text('work_info'),
  socialMedia: text('social_media'),
  photoUrl: text('photo_url'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const homes = pgTable('homes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  hostId: text('host_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  address: text('address').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  maxGuests: integer('max_guests').notNull(),
  pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }).notNull(),
  amenities: text('amenities'), // JSON string of amenities array
  houseRules: text('house_rules'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const homePhotos = pgTable('home_photos', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  homeId: text('home_id').references(() => homes.id).notNull(),
  url: text('url').notNull(),
  caption: text('caption'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const availability = pgTable('availability', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  homeId: text('home_id').references(() => homes.id).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  homeId: text('home_id').references(() => homes.id).notNull(),
  guestId: text('guest_id').references(() => users.id).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  guests: integer('guests').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(), // pending, approved, declined, paid, completed, cancelled
  message: text('message'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  bookingId: text('booking_id').references(() => bookings.id).notNull(),
  senderId: text('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});