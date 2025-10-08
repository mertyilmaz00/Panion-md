import { EmojiCloud } from '../EmojiCloud';

const mockEmojis = [
  { emoji: '😂', count: 120 },
  { emoji: '❤️', count: 95 },
  { emoji: '👍', count: 80 },
  { emoji: '😊', count: 65 },
  { emoji: '🔥', count: 55 },
  { emoji: '💯', count: 45 },
  { emoji: '🙏', count: 40 },
  { emoji: '😭', count: 35 },
  { emoji: '🎉', count: 30 },
  { emoji: '💪', count: 25 },
];

export default function EmojiCloudExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <EmojiCloud emojis={mockEmojis} />
    </div>
  );
}
