import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrencyConversion } from "@/hooks/use-market-data";
import { useLanguage } from "@/contexts/language-context";
import { validateAmount } from "@/lib/utils";
import { ArrowUpDown, Calculator, TrendingUp, Loader2 } from "lucide-react";

// Comprehensive list of 80+ currencies - fiat and crypto
const allCurrencies = [
  // Major Fiat Currencies
  { value: "USD", label: "USD - US Dollar", type: "fiat", flag: "🇺🇸" },
  { value: "EUR", label: "EUR - Euro", type: "fiat", flag: "🇪🇺" },
  { value: "GBP", label: "GBP - British Pound", type: "fiat", flag: "🇬🇧" },
  { value: "JPY", label: "JPY - Japanese Yen", type: "fiat", flag: "🇯🇵" },
  { value: "CHF", label: "CHF - Swiss Franc", type: "fiat", flag: "🇨🇭" },
  { value: "CAD", label: "CAD - Canadian Dollar", type: "fiat", flag: "🇨🇦" },
  { value: "AUD", label: "AUD - Australian Dollar", type: "fiat", flag: "🇦🇺" },
  { value: "NZD", label: "NZD - New Zealand Dollar", type: "fiat", flag: "🇳🇿" },
  
  // European Currencies
  { value: "RON", label: "RON - Romanian Leu", type: "fiat", flag: "🇷🇴" },
  { value: "MDL", label: "MDL - Moldovan Leu", type: "fiat", flag: "🇲🇩" },
  { value: "PLN", label: "PLN - Polish Zloty", type: "fiat", flag: "🇵🇱" },
  { value: "CZK", label: "CZK - Czech Koruna", type: "fiat", flag: "🇨🇿" },
  { value: "HUF", label: "HUF - Hungarian Forint", type: "fiat", flag: "🇭🇺" },
  { value: "BGN", label: "BGN - Bulgarian Lev", type: "fiat", flag: "🇧🇬" },
  { value: "HRK", label: "HRK - Croatian Kuna", type: "fiat", flag: "🇭🇷" },
  { value: "SEK", label: "SEK - Swedish Krona", type: "fiat", flag: "🇸🇪" },
  { value: "NOK", label: "NOK - Norwegian Krone", type: "fiat", flag: "🇳🇴" },
  { value: "DKK", label: "DKK - Danish Krone", type: "fiat", flag: "🇩🇰" },
  { value: "ISK", label: "ISK - Icelandic Krona", type: "fiat", flag: "🇮🇸" },
  { value: "ALL", label: "ALL - Albanian Lek", type: "fiat", flag: "🇦🇱" },
  { value: "BAM", label: "BAM - Bosnia Convertible Mark", type: "fiat", flag: "🇧🇦" },
  { value: "MKD", label: "MKD - Macedonian Denar", type: "fiat", flag: "🇲🇰" },
  { value: "RSD", label: "RSD - Serbian Dinar", type: "fiat", flag: "🇷🇸" },
  { value: "UAH", label: "UAH - Ukrainian Hryvnia", type: "fiat", flag: "🇺🇦" },
  { value: "BYN", label: "BYN - Belarusian Ruble", type: "fiat", flag: "🇧🇾" },
  
  // Asian Currencies
  { value: "CNY", label: "CNY - Chinese Yuan", type: "fiat", flag: "🇨🇳" },
  { value: "RUB", label: "RUB - Russian Ruble", type: "fiat", flag: "🇷🇺" },
  { value: "INR", label: "INR - Indian Rupee", type: "fiat", flag: "🇮🇳" },
  { value: "KRW", label: "KRW - South Korean Won", type: "fiat", flag: "🇰🇷" },
  { value: "SGD", label: "SGD - Singapore Dollar", type: "fiat", flag: "🇸🇬" },
  { value: "HKD", label: "HKD - Hong Kong Dollar", type: "fiat", flag: "🇭🇰" },
  { value: "TWD", label: "TWD - Taiwan Dollar", type: "fiat", flag: "🇹🇼" },
  { value: "MYR", label: "MYR - Malaysian Ringgit", type: "fiat", flag: "🇲🇾" },
  { value: "IDR", label: "IDR - Indonesian Rupiah", type: "fiat", flag: "🇮🇩" },
  { value: "PHP", label: "PHP - Philippine Peso", type: "fiat", flag: "🇵🇭" },
  { value: "VND", label: "VND - Vietnamese Dong", type: "fiat", flag: "🇻🇳" },
  { value: "THB", label: "THB - Thai Baht", type: "fiat", flag: "🇹🇭" },
  { value: "LAK", label: "LAK - Lao Kip", type: "fiat", flag: "🇱🇦" },
  { value: "KHR", label: "KHR - Cambodian Riel", type: "fiat", flag: "🇰🇭" },
  { value: "MMK", label: "MMK - Myanmar Kyat", type: "fiat", flag: "🇲🇲" },
  { value: "NPR", label: "NPR - Nepalese Rupee", type: "fiat", flag: "🇳🇵" },
  { value: "LKR", label: "LKR - Sri Lankan Rupee", type: "fiat", flag: "🇱🇰" },
  { value: "BDT", label: "BDT - Bangladeshi Taka", type: "fiat", flag: "🇧🇩" },
  { value: "PKR", label: "PKR - Pakistani Rupee", type: "fiat", flag: "🇵🇰" },
  { value: "AFN", label: "AFN - Afghan Afghani", type: "fiat", flag: "🇦🇫" },
  { value: "UZS", label: "UZS - Uzbek Som", type: "fiat", flag: "🇺🇿" },
  { value: "KZT", label: "KZT - Kazakh Tenge", type: "fiat", flag: "🇰🇿" },
  { value: "KGS", label: "KGS - Kyrgyz Som", type: "fiat", flag: "🇰🇬" },
  { value: "TJS", label: "TJS - Tajik Somoni", type: "fiat", flag: "🇹🇯" },
  { value: "TMT", label: "TMT - Turkmen Manat", type: "fiat", flag: "🇹🇲" },
  { value: "AZN", label: "AZN - Azerbaijani Manat", type: "fiat", flag: "🇦🇿" },
  { value: "GEL", label: "GEL - Georgian Lari", type: "fiat", flag: "🇬🇪" },
  { value: "AMD", label: "AMD - Armenian Dram", type: "fiat", flag: "🇦🇲" },
  
  // Middle East & Africa
  { value: "AED", label: "AED - UAE Dirham", type: "fiat", flag: "🇦🇪" },
  { value: "SAR", label: "SAR - Saudi Riyal", type: "fiat", flag: "🇸🇦" },
  { value: "QAR", label: "QAR - Qatari Riyal", type: "fiat", flag: "🇶🇦" },
  { value: "KWD", label: "KWD - Kuwaiti Dinar", type: "fiat", flag: "🇰🇼" },
  { value: "BHD", label: "BHD - Bahraini Dinar", type: "fiat", flag: "🇧🇭" },
  { value: "OMR", label: "OMR - Omani Rial", type: "fiat", flag: "🇴🇲" },
  { value: "JOD", label: "JOD - Jordanian Dinar", type: "fiat", flag: "🇯🇴" },
  { value: "ILS", label: "ILS - Israeli Shekel", type: "fiat", flag: "🇮🇱" },
  { value: "TRY", label: "TRY - Turkish Lira", type: "fiat", flag: "🇹🇷" },
  { value: "EGP", label: "EGP - Egyptian Pound", type: "fiat", flag: "🇪🇬" },
  { value: "ZAR", label: "ZAR - South African Rand", type: "fiat", flag: "🇿🇦" },
  { value: "NGN", label: "NGN - Nigerian Naira", type: "fiat", flag: "🇳🇬" },
  { value: "GHS", label: "GHS - Ghanaian Cedi", type: "fiat", flag: "🇬🇭" },
  { value: "KES", label: "KES - Kenyan Shilling", type: "fiat", flag: "🇰🇪" },
  { value: "UGX", label: "UGX - Ugandan Shilling", type: "fiat", flag: "🇺🇬" },
  { value: "TZS", label: "TZS - Tanzanian Shilling", type: "fiat", flag: "🇹🇿" },
  { value: "RWF", label: "RWF - Rwandan Franc", type: "fiat", flag: "🇷🇼" },
  { value: "ETB", label: "ETB - Ethiopian Birr", type: "fiat", flag: "🇪🇹" },
  { value: "MAD", label: "MAD - Moroccan Dirham", type: "fiat", flag: "🇲🇦" },
  { value: "TND", label: "TND - Tunisian Dinar", type: "fiat", flag: "🇹🇳" },
  { value: "DZD", label: "DZD - Algerian Dinar", type: "fiat", flag: "🇩🇿" },
  
  // Americas
  { value: "MXN", label: "MXN - Mexican Peso", type: "fiat", flag: "🇲🇽" },
  { value: "BRL", label: "BRL - Brazilian Real", type: "fiat", flag: "🇧🇷" },
  { value: "ARS", label: "ARS - Argentine Peso", type: "fiat", flag: "🇦🇷" },
  { value: "CLP", label: "CLP - Chilean Peso", type: "fiat", flag: "🇨🇱" },
  { value: "COP", label: "COP - Colombian Peso", type: "fiat", flag: "🇨🇴" },
  { value: "PEN", label: "PEN - Peruvian Sol", type: "fiat", flag: "🇵🇪" },
  { value: "UYU", label: "UYU - Uruguayan Peso", type: "fiat", flag: "🇺🇾" },
  { value: "BOB", label: "BOB - Bolivian Boliviano", type: "fiat", flag: "🇧🇴" },
  { value: "PYG", label: "PYG - Paraguayan Guarani", type: "fiat", flag: "🇵🇾" },
  { value: "GTQ", label: "GTQ - Guatemalan Quetzal", type: "fiat", flag: "🇬🇹" },
  { value: "CRC", label: "CRC - Costa Rican Colon", type: "fiat", flag: "🇨🇷" },
  { value: "DOP", label: "DOP - Dominican Peso", type: "fiat", flag: "🇩🇴" },
  { value: "JMD", label: "JMD - Jamaican Dollar", type: "fiat", flag: "🇯🇲" },
  
  // Major Cryptocurrencies
  { value: "BTC", label: "BTC - Bitcoin", type: "crypto", flag: "₿" },
  { value: "ETH", label: "ETH - Ethereum", type: "crypto", flag: "Ξ" },
  { value: "BNB", label: "BNB - Binance Coin", type: "crypto", flag: "🔶" },
  { value: "ADA", label: "ADA - Cardano", type: "crypto", flag: "🔵" },
  { value: "SOL", label: "SOL - Solana", type: "crypto", flag: "🟣" },
  { value: "XRP", label: "XRP - Ripple", type: "crypto", flag: "🔷" },
  { value: "DOT", label: "DOT - Polkadot", type: "crypto", flag: "🔴" },
  { value: "DOGE", label: "DOGE - Dogecoin", type: "crypto", flag: "🐕" },
  { value: "AVAX", label: "AVAX - Avalanche", type: "crypto", flag: "🔺" },
  { value: "SHIB", label: "SHIB - Shiba Inu", type: "crypto", flag: "🔥" },
  { value: "MATIC", label: "MATIC - Polygon", type: "crypto", flag: "🟪" },
  { value: "LTC", label: "LTC - Litecoin", type: "crypto", flag: "Ł" },
  { value: "UNI", label: "UNI - Uniswap", type: "crypto", flag: "🦄" },
  { value: "LINK", label: "LINK - Chainlink", type: "crypto", flag: "🔗" },
  { value: "ATOM", label: "ATOM - Cosmos", type: "crypto", flag: "⚛️" },
  { value: "BCH", label: "BCH - Bitcoin Cash", type: "crypto", flag: "💚" },
  { value: "XLM", label: "XLM - Stellar", type: "crypto", flag: "⭐" },
  { value: "VET", label: "VET - VeChain", type: "crypto", flag: "✅" },
  { value: "FIL", label: "FIL - Filecoin", type: "crypto", flag: "📁" },
  { value: "MANA", label: "MANA - Decentraland", type: "crypto", flag: "🌍" },
];

export function EnhancedCurrencyConverter() {
  const { t } = useLanguage();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number>(0);

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
          setConvertedAmount(data.toAmount.toFixed(6));
          setExchangeRate(data.rate);
        },
      }
    );
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setConvertedAmount("");
    setExchangeRate(0);
  };

  const fromCurrencyData = allCurrencies.find(c => c.value === fromCurrency);
  const toCurrencyData = allCurrencies.find(c => c.value === toCurrency);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{t('converter.title')}</CardTitle>
        <p className="text-muted-foreground">{t('converter.subtitle')}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* From Currency */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">{t('converter.from')}</Label>
          <div className="flex space-x-3">
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground sticky top-0 bg-background">
                  FIAT CURRENCIES
                </div>
                {allCurrencies.filter(c => c.type === 'fiat').map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <div className="flex items-center">
                      <span className="mr-2">{currency.flag}</span>
                      {currency.label}
                    </div>
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground sticky top-0 bg-background">
                  CRYPTOCURRENCIES
                </div>
                {allCurrencies.filter(c => c.type === 'crypto').map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <div className="flex items-center">
                      <span className="mr-2">{currency.flag}</span>
                      {currency.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder={t('converter.enterAmount')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-lg font-mono"
              min="0"
              step="any"
            />
          </div>
          {fromCurrencyData && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="mr-2">{fromCurrencyData.flag}</span>
              <span>{fromCurrencyData.label}</span>
            </div>
          )}
        </div>
        
        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwap}
            className="p-3 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            <ArrowUpDown className="w-5 h-5" />
          </Button>
        </div>
        
        {/* To Currency */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">{t('converter.to')}</Label>
          <div className="flex space-x-3">
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground sticky top-0 bg-background">
                  FIAT CURRENCIES
                </div>
                {allCurrencies.filter(c => c.type === 'fiat').map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <div className="flex items-center">
                      <span className="mr-2">{currency.flag}</span>
                      {currency.label}
                    </div>
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground sticky top-0 bg-background">
                  CRYPTOCURRENCIES
                </div>
                {allCurrencies.filter(c => c.type === 'crypto').map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <div className="flex items-center">
                      <span className="mr-2">{currency.flag}</span>
                      {currency.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 border border-input rounded-md px-4 py-3 bg-muted text-lg font-mono flex items-center">
              {convertedAmount || "0.000000"}
            </div>
          </div>
          {toCurrencyData && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="mr-2">{toCurrencyData.flag}</span>
              <span>{toCurrencyData.label}</span>
            </div>
          )}
        </div>
        
        {/* Convert Button */}
        <Button 
          onClick={handleConvert} 
          className="w-full py-6 text-lg font-semibold" 
          disabled={conversion.isPending || !validateAmount(amount)}
          size="lg"
        >
          {conversion.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              {t('converter.converting')}
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5 mr-3" />
              {t('converter.convert')}
            </>
          )}
        </Button>

        {/* Conversion Result */}
        {convertedAmount && exchangeRate && (
          <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                {t('converter.result')}
              </p>
              <div className="text-2xl font-bold text-primary">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </div>
              <div className="text-sm text-muted-foreground">
                1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}