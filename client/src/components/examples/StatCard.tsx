import { StatCard } from '../StatCard';
import { Clock, MessageCircle, User, Moon } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <StatCard
        title="Total Online Time"
        value="4h 12m"
        icon={Clock}
        trend={{ value: "15% from last week", isPositive: true }}
        testId="stat-online-time"
      />
      <StatCard
        title="Messages Sent"
        value={2410}
        icon={MessageCircle}
        trend={{ value: "12% from last week", isPositive: true }}
        testId="stat-messages-sent"
      />
      <StatCard
        title="Top Contact"
        value="Linda"
        icon={User}
        testId="stat-top-contact"
      />
      <StatCard
        title="Most Active Time"
        value="9 PM - 11 PM"
        icon={Moon}
        testId="stat-active-time"
      />
    </div>
  );
}
