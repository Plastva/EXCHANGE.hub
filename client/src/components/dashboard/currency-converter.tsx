import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCurrencyConversion } from "@/hooks/use-market-data";
import { validateAmount } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

const popularCurrencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "BTC", label: "BTC - Bitcoin" },
  { value: "ETH", label: "ETH - Ethereum" },
];

export function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("100");
  const [convertedAmount, setConvertedAmount] = useState<string>("");

  const conversion = useCurrencyConversion();

  const handleConvert = () => {
    if (!validateAmount(amount)) {
      return;
    }

    const numAmount = parseFloat(amount);
    conversion.mutate(
      { from: fromCurrency, to: toCurrency, amount: numAmount },
      {
        onSuccess: (data) => {
          setConvertedAmount(data.toAmount.toFixed(4));
        },
      }
    );
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setConvertedAmount("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Convert</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2">From</Label>
          <div className="flex space-x-2">
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {popularCurrencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-24 font-mono"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwap}
            className="p-2"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2">To</Label>
          <div className="flex space-x-2">
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {popularCurrencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-24 border border-input rounded-md px-3 py-2 bg-muted text-right font-mono text-sm">
              {convertedAmount || "0.00"}
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleConvert} 
          className="w-full" 
          disabled={conversion.isPending || !validateAmount(amount)}
        >
          {conversion.isPending ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Converting...
            </>
          ) : (
            "Convert Currency"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
