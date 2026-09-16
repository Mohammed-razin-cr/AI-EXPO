import React, { useState } from 'react';
import {
  Bell,
  Megaphone,
  Sparkles,
  Calendar,
  AlertTriangle,
  Award,
  CheckCircle2,
  Trash2,
  Filter
} from 'lucide-react';
import { CampusAnnouncement, CampusNotification } from '../types';

interface AnnouncementsNotificationsViewProps {
  announcements: CampusAnnouncement[];
  notifications: CampusNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onSelectTab: (tab: string) => void;
}

export const AnnouncementsNotificationsView: React.FC<AnnouncementsNotificationsViewProps> = ({
  announcements,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onSelectTab,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredAnnouncements = announcements.filter((ann) => {
    if (filterCategory !== 'all' && ann.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="neo-card bg-[#FFFDF9] border-2 border-slate-900 rounded-2xl p-6 sm:p-7 shadow-[5px_5px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="neo-pill bg-yellow-200 text-slate-950 font-black mb-2">
            <Megaphone className="w-3.5 h-3.5 stroke-[2.5]" />
            Official University Notices
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">
            Campus Announcements &amp; AI Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xl mt-1 leading-relaxed">
            Stay updated with academic schedules, campus placement drives, urgent administrative circulars, and personalized deadline alerts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Official Campus Announcements */}
        <div className="lg:col-span-8 space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['all', 'urgent', 'academic', 'placements', 'event'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-black capitalize transition-all border-2 border-slate-900 cursor-pointer whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_#0f172a]'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0f172a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3.5">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border-2 border-slate-900 transition-all space-y-2.5 ${
                  item.isUrgent
                    ? 'bg-yellow-100 shadow-[4.5px_4.5px_0px_#0f172a]'
                    : 'bg-white shadow-[3.5px_3.5px_0px_#0f172a] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 shadow-[1px_1px_0px_#0f172a] ${
                          item.isUrgent
                            ? 'bg-rose-300 text-slate-950'
                            : 'bg-yellow-200 text-slate-950'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-700 font-bold">{item.author}</span>
                  </div>
                  <span className="text-[11px] text-slate-600 font-bold">{item.date}</span>
                </div>

                <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI-Powered Notifications Feed */}
        <div className="lg:col-span-4 space-y-4">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#0f172a] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <h3 className="font-black text-sm text-slate-950">AI Notification Feed</h3>
              </div>
              <button
                onClick={onClearNotifications}
                className="text-slate-600 hover:text-black font-black text-[11px] flex items-center gap-1 cursor-pointer"
                title="Clear all read"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" /> Clear
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkNotificationRead(notif.id);
                    if (notif.actionTab) onSelectTab(notif.actionTab);
                  }}
                  className={`p-3 rounded-xl border-2 border-slate-900 transition-all cursor-pointer space-y-1 ${
                    !notif.read
                      ? 'bg-yellow-100 shadow-[2.5px_2.5px_0px_#0f172a] -translate-y-0.5'
                      : 'bg-white text-slate-600 hover:bg-slate-50 shadow-[1.5px_1.5px_0px_#0f172a]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-slate-950">{notif.title}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{notif.timeAgo}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-800 font-medium">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
