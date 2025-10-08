import { Card } from "@/components/ui/card";

interface ActivityHeatmapProps {
  data: number[][];
  title?: string;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export function ActivityHeatmap({ data, title = "Activity by Hour" }: ActivityHeatmapProps) {
  const maxValue = Math.max(...data.flat());

  const getIntensityClass = (value: number) => {
    const intensity = value / maxValue;
    if (intensity === 0) return 'bg-muted';
    if (intensity < 0.2) return 'bg-primary/20';
    if (intensity < 0.4) return 'bg-primary/40';
    if (intensity < 0.6) return 'bg-primary/60';
    if (intensity < 0.8) return 'bg-primary/80';
    return 'bg-primary';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-2">
            <div className="flex flex-col justify-around text-xs text-muted-foreground pr-2">
              {days.map((day) => (
                <div key={day} className="h-4 flex items-center">{day}</div>
              ))}
            </div>
            <div className="flex-1">
              <div className="flex gap-1 mb-2 text-xs text-muted-foreground">
                {[0, 6, 12, 18, 23].map((h) => (
                  <div key={h} className="w-4 text-center">{h}</div>
                ))}
              </div>
              <div className="space-y-1">
                {data.map((row, dayIndex) => (
                  <div key={dayIndex} className="flex gap-1">
                    {row.map((value, hourIndex) => (
                      <div
                        key={hourIndex}
                        className={`w-4 h-4 rounded-sm ${getIntensityClass(value)} transition-colors hover-elevate cursor-pointer`}
                        title={`${days[dayIndex]} ${hourIndex}:00 - ${value} messages`}
                        data-testid={`heatmap-cell-${dayIndex}-${hourIndex}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
