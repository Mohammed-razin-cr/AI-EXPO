import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  FileText,
  AlertCircle,
  Home as HomeIcon,
  Megaphone,
  MessageSquare,
  BarChart3,
  Bot,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Search,
  Users,
  Clock,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  QrCode,
  Globe2,
  Building2,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LandingPageViewProps {
  onNavigate: (tab: string) => void;
  onOpenAssistant: (prompt?: string) => void;
  onSwitchRole: (role: UserRole) => void;
  currentUser: UserProfile;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigate,
  onOpenAssistant,
  onSwitchRole,
  currentUser,
}) => {
  const CORE_MODULES = [
    {
      id: 'academic',
      title: 'Academic Intelligence & Schedule',
      desc: 'Real-time CGPA tracker, attendance threshold warnings (<75% exam cutoff), syllabus progress, and daily lecture timetable.',
      icon: GraduationCap,
      badge: 'Core ERP',
      color: 'indigo',
    },
    {
      id: 'promisecheck',
      title: 'PromiseCheck AI — Claim Auditor',
      desc: 'Consumer decision support before paying fees. Audit deceptive 100% placement claims, NBFC loan traps, and fine-print conditions.',
      icon: ShieldCheck,
      badge: 'Decision Support',
      highlight: true,
      color: 'amber',
    },
    {
      id: 'campusfind',
      title: 'CampusFind — AI Lost & Found',
      desc: 'Gemini vision-assisted matching, instant category filters, and secure verification to reunite students with misplaced belongings.',
      icon: Sparkles,
      badge: 'AI Vision Match',
      teal: true,
      color: 'teal',
    },
    {
      id: 'documents',
      title: 'Instant Digital Registrar',
      desc: 'Generate digitally signed Bonafide certificates, fee estimates, NOCs, and transcripts in seconds with verifiable QR seals.',
      icon: FileText,
      badge: '1-Click Certs',
      color: 'blue',
    },
    {
      id: 'complaints',
      title: 'Smart Grievance & SLA Triage',
      desc: 'Automated urgency classification (Emergency to Low), sentiment scoring, and direct routing to maintenance, wardens, or HODs.',
      icon: AlertCircle,
      badge: 'Auto-Routing',
      color: 'rose',
    },
    {
      id: 'hostel',
      title: 'Hostel Outpass & Dining Hub',
      desc: 'Gate-scannable QR outpasses, daily live mess menus with nutritional breakdown, and room inventory management.',
      icon: Building2,
      badge: 'QR Gate Pass',
      color: 'emerald',
    },
    {
      id: 'announcements',
      title: 'Campus Broadcasts & Alerts',
      desc: 'High-priority administrative notices, mid-term circulars, hackathon registrations, and emergency campus feeds.',
      icon: Megaphone,
      badge: 'Push Notices',
      color: 'purple',
    },
    {
      id: 'feedback',
      title: 'Student Voice & Teaching Pulse',
      desc: 'Course evaluation surveys, cafeteria feedback, and faculty teaching ratings ensuring transparent campus governance.',
      icon: MessageSquare,
      badge: 'Governance',
      color: 'sky',
    },
    {
      id: 'admin',
      title: 'Admin Intelligence Command',
      desc: 'Executive analytics, student retention metrics, resolution SLA times, department performance, and audit trails.',
      icon: BarChart3,
      badge: 'Leadership',
      color: 'slate',
    },
  ];

  const SAMPLE_QUERIES = [
    {
      label: 'Audit a 100% Placement Bootcamp',
      tab: 'promisecheck',
      icon: ShieldAlert,
    },
    {
      label: 'Check My Mid-Term Attendance in CS601',
      tab: 'academic',
      icon: GraduationCap,
    },
    {
      label: 'Request Bonafide Certificate for Visa/Loan',
      tab: 'documents',
      icon: FileCheck2,
    },
    {
      label: 'Search for Lost AirPods in Main Library',
      tab: 'campusfind',
      icon: Search,
    },
    {
      label: 'Generate Weekend Outpass for Hostel Gate',
      tab: 'hostel',
      icon: QrCode,
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden neo-card bg-[#FFFDF9] border-2 border-slate-900 p-6 sm:p-10 lg:p-12 shadow-[5px_5px_0px_#0f172a]">
        {/* Subtle retro dot pattern */}
        <div className="absolute inset-0 neo-grid-pattern opacity-40 pointer-events-none -z-0" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Super-Header Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="neo-pill bg-yellow-200 text-slate-950 font-black">
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              Unified Campus Intelligence
            </span>
            <span className="neo-pill bg-orange-300 text-slate-950 font-black">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              PromiseCheck™ Decision Support
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
            Where Academic Intelligence Meets{' '}
            <span className="bg-yellow-300 px-2 py-0.5 border-2 border-slate-900 rounded-xl shadow-[2.5px_2.5px_0px_#0f172a] inline-block">
              Student Protection.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
            Campus360 AI streamlines attendance tracking, smart grievance auto-triage, and instant signed registrar documents — alongside{' '}
            <strong className="text-slate-950 font-black bg-orange-100 px-1 border border-slate-900 rounded">PromiseCheck AI</strong>, our consumer auditor safeguarding students from deceptive &ldquo;100% placement&rdquo; coaching promises and hidden loan traps.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('academic')}
              className="neo-btn bg-slate-950 hover:bg-slate-800 text-white px-6 py-3.5 text-sm font-black shadow-[3.5px_3.5px_0px_#0f172a]"
              id="landing-enter-portal-btn"
            >
              <GraduationCap className="w-4 h-4 stroke-[2.5]" />
              <span>Enter Student Portal</span>
              <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
            </button>

            <button
              onClick={() => onNavigate('promisecheck')}
              className="neo-btn bg-orange-400 hover:bg-orange-500 text-slate-950 px-6 py-3.5 text-sm font-black shadow-[3.5px_3.5px_0px_#0f172a]"
              id="landing-try-promisecheck-btn"
            >
              <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              <span>Audit Coaching &amp; Job Claims</span>
            </button>

            <button
              onClick={() => onOpenAssistant()}
              className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 px-5 py-3.5 text-sm font-black shadow-[3.5px_3.5px_0px_#0f172a]"
              id="landing-assistant-btn"
            >
              <Bot className="w-4 h-4 stroke-[2.5]" />
              <span>Ask Campus AI</span>
            </button>
          </div>

          {/* Live Persona Indicator */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-700 font-bold">
            <span>Currently exploring as:</span>
            <span className="font-black text-slate-950 bg-white px-2.5 py-1 rounded-lg border-1.5 border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]">
              {currentUser.name} ({currentUser.role.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-10 pt-8 border-t-2 border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center p-3.5 rounded-xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
            <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">12,450+</div>
            <div className="text-[11px] font-black text-slate-600 uppercase tracking-wider mt-0.5">
              Active Campus Users
            </div>
          </div>

          <div className="text-center p-3.5 rounded-xl bg-orange-100 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
            <div className="text-2xl sm:text-3xl font-black text-orange-950 font-mono">₹42.8 Lakhs</div>
            <div className="text-[11px] font-black text-orange-900 uppercase tracking-wider mt-0.5">
              Fraud Fees Prevented
            </div>
          </div>

          <div className="text-center p-3.5 rounded-xl bg-sky-100 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
            <div className="text-2xl sm:text-3xl font-black text-sky-950 font-mono">2.4 Hours</div>
            <div className="text-[11px] font-black text-sky-900 uppercase tracking-wider mt-0.5">
              Avg. Grievance SLA
            </div>
          </div>

          <div className="text-center p-3.5 rounded-xl bg-emerald-100 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">100% Digital</div>
            <div className="text-[11px] font-black text-emerald-900 uppercase tracking-wider mt-0.5">
              Verifiable QR Certs
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Innovation Spotlight: PromiseCheck AI */}
      <section className="neo-card bg-orange-50 border-2 border-slate-900 p-6 sm:p-10 shadow-[5px_5px_0px_#0f172a] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="neo-pill bg-orange-300 text-slate-950 font-black">
              <ShieldAlert className="w-3.5 h-3.5 stroke-[2.5]" />
              Featured Innovation
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              PromiseCheck AI: Stop Predatory Fee Exploitation Before You Sign.
            </h2>

            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              Every academic year, thousands of college students lose savings to private bootcamps and coaching centers advertising <strong className="text-slate-950 font-black bg-orange-200 px-1 border border-slate-900 rounded">&ldquo;100% Placement Guarantee&rdquo;</strong>, <strong className="text-slate-950 font-black bg-orange-200 px-1 border border-slate-900 rounded">&ldquo;Pay After Placement&rdquo;</strong>, or <strong className="text-slate-950 font-black bg-orange-200 px-1 border border-slate-900 rounded">&ldquo;Govt-Recognized Certification&rdquo;</strong>. PromiseCheck AI is the consumer decision support tool that deconstructs the fine print.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong>Extracts Hidden Asterisks:</strong> Discovers unwritten 95% attendance and internal test hurdles.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong>NBFC Loan Detection:</strong> Flags when an &ldquo;ISA&rdquo; is actually a high-interest third-party debt.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong>Missing Evidence Audit:</strong> Checks for missing GSTIN, unverified trainers, and phantom logos.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong>Counselor Interrogation Kit:</strong> Generates 5 precise counter-questions to ask before paying.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('promisecheck')}
                className="neo-btn bg-orange-400 hover:bg-orange-500 text-slate-950 px-5 py-2.5 text-xs font-black shadow-[3px_3px_0px_#0f172a]"
              >
                <span>Audit Your First Offer Poster</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <div className="w-full lg:w-84 bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] space-y-4 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                Live Audit Sample
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-rose-200 text-rose-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                High Risk (88/100)
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-black text-slate-950 leading-tight text-sm">
                &ldquo;Apex Silicon Tech: 100% Guaranteed ₹12 LPA Placement or Full Fee Refund!&rdquo;
              </p>
              <div className="p-3 rounded-xl bg-orange-100 border border-slate-900 text-[11px] text-slate-900 space-y-1 font-medium">
                <span className="font-black block text-rose-700">Critical Red Flag:</span>
                <span>The enrollment contract binds the student to an irreversible NBFC personal loan. Refund only applies if 100+ interviews attended.</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('promisecheck')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-black transition-all text-center block cursor-pointer border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
            >
              Run Full Diagnostic →
            </button>
          </div>
        </div>
      </section>

      {/* Quick Interactive Prompt Launcher */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">
              Instant Action Shortcuts
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Jump directly to high-priority student tasks with one click
            </p>
          </div>
          <button
            onClick={() => onOpenAssistant()}
            className="text-xs font-black text-slate-900 hover:underline flex items-center gap-1.5 cursor-pointer bg-yellow-200 px-2.5 py-1 rounded-lg border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]"
          >
            <Bot className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Open AI Chat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SAMPLE_QUERIES.map((q, idx) => {
            const Icon = q.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(q.tab)}
                className="text-left p-3.5 neo-card-interactive bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-200 border-1.5 border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a] flex items-center justify-center text-slate-950 group-hover:scale-105 transition-transform shrink-0">
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-black transition-colors">
                    {q.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-900 stroke-[2.5] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Comprehensive Subsystems Directory */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-900 pb-3">
          <div>
            <h3 className="text-xl font-black text-slate-950">
              Campus Intelligence Ecosystem
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Unified modules serving over 12,000 students, faculty, and administrators
            </p>
          </div>
          <span className="text-xs font-black text-slate-900 bg-yellow-200 px-2.5 py-1 rounded-lg border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]">
            9 Integrated Subsystems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CORE_MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => onNavigate(module.id)}
                className={`p-5 rounded-2xl border-2 border-slate-900 shadow-[3.5px_3.5px_0px_#0f172a] transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#0f172a] ${
                  module.highlight
                    ? 'bg-orange-50'
                    : module.teal
                    ? 'bg-teal-50'
                    : 'bg-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-transform group-hover:scale-105 ${
                        module.highlight
                          ? 'bg-orange-400 text-slate-950'
                          : module.teal
                          ? 'bg-teal-300 text-slate-950'
                          : 'bg-yellow-200 text-slate-950'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_#0f172a] ${
                        module.highlight
                          ? 'bg-orange-200 text-slate-950'
                          : module.teal
                          ? 'bg-teal-200 text-slate-950'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      {module.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-950 group-hover:text-black transition-colors">
                      {module.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {module.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs font-black text-slate-900 group-hover:translate-x-1 transition-transform">
                  <span>Open {module.title.split('—')[0].trim()}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Multi-Role Switcher Sandbox */}
      <section className="neo-card bg-white border-2 border-slate-900 p-6 sm:p-8 space-y-5 shadow-[5px_5px_0px_#0f172a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-950">
              Simulate Campus Roles &amp; Permissions
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Switch roles to experience how views, approvals, and metrics dynamically reconfigure
            </p>
          </div>
          <span className="text-xs font-black text-slate-900 bg-amber-200 px-2.5 py-1 rounded-lg border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]">
            Instant Persona Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Student */}
          <button
            onClick={() => {
              onSwitchRole('student');
              onNavigate('academic');
            }}
            className={`p-4 rounded-2xl border-2 border-slate-900 text-left transition-all cursor-pointer ${
              currentUser.role === 'student'
                ? 'bg-yellow-200 shadow-[4px_4px_0px_#0f172a]'
                : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#0f172a]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-white border-1.5 border-slate-900 text-slate-950 shadow-[1px_1px_0px_#0f172a]">
                <GraduationCap className="w-4 h-4 stroke-[2.5]" />
              </span>
              {currentUser.role === 'student' && (
                <span className="text-[10px] font-black text-slate-950 bg-emerald-300 border border-slate-900 px-2 py-0.5 rounded shadow-[1px_1px_0px_#0f172a]">
                  ACTIVE
                </span>
              )}
            </div>
            <h4 className="font-black text-sm text-slate-950">Student Persona</h4>
            <p className="text-[11px] text-slate-700 mt-0.5 font-medium">
              Aarav Sharma • 6th Sem B.Tech CS • Timetables, Pass Requests, PromiseCheck
            </p>
          </button>

          {/* Faculty */}
          <button
            onClick={() => {
              onSwitchRole('faculty');
              onNavigate('academic');
            }}
            className={`p-4 rounded-2xl border-2 border-slate-900 text-left transition-all cursor-pointer ${
              currentUser.role === 'faculty'
                ? 'bg-yellow-200 shadow-[4px_4px_0px_#0f172a]'
                : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#0f172a]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-white border-1.5 border-slate-900 text-slate-950 shadow-[1px_1px_0px_#0f172a]">
                <Users className="w-4 h-4 stroke-[2.5]" />
              </span>
              {currentUser.role === 'faculty' && (
                <span className="text-[10px] font-black text-slate-950 bg-emerald-300 border border-slate-900 px-2 py-0.5 rounded shadow-[1px_1px_0px_#0f172a]">
                  ACTIVE
                </span>
              )}
            </div>
            <h4 className="font-black text-sm text-slate-950">Faculty Persona</h4>
            <p className="text-[11px] text-slate-700 mt-0.5 font-medium">
              Dr. Priya Sundaram • Associate Professor • Attendance, Syllabus, Approvals
            </p>
          </button>

          {/* Admin */}
          <button
            onClick={() => {
              onSwitchRole('admin');
              onNavigate('admin');
            }}
            className={`p-4 rounded-2xl border-2 border-slate-900 text-left transition-all cursor-pointer ${
              currentUser.role === 'admin'
                ? 'bg-yellow-200 shadow-[4px_4px_0px_#0f172a]'
                : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#0f172a]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-white border-1.5 border-slate-900 text-slate-950 shadow-[1px_1px_0px_#0f172a]">
                <BarChart3 className="w-4 h-4 stroke-[2.5]" />
              </span>
              {currentUser.role === 'admin' && (
                <span className="text-[10px] font-black text-slate-950 bg-emerald-300 border border-slate-900 px-2 py-0.5 rounded shadow-[1px_1px_0px_#0f172a]">
                  ACTIVE
                </span>
              )}
            </div>
            <h4 className="font-black text-sm text-slate-950">University Admin</h4>
            <p className="text-[11px] text-slate-700 mt-0.5 font-medium">
              Office of Academic Dean • Institution KPIs, Grievance SLAs, Certificates
            </p>
          </button>
        </div>
      </section>

      {/* University Trust & Verification Footer Banner */}
      <section className="p-6 rounded-2xl bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-300 text-slate-950 flex items-center justify-center shrink-0 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-950">
              Certified Academic &amp; Consumer Protection Standard
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Campus360 AI is compliant with NEP 2020 digital record governance and consumer defense guidelines.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('promisecheck')}
          className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 px-4 py-2 text-xs font-black shrink-0 shadow-[2.5px_2.5px_0px_#0f172a]"
        >
          Explore PromiseCheck AI →
        </button>
      </section>
    </div>
  );
};
