import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Currency, Exchange, ConversionResult, MarketStats } from "@/types";

export function useMarketStats() {
  return useQuery({
    queryKey: ['/api/market-stats'],
    queryFn: () => api.market.getStats(),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

export function useAllCurrencies() {
  return useQuery({
    queryKey: ['/api/currencies'],
    queryFn: () => api.currencies.getAll(),
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useForexData() {
  return useQuery({
    queryKey: ['/api/forex'],
    queryFn: () => api.currencies.getForex(),
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useCryptoData() {
  return useQuery({
    queryKey: ['/api/crypto'],
    queryFn: () => api.currencies.getCrypto(),
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useExchanges() {
  return useQuery({
    queryKey: ['/api/exchanges'],
    queryFn: () => api.exchanges.getAll(),
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 60000,
  });
}

export function useConversionHistory(userId?: number, limit?: number) {
  return useQuery({
    queryKey: ['/api/conversions', { userId, limit }],
    queryFn: () => api.conversion.getHistory(userId, limit),
    enabled: !!userId || limit !== undefined,
  });
}

export function useCurrencyConversion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ from, to, amount, userId }: { from: string; to: string; amount: number; userId?: number }) =>
      api.conversion.convert(from, to, amount, userId),
    onSuccess: (data: ConversionResult) => {
      toast({
        title: "Conversion Successful",
        description: `${data.fromAmount} ${data.from} = ${data.toAmount.toFixed(4)} ${data.to}`,
      });
      
      // Invalidate conversion history to show the new conversion
      queryClient.invalidateQueries({ queryKey: ['/api/conversions'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Conversion Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRefreshMarketData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const refreshAll = useMutation({
    mutationFn: async () => {
      // Trigger fresh fetches for all market data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['/api/market-stats'] }),
        queryClient.refetchQueries({ queryKey: ['/api/currencies'] }),
        queryClient.refetchQueries({ queryKey: ['/api/forex'] }),
        queryClient.refetchQueries({ queryKey: ['/api/crypto'] }),
        queryClient.refetchQueries({ queryKey: ['/api/exchanges'] }),
      ]);
    },
    onSuccess: () => {
      toast({
        title: "Data Refreshed",
        description: "Market data has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Refresh Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return refreshAll;
}
