import React, { useState, useRef, useEffect } from 'react';
import { Bell, Bot, Check, ChevronDown, GraduationCap, Languages, ShieldCheck, User, Users, X } from 'lucide-react';
import { UserProfile, UserRole, CampusNotification } from '../types';

interface NavbarProps {
  user: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  onOpenAssistant: () => void;
  onOpenLogin: () => void;
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
  notifications: CampusNotification[];
  onMarkNotificationRead: (id: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'Telugu'];
const ROLES: Array<{ id: UserRole; label: string; detail: string; icon: typeof User }> = [
  { id: 'student', label: 'Student', detail: 'Alex Rivera', icon: GraduationCap },
  { id: 'faculty', label: 'Faculty', detail: 'Dr. Aris Thorne', icon: Users },
  { id: 'admin', label: 'Administrator', detail: 'Dean Eleanor Vance', icon: ShieldCheck },
];

export const Navbar: React.FC<NavbarProps> = ({
  user, onSwitchRole, onOpenAssistant, onOpenLogin, currentLanguage,
  onChangeLanguage, notifications, onMarkNotificationRead, onSelectTab,
}) => {
  const [openMenu, setOpenMenu] = useState<'language' | 'notifications' | 'profile' | null>(null);
  const menuArea = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!openMenu) return;
    lastTrigger.current = document.activeElement as HTMLElement;
    const dismiss = (event: PointerEvent) => {
      if (!menuArea.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpenMenu(null); lastTrigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, [openMenu]);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const toggleMenu = (menu: typeof openMenu) => setOpenMenu((current) => current === menu ? null : menu);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button onClick={() => onSelectTab('landing')} className="group flex min-w-0 items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100" aria-label="Go to Yukti AI overview">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#183153] text-white shadow-sm transition-transform group-hover:-translate-y-0.5">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="truncate text-[17px] font-extrabold tracking-tight text-slate-950">Yukti AI</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-emerald-800">AI HUB</span>
            </span>
            <span className="hidden truncate text-[11px] font-semibold text-slate-500 sm:block">Student success, in one place</span>
          </span>
        </button>

        <div ref={menuArea} className="header-controls flex items-center gap-2">
          <button onClick={onOpenAssistant} className="hidden min-h-11 items-center gap-2 rounded-xl bg-[#183153] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#244a73] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:flex">
            <Bot className="h-4 w-4" aria-hidden="true" /> Ask Campus AI
          </button>

          <div className="relative">
            <button onClick={() => toggleMenu('language')} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100" aria-label={`Language: ${currentLanguage}`} aria-expanded={openMenu === 'language'}>
              <Languages className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            {openMenu === 'language' && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Language</p>
                {LANGUAGES.map((language) => (
                  <button key={language} onClick={() => { onChangeLanguage(language); setOpenMenu(null); }} className="flex min-h-10 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    {language}{language === currentLanguage && <Check className="h-4 w-4 text-blue-700" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => toggleMenu('notifications')} className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100" aria-label={`${unreadCount} unread notifications`} aria-expanded={openMenu === 'notifications'}>
              <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
              {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white ring-2 ring-white">{unreadCount}</span>}
            </button>
            {openMenu === 'notifications' && (
              <div className="absolute right-0 mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div><p className="text-sm font-extrabold text-slate-950">Notifications</p><p className="text-xs text-slate-500">{unreadCount} unread update{unreadCount === 1 ? '' : 's'}</p></div>
                  <button onClick={() => setOpenMenu(null)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close notifications"><X className="h-4 w-4" /></button>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {notifications.length === 0 ? <p className="px-3 py-8 text-center text-sm text-slate-500">You’re all caught up.</p> : notifications.map((notification) => (
                    <button key={notification.id} onClick={() => { onMarkNotificationRead(notification.id); if (notification.actionTab) onSelectTab(notification.actionTab); setOpenMenu(null); }} className={`w-full rounded-xl px-3 py-3 text-left transition hover:bg-slate-50 ${notification.read ? '' : 'bg-blue-50/70'}`}>
                      <span className="flex items-start justify-between gap-3"><span className="text-sm font-bold text-slate-900">{notification.title}</span><span className="shrink-0 text-[10px] font-semibold text-slate-400">{notification.timeAgo}</span></span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600">{notification.message}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => toggleMenu('profile')} className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-2.5 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100" aria-label={`Open profile menu for ${user.name}`} aria-expanded={openMenu === 'profile'}>
              <img src={user.avatar} alt="" className="h-8 w-8 rounded-lg object-cover" />
              <span className="hidden max-w-28 text-left lg:block"><span className="block truncate text-xs font-extrabold text-slate-900">{user.name}</span><span className="block text-[10px] font-semibold capitalize text-slate-500">{user.role}</span></span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            </button>
            {openMenu === 'profile' && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                <div className="border-b border-slate-100 px-3 pb-3 pt-2"><p className="text-sm font-extrabold text-slate-950">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
                <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">View portal as</p>
                {ROLES.map(({ id, label, detail, icon: Icon }) => (
                  <button key={id} onClick={() => { onSwitchRole(id); setOpenMenu(null); }} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left transition ${user.role === id ? 'bg-blue-50 text-blue-950' : 'text-slate-700 hover:bg-slate-50'}`}>
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{label}</span><span className="block truncate text-[11px] text-slate-500">{detail}</span></span>{user.role === id && <Check className="h-4 w-4 text-blue-700" />}
                  </button>
                ))}
                <button onClick={() => { onOpenLogin(); setOpenMenu(null); }} className="mt-2 flex min-h-10 w-full items-center gap-2 rounded-xl border-t border-slate-100 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><User className="h-4 w-4" />Manage account</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
