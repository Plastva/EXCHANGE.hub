import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const currencies = pgTable("currencies", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 10 }).notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'forex' | 'crypto'
  currentPrice: decimal("current_price", { precision: 20, scale: 8 }),
  change24h: decimal("change_24h", { precision: 10, scale: 4 }),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  iconUrl: text("icon_url"),
  metadata: jsonb("metadata"), // Additional data like rank, supply, etc.
});

export const exchanges = pgTable("exchanges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  url: text("url"),
  country: text("country"),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }),
  trustScore: integer("trust_score"), // 1-10 scale
  yearEstablished: integer("year_established"),
  description: text("description"),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const conversionHistory = pgTable("conversion_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  fromCurrency: varchar("from_currency", { length: 10 }).notNull(),
  toCurrency: varchar("to_currency", { length: 10 }).notNull(),
  fromAmount: decimal("from_amount", { precision: 20, scale: 8 }).notNull(),
  toAmount: decimal("to_amount", { precision: 20, scale: 8 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 20, scale: 10 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  currencyId: integer("currency_id").notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  volume: decimal("volume", { precision: 20, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conversions: many(conversionHistory),
}));

export const currenciesRelations = relations(currencies, ({ many }) => ({
  marketData: many(marketData),
  fromConversions: many(conversionHistory, { relationName: "fromCurrency" }),
  toConversions: many(conversionHistory, { relationName: "toCurrency" }),
}));

export const conversionHistoryRelations = relations(conversionHistory, ({ one }) => ({
  user: one(users, {
    fields: [conversionHistory.userId],
    references: [users.id],
  }),
}));

export const marketDataRelations = relations(marketData, ({ one }) => ({
  currency: one(currencies, {
    fields: [marketData.currencyId],
    references: [currencies.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCurrencySchema = createInsertSchema(currencies).omit({
  id: true,
  lastUpdated: true,
});

export const insertExchangeSchema = createInsertSchema(exchanges).omit({
  id: true,
  lastUpdated: true,
});

export const insertConversionSchema = createInsertSchema(conversionHistory).omit({
  id: true,
  timestamp: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Currency = typeof currencies.$inferSelect;
export type InsertCurrency = z.infer<typeof insertCurrencySchema>;

export type Exchange = typeof exchanges.$inferSelect;
export type InsertExchange = z.infer<typeof insertExchangeSchema>;

export type ConversionHistory = typeof conversionHistory.$inferSelect;
export type InsertConversion = z.infer<typeof insertConversionSchema>;

export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
