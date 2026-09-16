import React, { useState } from 'react';
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
  const [activeTicket, setActiveTicket] = useState<SmartComplaint | null>(complaints[0] || null);
  const [commentInput, setCommentInput] = useState('');

  const filteredComplaints = complaints.filter((c) => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    return true;
  });

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsTriaging(true);
    let aiTriageResult = {
      department: selectedCategory === 'hostel' ? 'Hostel Warden Office' : selectedCategory === 'mess' ? 'Catering Committee' : 'Campus IT Operations',
      estimatedHours: 12,
      severityReason: 'Automated campus triage assignment',
      suggestedFix: 'Assigned duty technician with priority tracking.'
    };
    let urgencyLevel: ComplaintUrgency = 'medium';

    try {
      const response = await fetch('/api/smart-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category: selectedCategory,
          location
        })
      });
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
    setActiveTicket(newTicket);
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
  };

  const getUrgencyBadge = (urgency: ComplaintUrgency) => {
    switch (urgency) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-200 text-rose-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-200 text-orange-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-yellow-200 text-yellow-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">Low</span>;
    }
  };

  const getStatusBadge = (status: SmartComplaint['status']) => {
    switch (status) {
      case 'resolved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-200 text-emerald-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">Resolved</span>;
      case 'action_taken':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-sky-200 text-sky-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">Action Taken</span>;
      case 'investigating':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">Investigating</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-900 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">Open Ticket</span>;
    }
  };

  const getCategoryIcon = (category: ComplaintCategory) => {
    switch (category) {
      case 'it': return <Wifi className="w-4 h-4 text-slate-950 stroke-[2.5]" />;
      case 'mess': return <Utensils className="w-4 h-4 text-slate-950 stroke-[2.5]" />;
      case 'hostel': return <Home className="w-4 h-4 text-slate-950 stroke-[2.5]" />;
      case 'academic': return <GraduationCap className="w-4 h-4 text-slate-950 stroke-[2.5]" />;
      default: return <Wrench className="w-4 h-4 text-slate-950 stroke-[2.5]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="neo-card bg-[#FFFDF9] border-2 border-slate-900 rounded-2xl p-6 sm:p-7 shadow-[5px_5px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="neo-pill bg-yellow-200 text-slate-950 font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            AI-Powered Triage &amp; Escalation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">
            Smart Complaint &amp; Grievance Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xl mt-1 leading-relaxed">
            Submit issues regarding hostel amenities, mess meals, Wi-Fi, or lecture halls. Gemini AI automatically assesses urgency, predicts resolution times, and alerts duty officers.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 px-4 py-2.5 font-black text-xs sm:text-sm shadow-[3px_3px_0px_#0f172a] flex items-center gap-2 self-start sm:self-auto"
          id="lodge-complaint-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Lodge New Grievance
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'it', 'hostel', 'mess', 'academic', 'cleanliness'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-black capitalize transition-all border-2 border-slate-900 cursor-pointer whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_#0f172a]'
                : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0f172a]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Split View: Tickets List + Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets */}
        <div className="lg:col-span-5 space-y-3">
          {filteredComplaints.map((ticket) => {
            const isSelected = activeTicket?.id === ticket.id;
            return (
              <div
                key={ticket.id}
                onClick={() => setActiveTicket(ticket)}
                className={`p-4 rounded-2xl border-2 border-slate-900 transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'bg-yellow-100 shadow-[4.5px_4.5px_0px_#0f172a] -translate-y-0.5'
                    : 'bg-white hover:bg-slate-50 shadow-[3px_3px_0px_#0f172a]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-yellow-200 border border-slate-900">
                      {getCategoryIcon(ticket.category)}
                    </span>
                    <span className="font-mono text-xs font-black text-slate-950">
                      {ticket.ticketNo}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getUrgencyBadge(ticket.urgency)}
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>

                <h3 className="font-black text-sm text-slate-950 line-clamp-1">{ticket.title}</h3>
                <p className="text-xs text-slate-600 font-medium line-clamp-2">{ticket.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold pt-2 border-t-2 border-slate-100">
                  <span>{ticket.location}</span>
                  <span>{ticket.submittedAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Ticket Detail & AI Triage Overview */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a] space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-black text-slate-950 bg-yellow-200 px-1.5 py-0.5 rounded border border-slate-900">
                      {activeTicket.ticketNo}
                    </span>
                    {getUrgencyBadge(activeTicket.urgency)}
                    {getStatusBadge(activeTicket.status)}
                  </div>
                  <h2 className="text-lg font-black text-slate-950">{activeTicket.title}</h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Location: <strong>{activeTicket.location}</strong> • Submitted by {activeTicket.studentName} ({activeTicket.rollNo})
                  </p>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <select
                    value={activeTicket.status}
                    onChange={(e) => onUpdateStatus(activeTicket.id, e.target.value as any)}
                    className="bg-white border-2 border-slate-900 rounded-xl px-2.5 py-1 text-xs text-slate-950 font-bold shadow-[1.5px_1.5px_0px_#0f172a] focus:outline-none focus:bg-yellow-50"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="action_taken">Action Taken</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a] text-xs text-slate-900 leading-relaxed font-medium">
                <span className="text-slate-600 font-black block mb-1">Student Description:</span>
                {activeTicket.description}
              </div>

              {/* AI Auto-Triage Card */}
              {activeTicket.aiTriage && (
                <div className="p-4 rounded-xl bg-yellow-100 border-2 border-slate-900 shadow-[2.5px_2.5px_0px_#0f172a] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-950 font-black">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      Gemini Smart Triage Insights
                    </span>
                    <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                      Target SLA: {activeTicket.aiTriage.estimatedHours}h
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                      <span className="text-slate-600 block font-bold">Assigned Dept:</span>
                      <span className="text-slate-950 font-black">{activeTicket.aiTriage.department}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                      <span className="text-slate-600 block font-bold">Severity Assessment:</span>
                      <span className="text-slate-950 font-medium">{activeTicket.aiTriage.severityReason}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-950 pt-1 font-medium">
                    <strong className="font-black">Suggested Action:</strong> {activeTicket.aiTriage.suggestedFix}
                  </div>
                </div>
              )}

              {/* Discussion Thread */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                  Resolution Updates &amp; Comments ({activeTicket.comments.length})
                </h4>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {activeTicket.comments.map((cmt) => (
                    <div
                      key={cmt.id}
                      className="p-3 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-black text-slate-950">
                          {cmt.sender}{' '}
                          <span className="text-[10px] text-indigo-700 font-bold bg-yellow-100 px-1 rounded border border-slate-900">
                            {cmt.role}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{cmt.timestamp}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">{cmt.message}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Bar */}
                <form onSubmit={handlePostComment} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add follow-up remark or maintenance confirmation..."
                    className="flex-1 bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  />
                  <button
                    type="submit"
                    className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 px-4 py-2 text-xs font-black shadow-[2px_2px_0px_#0f172a] flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                    Post
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-8 text-center text-slate-600 font-bold text-xs shadow-[4px_4px_0px_#0f172a]">
              Select a grievance ticket to inspect details and AI triage.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Lodge New Grievance */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-[8px_8px_0px_#0f172a] text-slate-950">
            <div className="p-5 border-b-2 border-slate-900 flex items-center justify-between bg-yellow-50">
              <h3 className="font-black text-base text-slate-950">Lodge Smart Campus Grievance</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-600 hover:text-black p-1"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="p-5 space-y-4 text-xs font-medium">
              <div>
                <label className="font-black text-slate-900 block mb-1">Grievance Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as ComplaintCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                >
                  <option value="it">IT, Wi-Fi &amp; Network</option>
                  <option value="hostel">Hostel &amp; Accommodation</option>
                  <option value="mess">Mess &amp; Food Quality</option>
                  <option value="academic">Academic &amp; Classrooms</option>
                  <option value="cleanliness">Sanitation &amp; Cleanliness</option>
                  <option value="other">Other Facility</option>
                </select>
              </div>

              <div>
                <label className="font-black text-slate-900 block mb-1">Issue Summary</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wi-Fi router packet loss on 3rd floor / Water cooler filter red"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              <div>
                <label className="font-black text-slate-900 block mb-1">Specific Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Falcon Hall Block-B, Room 312 / Mess Hall 2"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              <div>
                <label className="font-black text-slate-900 block mb-1">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Explain what is happening, duration, frequency, and impact on students..."
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-medium focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-black font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTriaging}
                  className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 px-5 py-2 font-black shadow-[2.5px_2.5px_0px_#0f172a] flex items-center gap-1.5"
                >
                  {isTriaging ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      Triaging with AI...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
