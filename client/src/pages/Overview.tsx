import { Clock, MessageCircle, User, Moon, TrendingUp, PieChart } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { AIInsightCard } from "@/components/AIInsightCard";
import { Card } from "@/components/ui/card";
import { getAnalytics } from "@/lib/analytics";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Overview() {
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
        <h1 className="text-3xl font-bold mb-2">Overview</h1>
        <p className="text-muted-foreground">Your WhatsApp activity at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Online Time"
          value={analytics.totalOnlineTime}
          icon={Clock}
          testId="stat-online-time"
        />
        <StatCard
          title="Messages Sent"
          value={analytics.messagesSent}
          icon={MessageCircle}
          testId="stat-messages-sent"
        />
        <StatCard
          title="Top Contact"
          value={analytics.topContact}
          icon={User}
          testId="stat-top-contact"
        />
        <StatCard
          title="Most Active Time"
          value={analytics.mostActiveTime}
          icon={Moon}
          testId="stat-active-time"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Messages Overview
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <p className="text-3xl font-bold font-mono">{analytics.totalMessages.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-xl font-bold font-mono text-chart-1">{analytics.messagesSent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Received</p>
                <p className="text-xl font-bold font-mono text-chart-2">{analytics.messagesReceived.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Media Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Photos</p>
              <p className="text-xl font-bold font-mono">{analytics.media.photos}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Videos</p>
              <p className="text-xl font-bold font-mono">{analytics.media.videos}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Voice Notes</p>
              <p className="text-xl font-bold font-mono">{analytics.media.voiceNotes}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Documents</p>
              <p className="text-xl font-bold font-mono">{analytics.media.documents}</p>
            </div>
          </div>
        </Card>
      </div>

      <ActivityHeatmap data={analytics.activity.hourlyActivity} title="Activity by Hour (Mon-Sun)" />

      <AIInsightCard
        insights={analytics.insights}
        tip='Try "Focus Mode" during work hours to reduce distractions.'
      />
    </div>
  );
}
