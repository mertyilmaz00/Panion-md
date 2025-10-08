import { InsightBox } from '../InsightBox';
import { TrendingUp, Clock, Users, Zap } from 'lucide-react';

export default function InsightBoxExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <InsightBox
        title="Morning vs Night Chat Ratio"
        value="20% vs 80%"
        description="You're most active at night"
        icon={Clock}
        variant="default"
      />
      <InsightBox
        title="Reply Speed"
        value="Faster than 78%"
        description="You respond quickly to messages"
        icon={Zap}
        variant="success"
      />
      <InsightBox
        title="Silent Chats"
        value="6 contacts"
        description="Haven't replied in 14 days"
        icon={Users}
        variant="warning"
      />
      <InsightBox
        title="Consistency Streak"
        value="7 days in a row"
        description="Active every day this week"
        icon={TrendingUp}
        variant="info"
      />
    </div>
  );
}
