import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/contexts/language-context";
import { Layout } from "@/components/layout/layout";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Page imports
import Dashboard from "@/pages/dashboard";
import Forex from "@/pages/forex";
import Crypto from "@/pages/crypto";
import Converter from "@/pages/converter";
import Exchanges from "@/pages/exchanges";
import AllCurrencies from "@/pages/all-currencies";
import CurrencyDetail from "@/pages/currency-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/forex" component={Forex} />
        <Route path="/crypto" component={Crypto} />
        <Route path="/converter" component={Converter} />
        <Route path="/exchanges" component={Exchanges} />
        <Route path="/currencies" component={AllCurrencies} />
        <Route path="/currency/:symbol" component={CurrencyDetail} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <ErrorBoundary>
              <Router />
              <Toaster />
            </ErrorBoundary>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
