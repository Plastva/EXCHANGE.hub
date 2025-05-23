import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversionSchema, insertCurrencySchema, insertExchangeSchema } from "@shared/schema";
import { z } from "zod";
import axios from "axios";

// External API configurations
const EXCHANGERATE_API_KEY = process.env.EXCHANGERATE_API_KEY || process.env.EXCHANGE_RATE_API_KEY || "demo_key";
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const EXCHANGERATE_API_URL = "https://v6.exchangerate-api.com/v6";

// Utility function to handle API errors
function handleApiError(error: any, defaultMessage: string) {
  console.error(defaultMessage, error.response?.data || error.message);
  if (error.response?.status === 429) {
    throw new Error("API rate limit exceeded. Please try again later.");
  }
  if (error.response?.status === 401) {
    throw new Error("API authentication failed. Please check API keys.");
  }
  throw new Error(defaultMessage);
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all currencies with optional type filter
  app.get("/api/currencies", async (req, res) => {
    try {
      const { type } = req.query;
      let currencies;
      
      if (type && (type === 'forex' || type === 'crypto')) {
        currencies = await storage.getCurrenciesByType(type as 'forex' | 'crypto');
      } else {
        currencies = await storage.getAllCurrencies();
      }
      
      res.json({ success: true, data: currencies });
    } catch (error) {
      console.error("Error fetching currencies:", error);
      res.status(500).json({ success: false, error: "Failed to fetch currencies" });
    }
  });

  // Get forex data from external API and update database
  app.get("/api/forex", async (req, res) => {
    try {
      // Fetch latest forex rates
      const response = await axios.get(`${EXCHANGERATE_API_URL}/${EXCHANGERATE_API_KEY}/latest/USD`);
      
      if (!response.data || !response.data.conversion_rates) {
        throw new Error("Invalid forex API response");
      }

      const rates = response.data.conversion_rates;
      const forexData = [];

      // Major currency pairs
      const majorCurrencies = ['EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'DKK'];
      
      for (const currency of majorCurrencies) {
        if (rates[currency]) {
          const rate = rates[currency];
          const pair = `USD/${currency}`;
          
          // Update or create currency in database
          await storage.upsertCurrency({
            symbol: pair,
            name: `US Dollar to ${currency}`,
            type: 'forex',
            currentPrice: rate.toString(),
            change24h: '0', // Exchange rate API doesn't provide 24h change
            isActive: true,
          });

          forexData.push({
            symbol: pair,
            name: `US Dollar to ${currency}`,
            price: rate,
            change24h: 0,
            type: 'forex'
          });
        }
      }

      res.json({ success: true, data: forexData });
    } catch (error) {
      handleApiError(error, "Failed to fetch forex data");
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get crypto data from CoinGecko API and update database
  app.get("/api/crypto", async (req, res) => {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid crypto API response");
      }

      const cryptoData = [];

      for (const coin of response.data) {
        // Update or create currency in database
        await storage.upsertCurrency({
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          type: 'crypto',
          currentPrice: coin.current_price?.toString() || '0',
          change24h: coin.price_change_percentage_24h?.toString() || '0',
          volume24h: coin.total_volume?.toString() || '0',
          marketCap: coin.market_cap?.toString() || '0',
          iconUrl: coin.image,
          isActive: true,
          metadata: {
            rank: coin.market_cap_rank,
            circulatingSupply: coin.circulating_supply,
            totalSupply: coin.total_supply,
            maxSupply: coin.max_supply,
          }
        });

        cryptoData.push({
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          volume24h: coin.total_volume,
          marketCap: coin.market_cap,
          rank: coin.market_cap_rank,
          icon: coin.image,
          type: 'crypto'
        });
      }

      res.json({ success: true, data: cryptoData });
    } catch (error) {
      handleApiError(error, "Failed to fetch crypto data");
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get exchange data from CoinGecko API and update database
  app.get("/api/exchanges", async (req, res) => {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/exchanges`, {
        params: {
          per_page: 20,
          page: 1
        }
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid exchanges API response");
      }

      const exchangesData = [];

      for (const exchange of response.data) {
        // Update or create exchange in database
        await storage.upsertExchange({
          name: exchange.id,
          displayName: exchange.name,
          url: exchange.url,
          country: exchange.country,
          volume24h: exchange.trade_volume_24h_btc?.toString() || '0',
          trustScore: exchange.trust_score || 0,
          yearEstablished: exchange.year_established,
          description: exchange.description,
          logoUrl: exchange.image,
          isActive: true,
        });

        exchangesData.push({
          id: exchange.id,
          name: exchange.name,
          url: exchange.url,
          country: exchange.country,
          volume24h: exchange.trade_volume_24h_btc,
          trustScore: exchange.trust_score,
          yearEstablished: exchange.year_established,
          image: exchange.image,
        });
      }

      res.json({ success: true, data: exchangesData });
    } catch (error) {
      handleApiError(error, "Failed to fetch exchanges data");
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Convert currencies with comprehensive rates
  app.post("/api/convert", async (req, res) => {
    try {
      const { from, to, amount } = req.body;

      if (!from || !to || !amount || amount <= 0) {
        return res.status(400).json({ success: false, error: "Invalid conversion parameters" });
      }

      // Comprehensive exchange rates including Moldovan Lei
      const exchangeRates: Record<string, number> = {
        // Major Fiat Currencies (base: USD)
        'USD': 1.0,
        'EUR': 0.85,
        'GBP': 0.73,
        'JPY': 110.0,
        'CHF': 0.92,
        'CAD': 1.25,
        'AUD': 1.35,
        'NZD': 1.45,
        
        // European Currencies
        'RON': 4.15,
        'MDL': 17.8,  // Moldovan Lei
        'PLN': 3.95,
        'CZK': 22.5,
        'HUF': 295.0,
        'BGN': 1.66,
        'HRK': 6.4,
        'SEK': 8.85,
        'NOK': 8.65,
        'DKK': 6.35,
        'ISK': 125.0,
        'ALL': 98.5,
        'BAM': 1.66,
        'MKD': 52.3,
        'RSD': 99.8,
        'UAH': 27.5,
        'BYN': 2.45,
        
        // Asian Currencies
        'CNY': 6.45,
        'RUB': 74.5,
        'INR': 74.2,
        'KRW': 1180.0,
        'SGD': 1.35,
        'HKD': 7.8,
        'TWD': 28.2,
        'MYR': 4.15,
        'IDR': 14250.0,
        'PHP': 49.8,
        'VND': 23100.0,
        'THB': 31.5,
        'LAK': 11500.0,
        'KHR': 4050.0,
        'MMK': 1680.0,
        'NPR': 118.5,
        'LKR': 200.0,
        'BDT': 84.8,
        'PKR': 155.0,
        'AFN': 78.2,
        'UZS': 10650.0,
        'KZT': 425.0,
        'KGS': 84.7,
        'TJS': 11.3,
        'TMT': 3.5,
        'AZN': 1.7,
        'GEL': 2.65,
        'AMD': 485.0,
        
        // Middle East & Africa
        'AED': 3.67,
        'SAR': 3.75,
        'QAR': 3.64,
        'KWD': 0.30,
        'BHD': 0.377,
        'OMR': 0.385,
        'JOD': 0.71,
        'LBP': 1507.5,
        'SYP': 2512.0,
        'IQD': 1310.0,
        'IRR': 42105.0,
        'ILS': 3.25,
        'TRY': 8.4,
        'EGP': 15.7,
        'ZAR': 14.8,
        'NGN': 411.0,
        'GHS': 5.8,
        'KES': 108.0,
        'UGX': 3550.0,
        'TZS': 2318.0,
        'RWF': 1025.0,
        'ETB': 43.8,
        'MAD': 8.85,
        'TND': 2.78,
        'DZD': 133.5,
        'LYD': 4.48,
        'XOF': 557.0, // West African CFA
        'XAF': 557.0, // Central African CFA
        
        // Americas
        'MXN': 20.1,
        'BRL': 5.2,
        'ARS': 98.5,
        'CLP': 715.0,
        'COP': 3875.0,
        'PEN': 3.65,
        'UYU': 44.2,
        'BOB': 6.91,
        'PYG': 7025.0,
        'VES': 4.18,
        'GTQ': 7.72,
        'HNL': 24.6,
        'NIO': 35.8,
        'CRC': 615.0,
        'PAB': 1.0,
        'DOP': 56.8,
        'HTG': 91.2,
        'JMD': 152.0,
        'BBD': 2.0,
        'TTD': 6.78,
        'GYD': 209.0,
        'SRD': 14.3,
        'FKP': 0.73,
        
        // Oceania & Others
        'FJD': 2.08,
        'PGK': 3.53,
        'SBD': 8.15,
        'VUV': 112.0,
        'WST': 2.58,
        'TOP': 2.27,
        
        // Major Cryptocurrencies
        'BTC': 0.000023,
        'ETH': 0.00035,
        'BNB': 0.002,
        'ADA': 0.85,
        'SOL': 0.011,
        'XRP': 1.85,
        'DOT': 0.065,
        'DOGE': 14.5,
        'AVAX': 0.028,
        'SHIB': 85000.0,
        'MATIC': 1.25,
        'LTC': 0.0075,
        'UNI': 0.095,
        'LINK': 0.042,
        'ATOM': 0.075,
        'BCH': 0.0018,
        'XLM': 8.5,
        'VET': 45.0,
        'FIL': 0.065,
        'MANA': 2.85,
      };

      let rate = 1;
      if (from !== to) {
        const fromRate = exchangeRates[from];
        const toRate = exchangeRates[to];
        
        if (fromRate && toRate) {
          rate = toRate / fromRate;
        } else {
          return res.status(400).json({ 
            success: false, 
            error: `Exchange rate not available for ${from} to ${to}` 
          });
        }
      }

      const convertedAmount = amount * rate;

      // Save conversion history
      await storage.createConversion({
        userId: 1, // Default user for demo
        fromCurrency: from,
        toCurrency: to,
        fromAmount: amount.toString(),
        toAmount: convertedAmount.toString(),
        exchangeRate: rate.toString(),
      });

      res.json({
        success: true,
        data: {
          from,
          to,
          fromAmount: amount,
          toAmount: convertedAmount,
          rate,
          timestamp: new Date().toISOString(),
        }
      });

    } catch (error) {
      console.error("Conversion error:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to convert currency" });
    }
  });

  // Get conversion history
  app.get("/api/conversions", async (req, res) => {
    try {
      const { userId, limit } = req.query;
      let conversions;

      if (userId) {
        conversions = await storage.getUserConversions(parseInt(userId as string));
      } else {
        conversions = await storage.getRecentConversions(parseInt(limit as string) || 10);
      }

      res.json({ success: true, data: conversions });
    } catch (error) {
      console.error("Error fetching conversions:", error);
      res.status(500).json({ success: false, error: "Failed to fetch conversion history" });
    }
  });

  // Get market statistics
  app.get("/api/market-stats", async (req, res) => {
    try {
      const [cryptocurrencies, forexCurrencies, exchanges] = await Promise.all([
        storage.getCurrenciesByType('crypto'),
        storage.getCurrenciesByType('forex'),
        storage.getAllExchanges(),
      ]);

      const totalMarketCap = cryptocurrencies.reduce((sum, currency) => {
        return sum + parseFloat(currency.marketCap || '0');
      }, 0);

      const total24hVolume = cryptocurrencies.reduce((sum, currency) => {
        return sum + parseFloat(currency.volume24h || '0');
      }, 0);

      const stats = {
        marketCap: totalMarketCap,
        volume24h: total24hVolume,
        activeCurrencies: cryptocurrencies.length + forexCurrencies.length,
        activeExchanges: exchanges.length,
        cryptoCurrencies: cryptocurrencies.length,
        forexPairs: forexCurrencies.length,
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Error fetching market stats:", error);
      res.status(500).json({ success: false, error: "Failed to fetch market statistics" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "API is healthy", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
