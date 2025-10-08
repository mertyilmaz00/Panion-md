import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  testId?: string;
}

export function StatCard({ title, value, icon: Icon, trend, testId }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;

  useEffect(() => {
    if (isNaN(numericValue)) {
      return;
    }

    let start = 0;
    const end = numericValue;
    const duration = 1500;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numericValue]);

  const formattedValue = typeof value === 'string' && isNaN(numericValue) 
    ? value 
    : typeof value === 'string' 
      ? value.replace(/[0-9]/g, (match) => displayValue.toString()[parseInt(match)] || match)
      : displayValue.toLocaleString();

  return (
    <Card className="p-6" data-testid={testId}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-mono" data-testid={`${testId}-value`}>
            {formattedValue}
          </p>
          {trend && (
            <p className={`text-xs ${trend.isPositive ? 'text-chart-1' : 'text-destructive'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
