import { Card } from "@/components/ui/card";
import { Phone, Video, PhoneMissed, Bell } from "lucide-react";
import { getAnalytics } from "@/lib/analytics";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Calls() {
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
        <h1 className="text-3xl font-bold mb-2">Call & Notifications</h1>
        <p className="text-muted-foreground">Track your calling habits and responsiveness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Voice Calls</p>
              <p className="text-3xl font-bold font-mono mt-2">{analytics.calls.voiceCalls}</p>
            </div>
            <div className="rounded-lg bg-chart-1/10 p-3">
              <Phone className="h-6 w-6 text-chart-1" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Avg duration: {analytics.calls.avgVoiceDuration}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Video Calls</p>
              <p className="text-3xl font-bold font-mono mt-2">{analytics.calls.videoCalls}</p>
            </div>
            <div className="rounded-lg bg-chart-3/10 p-3">
              <Video className="h-6 w-6 text-chart-3" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Avg duration: {analytics.calls.avgVideoDuration}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Missed Calls</p>
              <p className="text-3xl font-bold font-mono mt-2">{analytics.calls.missedCalls}</p>
            </div>
            <div className="rounded-lg bg-destructive/10 p-3">
              <PhoneMissed className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {analytics.calls.voiceCalls + analytics.calls.videoCalls > 0 
              ? `${Math.round((analytics.calls.missedCalls / (analytics.calls.voiceCalls + analytics.calls.videoCalls + analytics.calls.missedCalls)) * 100)}% miss rate`
              : 'No calls data'}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Calls</p>
              <p className="text-3xl font-bold font-mono mt-2">
                {analytics.calls.voiceCalls + analytics.calls.videoCalls}
              </p>
            </div>
            <div className="rounded-lg bg-chart-2/10 p-3">
              <Bell className="h-6 w-6 text-chart-2" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Combined total</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Most Used Reactions</h3>
        <div className="flex gap-6 items-center justify-center p-6">
          {['😂', '👍', '❤️', '🔥', '😮'].map((emoji, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl mb-2">{emoji}</div>
              <div className="text-sm font-mono">{50 - i * 8}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Callers</h3>
        <div className="space-y-3">
          {analytics.calls.topCallers.map((caller, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {caller.name[0]}
                </div>
                <div>
                  <p className="font-medium">{caller.name}</p>
                  <p className="text-sm text-muted-foreground">{caller.type} calls</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold font-mono">{caller.calls}</p>
                <p className="text-sm text-muted-foreground">{caller.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Call Duration Trend</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Line chart showing call durations over time
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Call Type Distribution</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Pie chart showing voice vs video calls
          </div>
        </Card>
      </div>
    </div>
  );
}
