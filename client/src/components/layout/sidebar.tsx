import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import {
  LayoutDashboard,
  TrendingUp,
  Bitcoin,
  Shuffle,
  Building2,
  Globe,
  Wallet,
  ChevronDown,
} from "lucide-react";

function getNavigation(t: (key: string) => string) {
  return [
    { name: t("nav.dashboard"), href: "/", icon: LayoutDashboard },
    { name: t("nav.forex"), href: "/forex", icon: TrendingUp },
    { name: t("nav.crypto"), href: "/crypto", icon: Bitcoin },
    { name: t("nav.converter"), href: "/converter", icon: Shuffle },
    { name: t("nav.exchanges"), href: "/exchanges", icon: Building2 },
    { name: t("nav.currencies"), href: "/currencies", icon: Globe },
  ];
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { t } = useLanguage();
  
  const navigation = getNavigation(t);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 shadow-sm transform transition-transform duration-200 ease-in-out lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
              {t('site.name')}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary dark:text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                    )}
                    onClick={onClose}
                  >
                    <item.icon className="mr-3 w-5 h-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>


        </div>
      </aside>
    </>
  );
}
