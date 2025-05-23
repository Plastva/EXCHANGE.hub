import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string, currency: string = 'USD', decimals: number = 2): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';

  if (currency === 'USD' || currency.includes('/')) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numValue);
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
}

export function formatNumber(value: number | string, decimals: number = 2): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
}

export function formatPercentage(value: number | string, decimals: number = 2): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0%';

  return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(decimals)}%`;
}

export function formatLargeNumber(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';

  if (numValue >= 1e12) {
    return `$${(numValue / 1e12).toFixed(2)}T`;
  } else if (numValue >= 1e9) {
    return `$${(numValue / 1e9).toFixed(2)}B`;
  } else if (numValue >= 1e6) {
    return `$${(numValue / 1e6).toFixed(2)}M`;
  } else if (numValue >= 1e3) {
    return `$${(numValue / 1e3).toFixed(2)}K`;
  }
  
  return formatCurrency(numValue);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getChangeColor(change: number | string): string {
  const numChange = typeof change === 'string' ? parseFloat(change) : change;
  
  if (isNaN(numChange)) return 'text-gray-500';
  if (numChange > 0) return 'text-success-600 dark:text-success-400';
  if (numChange < 0) return 'text-danger-600 dark:text-danger-400';
  return 'text-gray-500 dark:text-gray-400';
}

export function getChangeIcon(change: number | string): string {
  const numChange = typeof change === 'string' ? parseFloat(change) : change;
  
  if (isNaN(numChange)) return 'minus';
  if (numChange > 0) return 'trending-up';
  if (numChange < 0) return 'trending-down';
  return 'minus';
}

export function validateAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num < 1e12;
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>\"']/g, '');
}

export function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const executeOperation = () => {
      attempts++;
      operation()
        .then(resolve)
        .catch(error => {
          if (attempts < maxAttempts) {
            setTimeout(executeOperation, delay * attempts);
          } else {
            reject(error);
          }
        });
    };
    
    executeOperation();
  });
}
