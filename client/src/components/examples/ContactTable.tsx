import { ContactTable } from '../ContactTable';

const mockContacts = [
  { name: 'Linda', messages: 540, percentage: 22, avgResponse: '1m 30s', sentiment: 'positive' as const },
  { name: 'Spencer', messages: 320, percentage: 13, avgResponse: '5m', sentiment: 'mixed' as const },
  { name: 'Glinda', messages: 200, percentage: 8, avgResponse: '3m', sentiment: 'neutral' as const },
  { name: 'Marcus', messages: 180, percentage: 7, avgResponse: '2m 15s', sentiment: 'positive' as const },
  { name: 'Sarah', messages: 150, percentage: 6, avgResponse: '4m 30s', sentiment: 'positive' as const },
];

export default function ContactTableExample() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ContactTable contacts={mockContacts} />
    </div>
  );
}
