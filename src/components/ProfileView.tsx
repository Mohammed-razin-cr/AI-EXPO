import React, { useState, useMemo } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Key,
  Smartphone,
  Laptop,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  QrCode,
  Scan,
  Sparkles,
  Building2,
  Utensils,
  Heart,
  Printer,
  X,
  Plus,
  Trash2,
  ChevronRight,
  Settings,
  Bell,
  GraduationCap,
  Users,
  CreditCard,
  Radio,
  FileCheck,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { UserProfile, UserRole, ActiveSession, SecurityAuditEntry } from '../types';
import { YuktiLogo } from './YuktiLogo';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenAssistant: () => void;
  onOpenLogin?: (role?: UserRole) => void;
}

const PRESET_AVATARS = [
  { label: 'Student Alex (Default)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { label: 'Student Marcus', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
  { label: 'Student Priya', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
  { label: 'Student Kenji', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
  { label: 'Dr. Aris (Faculty)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { label: 'Dean Eleanor (Admin)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { label: 'Academic Lead Sarah', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
  { label: 'Research Scholar Leo', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onSwitchRole,
  onOpenAssistant,
  onOpenLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'personal' | 'living' | 'security' | 'preferences'>('dossier');
  const [isEditingPersonal, setIsEditingPersonal] = useState<boolean>(false);
  const [isDigitalIdModalOpen, setIsDigitalIdModalOpen] = useState<boolean>(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState<boolean>(false);
  const [customAvatarInput, setCustomAvatarInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable personal info local buffer
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || 'Suite 4B, Westside Campus Avenue, Metro District',
    bloodGroup: user.bloodGroup || 'O+ Positive',
    dateOfBirth: user.dateOfBirth || '2004-06-18',
    bio: user.bio || '',
    emergencyName: user.emergencyContact?.name || 'Elena Rivera',
    emergencyRelation: user.emergencyContact?.relation || 'Mother / Primary Guardian',
    emergencyPhone: user.emergencyContact?.phone || '+1 (555) 309-8422',
    emergencyAltPhone: user.emergencyContact?.alternatePhone || '+1 (555) 981-1140',
  });

  // Skills and clubs buffer
  const [skills, setSkills] = useState<string[]>(user.skills || ['Python', 'TypeScript', 'Distributed Systems', 'React']);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [clubs, setClubs] = useState<string[]>(user.clubs || ['ACM Student Chapter', 'Robotics Guild']);
  const [newClubInput, setNewClubInput] = useState<string>('');

  // Security state
  const [twoFactorActive, setTwoFactorActive] = useState<boolean>(user.twoFactorEnabled ?? true);
  const [showQrSimulation, setShowQrSimulation] = useState<boolean>(false);
  const [totpSimCode, setTotpSimCode] = useState<string>('482 910');
  const [sessions, setSessions] = useState<ActiveSession[]>(
    user.activeSessions || [
      { id: 'sess-1', device: 'MacBook Pro 16"', browser: 'Chrome 128.0', ip: '192.168.1.42 (Campus WiFi)', location: 'Academic Block 3', lastActive: 'Active Now', isCurrent: true },
      { id: 'sess-2', device: 'iPhone 15 Pro', browser: 'Yukti Mobile Web', ip: '10.24.12.89 (Hostel Cellular)', location: 'Falcon Hall Block-B', lastActive: '2 hours ago', isCurrent: false },
      { id: 'sess-3', device: 'Linux Workstation #14', browser: 'Firefox 129', ip: '172.16.8.10 (Lab)', location: 'CS Lab 4', lastActive: 'Yesterday, 18:40', isCurrent: false },
    ]
  );
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>(
    user.securityAuditLogs || [
      { id: 'aud-1', action: 'Digital Student ID Card NFC Access', category: 'hostel', timestamp: 'Today at 08:15 AM', ipAddress: 'Turnstile Terminal #04', status: 'success' },
      { id: 'aud-2', action: 'Campus Survey Vote Cast: Library 24/7 Access', category: 'profile', timestamp: 'Yesterday at 04:32 PM', ipAddress: '192.168.1.42', status: 'success' },
      { id: 'aud-3', action: 'Two-Factor Authentication (TOTP) Verified', category: 'auth', timestamp: '2 days ago', ipAddress: '192.168.1.42', status: 'info' },
    ]
  );

  // Password change form
  const [passwordState, setPasswordState] = useState({ current: '', next: '', confirm: '', show: false });
  const [pinState, setPinState] = useState({ currentPin: '', nextPin: '', confirmPin: '' });

  // Notifications preferences
  const [notifSettings, setNotifSettings] = useState(
    user.notificationSettings || {
      emailAlerts: true,
      pushAlerts: true,
      smsAlerts: false,
      examDeadlines: true,
      complaintUpdates: true,
      surveyReminders: true,
      hostelPassUpdates: true,
    }
  );

  // Digital ID Card Flip & Turnstile Tap
  const [idCardFlipped, setIdCardFlipped] = useState<boolean>(false);
  const [turnstileTapStatus, setTurnstileTapStatus] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      bloodGroup: formData.bloodGroup,
      dateOfBirth: formData.dateOfBirth,
      bio: formData.bio,
      skills,
      clubs,
      emergencyContact: {
        name: formData.emergencyName,
        relation: formData.emergencyRelation,
        phone: formData.emergencyPhone,
        alternatePhone: formData.emergencyAltPhone,
      },
    });
    setIsEditingPersonal(false);
    showToast('Personal information & dossier successfully updated and synced.');

    // Add audit log
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        action: 'Personal Dossier & Emergency Contacts Updated',
        category: 'profile',
        timestamp: 'Just now',
        ipAddress: '192.168.1.42',
        status: 'success',
      },
      ...prev,
    ]);
  };

  const handleSelectAvatar = (url: string) => {
    onUpdateUser({ avatar: url });
    setIsAvatarPickerOpen(false);
    showToast('Profile avatar updated.');
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim() || skills.includes(newSkillInput.trim())) return;
    const updated = [...skills, newSkillInput.trim()];
    setSkills(updated);
    setNewSkillInput('');
    onUpdateUser({ skills: updated });
    showToast(`Added skill: ${newSkillInput.trim()}`);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    onUpdateUser({ skills: updated });
  };

  const handleAddClub = () => {
    if (!newClubInput.trim() || clubs.includes(newClubInput.trim())) return;
    const updated = [...clubs, newClubInput.trim()];
    setClubs(updated);
    setNewClubInput('');
    onUpdateUser({ clubs: updated });
    showToast(`Added club: ${newClubInput.trim()}`);
  };

  const handleRemoveClub = (clubToRemove: string) => {
    const updated = clubs.filter((c) => c !== clubToRemove);
    setClubs(updated);
    onUpdateUser({ clubs: updated });
  };

  const handleRevokeSession = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast(`Session for ${target?.device || 'device'} has been revoked.`);
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        action: `Security Session Revoked (${target?.device || 'Device'})`,
        category: 'auth',
        timestamp: 'Just now',
        ipAddress: '192.168.1.42',
        status: 'warning',
      },
      ...prev,
    ]);
  };

  const handleToggle2FA = () => {
    const nextVal = !twoFactorActive;
    setTwoFactorActive(nextVal);
    onUpdateUser({ twoFactorEnabled: nextVal });
    if (nextVal) {
      setShowQrSimulation(true);
      showToast('Two-Factor Authentication activated.');
    } else {
      setShowQrSimulation(false);
      showToast('Two-Factor Authentication disabled.');
    }
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        action: `Two-Factor Authentication (2FA) ${nextVal ? 'Activated' : 'Deactivated'}`,
        category: 'auth',
        timestamp: 'Just now',
        ipAddress: '192.168.1.42',
        status: nextVal ? 'success' : 'warning',
      },
      ...prev,
    ]);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordState.current) {
      showToast('Please enter your current campus password.');
      return;
    }
    if (passwordState.next.length < 8) {
      showToast('New password must be at least 8 characters long.');
      return;
    }
    if (passwordState.next !== passwordState.confirm) {
      showToast('New password and confirmation do not match.');
      return;
    }
    setPasswordState({ current: '', next: '', confirm: '', show: false });
    showToast('Campus SSO password updated successfully.');
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        action: 'Campus SSO Password Successfully Changed',
        category: 'auth',
        timestamp: 'Just now',
        ipAddress: '192.168.1.42',
        status: 'success',
      },
      ...prev,
    ]);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinState.nextPin.length !== 4) {
      showToast('Exam portal PIN must be exactly 4 digits.');
      return;
    }
    if (pinState.nextPin !== pinState.confirmPin) {
      showToast('PIN confirmation does not match.');
      return;
    }
    setPinState({ currentPin: '', nextPin: '', confirmPin: '' });
    showToast('Digital exam terminal PIN reset.');
  };

  const handleToggleNotif = (key: keyof typeof notifSettings) => {
    const updated = { ...notifSettings, [key]: !notifSettings[key] };
    setNotifSettings(updated);
    onUpdateUser({ notificationSettings: updated });
    showToast('Notification preferences saved.');
  };

  const handleSimulateTurnstileTap = () => {
    setTurnstileTapStatus('Contactless NFC Reader active... scanning smart tag');
    setTimeout(() => {
      setTurnstileTapStatus(`Access Granted: Falcon Hall Turnstile #03 · Welcome ${user.name}`);
      setTimeout(() => setTurnstileTapStatus(null), 4000);
    }, 900);
  };

  const handleExportDossier = () => {
    const dossierData = {
      institution: 'Yukti University System',
      dossierGenerated: new Date().toISOString(),
      studentProfile: {
        ...user,
        skills,
        clubs,
        notificationSettings: notifSettings,
      },
    };
    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.rollNo}_Academic_Dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Official Academic Dossier exported as JSON.');
  };

  // Password strength calculation
  const passwordScore = useMemo(() => {
    const p = passwordState.next;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [passwordState.next]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-sm font-semibold animate-slideUp">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Profile Header Canvas */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
        {/* Cover Art Banner */}
        <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-[#0B2038] via-[#183153] to-[#2563eb] p-6 text-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/20">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                Verified Institutional Identity
              </span>
              <span className="hidden sm:inline-block rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
                PRN: {user.rollNo}
              </span>
            </div>

            {/* Quick Switch Role perspective */}
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md p-1 rounded-xl border border-white/15">
              <span className="text-[10px] uppercase font-bold text-slate-300 px-2">Role:</span>
              <button
                onClick={() => {
                  if (user.role === 'student') return;
                  if (onOpenLogin) onOpenLogin('student');
                  else onSwitchRole('student');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${user.role === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'}`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  if (user.role === 'faculty') return;
                  if (onOpenLogin) onOpenLogin('faculty');
                  else onSwitchRole('faculty');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${user.role === 'faculty' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'}`}
              >
                Faculty
              </button>
              <button
                onClick={() => {
                  if (user.role === 'admin') return;
                  if (onOpenLogin) onOpenLogin('admin');
                  else onSwitchRole('admin');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${user.role === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'}`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="font-mono">RFID TAG: {user.rfidCardNumber || 'RFID-9942-8812'}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Campus Session
            </span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
            {/* Avatar with edit button */}
            <div className="relative group">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-4 border-white bg-slate-100 shadow-lg overflow-hidden shrink-0">
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              </div>
              <button
                onClick={() => setIsAvatarPickerOpen(true)}
                className="absolute bottom-1 right-1 rounded-xl bg-slate-900/90 hover:bg-slate-950 text-white p-2 shadow-md transition transform group-hover:scale-105"
                title="Change Avatar"
                aria-label="Change profile photo"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              <button
                onClick={() => setIsDigitalIdModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-2 text-xs font-bold transition shadow-sm"
              >
                <CreditCard className="h-4 w-4" />
                Digital Campus ID
              </button>
              <button
                onClick={handleExportDossier}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-bold transition shadow-sm"
              >
                <Download className="h-4 w-4" />
                Export Dossier
              </button>
              <button
                onClick={onOpenAssistant}
                className="inline-flex items-center gap-2 rounded-xl bg-[#183153] hover:bg-[#22446e] text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                Ask Assistant
              </button>
            </div>
          </div>

          {/* Name & Academic Meta */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{user.name}</h1>
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-extrabold capitalize ${
                user.role === 'student' ? 'bg-blue-100 text-blue-800' : user.role === 'faculty' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {user.role === 'student' ? <GraduationCap className="h-3.5 w-3.5" /> : user.role === 'faculty' ? <Users className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                {user.role} Account
              </span>
              {user.academicStanding && (
                <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-3 py-0.5 text-xs font-bold">
                  ★ {user.academicStanding}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-slate-600">
              {user.department} &bull; {user.year} {user.semester ? `(${user.semester})` : ''}
            </p>

            {user.bio && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed pt-1">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex overflow-x-auto border-t border-slate-200 bg-slate-50/70 px-4 sm:px-6">
          {[
            { id: 'dossier', label: 'Academic Dossier', icon: Award },
            { id: 'personal', label: 'Personal & Contacts', icon: User },
            { id: 'living', label: 'Campus Services & Living', icon: Building2 },
            { id: 'security', label: 'Security & Access', icon: Lock },
            { id: 'preferences', label: 'Preferences & Privacy', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3.5 text-xs sm:text-sm font-bold transition ${
                  isActive
                    ? 'border-blue-600 text-blue-700 bg-white shadow-sm'
                    : 'border-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-100/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ACADEMIC DOSSIER */}
      {activeTab === 'dossier' && (
        <div className="space-y-6">
          {/* Top Performance Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cumulative CGPA</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{user.cgpa > 0 ? user.cgpa.toFixed(2) : 'N/A'}</span>
                <span className="text-xs text-slate-500 font-bold">/ 10.0</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1.5">Top 5% Departmental Ranking</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Current Semester GPA</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-blue-600">{user.currentGpa > 0 ? user.currentGpa.toFixed(2) : 'N/A'}</span>
                <span className="text-xs text-slate-500 font-bold">Semester 6</span>
              </div>
              <span className="text-[10px] text-blue-600 font-bold block mt-1.5">Certified via Senate Registry</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Overall Attendance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl sm:text-3xl font-black ${user.overallAttendance >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {user.overallAttendance}%
                </span>
                <span className="text-xs text-slate-500 font-bold">Min: 75%</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1.5">Eligible for Semester Finals</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Credits Completed</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{user.creditsCompleted || 118}</span>
                <span className="text-xs text-slate-500 font-bold">/ {user.creditsRequired || 160}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${Math.round(((user.creditsCompleted || 118) / (user.creditsRequired || 160)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Academic Profile Details Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Curriculum &amp; Registration Record</h2>
                <p className="text-xs text-slate-500">Official academic standing and degree progress details</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                <FileCheck className="h-4 w-4 text-emerald-600" />
                Matriculated 2023
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Degree Program</span>
                <span className="font-bold text-slate-800 mt-1 block">{user.degreeProgram || 'Bachelor of Technology (B.Tech)'}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Major Department</span>
                <span className="font-bold text-slate-800 mt-1 block">{user.department}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Faculty Academic Advisor</span>
                <span className="font-bold text-slate-800 mt-1 block">{user.advisor || 'Dr. Marcus Vance (CS Dept)'}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Student PRN / Roll No</span>
                <span className="font-mono font-bold text-slate-800 mt-1 block">{user.rollNo}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Library Card Number</span>
                <span className="font-mono font-bold text-slate-800 mt-1 block">{user.libraryCardNo || 'LIB-CS-2024-104'}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Academic Standing</span>
                <span className="font-bold text-emerald-700 mt-1 block">{user.academicStanding || "Dean's Honours List"}</span>
              </div>
            </div>

            {/* Technical Skills & Competencies */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Verified Technical &amp; Scholarly Competencies</h3>
                <span className="text-xs text-slate-400 font-semibold">{skills.length} skills listed</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded"
                      title="Remove skill"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Add new skill..."
                    className="rounded-xl border border-slate-200 px-3 py-1 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none w-32 sm:w-40"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="rounded-xl bg-blue-600 text-white p-1.5 hover:bg-blue-700"
                    title="Add skill"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Extracurricular Clubs & Societies */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Campus Societies &amp; Governance Roles</h3>
                <span className="text-xs text-slate-400 font-semibold">{clubs.length} registered</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {clubs.map((club) => (
                  <span
                    key={club}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-bold text-purple-900"
                  >
                    <Users className="h-3.5 w-3.5 text-purple-600" />
                    <span>{club}</span>
                    <button
                      onClick={() => handleRemoveClub(club)}
                      className="text-purple-400 hover:text-rose-600 p-0.5 rounded"
                      title="Leave society"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newClubInput}
                    onChange={(e) => setNewClubInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddClub()}
                    placeholder="Add society/role..."
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none w-36 sm:w-48"
                  />
                  <button
                    onClick={handleAddClub}
                    className="rounded-xl bg-purple-600 text-white p-2 hover:bg-purple-700"
                    title="Add club"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONAL & CONTACT INFORMATION */}
      {activeTab === 'personal' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Dossier &amp; Emergency Contacts</h2>
              <p className="text-xs text-slate-500">
                Official contact records used for institutional correspondence, health clinic, and guardian verification.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isEditingPersonal ? (
                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="rounded-xl bg-blue-600 text-white px-4 py-2 text-xs font-bold hover:bg-blue-700 transition shadow-sm"
                >
                  Edit Information
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 text-slate-600 px-4 py-2 text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSavePersonalInfo} className="space-y-6">
            {/* Primary Bio Data */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Primary Identification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    disabled={!isEditingPersonal}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Campus Institutional Email</label>
                  <input
                    type="email"
                    disabled={true}
                    value={formData.email}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-500 outline-none cursor-not-allowed"
                    title="Managed by University Identity Directory"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Mobile Phone</label>
                  <input
                    type="text"
                    disabled={!isEditingPersonal}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    disabled={!isEditingPersonal}
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group (Campus Health Record)</label>
                  <select
                    disabled={!isEditingPersonal}
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  >
                    {['A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'O+ Positive', 'O- Negative', 'AB+ Positive', 'AB- Negative'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Permanent Residential Address</label>
                  <input
                    type="text"
                    disabled={!isEditingPersonal}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bio Statement */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Bio / Academic Interests Statement</label>
              <textarea
                disabled={!isEditingPersonal}
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal disabled:bg-slate-50 disabled:text-slate-500 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none leading-relaxed"
                placeholder="Share a brief academic summary, goals, or research focus..."
              />
            </div>

            {/* Emergency Contacts Card */}
            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Designated Emergency &amp; Medical Contact</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    disabled={!isEditingPersonal}
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Relationship</label>
                  <input
                    type="text"
                    disabled={!isEditingPersonal}
                    value={formData.emergencyRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Emergency Phone</label>
                  <input
                    type="text"
                    disabled={!isEditingPersonal}
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Alternate Phone</label>
                  <input
                    type="text"
                    disabled={!isEditingPersonal}
                    value={formData.emergencyAltPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyAltPhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {isEditingPersonal && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 text-white px-5 py-2 text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                  Save &amp; Update Record
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: CAMPUS SERVICES & LIVING */}
      {activeTab === 'living' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hostel Residence Allocation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Hostel &amp; Residential Allocation</h2>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-extrabold">
                Active Resident
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Allocated Block:</span>
                <span className="font-bold text-slate-900">{user.hostelBlock}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Room Number:</span>
                <span className="font-bold text-slate-900">{user.roomNo} (2-Bed Air-Cooled)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Resident Warden:</span>
                <span className="font-bold text-slate-900">Prof. Kenneth Vance</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Monthly Outpass Quota:</span>
                <span className="font-bold text-blue-600">4 / 6 Passes Remaining</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Curfew In-Time:</span>
                <span className="font-bold text-slate-900">22:00 hrs (10:00 PM)</span>
              </div>
            </div>
          </div>

          {/* Mess & Dining Hall Services */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">Dining Hall &amp; Meal Subscription</h2>
              </div>
              <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-extrabold">
                Plan Alpha (All Meals)
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Assigned Mess:</span>
                <span className="font-bold text-slate-900">Falcon North Dining Hall</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Dietary Registration:</span>
                <span className="font-bold text-slate-900">Standard / Non-Veg Option</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Meal Card Status:</span>
                <span className="font-bold text-emerald-600">Active &bull; Biometric Verified</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Guest Coupons Remaining:</span>
                <span className="font-bold text-slate-900">3 Coupons</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Mess Fee Dues:</span>
                <span className="font-bold text-slate-900">$0.00 (Fully Settled)</span>
              </div>
            </div>
          </div>

          {/* Campus Library & Borrowing Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Central Library Membership</h2>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-extrabold">
                Good Standing
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Library Account No:</span>
                <span className="font-mono font-bold text-slate-900">{user.libraryCardNo || 'LIB-CS-2024-104'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Active Checked-Out Volumes:</span>
                <span className="font-bold text-slate-900">2 / 6 Books (CS601, CS602)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Nearest Return Due Date:</span>
                <span className="font-bold text-blue-600">Oct 04, 2026</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Digital IEEE/ACM Access:</span>
                <span className="font-bold text-emerald-600">Institutional SSO Enabled</span>
              </div>
            </div>
          </div>

          {/* Transportation, Parking & Locker Services */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">Transit &amp; Campus Amenities</h2>
              </div>
              <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-xs font-extrabold">
                Registered
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Bicycle / Vehicle Tag:</span>
                <span className="font-mono font-bold text-slate-900">TAG-CS-9912 (North Stand)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Campus Shuttle Pass:</span>
                <span className="font-bold text-emerald-600">Route 3 (Hostel &bull; CS Block)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Student Center Smart Locker:</span>
                <span className="font-bold text-slate-900">Locker #48 (Level 2)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Gymnasium &amp; Sports Complex:</span>
                <span className="font-bold text-purple-700">All-Access Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY, AUTHENTICATION & SESSIONS */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* 2FA & Password Management Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Two Factor Authentication */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 grid place-items-center">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Two-Factor Authentication (2FA)</h2>
                    <p className="text-xs text-slate-500">Time-based One-Time Password (TOTP)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    twoFactorActive ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                  aria-pressed={twoFactorActive}
                  aria-label="Toggle Two Factor Authentication"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      twoFactorActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Protect your institutional records, grade certificates, and outpass approvals. When logging in from an unrecognized terminal, a 6-digit verification code is required.
              </p>

              {twoFactorActive && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Authenticator App Paired
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowQrSimulation(!showQrSimulation)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      {showQrSimulation ? 'Hide QR' : 'Show Setup QR'}
                    </button>
                  </div>

                  {showQrSimulation && (
                    <div className="pt-2 border-t border-slate-200 flex flex-col items-center gap-2">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <QrCode className="h-28 w-28 text-slate-900" />
                      </div>
                      <span className="font-mono text-xs text-slate-600">SECRET KEY: <strong>YUKTI-2026-CAMPUS-X88</strong></span>
                      <p className="text-[11px] text-slate-400 text-center">Scan with Google Authenticator or 1Password</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500">Simulated TOTP Code:</span>
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {totpSimCode}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Change Campus Password */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 grid place-items-center">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Campus SSO Password</h2>
                  <p className="text-xs text-slate-500">Update your central university password</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                  <input
                    type={passwordState.show ? 'text' : 'password'}
                    value={passwordState.current}
                    onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">New Password</label>
                    <input
                      type={passwordState.show ? 'text' : 'password'}
                      value={passwordState.next}
                      onChange={(e) => setPasswordState({ ...passwordState, next: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                      placeholder="Min. 8 characters"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Confirm Password</label>
                    <input
                      type={passwordState.show ? 'text' : 'password'}
                      value={passwordState.confirm}
                      onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                      placeholder="Re-enter password"
                      required
                    />
                  </div>
                </div>

                {passwordState.next && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Password Strength</span>
                      <span className={passwordScore > 2 ? 'text-emerald-600' : 'text-amber-600'}>
                        {passwordScore <= 1 ? 'Weak' : passwordScore === 2 ? 'Moderate' : 'Strong'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full ${
                            passwordScore >= step
                              ? passwordScore > 2
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                              : 'bg-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setPasswordState({ ...passwordState, show: !passwordState.show })}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
                  >
                    {passwordState.show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    <span>{passwordState.show ? 'Hide password' : 'Show password'}</span>
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 hover:bg-slate-950 text-white px-4 py-2 font-bold transition shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Active Devices & Sessions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Active Authorized Sessions</h2>
                <p className="text-xs text-slate-500">Terminals and devices currently holding active campus tokens</p>
              </div>
              <span className="text-xs font-bold text-slate-500">{sessions.length} sessions active</span>
            </div>

            <div className="divide-y divide-slate-100">
              {sessions.map((sess) => (
                <div key={sess.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 grid place-items-center shrink-0 mt-0.5">
                      {sess.device.includes('iPhone') || sess.device.includes('Android') ? (
                        <Smartphone className="h-4 w-4" />
                      ) : (
                        <Laptop className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold">
                            This Device
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {sess.browser} &bull; {sess.location} &bull; <span className="font-mono">{sess.ip}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-medium text-slate-400">{sess.lastActive}</span>
                    {!sess.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(sess.id)}
                        className="rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 px-2.5 py-1 text-xs font-bold transition"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Audit History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Security &amp; Identity Audit Trail</h2>
                <p className="text-xs text-slate-500">Immutable chronological events logged across campus systems</p>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Verified System Log</span>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : log.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase">
                      {log.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="font-mono">{log.ipAddress}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PREFERENCES & PRIVACY */}
      {activeTab === 'preferences' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Notification Channels &amp; Campus Subscriptions</h2>
            <p className="text-xs text-slate-500">Configure how and when Yukti AI alerts you about events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'emailAlerts', title: 'Institutional Email Notifications', desc: 'Critical official dispatches, fee receipts, and Senate notices' },
              { key: 'pushAlerts', title: 'Browser & Mobile Push Alerts', desc: 'Real-time outpass status, survey releases, and timetable changes' },
              { key: 'smsAlerts', title: 'SMS Gatepass & Emergency Dispatch', desc: 'Urgent gate alerts and campus safety emergency broadcasts' },
              { key: 'examDeadlines', title: 'Exam Schedules & Assignment Alerts', desc: '48h countdown prior to midterms, lab evaluations, and grade releases' },
              { key: 'complaintUpdates', title: 'Grievance Resolution Updates', desc: 'Instant status changes and warden responses to filed tickets' },
              { key: 'surveyReminders', title: 'Campus Survey Influx & Reminders', desc: 'Invitations to vote on active campus policy polls' },
              { key: 'hostelPassUpdates', title: 'Hostel Outpass & Gate Clearance', desc: 'QR code verification alerts when leaving or entering campus gates' },
            ].map(({ key, title, desc }) => {
              const active = (notifSettings as any)[key] ?? true;
              return (
                <div key={key} className="flex items-start justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                  <div className="space-y-0.5 pr-3">
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotif(key as any)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      active ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                    aria-pressed={active}
                    aria-label={`Toggle ${title}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Campus Directory Privacy Controls</h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-sm">Directory Search Visibility</span>
                  <span className="text-slate-500">Allow peer students and study groups to look up your institutional profile</span>
                </div>
                <select className="rounded-xl border border-slate-200 px-3 py-1.5 font-bold text-slate-700 bg-white outline-none">
                  <option>Visible to Campus Community</option>
                  <option>Department Students &amp; Faculty Only</option>
                  <option>Restricted / Faculty Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: DIGITAL CAMPUS SMART ID CARD (FLIPPABLE 3D-LIKE PVC BADGE) */}
      {isDigitalIdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Digital Campus Smart Card</h3>
              </div>
              <button
                onClick={() => setIsDigitalIdModalOpen(false)}
                className="rounded-lg text-slate-400 hover:text-slate-700 p-1"
                aria-label="Close smart card modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Simulated Smart Card Body */}
            <div
              className={`w-full rounded-2xl p-6 text-white transition-all duration-500 shadow-xl select-none ${
                idCardFlipped
                  ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
                  : 'bg-gradient-to-br from-[#0B2038] via-[#143258] to-[#1e497d]'
              }`}
            >
              {!idCardFlipped ? (
                /* FRONT OF CARD */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-white/10 grid place-items-center border border-white/20">
                        <YuktiLogo size={18} variant="white" />
                      </div>
                      <div>
                        <span className="text-xs font-black tracking-wider block">YUKTI UNIVERSITY</span>
                        <span className="text-[9px] uppercase font-bold text-blue-300">Identity &amp; Access Credential</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                      {user.role}
                    </span>
                  </div>

                  {/* Chip & NFC Wave */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Simulated EMV Smart Chip */}
                    <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-200 border border-amber-500/50 shadow-inner flex flex-col justify-around p-1">
                      <div className="h-0.5 bg-amber-600/60 rounded"></div>
                      <div className="h-0.5 bg-amber-600/60 rounded"></div>
                    </div>
                    <Radio className="h-5 w-5 text-white/60 animate-pulse" />
                  </div>

                  {/* Photo & Main Details */}
                  <div className="flex items-center gap-4 pt-1">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-20 w-20 rounded-xl object-cover border-2 border-white/40 shadow"
                    />
                    <div className="space-y-0.5">
                      <span className="text-base font-extrabold leading-tight block">{user.name}</span>
                      <span className="text-xs text-blue-200 font-mono block">{user.rollNo}</span>
                      <span className="text-[11px] text-white/80 block">{user.department}</span>
                      <span className="text-[10px] text-white/60 block">{user.year} &bull; Blood: {user.bloodGroup || 'O+'}</span>
                    </div>
                  </div>

                  {/* Barcode & Expiry Bottom Strip */}
                  <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-white/70">
                    <span>VALID: 2023 - 2027</span>
                    <span>RFID: {user.rfidCardNumber || 'RFID-9942'}</span>
                  </div>
                </div>
              ) : (
                /* BACK OF CARD */
                <div className="space-y-4 text-xs text-white/80">
                  <div className="h-9 w-full bg-black/70 -mx-6 -mt-6 mb-2 rounded-t-xl"></div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/60 border-b border-white/15 pb-2">
                    <span>CAMPUS ID CARD 2026-27</span>
                    <span>AUTHORIZATION CODE: #88219</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <p className="text-white/90 font-bold">TERMS OF CREDENTIAL:</p>
                    <p className="text-white/60 leading-tight text-[10px]">
                      This smart credential is the property of Yukti University. Must be presented upon request to campus security, turnstiles, and examination invigilators.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-white/50 block">EMERGENCY DISPATCH</span>
                      <span className="font-mono text-xs font-bold text-white">+1 (555) 000-HELP</span>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg">
                      <QrCode className="h-10 w-10 text-slate-900" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Turnstile Tap Status */}
            {turnstileTapStatus && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{turnstileTapStatus}</span>
              </div>
            )}

            {/* Smart Card Controls */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => setIdCardFlipped(!idCardFlipped)}
                className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {idCardFlipped ? 'Show Front' : 'Flip to Back'}
              </button>
              <button
                onClick={handleSimulateTurnstileTap}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Radio className="h-3.5 w-3.5" />
                Tap at Turnstile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AVATAR PICKER / UPLOAD MODAL */}
      {isAvatarPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Choose Profile Picture</h3>
                <p className="text-xs text-slate-500">Select an institutional preset or provide a custom image URL</p>
              </div>
              <button
                onClick={() => setIsAvatarPickerOpen(false)}
                className="rounded-lg text-slate-400 hover:text-slate-700 p-1"
                aria-label="Close avatar picker"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Preset Avatars Grid */}
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAvatar(avatar.url)}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition p-0.5 ${
                    user.avatar === avatar.url ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-400'
                  }`}
                  title={avatar.label}
                >
                  <img src={avatar.url} alt={avatar.label} className="h-16 w-full object-cover rounded-xl" />
                  {user.avatar === avatar.url && (
                    <span className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Image URL Input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Or Paste Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                />
                <button
                  onClick={() => {
                    if (customAvatarInput.trim()) {
                      handleSelectAvatar(customAvatarInput.trim());
                      setCustomAvatarInput('');
                    }
                  }}
                  className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold hover:bg-slate-950"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
