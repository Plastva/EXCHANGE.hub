import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSkeleton } from "@/components/ui/loading-spinner";
import { useAllCurrencies, useRefreshMarketData } from "@/hooks/use-market-data";
import { formatCurrency, formatLargeNumber, formatPercentage, getChangeColor, getChangeIcon } from "@/lib/utils";
import { 
  RefreshCw, 
  SquareChevronDown, 
  Star,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import type { Currency } from "@/types";

const iconMap = {
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "activity": Activity,
};

function CurrencyRow({ currency }: { currency: Currency }) {
  const price = currency.currentPrice ? parseFloat(currency.currentPrice) : currency.price || 0;
  const change = currency.change24h ? parseFloat(currency.change24h) : 0;
  const volume = currency.volume24h ? parseFloat(currency.volume24h) : 0;
  const marketCap = currency.marketCap ? parseFloat(currency.marketCap) : 0;

  const ChangeIcon = iconMap[getChangeIcon(change) as keyof typeof iconMap] || Activity;

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
      <TableCell>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-500/10 rounded-full flex items-center justify-center mr-3">
            {currency.iconUrl ? (
              <img 
                src={currency.iconUrl} 
                alt={currency.symbol} 
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
            ) : null}
            <span 
              className="text-xs font-bold text-gray-600 dark:text-gray-400"
              style={{ display: currency.iconUrl ? 'none' : 'block' }}
            >
              {currency.symbol.slice(0, 3)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {currency.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currency.symbol}
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
          {price > 0 ? formatCurrency(price) : 'N/A'}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center">
          <ChangeIcon className={`w-4 h-4 mr-1 ${getChangeColor(change)}`} />
          <span className={`text-sm font-medium ${getChangeColor(change)}`}>
            {formatPercentage(change)}
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-sm font-mono text-gray-900 dark:text-white">
          {volume > 0 ? formatLargeNumber(volume) : '-'}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-sm font-mono text-gray-900 dark:text-white">
          {marketCap > 0 ? formatLargeNumber(marketCap) : '-'}
        </div>
      </TableCell>
      
      <TableCell className="text-right">
        <div className="flex items-center justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            View
          </Button>
          <Button variant="ghost" size="sm">
            <Star className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function MarketTable() {
  const [filter, setFilter] = useState("all");
  const { data: currencies, isLoading, error } = useAllCurrencies();
  const refreshData = useRefreshMarketData();

  const filteredCurrencies = currencies?.filter(currency => {
    if (filter === "all") return true;
    if (filter === "forex") return currency.type === 'forex';
    if (filter === "crypto") return currency.type === 'crypto';
    return true;
  }) || [];

  const handleRefresh = () => {
    refreshData.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Live Market Data
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time currency and crypto prices
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="forex">Forex Only</SelectItem>
                <SelectItem value="crypto">Crypto Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshData.isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshData.isPending ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600">
                  <div className="flex items-center space-x-1">
                    <span>Currency</span>
                    <SquareChevronDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600">
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    <SquareChevronDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600">
                  <div className="flex items-center space-x-1">
                    <span>24h Change</span>
                    <SquareChevronDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600">
                  <div className="flex items-center space-x-1">
                    <span>Volume</span>
                    <SquareChevronDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><LoadingSkeleton /></TableCell>
                    <TableCell><LoadingSkeleton /></TableCell>
                    <TableCell><LoadingSkeleton /></TableCell>
                    <TableCell><LoadingSkeleton /></TableCell>
                    <TableCell><LoadingSkeleton /></TableCell>
                    <TableCell><LoadingSkeleton /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">
                      Failed to load market data
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCurrencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">
                      No currencies found
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCurrencies.slice(0, 10).map((currency) => (
                  <CurrencyRow key={currency.symbol} currency={currency} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredCurrencies.length > 10 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to{" "}
              <span className="font-medium text-gray-900 dark:text-white">10</span> of{" "}
              <span className="font-medium text-gray-900 dark:text-white">{filteredCurrencies.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
