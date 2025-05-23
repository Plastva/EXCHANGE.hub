import { 
  users, currencies, exchanges, conversionHistory, marketData,
  type User, type InsertUser, type Currency, type InsertCurrency,
  type Exchange, type InsertExchange, type ConversionHistory, type InsertConversion,
  type MarketData, type InsertMarketData
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Currency operations
  getAllCurrencies(): Promise<Currency[]>;
  getCurrenciesByType(type: 'forex' | 'crypto'): Promise<Currency[]>;
  getCurrency(symbol: string): Promise<Currency | undefined>;
  upsertCurrency(currency: InsertCurrency): Promise<Currency>;
  updateCurrencyPrice(symbol: string, price: string, change24h?: string, volume24h?: string, marketCap?: string): Promise<void>;

  // Exchange operations
  getAllExchanges(): Promise<Exchange[]>;
  getExchange(id: number): Promise<Exchange | undefined>;
  upsertExchange(exchange: InsertExchange): Promise<Exchange>;

  // Conversion operations
  createConversion(conversion: InsertConversion): Promise<ConversionHistory>;
  getUserConversions(userId: number): Promise<ConversionHistory[]>;
  getRecentConversions(limit?: number): Promise<ConversionHistory[]>;

  // Market data operations
  getMarketData(currencyId: number, hours?: number): Promise<MarketData[]>;
  insertMarketData(data: InsertMarketData): Promise<MarketData>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllCurrencies(): Promise<Currency[]> {
    return await db.select().from(currencies).where(eq(currencies.isActive, true)).orderBy(currencies.name);
  }

  async getCurrenciesByType(type: 'forex' | 'crypto'): Promise<Currency[]> {
    return await db.select()
      .from(currencies)
      .where(and(eq(currencies.type, type), eq(currencies.isActive, true)))
      .orderBy(currencies.name);
  }

  async getCurrency(symbol: string): Promise<Currency | undefined> {
    const [currency] = await db.select().from(currencies).where(eq(currencies.symbol, symbol));
    return currency || undefined;
  }

  async upsertCurrency(currency: InsertCurrency): Promise<Currency> {
    const existing = await this.getCurrency(currency.symbol);
    
    if (existing) {
      const [updated] = await db
        .update(currencies)
        .set({ ...currency, lastUpdated: new Date() })
        .where(eq(currencies.symbol, currency.symbol))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(currencies)
        .values(currency)
        .returning();
      return created;
    }
  }

  async updateCurrencyPrice(symbol: string, price: string, change24h?: string, volume24h?: string, marketCap?: string): Promise<void> {
    const updateData: any = {
      currentPrice: price,
      lastUpdated: new Date(),
    };

    if (change24h !== undefined) updateData.change24h = change24h;
    if (volume24h !== undefined) updateData.volume24h = volume24h;
    if (marketCap !== undefined) updateData.marketCap = marketCap;

    await db
      .update(currencies)
      .set(updateData)
      .where(eq(currencies.symbol, symbol));
  }

  async getAllExchanges(): Promise<Exchange[]> {
    return await db.select().from(exchanges).where(eq(exchanges.isActive, true)).orderBy(desc(exchanges.volume24h));
  }

  async getExchange(id: number): Promise<Exchange | undefined> {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, id));
    return exchange || undefined;
  }

  async upsertExchange(exchange: InsertExchange): Promise<Exchange> {
    const existing = await db.select().from(exchanges).where(eq(exchanges.name, exchange.name));
    
    if (existing.length > 0) {
      const [updated] = await db
        .update(exchanges)
        .set({ ...exchange, lastUpdated: new Date() })
        .where(eq(exchanges.name, exchange.name))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(exchanges)
        .values(exchange)
        .returning();
      return created;
    }
  }

  async createConversion(conversion: InsertConversion): Promise<ConversionHistory> {
    const [created] = await db
      .insert(conversionHistory)
      .values(conversion)
      .returning();
    return created;
  }

  async getUserConversions(userId: number): Promise<ConversionHistory[]> {
    return await db.select()
      .from(conversionHistory)
      .where(eq(conversionHistory.userId, userId))
      .orderBy(desc(conversionHistory.timestamp))
      .limit(50);
  }

  async getRecentConversions(limit: number = 10): Promise<ConversionHistory[]> {
    return await db.select()
      .from(conversionHistory)
      .orderBy(desc(conversionHistory.timestamp))
      .limit(limit);
  }

  async getMarketData(currencyId: number, hours: number = 24): Promise<MarketData[]> {
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await db.select()
      .from(marketData)
      .where(and(
        eq(marketData.currencyId, currencyId),
        gte(marketData.timestamp, hoursAgo)
      ))
      .orderBy(marketData.timestamp);
  }

  async insertMarketData(data: InsertMarketData): Promise<MarketData> {
    const [created] = await db
      .insert(marketData)
      .values(data)
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
