import { db } from './db';
import { currencies } from '../shared/schema';

const fiatCurrencies = [
  // Major Fiat Currencies
  { symbol: "USD", name: "US Dollar", type: "forex" as const, currentPrice: "1.0000", isActive: true },
  { symbol: "EUR", name: "Euro", type: "forex" as const, currentPrice: "0.8500", isActive: true },
  { symbol: "GBP", name: "British Pound", type: "forex" as const, currentPrice: "0.7300", isActive: true },
  { symbol: "JPY", name: "Japanese Yen", type: "forex" as const, currentPrice: "110.0000", isActive: true },
  { symbol: "CHF", name: "Swiss Franc", type: "forex" as const, currentPrice: "0.9200", isActive: true },
  { symbol: "CAD", name: "Canadian Dollar", type: "forex" as const, currentPrice: "1.2500", isActive: true },
  { symbol: "AUD", name: "Australian Dollar", type: "forex" as const, currentPrice: "1.3500", isActive: true },
  { symbol: "NZD", name: "New Zealand Dollar", type: "forex" as const, currentPrice: "1.4500", isActive: true },
  
  // European Currencies
  { symbol: "RON", name: "Romanian Leu", type: "forex" as const, currentPrice: "4.1500", isActive: true },
  { symbol: "MDL", name: "Moldovan Leu", type: "forex" as const, currentPrice: "17.8000", isActive: true },
  { symbol: "PLN", name: "Polish Zloty", type: "forex" as const, currentPrice: "3.9500", isActive: true },
  { symbol: "CZK", name: "Czech Koruna", type: "forex" as const, currentPrice: "22.5000", isActive: true },
  { symbol: "HUF", name: "Hungarian Forint", type: "forex" as const, currentPrice: "295.0000", isActive: true },
  { symbol: "BGN", name: "Bulgarian Lev", type: "forex" as const, currentPrice: "1.6600", isActive: true },
  { symbol: "HRK", name: "Croatian Kuna", type: "forex" as const, currentPrice: "6.4000", isActive: true },
  { symbol: "SEK", name: "Swedish Krona", type: "forex" as const, currentPrice: "8.8500", isActive: true },
  { symbol: "NOK", name: "Norwegian Krone", type: "forex" as const, currentPrice: "8.6500", isActive: true },
  { symbol: "DKK", name: "Danish Krone", type: "forex" as const, currentPrice: "6.3500", isActive: true },
  { symbol: "ISK", name: "Icelandic Krona", type: "forex" as const, currentPrice: "125.0000", isActive: true },
  { symbol: "ALL", name: "Albanian Lek", type: "forex" as const, currentPrice: "98.5000", isActive: true },
  { symbol: "BAM", name: "Bosnia Convertible Mark", type: "forex" as const, currentPrice: "1.6600", isActive: true },
  { symbol: "MKD", name: "Macedonian Denar", type: "forex" as const, currentPrice: "52.3000", isActive: true },
  { symbol: "RSD", name: "Serbian Dinar", type: "forex" as const, currentPrice: "99.8000", isActive: true },
  { symbol: "UAH", name: "Ukrainian Hryvnia", type: "forex" as const, currentPrice: "27.5000", isActive: true },
  { symbol: "BYN", name: "Belarusian Ruble", type: "forex" as const, currentPrice: "2.4500", isActive: true },
  
  // Asian Currencies
  { symbol: "CNY", name: "Chinese Yuan", type: "forex" as const, currentPrice: "6.4500", isActive: true },
  { symbol: "RUB", name: "Russian Ruble", type: "forex" as const, currentPrice: "74.5000", isActive: true },
  { symbol: "INR", name: "Indian Rupee", type: "forex" as const, currentPrice: "74.2000", isActive: true },
  { symbol: "KRW", name: "South Korean Won", type: "forex" as const, currentPrice: "1180.0000", isActive: true },
  { symbol: "SGD", name: "Singapore Dollar", type: "forex" as const, currentPrice: "1.3500", isActive: true },
  { symbol: "HKD", name: "Hong Kong Dollar", type: "forex" as const, currentPrice: "7.8000", isActive: true },
  { symbol: "TWD", name: "Taiwan Dollar", type: "forex" as const, currentPrice: "28.2000", isActive: true },
  { symbol: "MYR", name: "Malaysian Ringgit", type: "forex" as const, currentPrice: "4.1500", isActive: true },
  { symbol: "IDR", name: "Indonesian Rupiah", type: "forex" as const, currentPrice: "14250.0000", isActive: true },
  { symbol: "PHP", name: "Philippine Peso", type: "forex" as const, currentPrice: "49.8000", isActive: true },
  { symbol: "VND", name: "Vietnamese Dong", type: "forex" as const, currentPrice: "23100.0000", isActive: true },
  { symbol: "THB", name: "Thai Baht", type: "forex" as const, currentPrice: "31.5000", isActive: true },
  { symbol: "LAK", name: "Lao Kip", type: "forex" as const, currentPrice: "11500.0000", isActive: true },
  { symbol: "KHR", name: "Cambodian Riel", type: "forex" as const, currentPrice: "4050.0000", isActive: true },
  { symbol: "MMK", name: "Myanmar Kyat", type: "forex" as const, currentPrice: "1680.0000", isActive: true },
  { symbol: "NPR", name: "Nepalese Rupee", type: "forex" as const, currentPrice: "118.5000", isActive: true },
  { symbol: "LKR", name: "Sri Lankan Rupee", type: "forex" as const, currentPrice: "200.0000", isActive: true },
  { symbol: "BDT", name: "Bangladeshi Taka", type: "forex" as const, currentPrice: "84.8000", isActive: true },
  { symbol: "PKR", name: "Pakistani Rupee", type: "forex" as const, currentPrice: "155.0000", isActive: true },
  { symbol: "AFN", name: "Afghan Afghani", type: "forex" as const, currentPrice: "78.2000", isActive: true },
  { symbol: "UZS", name: "Uzbek Som", type: "forex" as const, currentPrice: "10650.0000", isActive: true },
  { symbol: "KZT", name: "Kazakh Tenge", type: "forex" as const, currentPrice: "425.0000", isActive: true },
  { symbol: "KGS", name: "Kyrgyz Som", type: "forex" as const, currentPrice: "84.7000", isActive: true },
  { symbol: "TJS", name: "Tajik Somoni", type: "forex" as const, currentPrice: "11.3000", isActive: true },
  { symbol: "TMT", name: "Turkmen Manat", type: "forex" as const, currentPrice: "3.5000", isActive: true },
  { symbol: "AZN", name: "Azerbaijani Manat", type: "forex" as const, currentPrice: "1.7000", isActive: true },
  { symbol: "GEL", name: "Georgian Lari", type: "forex" as const, currentPrice: "2.6500", isActive: true },
  { symbol: "AMD", name: "Armenian Dram", type: "forex" as const, currentPrice: "485.0000", isActive: true },
  
  // Middle East & Africa
  { symbol: "AED", name: "UAE Dirham", type: "forex" as const, currentPrice: "3.6700", isActive: true },
  { symbol: "SAR", name: "Saudi Riyal", type: "forex" as const, currentPrice: "3.7500", isActive: true },
  { symbol: "QAR", name: "Qatari Riyal", type: "forex" as const, currentPrice: "3.6400", isActive: true },
  { symbol: "KWD", name: "Kuwaiti Dinar", type: "forex" as const, currentPrice: "0.3000", isActive: true },
  { symbol: "BHD", name: "Bahraini Dinar", type: "forex" as const, currentPrice: "0.3770", isActive: true },
  { symbol: "OMR", name: "Omani Rial", type: "forex" as const, currentPrice: "0.3850", isActive: true },
  { symbol: "JOD", name: "Jordanian Dinar", type: "forex" as const, currentPrice: "0.7100", isActive: true },
  { symbol: "ILS", name: "Israeli Shekel", type: "forex" as const, currentPrice: "3.2500", isActive: true },
  { symbol: "TRY", name: "Turkish Lira", type: "forex" as const, currentPrice: "8.4000", isActive: true },
  { symbol: "EGP", name: "Egyptian Pound", type: "forex" as const, currentPrice: "15.7000", isActive: true },
  { symbol: "ZAR", name: "South African Rand", type: "forex" as const, currentPrice: "14.8000", isActive: true },
  { symbol: "NGN", name: "Nigerian Naira", type: "forex" as const, currentPrice: "411.0000", isActive: true },
  { symbol: "GHS", name: "Ghanaian Cedi", type: "forex" as const, currentPrice: "5.8000", isActive: true },
  { symbol: "KES", name: "Kenyan Shilling", type: "forex" as const, currentPrice: "108.0000", isActive: true },
  { symbol: "UGX", name: "Ugandan Shilling", type: "forex" as const, currentPrice: "3550.0000", isActive: true },
  { symbol: "TZS", name: "Tanzanian Shilling", type: "forex" as const, currentPrice: "2318.0000", isActive: true },
  { symbol: "RWF", name: "Rwandan Franc", type: "forex" as const, currentPrice: "1025.0000", isActive: true },
  { symbol: "ETB", name: "Ethiopian Birr", type: "forex" as const, currentPrice: "43.8000", isActive: true },
  { symbol: "MAD", name: "Moroccan Dirham", type: "forex" as const, currentPrice: "8.8500", isActive: true },
  { symbol: "TND", name: "Tunisian Dinar", type: "forex" as const, currentPrice: "2.7800", isActive: true },
  { symbol: "DZD", name: "Algerian Dinar", type: "forex" as const, currentPrice: "133.5000", isActive: true },
  
  // Americas
  { symbol: "MXN", name: "Mexican Peso", type: "forex" as const, currentPrice: "20.1000", isActive: true },
  { symbol: "BRL", name: "Brazilian Real", type: "forex" as const, currentPrice: "5.2000", isActive: true },
  { symbol: "ARS", name: "Argentine Peso", type: "forex" as const, currentPrice: "98.5000", isActive: true },
  { symbol: "CLP", name: "Chilean Peso", type: "forex" as const, currentPrice: "715.0000", isActive: true },
  { symbol: "COP", name: "Colombian Peso", type: "forex" as const, currentPrice: "3875.0000", isActive: true },
  { symbol: "PEN", name: "Peruvian Sol", type: "forex" as const, currentPrice: "3.6500", isActive: true },
  { symbol: "UYU", name: "Uruguayan Peso", type: "forex" as const, currentPrice: "44.2000", isActive: true },
  { symbol: "BOB", name: "Bolivian Boliviano", type: "forex" as const, currentPrice: "6.9100", isActive: true },
  { symbol: "PYG", name: "Paraguayan Guarani", type: "forex" as const, currentPrice: "7025.0000", isActive: true },
  { symbol: "GTQ", name: "Guatemalan Quetzal", type: "forex" as const, currentPrice: "7.7200", isActive: true },
  { symbol: "CRC", name: "Costa Rican Colon", type: "forex" as const, currentPrice: "615.0000", isActive: true },
  { symbol: "DOP", name: "Dominican Peso", type: "forex" as const, currentPrice: "56.8000", isActive: true },
  { symbol: "JMD", name: "Jamaican Dollar", type: "forex" as const, currentPrice: "152.0000", isActive: true },
];

export async function seedFiatCurrencies() {
  console.log('Seeding fiat currencies...');
  
  for (const currency of fiatCurrencies) {
    try {
      await db.insert(currencies)
        .values(currency)
        .onConflictDoUpdate({
          target: currencies.symbol,
          set: {
            currentPrice: currency.currentPrice,
            lastUpdated: new Date(),
          }
        });
      console.log(`✓ Added/Updated ${currency.symbol} - ${currency.name}`);
    } catch (error) {
      console.log(`• Skipped ${currency.symbol} (already exists)`);
    }
  }
  
  console.log('✅ Fiat currencies seeded successfully!');
}

// Run the seeding function
seedFiatCurrencies()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding currencies:', error);
    process.exit(1);
  });