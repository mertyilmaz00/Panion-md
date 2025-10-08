import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AIInsightCardProps {
  insights: string[];
  tip?: string;
}

export function AIInsightCard({ insights, tip }: AIInsightCardProps) {
  return (
    <Card className="p-6 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold">Your Weekly Personality Recap</h3>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
          {tip && (
            <div className="pt-3 border-t">
              <p className="text-sm">
                <span className="font-semibold text-primary">💡 Tip:</span> {tip}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
