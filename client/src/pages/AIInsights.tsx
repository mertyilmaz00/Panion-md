import { AIInsightCard } from "@/components/AIInsightCard";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, Clock, Heart, Zap } from "lucide-react";
import { getAnalytics } from "@/lib/analytics";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AIInsights() {
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
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Insights
        </h1>
        <p className="text-muted-foreground">Smart summaries and personality analysis</p>
      </div>

      <AIInsightCard
        insights={analytics.insights}
        tip='Try "Focus Mode" during work hours to cut down late-night sessions.'
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-l-chart-1">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-lg bg-chart-1/10 p-2">
              <TrendingUp className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Activity Pattern</h3>
              <p className="text-sm text-muted-foreground">Based on 7 days of data</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p>• You're most active on Wednesday evenings</p>
            <p>• Weekend usage is 15% higher than weekdays</p>
            <p>• Morning activity has increased by 20% this week</p>
            <p>• You tend to check WhatsApp right after waking up</p>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-chart-2">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-lg bg-chart-2/10 p-2">
              <Heart className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Social Circle</h3>
              <p className="text-sm text-muted-foreground">Relationship insights</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p>• You maintain close ties with 5 primary contacts</p>
            <p>• 12 contacts are in your active circle</p>
            <p>• You've reconnected with 3 old friends this week</p>
            <p>• Group chats make up 35% of your activity</p>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-chart-3">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-lg bg-chart-3/10 p-2">
              <Clock className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Time Management</h3>
              <p className="text-sm text-muted-foreground">Digital wellbeing</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p>• Average session duration: 12 minutes</p>
            <p>• You take healthy breaks between sessions</p>
            <p>• Night usage could be reduced by 30 minutes</p>
            <p>• Consider enabling "Do Not Disturb" at 11 PM</p>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-chart-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-lg bg-chart-4/10 p-2">
              <Zap className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Communication Style</h3>
              <p className="text-sm text-muted-foreground">Your signature</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p>• You're a quick responder - 78% faster than average</p>
            <p>• Voice notes are your preferred media type</p>
            <p>• Your messages are concise and to-the-point</p>
            <p>• You use humor frequently in conversations</p>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-4/10">
        <h3 className="text-lg font-semibold mb-4">Weekly Digest</h3>
        <div className="space-y-4">
          <p className="text-base">
            This week, you messaged <span className="font-bold">32 people</span>, spent <span className="font-bold">4.5 hours</span> chatting, 
            and were most active at <span className="font-bold">10 PM</span>. Your sentiment remains overwhelmingly positive, 
            with Linda being your most engaged contact.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div>
              <p className="text-2xl font-bold font-mono text-primary">{analytics.messagesSent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Messages sent</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-chart-1">{analytics.media.voiceNotes}</p>
              <p className="text-sm text-muted-foreground">Voice notes</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-chart-2">
                {analytics.calls.voiceCalls + analytics.calls.videoCalls}
              </p>
              <p className="text-sm text-muted-foreground">Calls made</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-chart-3">{analytics.contacts.length}</p>
              <p className="text-sm text-muted-foreground">Active contacts</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium mb-1">Enable Focus Mode</p>
              <p className="text-sm text-muted-foreground">
                You spend 40% of your work hours on WhatsApp. Try muting 3 less important groups during work hours.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium mb-1">Reconnect with Silent Contacts</p>
              <p className="text-sm text-muted-foreground">
                6 contacts haven't replied in 14+ days. Consider reaching out to maintain those connections.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium mb-1">Set Bedtime Reminders</p>
              <p className="text-sm text-muted-foreground">
                80% of your activity happens at night. Setting a 11 PM reminder could improve your sleep quality.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
