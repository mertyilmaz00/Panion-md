import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Contact {
  name: string;
  messages: number;
  percentage: number;
  avgResponse: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
}

interface ContactTableProps {
  contacts: Contact[];
  title?: string;
}

const sentimentConfig = {
  positive: { label: 'Positive', color: 'bg-chart-1 text-white' },
  neutral: { label: 'Neutral', color: 'bg-chart-5 text-foreground' },
  negative: { label: 'Negative', color: 'bg-destructive text-white' },
  mixed: { label: 'Mixed', color: 'bg-chart-2 text-white' },
};

export function ContactTable({ contacts, title = "Top Contacts" }: ContactTableProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Messages</TableHead>
              <TableHead className="text-right">% of Total</TableHead>
              <TableHead className="text-right">Avg Response</TableHead>
              <TableHead className="text-right">Sentiment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact, index) => (
              <TableRow key={index} data-testid={`row-contact-${index}`}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="text-right font-mono">{contact.messages.toLocaleString()}</TableCell>
                <TableCell className="text-right">{contact.percentage}%</TableCell>
                <TableCell className="text-right font-mono">{contact.avgResponse}</TableCell>
                <TableCell className="text-right">
                  <Badge className={sentimentConfig[contact.sentiment].color}>
                    {sentimentConfig[contact.sentiment].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
