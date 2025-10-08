import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { InsightBox } from "@/components/InsightBox";
import { Card } from "@/components/ui/card";
import { Clock, Calendar, TrendingUp } from "lucide-react";
import { getAnalytics } from "@/lib/analytics";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Activity() {
  const [, setLocation] = useLocation();
  const analytics = getAnalytics();

  useEffect(() => {
    if (!analytics) {
      setLocation('/');
    }
  }, [analytics, setLocation]);

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Activity Timeline</h1>
        <p className="text-muted-foreground">Track when you're most active on WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightBox
          title="Most Active Time"
          value={analytics.activity.peakHours}
          description="Peak activity hours"
          icon={Clock}
          variant="default"
        />
        <InsightBox
          title="Least Active Day"
          value={analytics.activity.leastActiveDay}
          description="Take time to relax"
          icon={Calendar}
          variant="info"
        />
        <InsightBox
          title="Daily App Opens"
          value={`${analytics.activity.dailyOpens} times`}
          description="Average per day"
          icon={TrendingUp}
          variant="warning"
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
        <div className="space-y-3 text-sm">
          <p>• Peak activity: {analytics.activity.peakHours}</p>
          <p>• Most active day: {analytics.activity.mostActiveDay}</p>
          <p>• Least active day: {analytics.activity.leastActiveDay}</p>
          <p>• Average session duration: {analytics.activity.averageSessionDuration}</p>
          <p>• Daily app opens: {analytics.activity.dailyOpens} times</p>
        </div>
      </Card>

      <ActivityHeatmap data={analytics.activity.hourlyActivity} title="Activity Intensity by Day & Hour" />

      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Activity Insights</h3>
        <div className="space-y-3 text-sm">
          <p>• Most active between 9-11 PM with peak at 10:15 PM</p>
          <p>• Least active on Sundays, especially in the morning</p>
          <p>• You open WhatsApp an average of 37 times daily</p>
          <p>• Longest continuous session: 2h 45m on Wednesday evening</p>
          <p>• Morning activity (6-10 AM): 15% of daily usage</p>
          <p>• Evening activity (6-11 PM): 65% of daily usage</p>
        </div>
      </Card>
    </div>
  );
}
