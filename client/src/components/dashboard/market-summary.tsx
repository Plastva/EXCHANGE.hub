import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/ui/loading-spinner";
import { useCryptoData } from "@/hooks/use-market-data";
import { formatCurrency, formatPercentage, getChangeColor } from "@/lib/utils";
import type { Currency } from "@/types";

function CurrencyItem({ currency }: { currency: Currency }) {
  const price = currency.currentPrice ? parseFloat(currency.currentPrice) : currency.price || 0;
  const change = currency.change24h ? parseFloat(currency.change24h) : 0;

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-500/10 rounded-full flex items-center justify-center mr-3">
          {currency.iconUrl ? (
            <img 
              src={currency.iconUrl} 
              alt={currency.symbol} 
              className="w-5 h-5 rounded-full"
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
          <p className="font-medium text-gray-900 dark:text-white">
            {currency.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currency.symbol}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono font-medium text-gray-900 dark:text-white">
          {formatCurrency(price)}
        </p>
        <p className={`text-xs ${getChangeColor(change)}`}>
          {formatPercentage(change)}
        </p>
      </div>
    </div>
  );
}

export function MarketSummary() {
  const { data: cryptoData, isLoading, error } = useCryptoData();

  const topCryptos = cryptoData?.slice(0, 3) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Market Summary</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <LoadingSkeleton rows={3} />
          ) : error ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              Failed to load market data
            </div>
          ) : topCryptos.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No market data available
            </div>
          ) : (
            topCryptos.map((currency) => (
              <CurrencyItem key={currency.symbol} currency={currency} />
            ))
          )}
        </div>
        
        <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/10">
          View All Markets
        </Button>
      </CardContent>
    </Card>
  );
}
