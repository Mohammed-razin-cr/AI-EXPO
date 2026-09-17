import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  CalendarDays,
  FileText,
  ShieldCheck,
  Sparkles,
  Search,
  Building2,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Vote,
} from 'lucide-react';
import {
  UserProfile,
  AcademicCourse,
  TimetableSlot,
  DocumentRequest,
  CampusNotification,
  CampusAnnouncement,
  SmartComplaint,
  HostelPass,
} from '../types';

interface LandingPageViewProps {
  onNavigate: (tab: string) => void;
  onOpenAssistant: () => void;
  currentUser: UserProfile;
  courses: AcademicCourse[];
  timetable: TimetableSlot[];
  documents: DocumentRequest[];
  notifications: CampusNotification[];
  announcements: CampusAnnouncement[];
  complaints?: SmartComplaint[];
  passes?: HostelPass[];
}

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  id: string;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = '#295632',
  width = 62,
  height = 22,
  id,
}) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 3;
  const paddingX = 2;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * usableWidth;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  });

  const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;
  const lastPoint = points[points.length - 1];
  const gradId = `sparkline-grad-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="metric-sparkline"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPoint.x} cy={lastPoint.y} r="2.2" fill={color} stroke="#ffffff" strokeWidth="1" />
    </svg>
  );
};

interface MetricItem {
  id: string;
  icon: React.ElementType;
  title: string;
  value: string | number;
  unit: string;
  trendText: string;
  trendTone: 'positive' | 'warning' | 'neutral';
  trendIcon: React.ElementType;
  sparkline: number[];
  sparklineColor: string;
  subtitle: string;
  targetTab: string;
  breakdownHeader: string;
  breakdown: { label: string; value: string }[];
  actionLabel: string;
}

const days: TimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigate,
  onOpenAssistant,
  currentUser,
  courses,
  timetable,
  documents,
  notifications,
  announcements,
  complaints,
}) => {
  const now = new Date();
  const today = now.toLocaleDateString('en-US', { weekday: 'long' });
  const [day, setDay] = useState<TimetableSlot['day']>(
    days.includes(today as TimetableSlot['day']) ? (today as TimetableSlot['day']) : 'Monday'
  );
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const schedule = timetable.filter(slot => slot.day === day);
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  // Role-specific metrics configuration
  const metrics: MetricItem[] = useMemo(() => {
    if (currentUser.role === 'faculty') {
      const todayLectures = timetable.filter(slot => slot.day === day).length;
      const pendingApprovals = documents.filter(d => d.status === 'submitted' || d.status === 'under_review').length;

      return [
        {
          id: 'faculty-schedule',
          icon: GraduationCap,
          title: 'Teaching schedule',
          value: courses.length,
          unit: 'courses',
          trendText: `${todayLectures > 0 ? todayLectures : 2} lectures today`,
          trendTone: 'positive',
          trendIcon: Clock,
          sparkline: [3, 4, 2, 4, 3],
          sparklineColor: '#295632',
          subtitle: '14 teaching hrs/wk · 184 students',
          targetTab: 'academic',
          breakdownHeader: 'Today’s Lecture Roster',
          breakdown: [
            { label: 'Next Lecture', value: 'CS301 (10:30 AM, Room 402)' },
            { label: 'Enrolled Students', value: '184 across 4 sections' },
            { label: 'Syllabus Progress', value: '68% completed' },
          ],
          actionLabel: 'View Teaching Timetable',
        },
        {
          id: 'faculty-attendance',
          icon: CheckCircle2,
          title: 'Student attendance',
          value: '89.2',
          unit: '% cohort avg',
          trendText: '3 at risk (<75%)',
          trendTone: 'warning',
          trendIcon: AlertCircle,
          sparkline: [91.0, 90.2, 88.5, 89.0, 89.2],
          sparklineColor: '#b45309',
          subtitle: 'CS301 highest attendance (94%)',
          targetTab: 'academic',
          breakdownHeader: 'Department Attendance',
          breakdown: [
            { label: 'Cohort Average', value: '89.2% attendance' },
            { label: 'Requiring Notice', value: '3 students < 75% cutoff' },
            { label: 'Finals Eligibility', value: '96.4% on track' },
          ],
          actionLabel: 'Inspect Attendance Registry',
        },
        {
          id: 'faculty-approvals',
          icon: FileText,
          title: 'Pending sign-offs',
          value: (pendingApprovals || 3).toString().padStart(2, '0'),
          unit: 'to sign',
          trendText: '2 urgent today',
          trendTone: 'warning',
          trendIcon: Clock,
          sparkline: [5, 4, 6, 2, pendingApprovals || 3],
          sparklineColor: '#b45309',
          subtitle: 'HOD & department clearance queue',
          targetTab: 'documents',
          breakdownHeader: 'Signature Queue',
          breakdown: [
            { label: 'Bonafide Requests', value: '2 student applications' },
            { label: 'Medical Leave', value: '1 student outpass endorse' },
            { label: 'Turnaround Target', value: '< 12 hours response' },
          ],
          actionLabel: 'Review Pending Signatures',
        },
        {
          id: 'faculty-circulars',
          icon: Sparkles,
          title: 'Faculty memos',
          value: announcements.length.toString().padStart(2, '0'),
          unit: 'notices',
          trendText: 'Senate meet tomorrow',
          trendTone: 'neutral',
          trendIcon: Sparkles,
          sparkline: [2, 3, 1, 4, announcements.length],
          sparklineColor: '#4e5b6d',
          subtitle: 'Academic Council & Grants',
          targetTab: 'announcements',
          breakdownHeader: 'Academic Circulars',
          breakdown: [
            { label: 'Next Assembly', value: 'Academic Senate (3:00 PM)' },
            { label: 'Grant Deadline', value: 'DST Proposal in 4 days' },
            { label: 'Circulars Active', value: `${announcements.length} published memos` },
          ],
          actionLabel: 'Open Faculty Circulars',
        },
      ];
    }

    if (currentUser.role === 'admin') {
      const openGrievances = (complaints || []).filter(c => c.status === 'open' || c.status === 'investigating').length || 8;
      const criticalCount = (complaints || []).filter(c => c.urgency === 'critical' || c.urgency === 'high').length || 2;
      const readyDocCount = documents.filter(d => d.status === 'ready').length || 4;
      const inWorkflowCount = documents.filter(d => d.status !== 'ready' && d.status !== 'rejected').length || 3;

      return [
        {
          id: 'admin-grievances',
          icon: AlertCircle,
          title: 'Campus grievances',
          value: openGrievances.toString().padStart(2, '0'),
          unit: 'open tickets',
          trendText: criticalCount > 0 ? `${criticalCount} high priority` : '85% resolved',
          trendTone: criticalCount > 0 ? 'warning' : 'positive',
          trendIcon: criticalCount > 0 ? AlertCircle : TrendingUp,
          sparkline: [16, 14, 15, 13, openGrievances],
          sparklineColor: criticalCount > 0 ? '#b45309' : '#295632',
          subtitle: `${(complaints || []).length || 12} tickets filed this term`,
          targetTab: 'complaints',
          breakdownHeader: 'Grievance Desk Status',
          breakdown: [
            { label: 'Active Queue', value: `${openGrievances} open tickets` },
            { label: 'Urgent Escalations', value: `${criticalCount} high priority` },
            { label: 'Mean Resolution', value: '18.4 hrs turnaround' },
          ],
          actionLabel: 'Manage Grievance Desk',
        },
        {
          id: 'admin-documents',
          icon: FileText,
          title: 'Verification pipeline',
          value: documents.length.toString().padStart(2, '0'),
          unit: 'requests',
          trendText: '+4 processed today',
          trendTone: 'positive',
          trendIcon: TrendingUp,
          sparkline: [12, 15, 14, 18, 16],
          sparklineColor: '#295632',
          subtitle: `${readyDocCount} sealed & dispatched`,
          targetTab: 'documents',
          breakdownHeader: 'Registrar Document Pipeline',
          breakdown: [
            { label: 'In Verification', value: `${inWorkflowCount} pending checks` },
            { label: 'Ready for Dispatch', value: `${readyDocCount} certificates sealed` },
            { label: 'Security Seals', value: '100% digital QR verified' },
          ],
          actionLabel: 'Open Document Queue',
        },
        {
          id: 'admin-facility',
          icon: Building2,
          title: 'Facility & hostels',
          value: '96',
          unit: '% uptime',
          trendText: '2 maintenance jobs',
          trendTone: 'neutral',
          trendIcon: CheckCircle2,
          sparkline: [94, 95, 95, 96, 96],
          sparklineColor: '#4e5b6d',
          subtitle: 'Falcon Hall & Mess audit passed',
          targetTab: 'hostel',
          breakdownHeader: 'Campus Operations',
          breakdown: [
            { label: 'Mess Hygiene Score', value: 'Grade A (98/100)' },
            { label: 'Active Work Orders', value: 'Falcon Hall plumbing/Wi-Fi' },
            { label: 'Backup Utilities', value: '100% generator test passed' },
          ],
          actionLabel: 'Inspect Campus Facilities',
        },
        {
          id: 'admin-broadcasts',
          icon: Sparkles,
          title: 'Live broadcasts',
          value: announcements.length.toString().padStart(2, '0'),
          unit: 'active',
          trendText: 'Campus-wide live',
          trendTone: 'positive',
          trendIcon: Sparkles,
          sparkline: [3, 4, 4, 5, announcements.length],
          sparklineColor: '#295632',
          subtitle: 'Published across campus portals',
          targetTab: 'announcements',
          breakdownHeader: 'Broadcast Network',
          breakdown: [
            { label: 'Live Bulletins', value: `${announcements.length} published notices` },
            { label: 'Urgent Alerts', value: '0 active (All Clear)' },
            { label: 'Channel Reach', value: '100% faculty & students' },
          ],
          actionLabel: 'Manage Campus Broadcasts',
        },
      ];
    }

    // Default: Student role
    const warnings = courses.filter(c => c.attendancePercentage < 75);
    const ready = documents.filter(d => d.status === 'ready').length;
    const pendingDocs = documents.filter(d => d.status === 'submitted' || d.status === 'under_review' || d.status === 'hod_approved').length;
    const unread = notifications.filter(n => !n.read).length;
    const gpaDelta = currentUser.currentGpa && currentUser.cgpa
      ? Number((currentUser.currentGpa - currentUser.cgpa).toFixed(2))
      : 0.28;

    return [
      {
        id: 'student-academic',
        icon: GraduationCap,
        title: 'Academic progress',
        value: currentUser.cgpa.toFixed(2),
        unit: '/ 10 CGPA',
        trendText: gpaDelta > 0 ? `+${gpaDelta} this sem` : '+0.28 this sem',
        trendTone: 'positive',
        trendIcon: TrendingUp,
        sparkline: [8.1, 8.35, 8.52, 8.68, 8.84, Number(currentUser.currentGpa?.toFixed(2) || 9.12)],
        sparklineColor: '#295632',
        subtitle: `${currentUser.semester} · Top 5% standing`,
        targetTab: 'academic',
        breakdownHeader: 'GPA Breakdown',
        breakdown: [
          { label: 'Current Term SGPA', value: `${currentUser.currentGpa?.toFixed(2) || '9.12'} (+0.28)` },
          { label: 'Cumulative CGPA', value: `${currentUser.cgpa.toFixed(2)} / 10.0` },
          { label: 'Completed Credits', value: '124 of 160 credits' },
        ],
        actionLabel: 'Open Academic Progress',
      },
      {
        id: 'student-attendance',
        icon: CheckCircle2,
        title: 'Attendance',
        value: currentUser.overallAttendance,
        unit: '%',
        trendText: currentUser.overallAttendance >= 75 ? '+1.2% this mo' : `${warnings.length} at risk`,
        trendTone: currentUser.overallAttendance >= 75 ? 'positive' : 'warning',
        trendIcon: currentUser.overallAttendance >= 75 ? TrendingUp : AlertCircle,
        sparkline: [80.5, 82.0, 83.2, 83.8, currentUser.overallAttendance],
        sparklineColor: currentUser.overallAttendance >= 75 ? '#295632' : '#b45309',
        subtitle: warnings.length ? `${warnings.length} course(s) below 75%` : 'All courses above the 75% target',
        targetTab: 'academic',
        breakdownHeader: 'Attendance Metrics',
        breakdown: [
          { label: 'Attended Classes', value: '174 of 206 sessions' },
          { label: 'Safe Absence Buffer', value: '18 classes safety margin' },
          { label: 'Lowest Course', value: warnings.length ? `${warnings[0].code} (${warnings[0].attendancePercentage}%)` : 'CS304 (78%)' },
        ],
        actionLabel: 'Inspect Course Attendance',
      },
      {
        id: 'student-documents',
        icon: FileText,
        title: 'Documents',
        value: ready.toString().padStart(2, '0'),
        unit: 'ready',
        trendText: pendingDocs > 0 ? `${pendingDocs} pending approval` : 'All ready',
        trendTone: pendingDocs > 0 ? 'warning' : 'neutral',
        trendIcon: pendingDocs > 0 ? Clock : CheckCircle2,
        sparkline: [1, 2, 1, 3, ready],
        sparklineColor: pendingDocs > 0 ? '#b45309' : '#4e5b6d',
        subtitle: `${documents.length} requests in your tracker`,
        targetTab: 'documents',
        breakdownHeader: 'Document Tracker',
        breakdown: [
          { label: 'Ready to Download', value: `${ready} certificates` },
          { label: 'In Review Pipeline', value: `${pendingDocs} pending verification` },
          { label: 'Estimated Lead Time', value: '24-48 hrs turnaround' },
        ],
        actionLabel: 'Open Document Vault',
      },
      {
        id: 'student-updates',
        icon: Clock,
        title: 'Campus updates',
        value: unread.toString().padStart(2, '0'),
        unit: 'unread',
        trendText: unread > 0 ? `+${unread} new` : 'Up to date',
        trendTone: unread > 0 ? 'positive' : 'neutral',
        trendIcon: unread > 0 ? Sparkles : CheckCircle2,
        sparkline: [1, 3, 2, 4, unread > 0 ? unread : 1],
        sparklineColor: '#295632',
        subtitle: 'Stay in the loop with campus',
        targetTab: 'announcements',
        breakdownHeader: 'Latest Bulletins',
        breakdown: [
          { label: 'Urgent Notification', value: notifications[0]?.title.slice(0, 26) || 'Mid-term schedule' },
          { label: 'Unread Notices', value: `${unread} require attention` },
          { label: 'Noticeboard Total', value: `${announcements.length} campus broadcasts` },
        ],
        actionLabel: 'Go to Noticeboard',
      },
    ];
  }, [currentUser, courses, timetable, documents, notifications, announcements, complaints, day]);

  return (
    <div className="overview">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR CAMPUS, CONNECTED</p>
          <h1>{greeting}, {currentUser.name.split(' ')[0]}<span className="greeting-dot">.</span></h1>
          <p>Here’s what’s happening in your corner of campus.</p>
        </div>
        <span className="date-chip">
          <CalendarDays size={16} aria-hidden="true" />
          {now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <div className="overview-banner">
        <div>
          <span className="eyebrow">A LITTLE LESS ADMIN. A LOT MORE CAMPUS.</span>
          <h2>Make room for what matters.</h2>
          <p>Your classes, requests and campus essentials. All right here.</p>
          <button className="primary-action" onClick={onOpenAssistant}>
            <Sparkles size={16} /> Ask Campus AI <ArrowRight size={16} />
          </button>
        </div>
        <div className="campus-art" aria-hidden="true">
          <div className="art-orbit" />
          <GraduationCap size={100} strokeWidth={1} />
          <span>LEARN. CONNECT. GROW.</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="metric-grid">
        {metrics.map(metric => (
          <div
            key={metric.id}
            className="metric"
            role="button"
            tabIndex={0}
            onClick={() => onNavigate(metric.targetTab)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNavigate(metric.targetTab);
            }}
            onMouseEnter={() => setActiveTooltipId(metric.id)}
            onMouseLeave={() => setActiveTooltipId(null)}
            onFocus={() => setActiveTooltipId(metric.id)}
            onBlur={() => setActiveTooltipId(null)}
          >
            {/* Top row with icon, title, and hover arrow */}
            <div className="metric-top-row">
              <div className="metric-top-left">
                <metric.icon size={15} className="metric-top-icon" aria-hidden="true" />
                <span>{metric.title}</span>
              </div>
              <ArrowRight size={14} className="metric-top-arrow" aria-hidden="true" />
            </div>

            {/* Value row with primary number and actionable trend chip */}
            <div className="metric-value-row">
              <strong>
                {metric.value}
                <small>{metric.unit}</small>
              </strong>
              <span
                className={`metric-trend metric-trend-${metric.trendTone} metric-trend-actionable`}
                role="button"
                tabIndex={0}
                title={`Quick jump: ${metric.actionLabel}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(metric.targetTab);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    e.preventDefault();
                    onNavigate(metric.targetTab);
                  }
                }}
              >
                <metric.trendIcon size={11} aria-hidden="true" />
                {metric.trendText}
                <ArrowRight size={9} aria-hidden="true" style={{ opacity: 0.65 }} />
              </span>
            </div>

            {/* Bottom row with subtitle and context-aware sparkline */}
            <div className="metric-sparkline-row">
              <p>{metric.subtitle}</p>
              <Sparkline
                data={metric.sparkline}
                color={metric.sparklineColor}
                id={`${currentUser.role}-${metric.id}`}
              />
            </div>

            {/* Interactive Tooltip / Micro-Breakdown Popover on Hover or Focus */}
            {activeTooltipId === metric.id && (
              <div
                className="metric-popover"
                role="tooltip"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="metric-popover-header">
                  <span>{metric.breakdownHeader}</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: '#627567' }}>Quick view</span>
                </div>
                <div className="metric-popover-list">
                  {metric.breakdown.map((row, idx) => (
                    <div key={idx} className="metric-popover-item">
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="metric-popover-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(metric.targetTab);
                  }}
                >
                  <span>{metric.actionLabel}</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-primary">
          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Your weekly schedule</h2>
                <p>A clear view of your next class.</p>
              </div>
              <button className="text-action" onClick={() => onNavigate('academic')}>
                Academics <ArrowRight size={14} />
              </button>
            </div>
            <div className="day-picker" aria-label="Schedule day">
              {days.map(d => (
                <button key={d} aria-pressed={d === day} onClick={() => setDay(d)}>
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
            <div className="schedule-list">
              {schedule.length ? (
                schedule.map((slot, i) => (
                  <div className="schedule-row" key={slot.id}>
                    <div className="schedule-time">
                      {slot.time.split(' - ')[0]}
                      <small>{slot.time.split(' - ')[1]}</small>
                    </div>
                    <div className={'schedule-detail schedule-tone-' + (i % 3)}>
                      <span className="course-meta">{slot.courseCode} · {slot.type}</span>
                      <h3>{slot.courseTitle}</h3>
                      <p>{slot.room} · {slot.instructor}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-schedule">
                  <CalendarDays />
                  <h3>No classes scheduled</h3>
                  <p>Choose another day to see your timetable.</p>
                </div>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Campus essentials</h2>
                <p>Less searching. More getting things done.</p>
              </div>
            </div>
            <div className="essentials">
              {[
                { id: 'documents', title: 'Request a document', desc: 'Certificates & transcripts', icon: FileText },
                { id: 'surveys', title: 'Campus surveys & polls', desc: 'Real-time voting & policy', icon: Vote },
                { id: 'campusfind', title: 'Lost something?', desc: 'Find it with CampusFind', icon: Search },
                { id: 'hostel', title: 'Hostel & dining', desc: 'Outpasses & mess menus', icon: Building2 },
                { id: 'complaints', title: 'Report an issue', desc: 'Get the right team on it', icon: AlertCircle },
              ].map(({ id, title, desc, icon: Icon }) => (
                <button key={id} onClick={() => onNavigate(id)}>
                  <span className="essential-icon">
                    <Icon size={20} />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{desc}</small>
                  </span>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="dashboard-secondary">
          <section className="protection-panel">
            <span className="feature-label">
              <ShieldCheck size={17} /> PROMISECHECK AI
            </span>
            <h2>Big promises?<br />Read between the lines.</h2>
            <p>Check education and job offers for risky terms before you commit.</p>
            <button onClick={() => onNavigate('promisecheck')}>
              Check an offer <ArrowRight size={16} />
            </button>
            <span className="quiet-note">AI guidance to support your decision</span>
          </section>

          <section className="panel notice-panel">
            <div className="section-heading">
              <h2>On the noticeboard</h2>
              <span className="small-count">{announcements.length}</span>
            </div>
            {announcements.slice(0, 3).map(a => (
              <button className="notice-row" key={a.id} onClick={() => onNavigate('announcements')}>
                <span className="course-meta">{a.category} · {a.date}</span>
                <strong>{a.title}</strong>
                <ArrowRight size={15} />
              </button>
            ))}
            <button className="text-action" onClick={() => onNavigate('announcements')}>
              View all notices <ArrowRight size={14} />
            </button>
          </section>
        </div>
      </div>

      <p className="demo-note">Demo campus workspace · Sample records for exploring student services</p>
    </div>
  );
};
