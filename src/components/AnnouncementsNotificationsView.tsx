import React, { useState, useEffect } from 'react';
import { Bell, ArrowUpRight, Megaphone, CheckCheck, Bookmark, Search } from 'lucide-react';
import { CampusAnnouncement, CampusNotification } from '../types';
import { ServiceHeader, ServiceSearch, ServiceEmpty } from './ServiceUI';
interface Props {
  announcements: CampusAnnouncement[];
  notifications: CampusNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onSelectTab: (tab: string) => void;
}
export function AnnouncementsNotificationsView({ announcements, notifications, onMarkNotificationRead, onClearNotifications, onSelectTab }: Props) {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>(() => {
    try { const value = JSON.parse(sessionStorage.getItem('campus-saved-notices') || '[]'); return Array.isArray(value) ? value.filter(id => typeof id === 'string') : []; } catch { return []; }
  });
  useEffect(() => { try { sessionStorage.setItem('campus-saved-notices', JSON.stringify(saved)); } catch { /* Storage may be disabled. */ } }, [saved]);
  const [savedOnly, setSavedOnly] = useState(false);
  const unread = notifications.filter(n => !n.read);
  const filtered = announcements.filter(a => (category === 'all' || a.category === category) && (!savedOnly || saved.includes(a.id)) && (a.title + a.summary + a.author).toLowerCase().includes(query.toLowerCase()));
  const feed = notifications.filter(n => !unreadOnly || !n.read);
  return <div className="service-page">
    <ServiceHeader label="CAMPUS COMMUNICATIONS" title="Your campus, in the loop." description="The announcements that matter. The updates that move your day forward."><span className="service-header-note"><Bell size={16}/>{unread.length} unread updates</span></ServiceHeader>
    <div className="service-summary"><div><Megaphone/><strong>{announcements.length}</strong><span>Campus notices</span></div><div><Bell/><strong>{announcements.filter(a => a.isUrgent).length}</strong><span>Priority notices</span></div><div><Bookmark/><strong>{saved.length}</strong><span>Saved this session</span></div></div>
    <div className="service-notices-layout">
      <section>
        <div className="service-toolbar"><ServiceSearch value={query} onChange={setQuery} placeholder="Search notices, topics or departments"/><button className="service-secondary" aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={16}/>Saved</button></div>
        <div className="service-filters" aria-label="Notice categories">{['all','urgent','academic','placements','event','hostel'].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c === 'all' ? 'All notices' : c === 'event' ? 'Events' : c}</button>)}</div>
        <p className="service-result-count" role="status">{filtered.length} notice{filtered.length === 1 ? '' : 's'}{savedOnly ? ' saved' : ''}</p>
        <div className="service-notice-list">{filtered.map(a => <article className={'service-notice' + (a.isUrgent ? ' is-priority' : '')} key={a.id}><div className="service-notice-top"><span className={'service-badge ' + (a.isUrgent ? 'status-amber' : 'status-green')}>{a.isUrgent ? 'Priority · ' : ''}{a.badge || a.category}</span><span>{a.date}</span><button aria-label={(saved.includes(a.id) ? 'Unsave ' : 'Save ') + a.title} aria-pressed={saved.includes(a.id)} onClick={() => setSaved(saved.includes(a.id) ? saved.filter(id => id !== a.id) : [...saved,a.id])}><Bookmark size={17} fill={saved.includes(a.id) ? 'currentColor' : 'none'}/></button></div><h2>{a.title}</h2><p>{a.summary}</p><footer><span className="service-department-icon"><Megaphone size={14}/></span>{a.author}</footer></article>)}{!filtered.length && <ServiceEmpty title="No matching notices" description="Try a different search or category, or switch off Saved."/>}</div>
      </section>
      <aside className="service-panel service-inbox"><div className="service-panel-title"><div><p className="service-eyebrow">JUST FOR YOU</p><h2>Your updates <small>{unread.length}</small></h2></div><Bell size={19}/></div><div className="service-inbox-tools"><button onClick={() => unread.forEach(n => onMarkNotificationRead(n.id))} disabled={!unread.length}><CheckCheck size={15}/>Mark all read</button><label><input type="checkbox" checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)}/>Unread</label></div><div>{feed.map(n => <button className={'service-notification ' + (!n.read ? 'is-unread' : '')} key={n.id} onClick={() => { onMarkNotificationRead(n.id); if(n.actionTab) onSelectTab(n.actionTab); }}><span className="service-notification-meta">{n.read ? 'Read' : 'Unread'} · {n.timeAgo}<ArrowUpRight size={14}/></span><strong>{n.title}</strong><p>{n.message}</p></button>)}{!feed.length && <ServiceEmpty title="You’re all caught up" description={unreadOnly ? 'No unread updates. Turn off Unread to see your history.' : 'New updates will appear here.'}/>}</div><button className="service-clear-read" disabled={!notifications.some(n => n.read)} onClick={onClearNotifications}>Clear read updates</button></aside>
    </div>
  </div>;
}
