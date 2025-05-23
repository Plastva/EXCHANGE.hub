import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = 'en' | 'ro' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Site Name
    "site.name": "EXCHANGE.hub",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.forex": "Fiat Markets",
    "nav.crypto": "Cryptocurrency",
    "nav.converter": "Currency Converter",
    "nav.exchanges": "Exchanges",
    "nav.currencies": "All Currencies",
    
    // Dashboard
    "dashboard.title": "Market Overview",
    "dashboard.subtitle": "Real-time financial data and insights",
    "dashboard.marketCap": "Market Cap",
    "dashboard.volume24h": "24h Volume",
    "dashboard.activeCurrencies": "Active Currencies",
    "dashboard.exchanges": "Exchanges",
    "dashboard.refreshData": "Refresh",
    "dashboard.exportData": "Export Data",
    
    // Currency Converter
    "converter.title": "Currency Converter",
    "converter.subtitle": "Convert between different currencies and cryptocurrencies",
    "converter.from": "From",
    "converter.to": "To",
    "converter.amount": "Amount",
    "converter.convert": "Convert Currency",
    "converter.converting": "Converting...",
    "converter.result": "Conversion Result",
    "converter.history": "Recent Conversions",
    "converter.enterAmount": "Enter amount",
    "converter.quickConvert": "Quick Convert",
    
    // Market Data
    "market.price": "Price",
    "market.change24h": "24h Change",
    "market.volume": "Volume",
    "market.marketCap": "Market Cap",
    "market.rank": "Rank",
    "market.lastUpdated": "Last Updated",
    "market.actions": "Actions",
    "market.view": "View",
    "market.trade": "Trade",
    "market.livePrices": "Live Market Prices",
    "market.topCryptos": "Top Cryptocurrencies",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error loading data",
    "common.noData": "No data available",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.refresh": "Refresh",
    "common.export": "Export",
    "common.download": "Download",
    "common.view": "View",
    "common.trade": "Trade",
    "common.rank": "Rank",
    "common.symbol": "Symbol",
    "common.name": "Name",
    "common.type": "Type",
    "common.fiat": "Fiat",
    "common.crypto": "Crypto",
    "common.back": "Back",
    
    // Languages
    "lang.english": "English",
    "lang.romanian": "Română",
    "lang.russian": "Русский",
  },
  ro: {
    // Site Name
    "site.name": "EXCHANGE.hub",
    
    // Navigation
    "nav.dashboard": "Tablou de Bord",
    "nav.forex": "Piețe Fiat",
    "nav.crypto": "Criptomonede",
    "nav.converter": "Convertor Valutar",
    "nav.exchanges": "Burse",
    "nav.currencies": "Toate Valutele",
    
    // Dashboard
    "dashboard.title": "Prezentare Generală a Pieței",
    "dashboard.subtitle": "Date financiare în timp real și perspective",
    "dashboard.marketCap": "Capitalizare de Piață",
    "dashboard.volume24h": "Volum 24h",
    "dashboard.activeCurrencies": "Valute Active",
    "dashboard.exchanges": "Burse",
    "dashboard.refreshData": "Actualizează",
    "dashboard.exportData": "Exportă Date",
    
    // Currency Converter
    "converter.title": "Convertor Valutar",
    "converter.subtitle": "Convertiți între diferite valute și criptomonede",
    "converter.from": "De la",
    "converter.to": "La",
    "converter.amount": "Sumă",
    "converter.convert": "Convertește Valuta",
    "converter.converting": "Se convertește...",
    "converter.result": "Rezultatul Conversiei",
    "converter.history": "Conversii Recente",
    "converter.enterAmount": "Introduceți suma",
    "converter.quickConvert": "Conversie Rapidă",
    
    // Market Data
    "market.price": "Preț",
    "market.change24h": "Schimbare 24h",
    "market.volume": "Volum",
    "market.marketCap": "Capitalizare",
    "market.rank": "Rang",
    "market.lastUpdated": "Ultima Actualizare",
    "market.actions": "Acțiuni",
    "market.view": "Vezi",
    "market.trade": "Tranzacționează",
    "market.livePrices": "Prețuri Live pe Piață",
    "market.topCryptos": "Top Criptomonede",
    
    // Common
    "common.loading": "Se încarcă...",
    "common.error": "Eroare la încărcarea datelor",
    "common.noData": "Nu sunt date disponibile",
    "common.search": "Căutare",
    "common.filter": "Filtru",
    "common.all": "Toate",
    "common.refresh": "Actualizează",
    "common.export": "Exportă",
    "common.download": "Descarcă",
    "common.view": "Vezi",
    "common.trade": "Tranzacționează",
    "common.rank": "Rang",
    "common.symbol": "Simbol",
    "common.name": "Nume",
    "common.type": "Tip",
    "common.fiat": "Fiat",
    "common.crypto": "Crypto",
    "common.back": "Înapoi",
    
    // Languages
    "lang.english": "English",
    "lang.romanian": "Română",
    "lang.russian": "Русский",
  },
  ru: {
    // Site Name
    "site.name": "EXCHANGE.hub",
    
    // Navigation
    "nav.dashboard": "Панель управления",
    "nav.forex": "Фиатные рынки",
    "nav.crypto": "Криптовалюты",
    "nav.converter": "Конвертер валют",
    "nav.exchanges": "Биржи",
    "nav.currencies": "Все валюты",
    
    // Dashboard
    "dashboard.title": "Обзор рынка",
    "dashboard.subtitle": "Финансовые данные в реальном времени и аналитика",
    "dashboard.marketCap": "Рыночная капитализация",
    "dashboard.volume24h": "Объем за 24ч",
    "dashboard.activeCurrencies": "Активные валюты",
    "dashboard.exchanges": "Биржи",
    "dashboard.refreshData": "Обновить",
    "dashboard.exportData": "Экспорт данных",
    
    // Currency Converter
    "converter.title": "Конвертер валют",
    "converter.subtitle": "Конвертируйте между различными валютами и криптовалютами",
    "converter.from": "Из",
    "converter.to": "В",
    "converter.amount": "Сумма",
    "converter.convert": "Конвертировать валюту",
    "converter.converting": "Конвертация...",
    "converter.result": "Результат конвертации",
    "converter.history": "Недавние конвертации",
    "converter.enterAmount": "Введите сумму",
    "converter.quickConvert": "Быстрая конвертация",
    
    // Market Data
    "market.price": "Цена",
    "market.change24h": "Изменение за 24ч",
    "market.volume": "Объем",
    "market.marketCap": "Рын. кап.",
    "market.rank": "Ранг",
    "market.lastUpdated": "Последнее обновление",
    "market.actions": "Действия",
    "market.view": "Просмотр",
    "market.trade": "Торговля",
    "market.livePrices": "Актуальные цены рынка",
    "market.topCryptos": "Топ криптовалюты",
    
    // Common
    "common.loading": "Загрузка...",
    "common.error": "Ошибка загрузки данных",
    "common.noData": "Данные недоступны",
    "common.search": "Поиск",
    "common.filter": "Фильтр",
    "common.all": "Все",
    "common.refresh": "Обновить",
    "common.export": "Экспорт",
    "common.download": "Скачать",
    "common.view": "Просмотр",
    "common.trade": "Торговля",
    "common.rank": "Ранг",
    "common.symbol": "Символ",
    "common.name": "Название",
    "common.type": "Тип",
    "common.fiat": "Фиат",
    "common.crypto": "Крипто",
    "common.back": "Назад",
    
    // Languages
    "lang.english": "English",
    "lang.romanian": "Română",
    "lang.russian": "Русский",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ro', 'ru'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}