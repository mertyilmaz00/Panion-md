import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InsightBoxProps {
  title: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

const variantStyles = {
  default: 'border-l-4 border-l-primary bg-primary/5',
  success: 'border-l-4 border-l-chart-1 bg-chart-1/5',
  warning: 'border-l-4 border-l-chart-5 bg-chart-5/5',
  info: 'border-l-4 border-l-chart-2 bg-chart-2/5',
};

export function InsightBox({ title, value, description, icon: Icon, variant = 'default' }: InsightBoxProps) {
  return (
    <Card className={`p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <p className="text-2xl font-bold mb-1" data-testid="text-value">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {Icon && (
          <Icon className="h-6 w-6 text-primary" />
        )}
      </div>
    </Card>
  );
}
