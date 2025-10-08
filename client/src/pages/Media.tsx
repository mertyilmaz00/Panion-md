import { MediaStats } from "@/components/MediaStats";
import { Card } from "@/components/ui/card";
import { Eye, TrendingUp, Users } from "lucide-react";
import { getAnalytics } from "@/lib/analytics";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Media() {
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

  const storageGB = (analytics.media.totalSize / (1024 * 1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Media & Status</h1>
        <p className="text-muted-foreground">Your content engagement and sharing patterns</p>
      </div>

      <MediaStats
        photos={analytics.media.photos}
        videos={analytics.media.videos}
        voiceNotes={analytics.media.voiceNotes}
        documents={analytics.media.documents}
        storageUsed={`${storageGB} GB`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statuses Posted</p>
              <p className="text-3xl font-bold font-mono mt-2">10</p>
            </div>
            <div className="rounded-lg bg-chart-3/10 p-3">
              <TrendingUp className="h-6 w-6 text-chart-3" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">This week</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Views per Status</p>
              <p className="text-3xl font-bold font-mono mt-2">65</p>
            </div>
            <div className="rounded-lg bg-chart-2/10 p-3">
              <Eye className="h-6 w-6 text-chart-2" />
            </div>
          </div>
          <p className="text-sm text-chart-1">↑ 12% from last week</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top Viewers</p>
              <p className="text-3xl font-bold font-mono mt-2">12</p>
            </div>
            <div className="rounded-lg bg-chart-1/10 p-3">
              <Users className="h-6 w-6 text-chart-1" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Regular viewers</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Most Viewed Status</h3>
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-chart-1 to-chart-4 flex items-center justify-center text-white font-bold text-xl">
            ST
          </div>
          <div className="flex-1">
            <p className="font-semibold">Trip to Sneville</p>
            <p className="text-sm text-muted-foreground">Posted 2 days ago</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-mono">92</p>
            <p className="text-sm text-muted-foreground">views</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Status Viewers</h3>
        <div className="space-y-3">
          {['Linda', 'Spencer', 'Glinda', 'Marcus', 'Sarah'].map((name, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {name[0]}
                </div>
                <span className="font-medium">{name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {10 - i} statuses viewed
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Status Engagement Trend</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Line chart showing status views over time
        </div>
      </Card>
    </div>
  );
}
