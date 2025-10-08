import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface WellbeingScoreProps {
  score: number;
  label?: string;
}

export function WellbeingScore({ score, label = "Digital Wellbeing Score" }: WellbeingScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">{label}</h3>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="180" height="180" className="transform -rotate-90">
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                <stop offset="100%" stopColor="hsl(var(--chart-4))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold font-mono" data-testid="text-score">
              {animatedScore}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {score >= 80 ? 'Excellent balance!' : score >= 60 ? 'Good balance' : 'Room for improvement'}
          </p>
        </div>
      </div>
    </Card>
  );
}
