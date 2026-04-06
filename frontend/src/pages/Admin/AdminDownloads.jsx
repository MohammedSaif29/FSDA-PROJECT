import { useEffect, useState } from 'react';
import { Download, Clock3 } from 'lucide-react';
import { getAdminRecentActivity } from '../../api/adminService';

export default function AdminDownloads() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const data = await getAdminRecentActivity();
        setActivity(data);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, []);

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h2>Download Activity</h2>
          <p className="text-secondary mt-1">Review the latest downloads across your learning platform.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {(loading ? Array.from({ length: 6 }) : activity).map((item, index) => (
          <div
            key={loading ? `download-skeleton-${index}` : item.id}
            className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-slate-950/20 backdrop-blur-xl"
          >
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-2/5 rounded-full bg-white/10" />
                <div className="h-3 w-3/5 rounded-full bg-white/10" />
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {item.username} downloaded <span className="text-sky-300">{item.resourceTitle}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{item.activityTime}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3 text-sky-300">
                  <Download className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>
        ))}

        {!loading && activity.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
            <Clock3 className="mx-auto h-8 w-8 text-slate-500" />
            <p className="mt-4 text-lg font-medium text-white">No downloads recorded yet</p>
            <p className="mt-2 text-sm text-slate-400">When students start downloading resources, they will appear here.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
