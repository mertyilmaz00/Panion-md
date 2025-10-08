import { ActivityHeatmap } from '../ActivityHeatmap';

const mockHeatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
);

export default function ActivityHeatmapExample() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ActivityHeatmap data={mockHeatmapData} />
    </div>
  );
}
