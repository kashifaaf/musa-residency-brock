import { pgTable, text, timestamp, boolean, integer, decimal, uuid, json, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  bio: text('bio'),
  workInfo: text('work_info'),
  location: text('location'),
  socialMediaUrls: json('social_media_urls').$type<{
    website?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }>(),
  artisticPractice: text('artistic_practice'),
  portfolio: json('portfolio').$type<string[]>(),
  isHost: boolean('is_host').default(false).notNull(),
  emailVerified: timestamp('emailVerified'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
}))

export const usersRelations = relations(users, ({ many }) => ({
  homes: many(homes),
  bookingsAsGuest: many(bookings),
  sentMessages: many(messages, {
    relationName: 'sender',
  }),
  receivedMessages: many(messages, {
    relationName: 'recipient',
  }),
  accounts: many(accounts),
  sessions: many(sessions),
}))

// Accounts table (for NextAuth)
export const accounts = pgTable('accounts', {
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  providerProviderAccountIdIdx: uniqueIndex('accounts_provider_providerAccountId_idx')
    .on(table.provider, table.providerAccountId),
  userIdIdx: index('accounts_userId_idx').on(table.userId),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

// Sessions table (for NextAuth)
export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').notNull().unique(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
}, (table) => ({
  sessionTokenIdx: uniqueIndex('sessions_sessionToken_idx').on(table.sessionToken),
  userIdIdx: index('sessions_userId_idx').on(table.userId),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

// Verification tokens table (for email verification)
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
}, (table) => ({
  tokenIdx: uniqueIndex('verification_tokens_token_idx').on(table.token),
  identifierTokenIdx: index('verification_tokens_identifier_token_idx').on(table.identifier, table.token),
}))

// Homes table
export const homes = pgTable('homes', {
  id: uuid('id').primaryKey().defaultRandom(),
  hostId: uuid('host_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  images: json('images').notNull().$type<string[]>(),
  amenities: json('amenities').$type<string[]>(),
  creativeAmenities: json('creative_amenities').$type<string[]>(),
  maxGuests: integer('max_guests').notNull().default(2),
  bedrooms: integer('bedrooms').notNull().default(1),
  bathrooms: integer('bathrooms').notNull().default(1),
  pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }).notNull(),
  minimumStay: integer('minimum_stay').notNull().default(30),
  houseRules: text('house_rules'),
  localArtScene: text('local_art_scene'),
  isActive: boolean('is_active').default(true).notNull(),
  responseRate: decimal('response_rate', { precision: 5, scale: 2 }).default('100.00'),
  avgResponseTime: integer('avg_response_time'), // in hours
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  hostIdIdx: index('homes_host_id_idx').on(table.hostId),
  cityCountryIdx: index('homes_city_country_idx').on(table.city, table.country),
  isActiveIdx: index('homes_is_active_idx').on(table.isActive),
}))

export const homesRelations = relations(homes, ({ one, many }) => ({
  host: one(users, {
    fields: [homes.hostId],
    references: [users.id],
  }),
  availability: many(availability),
  bookings: many(bookings),
}))

// Availability table
export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  homeId: uuid('home_id').notNull().references(() => homes.id, { onDelete: 'cascade' }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  homeIdIdx: index('availability_home_id_idx').on(table.homeId),
  dateRangeIdx: index('availability_date_range_idx').on(table.startDate, table.endDate),
}))

export const availabilityRelations = relations(availability, ({ one }) => ({
  home: one(homes, {
    fields: [availability.homeId],
    references: [homes.id],
  }),
}))

// Bookings table
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  homeId: uuid('home_id').notNull().references(() => homes.id, { onDelete: 'restrict' }),
  guestId: uuid('guest_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out').notNull(),
  guests: integer('guests').notNull().default(1),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status', { 
    enum: ['pending', 'approved', 'declined', 'cancelled', 'completed'] 
  }).notNull().default('pending'),
  message: text('message'),
  hostResponseAt: timestamp('host_response_at'),
  paymentIntentId: text('payment_intent_id'),
  paymentStatus: text('payment_status', {
    enum: ['pending', 'authorized', 'captured', 'failed', 'refunded']
  }).default('pending'),
  cancelledAt: timestamp('cancelled_at'),
  cancelReason: text('cancel_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  homeIdIdx: index('bookings_home_id_idx').on(table.homeId),
  guestIdIdx: index('bookings_guest_id_idx').on(table.guestId),
  statusIdx: index('bookings_status_idx').on(table.status),
  dateRangeIdx: index('bookings_date_range_idx').on(table.checkIn, table.checkOut),
}))

export const bookingsRelations = relations(bookings, ({ one }) => ({
  home: one(homes, {
    fields: [bookings.homeId],
    references: [homes.id],
  }),
  guest: one(users, {
    fields: [bookings.guestId],
    references: [users.id],
  }),
}))

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipientId: uuid('recipient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  senderIdIdx: index('messages_sender_id_idx').on(table.senderId),
  recipientIdIdx: index('messages_recipient_id_idx').on(table.recipientId),
  bookingIdIdx: index('messages_booking_id_idx').on(table.bookingId),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: 'recipient',
  }),
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
}))

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export const insertHomeSchema = createInsertSchema(homes, {
  images: z.array(z.string().url()),
  amenities: z.array(z.string()).optional(),
  creativeAmenities: z.array(z.string()).optional(),
  pricePerNight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0),
})
export const selectHomeSchema = createSelectSchema(homes)

export const insertBookingSchema = createInsertSchema(bookings)
export const selectBookingSchema = createSelectSchema(bookings)

export const insertMessageSchema = createInsertSchema(messages)
export const selectMessageSchema = createSelectSchema(messages)

export const insertAvailabilitySchema = createInsertSchema(availability)
export const selectAvailabilitySchema = createSelectSchema(availability)

// Export all table types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Account = typeof accounts.$inferSelect
export type Session = typeof sessions.$inferSelect
export type VerificationToken = typeof verificationTokens.$inferSelect
export type Home = typeof homes.$inferSelect
export type NewHome = typeof homes.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type Availability = typeof availability.$inferSelect
export type NewAvailability = typeof availability.$inferInsert