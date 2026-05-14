import { pgTable, text, timestamp, boolean, integer, decimal, jsonb, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'approved', 'declined', 'cancelled', 'completed']);
export const notificationTypeEnum = pgEnum('notification_type', ['booking_request', 'booking_approved', 'booking_declined', 'booking_cancelled', 'message', 'payment_success', 'payment_failed']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'authorized', 'captured', 'failed', 'refunded']);

// Users table - compatible with NextAuth DrizzleAdapter
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Will use nanoid
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'), // Required by NextAuth adapter
  bio: text('bio'),
  location: text('location'),
  workInfo: text('work_info'),
  profileImage: text('profile_image'), // Keep for backwards compatibility
  socialLinks: jsonb('social_links').$type<{
    website?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  }>(),
  role: userRoleEnum('role').default('user').notNull(),
  isHost: boolean('is_host').default(false).notNull(),
  responseRate: decimal('response_rate', { precision: 5, scale: 2 }),
  averageResponseTime: integer('average_response_time'), // in hours
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Homes table
export const homes = pgTable('homes', {
  id: text('id').primaryKey(),
  hostId: text('host_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state'),
  country: text('country').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  amenities: jsonb('amenities').$type<{
    bedrooms: number;
    bathrooms: number;
    workspace: boolean;
    wifi: boolean;
    kitchen: boolean;
    parking: boolean;
    artStudio?: boolean;
    instruments?: boolean;
    other: string[];
  }>().notNull(),
  houseRules: text('house_rules'),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  isActive: boolean('is_active').default(true).notNull(),
  visibilityScore: integer('visibility_score').default(100).notNull(), // 0-100, affected by response rate
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  cityIndex: index('homes_city_idx').on(table.city),
  countryIndex: index('homes_country_idx').on(table.country),
  hostIdIndex: index('homes_host_id_idx').on(table.hostId),
}));

// Availability table
export const availability = pgTable('availability', {
  id: text('id').primaryKey(),
  homeId: text('home_id').notNull().references(() => homes.id, { onDelete: 'cascade' }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  homeIdIndex: index('availability_home_id_idx').on(table.homeId),
  dateRangeIndex: index('availability_date_range_idx').on(table.startDate, table.endDate),
}));

// Bookings table
export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  homeId: text('home_id').notNull().references(() => homes.id),
  guestId: text('guest_id').notNull().references(() => users.id),
  hostId: text('host_id').notNull().references(() => users.id),
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  guestCount: integer('guest_count').default(1).notNull(),
  message: text('message'),
  hostResponseAt: timestamp('host_response_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancelledBy: text('cancelled_by').references(() => users.id),
  cancellationReason: text('cancellation_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  homeIdIndex: index('bookings_home_id_idx').on(table.homeId),
  guestIdIndex: index('bookings_guest_id_idx').on(table.guestId),
  hostIdIndex: index('bookings_host_id_idx').on(table.hostId),
  statusIndex: index('bookings_status_idx').on(table.status),
}));

// Payments table
export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').notNull().references(() => bookings.id),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('usd').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  authorizedAt: timestamp('authorized_at'),
  capturedAt: timestamp('captured_at'),
  failedAt: timestamp('failed_at'),
  refundedAt: timestamp('refunded_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  bookingIdIndex: index('payments_booking_id_idx').on(table.bookingId),
  stripeIdIndex: index('payments_stripe_id_idx').on(table.stripePaymentIntentId),
}));

// Messages table
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').notNull().references(() => bookings.id),
  senderId: text('sender_id').notNull().references(() => users.id),
  recipientId: text('recipient_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  bookingIdIndex: index('messages_booking_id_idx').on(table.bookingId),
  recipientIdIndex: index('messages_recipient_id_idx').on(table.recipientId),
}));

// Notifications table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false).notNull(),
  emailSent: boolean('email_sent').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIndex: index('notifications_user_id_idx').on(table.userId),
  isReadIndex: index('notifications_is_read_idx').on(table.isRead),
}));

// Sessions table (for NextAuth) - using exact column names expected by adapter
export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// Accounts table (for NextAuth OAuth) - using exact column names expected by adapter
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
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
  providerProviderAccountIdIndex: uniqueIndex('accounts_provider_provider_account_id_key').on(table.provider, table.providerAccountId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  homes: many(homes),
  bookingsAsGuest: many(bookings, { relationName: 'guestBookings' }),
  bookingsAsHost: many(bookings, { relationName: 'hostBookings' }),
  sentMessages: many(messages, { relationName: 'sentMessages' }),
  receivedMessages: many(messages, { relationName: 'receivedMessages' }),
  notifications: many(notifications),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const homesRelations = relations(homes, ({ one, many }) => ({
  host: one(users, {
    fields: [homes.hostId],
    references: [users.id],
  }),
  availability: many(availability),
  bookings: many(bookings),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  home: one(homes, {
    fields: [availability.homeId],
    references: [homes.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  home: one(homes, {
    fields: [bookings.homeId],
    references: [homes.id],
  }),
  guest: one(users, {
    fields: [bookings.guestId],
    references: [users.id],
    relationName: 'guestBookings',
  }),
  host: one(users, {
    fields: [bookings.hostId],
    references: [users.id],
    relationName: 'hostBookings',
  }),
  cancelledByUser: one(users, {
    fields: [bookings.cancelledBy],
    references: [users.id],
    relationName: 'cancelledBookings',
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
    relationName: 'sentMessages',
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: 'receivedMessages',
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));