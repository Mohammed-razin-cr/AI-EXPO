import React, { useState } from 'react';
import { Home, Utensils, Calendar, Plus, ArrowUpRight, Coffee, Sun, Moon, Info } from 'lucide-react';
import { HostelPass, MessMenuDay, UserProfile } from '../types';
import { ServiceHeader, ServiceEmpty, ServiceDialog } from './ServiceUI';

interface HostelServicesViewProps {
  user: UserProfile; passes: HostelPass[]; messMenu: MessMenuDay[];
  onRequestPass: (pass: HostelPass) => void; onOpenMaintenanceGrievance: () => void;
}
export const HostelServicesView: React.FC<HostelServicesViewProps> = ({ user, passes, messMenu, onRequestPass, onOpenMaintenanceGrievance }) => {
  const [activeTab, setActiveTab] = useState('outpass');
  const [selectedDay, setSelectedDay] = useState<MessMenuDay['day']>((['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] as MessMenuDay['day'][])[new Date().getDay()]);
  const [showPassModal, setShowPassModal] = useState(false);
  const [viewingPass, setViewingPass] = useState<HostelPass | null>(null);
  const [filter, setFilter] = useState('all');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [outDate, setOutDate] = useState('');
  const [inDate, setInDate] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const selectedMenu = messMenu.find(m => m.day === selectedDay);
  const visiblePasses = passes.filter(p => filter === 'all' || p.status === filter);
  const tone = { approved: 'status-green', pending: 'status-amber', rejected: 'status-red' };
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  };
  const createPass = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reason.trim() || !destination.trim()) { setError('Please enter your destination and reason.'); return; }
    if (new Date(outDate).getTime() <= Date.now()) { setError('Departure must be in the future.'); return; }
    if (new Date(inDate).getTime() <= new Date(outDate).getTime()) { setError('Return must be after your departure.'); return; }
    const passNo = 'GP-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6);
    onRequestPass({ id: 'pass-' + Date.now(), passNo, studentName: user.name, rollNo: user.rollNo, roomNo: user.roomNo || 'Not assigned', reason: reason.trim(), destination: destination.trim(), outDate, inDate, status:'pending', wardenRemarks:'Awaiting review in the local demo Admin queue. Not valid for campus gate entry.', qrPayload:'' });
    setShowPassModal(false); setReason(''); setDestination(''); setOutDate(''); setInDate(''); setFilter('all'); setActiveTab('outpass'); setError('');
    setNotice('Your demo outpass has been created. View its details below.');
  };
  return <div className="service-page">
    <ServiceHeader label="RESIDENT LIFE" title="Make yourself at home." description="Your outpasses, daily meals, and room essentials. All in one place.">
      <button className="service-primary" onClick={() => { setError(''); setShowPassModal(true); }}><Plus size={16}/> Request outpass</button>
    </ServiceHeader>
    {notice && <p className="service-success" role="status">{notice}</p>}
    <div className="service-residence"><Home size={28}/><div><strong>{user.hostelBlock || 'Campus residence'}</strong><span>Room {user.roomNo || 'not assigned'} · {user.name}</span></div><div><span>RESIDENT ID</span><strong>{user.rollNo}</strong></div></div>
    <nav className="service-tabs" aria-label="Hostel services">
      {[{id:'outpass',name:'My outpasses',Icon:Calendar},{id:'mess',name:'Mess menu',Icon:Utensils},{id:'room',name:'My room',Icon:Home}].map(({id,name,Icon}) => <button key={id} aria-pressed={activeTab === id} onClick={() => setActiveTab(id)}><Icon size={17}/>{name}</button>)}
    </nav>
    {activeTab === 'outpass' && <section aria-label="My outpasses">
      <div className="service-panel-title"><h2>Plans outside campus</h2><span className="service-badge">{passes.length} passes</span></div>
      <div className="service-filters" aria-label="Filter outpasses">{['all','approved','pending','rejected'].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === 'all' ? 'All passes' : value}</button>)}</div>
      <div className="service-pass-grid">{visiblePasses.map(pass => <article className="service-pass" key={pass.id}>
        <header><code>{pass.passNo}</code><span className={'service-badge ' + tone[pass.status]}>{pass.status}</span></header>
        <div className="service-pass-body"><h2>{pass.destination}</h2><p>{pass.reason}</p><div className="service-pass-dates"><div><span>DEPARTURE</span><strong>{formatDate(pass.outDate)}</strong></div><div><span>RETURN BY</span><strong>{formatDate(pass.inDate)}</strong></div></div></div>
        <footer><small>{pass.studentName} · {pass.roomNo}</small><button className="service-secondary" aria-label={'View pass ' + pass.passNo} onClick={() => setViewingPass(pass)}>View pass <ArrowUpRight size={14}/></button></footer>
      </article>)}</div>
      {!visiblePasses.length && <ServiceEmpty title="No outpasses here yet" description="Try another status, or request an outpass for your next trip."/>}
      <p className="service-diet-note"><Info size={16} className="shrink-0"/>Demo workspace: passes are sample records, not valid gate-entry documents.</p>
    </section>}
    {activeTab === 'mess' && <section aria-label="Weekly mess menu">
      <div className="service-panel-title"><h2>A little taste of today</h2><span className="service-badge">Weekly menu</span></div>
      <div className="service-day-picker" aria-label="Choose menu day">{(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const).map(day => <button key={day} aria-label={day} aria-pressed={selectedDay === day} onClick={() => setSelectedDay(day)}>{day.slice(0,3)}</button>)}</div>
      <p className="service-result-count">{selectedDay}'s menu · Campus dining hall</p>
      {selectedMenu ? <><div className="service-meals">
        {([{key:'breakfast',label:'Breakfast',time:'7:30 – 9:30 AM',Icon:Coffee},{key:'lunch',label:'Lunch',time:'12:30 – 2:30 PM',Icon:Sun},{key:'snacks',label:'Evening snacks',time:'4:30 – 5:30 PM',Icon:Utensils},{key:'dinner',label:'Dinner',time:'7:30 – 9:30 PM',Icon:Moon}] as const).map(({key,label,time,Icon}) => <article className="service-meal" key={key}><div><Icon size={22}/><span>{time}</span></div><h3>{label}</h3><p>{selectedMenu[key]}</p></article>)}
      </div>{selectedMenu.specialDietNote && <p className="service-diet-note"><Info size={17} className="shrink-0"/>{selectedMenu.specialDietNote}</p>}</> : <ServiceEmpty title="Menu not published" description="Check another day for available meals."/>}
    </section>}
    {activeTab === 'room' && <section aria-label="Room essentials">
      <div className="service-panel-title"><h2>Your space on campus</h2><Home size={22}/></div>
      <div className="service-panel"><span className="service-eyebrow">YOUR ALLOCATION</span><h2 className="text-2xl mt-3 mb-2">Room {user.roomNo || 'not assigned'}</h2><p className="service-detail-meta">{user.hostelBlock} · {user.name} · {user.rollNo}</p></div>
      <div className="service-room-grid">
        <article className="service-panel"><h3>Room maintenance</h3><p>Something needs attention? Send a maintenance issue to campus support.</p><button className="service-secondary mt-4" onClick={onOpenMaintenanceGrievance}>Report an issue <ArrowUpRight size={14}/></button></article>
        <article className="service-panel"><h3>Residence support</h3><p>Contact your hostel office for room changes, access questions, and residence assistance.</p></article>
        <article className="service-panel"><h3>Heading out?</h3><p>Keep your departure and return details up to date. Check with your warden for campus entry requirements.</p><button className="service-secondary mt-4" onClick={() => setActiveTab('outpass')}>Manage outpasses</button></article>
      </div>
    </section>}
    {showPassModal && <ServiceDialog title="Request an outpass" onClose={() => setShowPassModal(false)}><form className="service-form" onSubmit={createPass}>
      <p>Add your trip details. Review this request in the demo Admin outpass queue. This is not a real warden authorization.</p>
      <label>Destination<input required autoComplete="off" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Where are you going?"/></label>
      <label>Reason for travel<textarea required value={reason} onChange={e => setReason(e.target.value)} placeholder="Briefly describe the purpose of your visit."/></label>
      <div className="service-form-row"><label>Departure<input type="datetime-local" required value={outDate} onChange={e => {setOutDate(e.target.value);setError('');}}/></label><label>Return by<input type="datetime-local" required value={inDate} min={outDate || undefined} onChange={e => {setInDate(e.target.value);setError('');}}/></label></div>
      {error && <p className="service-form-error" role="alert">{error}</p>}
      <div className="service-form-actions"><button type="button" className="service-secondary" onClick={() => setShowPassModal(false)}>Cancel</button><button type="submit" className="service-primary">Create demo pass</button></div>
    </form></ServiceDialog>}
    {viewingPass && <ServiceDialog title="Outpass details" onClose={() => setViewingPass(null)}><div className="service-pass-preview">
      <span className={'service-badge ' + tone[viewingPass.status]}>{viewingPass.status}</span><code>{viewingPass.passNo}</code><h3>{viewingPass.destination}</h3><p>{viewingPass.reason}</p>
      <div className="service-pass-dates"><div><span>DEPARTURE</span><strong>{formatDate(viewingPass.outDate)}</strong></div><div><span>RETURN BY</span><strong>{formatDate(viewingPass.inDate)}</strong></div></div>
      <p>{viewingPass.studentName} · {viewingPass.rollNo}<br/>Room {viewingPass.roomNo}</p>
      <p className="service-diet-note"><Info size={16} className="shrink-0"/>Sample pass only. Live approval and QR verification require campus integration.</p>
      <button className="service-primary mt-5" onClick={() => setViewingPass(null)}>Done</button>
    </div></ServiceDialog>}
  </div>;
};
