import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/ui/loading-spinner";
import { formatLargeNumber, formatNumber, getChangeColor, getChangeIcon } from "@/lib/utils";
import { useMarketStats } from "@/hooks/use-market-data";
import { 
  DollarSign, 
  BarChart3, 
  Coins, 
  Building2,
  TrendingUp,
  TrendingDown,
  Activity,
  Icon
} from "lucide-react";

const iconMap: Record<string, Icon> = {
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "activity": Activity,
};

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeLabel?: string;
  icon: Icon;
  iconBgColor: string;
  iconColor: string;
}

function StatCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  iconBgColor, 
  iconColor 
}: StatCardProps) {
  const changeNum = change ? parseFloat(change) : 0;
  const ChangeIcon = iconMap[getChangeIcon(changeNum)] || Activity;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
              {value}
            </p>
            {change && (
              <div className="flex items-center mt-2">
                <ChangeIcon className={`w-4 h-4 mr-1 ${getChangeColor(changeNum)}`} />
                <span className={`text-sm font-medium ${getChangeColor(changeNum)}`}>
                  {change}
                </span>
                {changeLabel && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { data: stats, isLoading, error } = useMarketStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <LoadingSkeleton rows={3} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
              Failed to load market stats
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Market Cap"
        value={formatLargeNumber(stats.marketCap)}
        change="+2.4%"
        changeLabel="24h"
        icon={DollarSign}
        iconBgColor="bg-success-50 dark:bg-success-500/10"
        iconColor="text-success-500"
      />

      <StatCard
        title="24h Volume"
        value={formatLargeNumber(stats.volume24h)}
        change="-1.2%"
        changeLabel="24h"
        icon={BarChart3}
        iconBgColor="bg-primary-50 dark:bg-primary-500/10"
        iconColor="text-primary-500"
      />

      <StatCard
        title="Active Currencies"
        value={formatNumber(stats.activeCurrencies, 0)}
        change="+5"
        changeLabel="this week"
        icon={Coins}
        iconBgColor="bg-warning-50 dark:bg-warning-500/10"
        iconColor="text-warning-500"
      />

      <StatCard
        title="Exchanges"
        value={formatNumber(stats.activeExchanges, 0)}
        changeLabel="All Online"
        icon={Building2}
        iconBgColor="bg-danger-50 dark:bg-danger-500/10"
        iconColor="text-danger-500"
      />
    </div>
  );
}
