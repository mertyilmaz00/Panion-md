import { EmojiCloud } from "@/components/EmojiCloud";
import { ContactTable } from "@/components/ContactTable";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { getAnalytics } from "@/lib/analytics";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Emotional() {
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

  const topEmotionalContacts = analytics.contacts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Emotional & Sentiment</h1>
        <p className="text-muted-foreground">Analyze mood, tone, and emoji trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Overall Sentiment</p>
          <p className="text-3xl font-bold font-mono text-chart-1 mb-2">{analytics.sentiment.positive}%</p>
          <p className="text-sm text-muted-foreground">Positive</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Neutral</p>
          <p className="text-3xl font-bold font-mono text-chart-5 mb-2">{analytics.sentiment.neutral}%</p>
          <p className="text-sm text-muted-foreground">Balanced tone</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Negative</p>
          <p className="text-3xl font-bold font-mono text-destructive mb-2">{analytics.sentiment.negative}%</p>
          <p className="text-sm text-muted-foreground">Critical or sad</p>
        </Card>
      </div>

      <EmojiCloud emojis={analytics.sentiment.topEmojis} />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Sentiment Trend Over Time
        </h3>
        <div className="h-72 flex items-center justify-center text-muted-foreground">
          Line chart showing positive, neutral, negative sentiment per week
        </div>
      </Card>

      <ContactTable 
        contacts={topEmotionalContacts.map(c => ({
          ...c,
          avgResponse: c.avgResponse,
        }))} 
        title="Top Emotional Contacts" 
      />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Keywords</h3>
        <div className="flex flex-wrap gap-3">
          {analytics.sentiment.topKeywords.map((word, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-lg border hover-elevate cursor-pointer"
              style={{ fontSize: `${1 + (10 - i) * 0.1}rem` }}
            >
              {word}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-l-primary">
        <h3 className="text-lg font-semibold mb-3">AI Comment</h3>
        <p className="text-base">
          {analytics.sentiment.topEmojis.length > 0 && (
            <>You use "{analytics.sentiment.topEmojis[0].emoji}" {analytics.sentiment.topEmojis[0].count} times — it defines your chats! </>
          )}
          Your conversations are {analytics.sentiment.positive > 60 ? 'predominantly positive' : 'balanced'}, 
          {analytics.contacts.length > 0 && (
            <> with {analytics.contacts[0].name} being your most frequent contact.</>
          )}
        </p>
      </Card>
    </div>
  );
}
