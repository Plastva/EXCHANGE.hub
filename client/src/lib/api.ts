import { apiRequest } from "./queryClient";
import type { Currency, Exchange, ConversionResult, ConversionHistory, MarketStats, ApiResponse } from "@/types";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  // Currency endpoints
  currencies: {
    getAll: async (): Promise<Currency[]> => {
      const response = await apiRequest('GET', '/api/currencies');
      const data: ApiResponse<Currency[]> = await response.json();
      if (!data.success) throw new ApiError(data.error || 'Failed to fetch currencies');
      return data.data || [];
    },
    
    getByType: async (type: 'forex' | 'crypto'): Promise<Currency[]> => {
      const response = await apiRequest('GET', `/api/currencies?type=${type}`);
      const data: ApiResponse<Currency[]> = await response.json();
      if (!data.success) throw new ApiError(data.error || `Failed to fetch ${type} currencies`);
      return data.data || [];
    },

    getForex: async (): Promise<Currency[]> => {
      const response = await apiRequest('GET', '/api/forex');
      const data: ApiResponse<Currency[]> = await response.json();
      if (!data.success) throw new ApiError(data.error || 'Failed to fetch forex data');
      return data.data || [];
    },

    getCrypto: async (): Promise<Currency[]> => {
      const response = await apiRequest('GET', '/api/crypto');
      const data: ApiResponse<Currency[]> = await response.json();
      if (!data.success) throw new ApiError(data.error || 'Failed to fetch crypto data');
      return data.data || [];
    },
  },

  // Exchange endpoints
  exchanges: {
    getAll: async (): Promise<Exchange[]> => {
      const response = await apiRequest('GET', '/api/exchanges');
      const data: ApiResponse<Exchange[]> = await response.json();
      if (!data.success) throw new ApiError(data.error || 'Failed to fetch exchanges');
      return data.data || [];
    },
  },

  // Conversion endpoints
  conversion: {
    convert: async (from: string, to: string, amount: number, userId?: number): Promise<ConversionResult> => {
      const response = await apiRequest('POST', '/api/convert', { from, to, amount, userId });
      const data: ApiResponse<ConversionResult> = await response.json();
      if (!data.success) throw new ApiError(data.error || 'Failed to convert currency');
      return data.data!;
    },

    getHistory: async (userId?: number, limit?: number): Promise<ConversionHistory[]> => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());
      if (limit) params.append('limit', limit.toString());
      
      const response = await apiRequest('GET', `/api/conversions?${params}`);
      const data: ApiResponse<ConversionHistory[]> = await response.json();
      if (!data.success) throw new ApiError(data.error || 'Failed to fetch conversion history');
      return data.data || [];
    },
  },

  // Market stats
  market: {
    getStats: async (): Promise<MarketStats> => {
      const response = await apiRequest('GET', '/api/market-stats');
      const data: ApiResponse<MarketStats> = await response.json();
      if (!data.success) throw new ApiError(data.error || 'Failed to fetch market stats');
      return data.data!;
    },
  },

  // Health check
  health: async (): Promise<{ success: boolean; message: string; timestamp: string }> => {
    const response = await apiRequest('GET', '/api/health');
    return await response.json();
  },
};
