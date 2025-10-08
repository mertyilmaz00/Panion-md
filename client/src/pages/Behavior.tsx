import { WellbeingScore } from "@/components/WellbeingScore";
import { InsightBox } from "@/components/InsightBox";
import { Clock, Moon, Zap, Users, TrendingUp, AlertCircle } from "lucide-react";
import { getAnalytics } from "@/lib/analytics";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Behavior() {
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

  const morningMessages = analytics.activity.hourlyActivity.reduce((sum, day) => {
    return sum + day.slice(6, 12).reduce((a, b) => a + b, 0);
  }, 0);
  
  const nightMessages = analytics.activity.hourlyActivity.reduce((sum, day) => {
    return sum + day.slice(18, 24).reduce((a, b) => a + b, 0);
  }, 0);

  const total = morningMessages + nightMessages || 1;
  const morningPercent = Math.round((morningMessages / total) * 100);
  const nightPercent = Math.round((nightMessages / total) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Behavior & Habits</h1>
        <p className="text-muted-foreground">Understand your WhatsApp usage patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InsightBox
            title="Focus Balance"
            value={`${analytics.totalOnlineTime} / day online`}
            description="Time spent on WhatsApp"
            icon={Clock}
            variant="warning"
          />
          <InsightBox
            title="Morning vs Night Ratio"
            value={`${morningPercent}% vs ${nightPercent}%`}
            description={nightPercent > morningPercent ? "You're a night owl" : "You're an early bird"}
            icon={Moon}
            variant="info"
          />
          <InsightBox
            title="Most Active Time"
            value={analytics.activity.peakHours}
            description="Peak activity hours"
            icon={Zap}
            variant="success"
          />
          <InsightBox
            title="Active Contacts"
            value={`${analytics.contacts.length} contacts`}
            description="People you chat with"
            icon={Users}
            variant="warning"
          />
          <InsightBox
            title="Most Active Day"
            value={analytics.activity.mostActiveDay}
            description="Your busiest day"
            icon={TrendingUp}
            variant="success"
          />
          <InsightBox
            title="Avg Session Duration"
            value={analytics.activity.averageSessionDuration}
            description="Time per session"
            icon={AlertCircle}
            variant="warning"
          />
        </div>

        <WellbeingScore score={analytics.wellbeingScore} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Activity Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Work Hours (9 AM - 5 PM)</span>
                <span className="font-mono">40%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-5" style={{ width: '40%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Evening (5 PM - 11 PM)</span>
                <span className="font-mono">50%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-1" style={{ width: '50%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Night (11 PM - 6 AM)</span>
                <span className="font-mono">10%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-3" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Weekly Comparison</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Weekdays</span>
                <span className="font-mono">4.8h / day</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-2" style={{ width: '70%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Weekends</span>
                <span className="font-mono">5.5h / day</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-4" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
