import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  Wrench,
  Wifi,
  Utensils,
  Home,
  GraduationCap,
  Sparkles,
  Send,
  MessageSquare,
  X,
  ChevronRight
} from 'lucide-react';
import { ServiceHeader, ServiceSearch, ServiceEmpty, ServiceDialog } from './ServiceUI';
import { SmartComplaint, ComplaintCategory, ComplaintUrgency, UserProfile } from '../types';

interface ComplaintManagementViewProps {
  complaints: SmartComplaint[];
  user: UserProfile;
  onAddComplaint: (complaint: SmartComplaint) => void;
  onAddComment: (complaintId: string, commentText: string) => void;
  onUpdateStatus: (complaintId: string, status: SmartComplaint['status']) => void;
}

export const ComplaintManagementView: React.FC<ComplaintManagementViewProps> = ({
  complaints,
  user,
  onAddComplaint,
  onAddComment,
  onUpdateStatus,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory>('it');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isTriaging, setIsTriaging] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(complaints[0]?.id || null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const detailRef = useRef<HTMLElement>(null);
  const activeTicket = complaints.find(c => c.id === activeTicketId) || null;
  const statusLabel: Record<SmartComplaint['status'], string> = { open: 'Open', investigating: 'In progress', action_taken: 'Action taken', resolved: 'Resolved' };
  const statusTone: Record<SmartComplaint['status'], string> = { open: 'status-blue', investigating: 'status-amber', action_taken: 'status-blue', resolved: 'status-green' };
  const [commentInput, setCommentInput] = useState('');

  const filteredComplaints = complaints.filter((c) => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return (c.title + c.description + c.ticketNo + c.location).toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    if (!filteredComplaints.some(c => c.id === activeTicketId)) setActiveTicketId(filteredComplaints[0]?.id || null);
  }, [query, filterCategory, statusFilter, complaints, activeTicketId]);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTriaging || !title.trim() || !description.trim()) return;

    setIsTriaging(true);
    let aiTriageResult = {
      department: ({hostel:'Hostel Office',mess:'Catering Committee',it:'Campus IT',academic:'Academic Office',cleanliness:'Housekeeping',other:'Campus Support'})[selectedCategory],
      estimatedHours: 12,
      severityReason: 'Local rule-based routing suggestion',
      suggestedFix: 'Review with the responsible team. No technician has been dispatched.'
    };
    let urgencyLevel: ComplaintUrgency = 'medium';

    try {
      const response = await fetch('/api/smart-triage', {
        signal: AbortSignal.timeout(60000),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category: selectedCategory,
          location
        })
      });
      if (!response.ok) throw new Error('Triage unavailable');
      const data = await response.json();
      if (data.department) {
        aiTriageResult = data;
        urgencyLevel = (data.urgency as ComplaintUrgency) || 'medium';
      }
    } catch (err) {
      console.warn('AI Triage error, using fallback');
    } finally {
      setIsTriaging(false);
    }

    const newTicket: SmartComplaint = {
      id: `cmp-${Date.now()}`,
      ticketNo: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      category: selectedCategory,
      location: location || 'Campus Premises',
      description,
      urgency: urgencyLevel,
      status: 'open',
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      studentName: user.name,
      rollNo: user.rollNo,
      aiTriage: aiTriageResult,
      comments: [
        {
          id: `c-${Date.now()}`,
          sender: 'Campus AI Auto-Triage',
          role: 'IT Admin',
          message: `Ticket automatically analyzed. Route assigned to ${aiTriageResult.department}. Estimated turnaround: ${aiTriageResult.estimatedHours} hours.`,
          timestamp: 'Just now'
        }
      ]
    };

    onAddComplaint(newTicket);
    setActiveTicketId(newTicket.id);
    setFilterCategory('all'); setStatusFilter('all'); setQuery('');
    setNotice('Ticket ' + newTicket.ticketNo + ' created. Track updates below.');
    setShowNewModal(false);
    setTitle('');
    setLocation('');
    setDescription('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeTicket) return;
    onAddComment(activeTicket.id, commentInput);
    setCommentInput('');
    setNotice('Your update has been added to the conversation.');
  };


  return <div className="service-page">
    <ServiceHeader label="CAMPUS SUPPORT" title="Let’s get it sorted." description="Report a problem, follow the response, and keep the conversation in one place."><button className="service-primary" onClick={() => setShowNewModal(true)}><Plus size={17}/> Report an issue</button></ServiceHeader>
    {notice && <p className="service-success" role="status">{notice}</p>}
    <div className="service-summary"><div><MessageSquare/><strong>{complaints.length}</strong><span>Total tickets</span></div><div><Clock/><strong>{complaints.filter(c => c.status !== 'resolved').length}</strong><span>Awaiting resolution</span></div><div><CheckCircle2/><strong>{complaints.filter(c => c.status === 'resolved').length}</strong><span>Resolved</span></div></div>
    <div className="service-toolbar"><ServiceSearch value={query} onChange={setQuery} placeholder="Search tickets or locations"/><select className="service-secondary" aria-label="Filter ticket status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="all">All statuses</option>{Object.entries(statusLabel).map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></div>
    <div className="service-filters" aria-label="Issue categories">{['all','it','hostel','mess','academic','cleanliness','other'].map(c => <button key={c} aria-pressed={filterCategory === c} onClick={() => setFilterCategory(c)}>{c === 'all' ? 'All issues' : c === 'it' ? 'IT & Wi-Fi' : c}</button>)}</div>
    <div className="service-ticket-layout">
      <section className="service-ticket-list" aria-label="Support tickets"><p className="service-result-count" role="status">{filteredComplaints.length} matching ticket{filteredComplaints.length === 1 ? '' : 's'}</p>{filteredComplaints.map(ticket => <button className="service-ticket" aria-pressed={activeTicketId === ticket.id} key={ticket.id} onClick={() => { setActiveTicketId(ticket.id); if(window.innerWidth <= 760) requestAnimationFrame(() => {detailRef.current?.scrollIntoView({block:'start',behavior:'instant'}); detailRef.current?.focus({preventScroll:true});}); }}><div><code>{ticket.ticketNo}</code><span className={'service-badge ' + statusTone[ticket.status]}>{statusLabel[ticket.status]}</span></div><h3>{ticket.title}</h3><p>{ticket.location}</p><footer><span className={'service-badge ' + (['high','critical'].includes(ticket.urgency) ? 'status-red' : '')}>{ticket.urgency} priority</span><span>{ticket.submittedAt}</span></footer></button>)}{!filteredComplaints.length && <ServiceEmpty title="No matching tickets" description="Try another category, status or search term."/>}</section>
      <section className="service-panel service-ticket-detail" ref={detailRef} tabIndex={-1} aria-label="Ticket details">
        {activeTicket ? <><div className="service-detail-top"><div><span className="service-badge">{activeTicket.ticketNo}</span><span className={'service-badge ' + statusTone[activeTicket.status]}>{statusLabel[activeTicket.status]}</span></div><span className={'service-badge ' + (['high','critical'].includes(activeTicket.urgency) ? 'status-red' : '')}>{activeTicket.urgency} priority</span></div><h2>{activeTicket.title}</h2><p className="service-detail-meta">{activeTicket.location}<br/>Reported by {activeTicket.studentName} · {activeTicket.submittedAt}</p><label className="service-status-control">Ticket status<select aria-label="Ticket status" value={activeTicket.status} onChange={e => {onUpdateStatus(activeTicket.id, e.target.value as SmartComplaint['status']); setNotice('Ticket status updated.');}}>{Object.entries(statusLabel).map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></label><p className="service-description">{activeTicket.description}</p>
        {activeTicket.aiTriage && <div className="service-assignment"><div><span><Sparkles size={13} style={{display:'inline',marginRight:5}}/>Assigned team</span><span>Est. {activeTicket.aiTriage.estimatedHours} hours</span></div><h3>{activeTicket.aiTriage.department}</h3><p>{activeTicket.aiTriage.suggestedFix}</p></div>}
        <div className="service-thread"><h3>Conversation <span className="service-badge">{activeTicket.comments.length}</span></h3>{activeTicket.comments.length ? activeTicket.comments.map(c => <article className="service-comment" key={c.id}><div><strong>{c.sender} · {c.role}</strong><span>{c.timestamp}</span></div><p>{c.message}</p></article>) : <p className="service-detail-meta">No updates yet. Add a message below.</p>}</div><form className="service-comment-form" onSubmit={handlePostComment}><input aria-label="Add an update" value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="Add an update or ask a question…" required/><button className="service-primary" disabled={!commentInput.trim()}><Send size={15}/> Send</button></form></> : <ServiceEmpty title="Choose a ticket" description="Its progress and conversation will appear here."/>}
      </section>
    </div>
    {showNewModal && <ServiceDialog title="Report a campus issue" busy={isTriaging} onClose={() => setShowNewModal(false)}><form className="service-form" onSubmit={handleCreateComplaint}><p>Tell us what happened and where. We’ll help route it to the right team.</p><label>Category<select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as ComplaintCategory)}><option value="it">IT & Wi-Fi</option><option value="hostel">Hostel</option><option value="mess">Mess & dining</option><option value="academic">Academic</option><option value="cleanliness">Cleanliness</option><option value="other">Other</option></select></label><label>Issue summary<input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Wi-Fi disconnects on the third floor"/></label><label>Location<input required value={location} onChange={e => setLocation(e.target.value)} placeholder="Building, floor or room"/></label><label>What’s happening?<textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue, when it started, and who it affects."/></label><div className="service-form-actions"><button type="button" disabled={isTriaging} className="service-secondary" onClick={() => setShowNewModal(false)}>Cancel</button><button className="service-primary" disabled={isTriaging}>{isTriaging ? 'Routing your ticket…' : 'Submit issue'}<ChevronRight size={15}/></button></div></form></ServiceDialog>}
  </div>;
};
