import { Card } from "@/components/ui/card";

interface EmojiData {
  emoji: string;
  count: number;
}

interface EmojiCloudProps {
  emojis: EmojiData[];
  title?: string;
}

export function EmojiCloud({ emojis, title = "Most Used Emojis" }: EmojiCloudProps) {
  const maxCount = Math.max(...emojis.map(e => e.count));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-4 items-center justify-center p-4">
        {emojis.map((item, index) => {
          const scale = 1 + (item.count / maxCount) * 2;
          return (
            <div
              key={index}
              className="transition-transform hover:scale-110 cursor-pointer"
              style={{ fontSize: `${scale}rem` }}
              title={`${item.emoji} used ${item.count} times`}
              data-testid={`emoji-${index}`}
            >
              {item.emoji}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
