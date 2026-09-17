import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, GraduationCap, ShieldCheck, CalendarDays, FileText, Check, CheckCircle2, Sparkles, LayoutDashboard, Search, Building2, Menu, X, Plus, Users, BarChart3, MessageSquare, Clock } from 'lucide-react';
import { UserRole } from '../types';
import { INITIAL_USER_STUDENT, SAMPLE_DOCUMENTS, SAMPLE_COURSES, SAMPLE_TIMETABLE } from '../data/mockData';
import '../public-landing.css';
import '../landing-motion.css';
import { Pause, Play, ScanLine } from 'lucide-react';
import { ServiceIllustration, RoleEmblem } from './LandingVisuals';

interface Props { onNavigate: (id: string) => void; onExploreRole: (role: UserRole) => void; }
const features = [
  { icon: CalendarDays, title: 'Stay one step ahead.', text: 'Your timetable, grades and attendance together. Know where you stand before the next class.', action: 'Explore academics', route: 'academic', number: '01' },
  { icon: FileText, title: 'Skip the office queue.', text: 'Request certificates and transcripts, follow each approval, and see when your document is ready.', action: 'View document services', route: 'documents', number: '02' },
  { icon: Search, title: 'Find your campus rhythm.', text: 'Lost belongings, hostel outpasses, dining menus and campus updates. The everyday details, connected.', action: 'Discover CampusFind', route: 'campusfind', number: '03' },
];
const questions = [
  ['What can I explore in the demo?', 'Explore schedules and attendance, request documents, report campus issues, browse lost and found items, and try PromiseCheck. The workspace uses sample campus records.'],
  ['Is Yukti AI only for students?', 'No. You can switch between student, faculty and administrator demo views. Each brings a different perspective on campus services and institutional information.'],
  ['How does PromiseCheck help?', 'It helps you examine education and job offers for unclear guarantees, missing evidence and risky conditions. Its analysis supports your research; it does not certify an offer or replace professional advice.'],
  ['Does the AI need an API key?', 'The assistant, offer analysis and reports need a Gemini or Groq key configured on the server. Poster analysis requires Gemini. CampusFind uses a downloaded local MiniLM model; complaint routing can use local rules without a key.'],
];

export function PublicLandingPage({ onNavigate, onExploreRole }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('pl-in-view', entry.isIntersecting));
    }, { threshold: 0.12 });
    rootRef.current?.querySelectorAll('.pl-feature, .pl-role, .pl-audit-preview, .pl-hero-visual').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const tiltCard = (event: React.PointerEvent<HTMLElement>) => {
    if (motionPaused || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--tilt-x', ((event.clientY - box.top) / box.height * -5 + 2.5) + 'deg');
    event.currentTarget.style.setProperty('--tilt-y', ((event.clientX - box.left) / box.width * 5 - 2.5) + 'deg');
  };
  const resetTilt = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };
  return <div ref={rootRef} className="public-landing" data-motion={motionPaused ? 'paused' : 'active'}>
    <button className="pl-motion-toggle" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? <Play size={14}/> : <Pause size={14}/>} {motionPaused ? 'Resume motion' : 'Pause motion'}</button>
    <a className="pl-skip" href="#public-main" onClick={event => { event.preventDefault(); document.getElementById('public-main')?.focus(); }}>Skip to content</a>
    <header className="pl-header">
      <div className="pl-nav-wrap">
        <button className="pl-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} aria-label="Yukti AI home"><span className="pl-brand-mark"><GraduationCap size={24}/></span>yukti ai<span className="pl-brand-dot">.</span></button>
        <nav className="pl-desktop-nav" aria-label="Landing page"><button onClick={() => scrollTo('pl-platform')}>The platform</button><button onClick={() => scrollTo('pl-promise')}>PromiseCheck AI <span>NEW</span></button><button onClick={() => scrollTo('pl-people')}>For your campus</button></nav>
        <div className="pl-nav-actions"><button className="pl-nav-login" onClick={() => onNavigate('overview')}>Open dashboard <ArrowUpRight size={16}/></button><button className="pl-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="pl-mobile-nav" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X/> : <Menu/>}</button></div>
      </div>
      {menuOpen && <nav id="pl-mobile-nav" aria-label="Mobile landing navigation" onKeyDown={event => { if (event.key === 'Escape') { setMenuOpen(false); document.querySelector<HTMLButtonElement>('.pl-menu-toggle')?.focus(); } }}><button onClick={() => scrollTo('pl-platform')}>The platform</button><button onClick={() => scrollTo('pl-promise')}>PromiseCheck AI</button><button onClick={() => scrollTo('pl-people')}>For your campus</button><button onClick={() => onNavigate('overview')}>Open dashboard <ArrowRight size={16}/></button></nav>}
    </header>
    <main id="public-main" tabIndex={-1}>
      <section className="pl-hero pl-container">
        <div className="pl-hero-copy">
          <div className="pl-kicker"><span/> A BETTER WAY TO CAMPUS</div>
          <h1>More campus.<br/>Less <span>complicated.</span></h1>
          <p>Make the most of student life. Bring your academics, everyday services and smarter decisions together in one thoughtful workspace.</p>
          <div className="pl-hero-actions"><button className="pl-button pl-button-dark" onClick={() => onExploreRole('student')}>Explore your campus <ArrowRight size={18}/></button><button className="pl-text-button" onClick={() => scrollTo('pl-platform')}>See how it works <span>↓</span></button></div>
          <div className="pl-hero-note"><span><Check size={14}/> Interactive demo</span><span><Check size={14}/> No sign-up needed</span></div>
        </div>
        <div className="pl-hero-visual">
          <div className="pl-orbit pl-orbit-one"/><div className="pl-orbit pl-orbit-two"/>
          <div className="pl-preview">
            <div className="pl-preview-top"><span><GraduationCap size={17}/> yukti ai.</span><span className="pl-demo-tag">WORKSPACE PREVIEW</span></div>
            <div className="pl-preview-body">
              <div className="pl-preview-rail" aria-hidden="true"><LayoutDashboard/><CalendarDays/><FileText/><MessageSquare/><Building2/></div>
              <div className="pl-preview-content"><div className="pl-preview-welcome"><span>YOUR EVERYDAY, ORGANIZED</span><strong>Hello, {INITIAL_USER_STUDENT.name.split(' ')[0]}.</strong><p>Let’s make it a good day.</p></div>
                <div className="pl-preview-metrics"><div><span>Attendance</span><strong>{INITIAL_USER_STUDENT.overallAttendance}<small>%</small></strong><div className="pl-mini-track"><i style={{width: INITIAL_USER_STUDENT.overallAttendance + '%'}}/></div></div><div><span>Overall CGPA</span><strong>{INITIAL_USER_STUDENT.cgpa}<small>/10</small></strong><p>{SAMPLE_COURSES.length} enrolled courses</p></div></div>
                <div className="pl-preview-schedule"><span>MONDAY’S SCHEDULE <CalendarDays size={12}/></span>{SAMPLE_TIMETABLE.filter(slot => slot.day === 'Monday').slice(0,2).map(slot => <div key={slot.id}><time>{slot.time.split(' - ')[0]}</time><p><strong>{slot.courseTitle}</strong><small>{slot.room} · {slot.type}</small></p></div>)}</div>
              </div>
            </div>
          </div>
          <div className="pl-floating-doc"><span><CheckCircle2 size={21}/></span><div><strong>A little less paperwork.</strong><small>{SAMPLE_DOCUMENTS.filter(doc => doc.status === 'ready').length} sample documents ready to view</small></div></div>
          <div className="pl-floating-ai"><Sparkles size={18}/><span>A little more possibility.</span></div>
          <p className="pl-preview-caption">A glimpse of your connected campus · Sample data</p>
        </div>
      </section>
      <section className="pl-capabilities" aria-label="Platform capabilities"><div className="pl-container"><p>ONE WORKSPACE.<br/><strong>YOUR WHOLE CAMPUS.</strong></p><span><GraduationCap/> Academic life</span><span><Building2/> Campus services</span><span><ShieldCheck/> Smarter decisions</span><span><Users/> Every campus role</span></div></section>
      <section id="pl-platform" className="pl-container pl-section">
        <div className="pl-section-heading"><div><p className="pl-kicker">BUILT AROUND YOUR EVERYDAY</p><h2>Less running around.<br/>More moving forward.</h2></div><p>The small things shouldn’t get in the way of the big ones. Give every campus task a place to belong.</p></div>
        <div className="pl-feature-grid">{features.map(({icon:Icon,title,text,action,route,number}) => <article className="pl-feature" key={route} onPointerMove={tiltCard} onPointerLeave={resetTilt}><div className="pl-feature-top"><span><Icon size={23}/></span><small>{number} /</small></div><ServiceIllustration kind={route}/><h3>{title}</h3><p>{text}</p><button onClick={() => onNavigate(route)}>{action}<ArrowUpRight size={17}/></button></article>)}</div>
        <div className="pl-workflow"><span className="pl-kicker">FROM TASK TO DONE</span><div><span>01</span><strong>Find your service</strong><p>Everything starts in one workspace.</p></div><ArrowRight aria-hidden="true"/><div><span>02</span><strong>Take the next step</strong><p>Request, report, explore or ask.</p></div><ArrowRight aria-hidden="true"/><div><span>03</span><strong>Keep track of progress</strong><p>Follow updates without the guesswork.</p></div></div>
      </section>
      <section id="pl-promise" className="pl-promise">
        <div className="pl-container pl-promise-grid">
          <div className="pl-promise-copy"><p className="pl-kicker"><ShieldCheck size={16}/> MEET PROMISECHECK AI</p><h2>Your future deserves<br/>more than a promise.</h2><p>“Guaranteed placement.” “Pay after you get hired.” Before you commit, take a closer look at what an offer actually says.</p><ul><li><Check size={17}/> Surface unclear guarantees and hidden conditions</li><li><Check size={17}/> Identify missing evidence worth asking for</li><li><Check size={17}/> Walk away with better questions to ask</li></ul><button className="pl-button pl-button-light" onClick={() => onNavigate('promisecheck')}>Look beyond the headline <ArrowRight size={18}/></button></div>
          <div className="pl-audit-preview" onPointerMove={tiltCard} onPointerLeave={resetTilt}>
            <div className="pl-scan-line" aria-hidden="true"/><span className="pl-analysis-orb" aria-hidden="true"><ScanLine size={25}/></span>
            <div className="pl-audit-heading"><span><ShieldCheck size={18}/> PromiseCheck</span><small>ILLUSTRATIVE ANALYSIS</small></div>
            <div className="pl-offer"><span>THE OFFER</span><blockquote>“100% placement.<br/>Your dream job, guaranteed.”</blockquote><div className="pl-offer-line"/></div>
            <div className="pl-audit-result"><span className="pl-caution-dot"/><div><strong>A promise worth questioning</strong><p>What does “placement” mean in the contract?</p></div></div>
            <div className="pl-audit-items"><div><span>01</span><p><strong>Look for the conditions</strong>Attendance thresholds, interview requirements and refund exclusions.</p></div><div><span>02</span><p><strong>Ask for the evidence</strong>Placement reports, employer details and written terms.</p></div></div>
            <div className="pl-audit-bottom"><Sparkles size={14}/> More clarity. A more informed decision.</div>
          </div>
        </div>
      </section>
      <section id="pl-people" className="pl-container pl-section">
        <div className="pl-section-heading pl-centered"><p className="pl-kicker">A SHARED CAMPUS. A PERSONAL EXPERIENCE.</p><h2>Different roles.<br/>One connected community.</h2><p>See campus from your side of the desk.</p></div>
        <div className="pl-role-grid">{[{role:'student' as UserRole,icon:GraduationCap,title:'For students',text:'More clarity for your classes. Less friction in your day.',items:['Academic progress & schedules','Document requests & campus services','AI support & offer analysis']},{role:'faculty' as UserRole,icon:Users,title:'For faculty',text:'Keep academic life and campus conversations in view.',items:['Course & attendance information','Grievance conversations','Campus notices & feedback']},{role:'admin' as UserRole,icon:BarChart3,title:'For administrators',text:'See the bigger picture. Find where your campus needs you.',items:['Institution overview & reports','Request & grievance tracking','Feedback & service insights']}].map(({role,icon:Icon,title,text,items}) => <article className="pl-role" key={role} onPointerMove={tiltCard} onPointerLeave={resetTilt}><RoleEmblem role={role}/><span className="pl-role-label"><Icon size={15}/>{role === 'admin' ? 'CAMPUS INTELLIGENCE' : role === 'faculty' ? 'TEACHING, CONNECTED' : 'YOUR PERSONAL WORKSPACE'}</span><h3>{title}</h3><p>{text}</p><ul>{items.map(item => <li key={item}><Check size={14}/>{item}</li>)}</ul><button onClick={() => onExploreRole(role)}>Explore {role === 'admin' ? 'admin' : role} view <ArrowUpRight size={17}/></button></article>)}</div>
      </section>
      <section className="pl-faq-section"><div className="pl-container pl-faq-grid"><div><p className="pl-kicker">GOOD QUESTIONS. CLEAR ANSWERS.</p><h2>A few things<br/>you might wonder.</h2><p>Get to know the workspace before you jump in.</p></div><div className="pl-faq-list">{questions.map(([question,answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true"/></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="pl-container pl-closing"><p className="pl-kicker">YOUR NEXT CHAPTER STARTS HERE</p><h2>Make campus life<br/>a little <span>lighter.</span></h2><button className="pl-button pl-button-dark" onClick={() => onExploreRole('student')}>Step inside Yukti AI <ArrowRight size={18}/></button><p>Explore the demo. Find your flow.</p></section>
    </main>
    <footer className="pl-footer"><div className="pl-container"><div><span className="pl-brand"><GraduationCap size={24}/> yukti ai.</span><p>A little less admin. A lot more campus.</p></div><nav aria-label="Footer"><button onClick={() => scrollTo('pl-platform')}>Platform</button><button onClick={() => onNavigate('promisecheck')}>PromiseCheck</button><button onClick={() => onNavigate('overview')}>Dashboard <ArrowUpRight size={14}/></button></nav></div><div className="pl-container pl-footer-bottom"><span>© {new Date().getFullYear()} Yukti AI</span><span>Demo workspace · Sample campus records</span><span>Thoughtfully connected.</span></div></footer>
  </div>;
}
