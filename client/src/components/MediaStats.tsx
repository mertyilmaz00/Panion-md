import { Card } from "@/components/ui/card";
import { Image, Video, Mic, FileText } from "lucide-react";

interface MediaStatsProps {
  photos: number;
  videos: number;
  voiceNotes: number;
  documents: number;
  storageUsed: string;
}

export function MediaStats({ photos, videos, voiceNotes, documents, storageUsed }: MediaStatsProps) {
  const items = [
    { icon: Image, label: 'Photos', value: photos, color: 'text-chart-2' },
    { icon: Video, label: 'Videos', value: videos, color: 'text-chart-3' },
    { icon: Mic, label: 'Voice Notes', value: voiceNotes, color: 'text-chart-1' },
    { icon: FileText, label: 'Documents', value: documents, color: 'text-chart-4' },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Media Usage</h3>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Storage Used</p>
          <p className="text-2xl font-bold font-mono">{storageUsed}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 rounded-lg border hover-elevate"
            data-testid={`media-stat-${index}`}
          >
            <div className={`${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold font-mono">{item.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
