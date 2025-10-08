import { AIInsightCard } from '../AIInsightCard';

const mockInsights = [
  "You're most talkative with Linda (540 msgs)",
  "You prefer voice notes over videos (2:1 ratio)",
  "You stay online 4.3h daily, mostly after 9 PM",
  "You respond in 2m on average — very active!",
  "Mood trend: 78% positive, 12% neutral, 10% negative"
];

export default function AIInsightCardExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <AIInsightCard 
        insights={mockInsights} 
        tip='Try "Focus Mode" during work hours to cut down late-night sessions.'
      />
    </div>
  );
}
