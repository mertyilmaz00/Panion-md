import { ContactTable } from "@/components/ContactTable";
import { Card } from "@/components/ui/card";
import { BarChart3, PieChart, Clock, Trash2 } from "lucide-react";
import { getAnalytics } from "@/lib/analytics";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Messages() {
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

  const topContacts = analytics.contacts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Message Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your messaging patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
              <p className="text-3xl font-bold font-mono mt-2">{analytics.totalMessages.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-chart-2/10 p-3">
              <BarChart3 className="h-6 w-6 text-chart-2" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {analytics.messagesSent.toLocaleString()} sent • {analytics.messagesReceived.toLocaleString()} received
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top Contact</p>
              <p className="text-3xl font-bold font-mono mt-2">{analytics.topContact}</p>
            </div>
            <div className="rounded-lg bg-chart-1/10 p-3">
              <Clock className="h-6 w-6 text-chart-1" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {analytics.contacts[0]?.messages.toLocaleString()} messages
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Contacts</p>
              <p className="text-3xl font-bold font-mono mt-2">{analytics.contacts.length}</p>
            </div>
            <div className="rounded-lg bg-chart-5/10 p-3">
              <Trash2 className="h-6 w-6 text-chart-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">People you chat with</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Message Volume Over Time
          </h3>
          <div className="h-72 flex items-center justify-center text-muted-foreground">
            Bar chart visualization area
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Sent vs Received Ratio
          </h3>
          <div className="h-72 flex items-center justify-center text-muted-foreground">
            Donut chart visualization area
          </div>
        </Card>
      </div>

      <ContactTable contacts={topContacts} title="Top 5 Contacts by Message Volume" />
    </div>
  );
}
