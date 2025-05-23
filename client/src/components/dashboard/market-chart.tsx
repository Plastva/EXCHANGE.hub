import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingCard } from "@/components/ui/loading-spinner";
import { useRefreshMarketData } from "@/hooks/use-market-data";
import { RefreshCw, Activity } from "lucide-react";
import { useState } from "react";

export function MarketChart() {
  const [timeframe, setTimeframe] = useState("7d");
  const refreshData = useRefreshMarketData();

  const handleRefresh = () => {
    refreshData.mutate();
  };

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Market Trends</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last 7 days performance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshData.isPending}
            >
              <RefreshCw className={`w-4 h-4 ${refreshData.isPending ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Chart placeholder - in a real app, this would be a chart library like Chart.js or Recharts */}
        <div className="h-80 bg-gray-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium mb-4">
              <Activity className="w-4 h-4 mr-2" />
              Live Chart Data
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Chart visualization will render here with real market data
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
