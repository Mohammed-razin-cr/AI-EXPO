import React, { useState } from 'react';
import { ArrowRight, CalendarDays, FileText, ShieldCheck, Sparkles, Search, Building2, GraduationCap, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { UserProfile, AcademicCourse, TimetableSlot, DocumentRequest, CampusNotification, CampusAnnouncement } from '../types';

interface LandingPageViewProps {
  onNavigate: (tab: string) => void;
  onOpenAssistant: () => void;
  currentUser: UserProfile;
  courses: AcademicCourse[];
  timetable: TimetableSlot[];
  documents: DocumentRequest[];
  notifications: CampusNotification[];
  announcements: CampusAnnouncement[];
}
const days: TimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate, onOpenAssistant, currentUser, courses, timetable, documents, notifications, announcements }) => {
  const now = new Date();
  const today = now.toLocaleDateString('en-US', { weekday: 'long' });
  const [day, setDay] = useState<TimetableSlot['day']>(days.includes(today as TimetableSlot['day']) ? today as TimetableSlot['day'] : 'Monday');
  const schedule = timetable.filter(slot => slot.day === day);
  const warnings = courses.filter(course => course.attendancePercentage < 75);
  const ready = documents.filter(doc => doc.status === 'ready').length;
  const unread = notifications.filter(n => !n.read).length;
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <div className="overview">
      <div className="page-heading">
        <div><p className="eyebrow">YOUR CAMPUS, CONNECTED</p><h1>{greeting}, {currentUser.name.split(' ')[0]}<span className="greeting-dot">.</span></h1><p>Here’s what’s happening in your corner of campus.</p></div>
        <span className="date-chip"><CalendarDays size={16} aria-hidden="true" />{now.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</span>
      </div>
      <div className="overview-banner">
        <div><span className="eyebrow">A LITTLE LESS ADMIN. A LOT MORE CAMPUS.</span><h2>Make room for what matters.</h2><p>Your classes, requests and campus essentials. All right here.</p><button className="primary-action" onClick={onOpenAssistant}><Sparkles size={16} /> Ask Campus AI <ArrowRight size={16} /></button></div>
        <div className="campus-art" aria-hidden="true"><div className="art-orbit"/><GraduationCap size={100} strokeWidth={1} /><span>LEARN. CONNECT. GROW.</span></div>
      </div>
      <div className="metric-grid">
        <button className="metric" onClick={() => onNavigate('academic')}><span><GraduationCap size={17}/> Academic progress <ArrowRight size={15}/></span><strong>{currentUser.role === 'student' ? currentUser.cgpa.toFixed(2) : courses.length}<small>{currentUser.role === 'student' ? '/ 10 CGPA' : 'courses'}</small></strong><p>{currentUser.semester}</p></button>
        <button className="metric" onClick={() => onNavigate('academic')}><span><CheckCircle2 size={17}/> Attendance <ArrowRight size={15}/></span><strong>{currentUser.overallAttendance}<small>%</small></strong><p>{warnings.length ? warnings.length + ' course(s) below 75%' : 'All courses above the 75% target'}</p></button>
        <button className="metric" onClick={() => onNavigate('documents')}><span><FileText size={17}/> Documents <ArrowRight size={15}/></span><strong>{ready.toString().padStart(2,'0')}<small>ready</small></strong><p>{documents.length} requests in your tracker</p></button>
        <button className="metric" onClick={() => onNavigate('announcements')}><span><Clock size={17}/> Updates <ArrowRight size={15}/></span><strong>{unread.toString().padStart(2,'0')}<small>unread</small></strong><p>Stay in the loop with campus</p></button>
      </div>
      <div className="dashboard-columns">
        <div className="dashboard-primary">
          <section className="panel">
            <div className="section-heading"><div><h2>Your weekly schedule</h2><p>A clear view of your next class.</p></div><button className="text-action" onClick={() => onNavigate('academic')}>Academics <ArrowRight size={14}/></button></div>
            <div className="day-picker" aria-label="Schedule day">{days.map(d => <button key={d} aria-pressed={d === day} onClick={() => setDay(d)}>{d.slice(0,3)}</button>)}</div>
            <div className="schedule-list">{schedule.length ? schedule.map((slot,i) => <div className="schedule-row" key={slot.id}><div className="schedule-time">{slot.time.split(' - ')[0]}<small>{slot.time.split(' - ')[1]}</small></div><div className={'schedule-detail schedule-tone-' + i % 3}><span className="course-meta">{slot.courseCode} · {slot.type}</span><h3>{slot.courseTitle}</h3><p>{slot.room} · {slot.instructor}</p></div></div>) : <div className="empty-schedule"><CalendarDays/><h3>No classes scheduled</h3><p>Choose another day to see your timetable.</p></div>}</div>
          </section>
          <section className="panel">
            <div className="section-heading"><div><h2>Campus essentials</h2><p>Less searching. More getting things done.</p></div></div>
            <div className="essentials">{[{id:'documents', title:'Request a document', desc:'Certificates & transcripts',icon:FileText},{id:'campusfind',title:'Lost something?',desc:'Find it with CampusFind',icon:Search},{id:'hostel',title:'Hostel & dining',desc:'Outpasses & mess menus',icon:Building2},{id:'complaints',title:'Report an issue',desc:'Get the right team on it',icon:AlertCircle}].map(({id,title,desc,icon:Icon}) => <button key={id} onClick={() => onNavigate(id)}><span className="essential-icon"><Icon size={20}/></span><span><strong>{title}</strong><small>{desc}</small></span><ArrowRight size={16}/></button>)}</div>
          </section>
        </div>
        <div className="dashboard-secondary">
          <section className="protection-panel"><span className="feature-label"><ShieldCheck size={17}/> PROMISECHECK AI</span><h2>Big promises?<br/>Read between the lines.</h2><p>Check education and job offers for risky terms before you commit.</p><button onClick={() => onNavigate('promisecheck')}>Check an offer <ArrowRight size={16}/></button><span className="quiet-note">AI guidance to support your decision</span></section>
          <section className="panel notice-panel"><div className="section-heading"><h2>On the noticeboard</h2><span className="small-count">{announcements.length}</span></div>{announcements.slice(0,3).map(a => <button className="notice-row" key={a.id} onClick={() => onNavigate('announcements')}><span className="course-meta">{a.category} · {a.date}</span><strong>{a.title}</strong><ArrowRight size={15}/></button>)}<button className="text-action" onClick={() => onNavigate('announcements')}>View all notices <ArrowRight size={14}/></button></section>
        </div>
      </div>
      <p className="demo-note">Demo campus workspace · Sample records for exploring student services</p>
    </div>
  );
};
