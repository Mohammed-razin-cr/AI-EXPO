import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Bell,
  Globe,
  User,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  ChevronDown,
  CheckCircle2,
  X,
} from 'lucide-react';
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

const LANGUAGES = [
  { code: 'English', label: 'English (EN)' },
  { code: 'Hindi', label: 'हिन्दी (HI)' },
  { code: 'Spanish', label: 'Español (ES)' },
  { code: 'French', label: 'Français (FR)' },
  { code: 'Telugu', label: 'తెలుగు (TE)' },
];

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSwitchRole,
  onOpenAssistant,
  onOpenLogin,
  currentLanguage,
  onChangeLanguage,
  notifications,
  onMarkNotificationRead,
  activeTab,
  onSelectTab,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-900 text-slate-900 shadow-[0px_3px_0px_#0f172a] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            id="brand-logo-btn"
            title="Return to Campus360 Overview"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_#0f172a] transition-all">
              <GraduationCap className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900 uppercase font-mono">Campus360</span>
                <span className="px-1.5 py-0.2 text-[10px] font-black bg-emerald-300 text-slate-950 border border-slate-900 rounded shadow-[1px_1px_0px_#0f172a]">
                  AI HUB
                </span>
              </div>
              <p className="text-[10px] text-slate-600 hidden sm:block font-bold uppercase tracking-wider">
                Unified Student &amp; Academic Intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Campus Assistant Floating Trigger (shown in portal views, hidden on clean landing page) */}
          {activeTab !== 'landing' && (
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-yellow-300 hover:bg-yellow-400 text-slate-950 border-2 border-slate-900 shadow-[2.5px_2.5px_0px_#0f172a] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
              id="open-campus-assistant-btn"
            >
              <Bot className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span className="hidden sm:inline">Ask AI Assistant</span>
              <span className="sm:hidden">AI</span>
            </button>
          )}

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowRoleDropdown(false);
                setShowNotifPopover(false);
              }}
              className="p-2 rounded-xl text-slate-900 bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Change Language"
              id="lang-selector-btn"
            >
              <Globe className="w-4 h-4 text-slate-900 stroke-[2.5]" />
              <span className="hidden md:inline uppercase text-[11px] font-mono">{currentLanguage.slice(0, 3)}</span>
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_#0f172a] py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600 border-b-2 border-slate-900 bg-slate-50">
                  Select Language
                </div>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onChangeLanguage(l.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-yellow-100 transition-colors cursor-pointer font-bold ${
                      currentLanguage === l.code ? 'text-slate-950 bg-yellow-200' : 'text-slate-800'
                    }`}
                  >
                    <span>{l.label}</span>
                    {currentLanguage === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifPopover(!showNotifPopover);
                setShowRoleDropdown(false);
                setShowLangDropdown(false);
              }}
              className="relative p-2 rounded-xl text-slate-900 bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
              title="Campus Notifications"
              id="notifications-bell-btn"
            >
              <Bell className="w-4 h-4 stroke-[2.5]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifPopover && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border-2 border-slate-900 rounded-2xl shadow-[5px_5px_0px_#0f172a] py-2 z-50 overflow-hidden">
                <div className="px-4 py-2.5 flex items-center justify-between border-b-2 border-slate-900 bg-amber-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-950 uppercase tracking-wider">Campus Alerts</span>
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-400 text-slate-950 border border-slate-900">
                      {unreadCount} NEW
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifPopover(false)}
                    className="p-1 rounded-lg hover:bg-amber-200 text-slate-900 cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y-2 divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs font-bold text-slate-500">No new notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onMarkNotificationRead(n.id);
                          if (n.actionTab) {
                            onSelectTab(n.actionTab);
                            setShowNotifPopover(false);
                          }
                        }}
                        className={`p-3.5 cursor-pointer transition-colors hover:bg-yellow-50 ${
                          !n.read ? 'bg-amber-50/70 border-l-4 border-l-amber-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-black text-slate-900">{n.title}</p>
                          <span className="text-[10px] font-bold text-slate-500 shrink-0 font-mono">{n.timeAgo}</span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher & Account */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowLangDropdown(false);
                setShowNotifPopover(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 shadow-[2px_2px_0px_#0f172a] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs cursor-pointer font-bold"
              id="user-profile-menu-btn"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-900"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-black text-slate-900 truncate max-w-[100px] leading-tight">{user.name}</p>
                <p className="text-[9px] text-slate-600 uppercase tracking-wider font-extrabold">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-900 stroke-[2.5]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white border-2 border-slate-900 rounded-2xl shadow-[5px_5px_0px_#0f172a] py-2 z-50 overflow-hidden">
                <div className="px-3 pb-2.5 mb-1 border-b-2 border-slate-900 bg-slate-50">
                  <p className="text-xs font-black text-slate-950">{user.name}</p>
                  <p className="text-[11px] text-slate-600 font-medium">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-300 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                    {user.rollNo} • {user.role}
                  </span>
                </div>

                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Switch Active Role
                </div>

                <button
                  onClick={() => {
                    onSwitchRole('student');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors cursor-pointer font-bold ${
                    user.role === 'student' ? 'text-slate-950 bg-yellow-200 border-y border-slate-900' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                  <span>Student View (Alex R.)</span>
                </button>

                <button
                  onClick={() => {
                    onSwitchRole('faculty');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors cursor-pointer font-bold ${
                    user.role === 'faculty' ? 'text-slate-950 bg-yellow-200 border-y border-slate-900' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                  <span>Faculty View (Dr. Thorne)</span>
                </button>

                <button
                  onClick={() => {
                    onSwitchRole('admin');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors cursor-pointer font-bold ${
                    user.role === 'admin' ? 'text-slate-950 bg-yellow-200 border-y border-slate-900' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                  <span>Admin / Dean View</span>
                </button>

                <div className="border-t-2 border-slate-900 mt-2 pt-1">
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <User className="w-4 h-4 stroke-[2.5]" />
                    <span>Manage Authentication</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
