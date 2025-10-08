import { MediaStats } from '../MediaStats';

export default function MediaStatsExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <MediaStats
        photos={180}
        videos={45}
        voiceNotes={87}
        documents={22}
        storageUsed="2.3 GB"
      />
    </div>
  );
}
