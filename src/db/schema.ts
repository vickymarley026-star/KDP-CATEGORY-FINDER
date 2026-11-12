import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Saved Books for author portfolio
export const savedBooks = pgTable('saved_books', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  authorName: text('author_name'),
  asinOrIsbn: text('asin_or_isbn'),
  format: text('format').default('ebook').notNull(),
  primaryGenre: text('primary_genre'),
  subgenreTropes: text('subgenre_tropes'),
  blurb: text('blurb'),
  currentCategories: text('current_categories'), // JSON stringified array
  backendKeywords: text('backend_keywords'), // JSON stringified array
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Saved Category Audits & Support Tickets
export const savedAudits = pgTable('saved_audits', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  bookId: integer('book_id').references(() => savedBooks.id, { onDelete: 'set null' }),
  bookTitle: text('book_title').notNull(),
  auditData: text('audit_data').notNull(), // JSON stringified CategoryAuditResult
  createdAt: timestamp('created_at').defaultNow(),
});

// Saved A+ Content Campaigns
export const savedCampaigns = pgTable('saved_campaigns', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  bookId: integer('book_id').references(() => savedBooks.id, { onDelete: 'set null' }),
  campaignTitle: text('campaign_title').notNull(),
  campaignData: text('campaign_data').notNull(), // JSON stringified APlusCampaign
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  books: many(savedBooks),
  audits: many(savedAudits),
  campaigns: many(savedCampaigns),
}));

export const savedBooksRelations = relations(savedBooks, ({ one, many }) => ({
  user: one(users, {
    fields: [savedBooks.userId],
    references: [users.id],
  }),
  audits: many(savedAudits),
  campaigns: many(savedCampaigns),
}));

export const savedAuditsRelations = relations(savedAudits, ({ one }) => ({
  user: one(users, {
    fields: [savedAudits.userId],
    references: [users.id],
  }),
  book: one(savedBooks, {
    fields: [savedAudits.bookId],
    references: [savedBooks.id],
  }),
}));

export const savedCampaignsRelations = relations(savedCampaigns, ({ one }) => ({
  user: one(users, {
    fields: [savedCampaigns.userId],
    references: [users.id],
  }),
  book: one(savedBooks, {
    fields: [savedCampaigns.bookId],
    references: [savedBooks.id],
  }),
}));
