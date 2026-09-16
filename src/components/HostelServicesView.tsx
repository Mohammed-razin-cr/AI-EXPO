import React, { useState } from 'react';
import {
  Home,
  Utensils,
  QrCode,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  Shield,
  UserCheck,
  Coffee,
  Sparkles
} from 'lucide-react';
import { HostelPass, MessMenuDay, UserProfile } from '../types';

interface HostelServicesViewProps {
  user: UserProfile;
  passes: HostelPass[];
  messMenu: MessMenuDay[];
  onRequestPass: (pass: HostelPass) => void;
  onOpenMaintenanceGrievance: () => void;
}

export const HostelServicesView: React.FC<HostelServicesViewProps> = ({
  user,
  passes,
  messMenu,
  onRequestPass,
  onOpenMaintenanceGrievance,
}) => {
  const [activeTab, setActiveTab] = useState<'mess' | 'outpass' | 'room'>('outpass');
  const [selectedDay, setSelectedDay] = useState<MessMenuDay['day']>('Monday');
  const [showPassModal, setShowPassModal] = useState(false);
  const [viewingPass, setViewingPass] = useState<HostelPass | null>(null);

  // Form State
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [outDate, setOutDate] = useState('2026-09-20 06:00 PM');
  const [inDate, setInDate] = useState('2026-09-22 09:00 PM');

  const selectedMenu = messMenu.find((m) => m.day === selectedDay) || messMenu[0];

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !destination.trim()) return;

    const passCode = `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPass: HostelPass = {
      id: `pass-${Date.now()}`,
      passNo: passCode,
      studentName: user.name,
      rollNo: user.rollNo,
      roomNo: user.roomNo || 'B-312',
      reason,
      destination,
      outDate,
      inDate,
      status: 'approved', // instant demo auto-approval for smooth UX
      wardenRemarks: 'Approved automatically based on clear disciplinary track record and parental consent.',
      qrPayload: `PASS:${passCode}|STUDENT:${user.rollNo}|DEST:${destination}|STATUS:APPROVED`
    };

    onRequestPass(newPass);
    setShowPassModal(false);
    setReason('');
    setDestination('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="neo-card bg-[#FFFDF9] border-2 border-slate-900 rounded-2xl p-6 sm:p-7 shadow-[5px_5px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="neo-pill bg-teal-200 text-slate-950 font-black mb-2">
            <Home className="w-3.5 h-3.5 stroke-[2.5]" />
            Resident Life &amp; Hospitality
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">
            Hostel Services &amp; Digital Outpass
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xl mt-1 leading-relaxed">
            Generate warden-approved QR gate passes, check the daily mess dining menu, and track room amenities for {user.hostelBlock}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPassModal(true)}
            className="neo-btn bg-teal-300 hover:bg-teal-400 text-slate-950 px-4 py-2.5 font-black text-xs sm:text-sm shadow-[3px_3px_0px_#0f172a] flex items-center gap-1.5"
            id="apply-outpass-btn"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Apply Gate Outpass
          </button>
        </div>
      </div>

      {/* Segment Navigation */}
      <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('outpass')}
          className={`px-4 py-2 rounded-xl font-black transition-all border-2 border-slate-900 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'outpass'
              ? 'bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_#0f172a]'
              : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0f172a]'
          }`}
        >
          <QrCode className="w-4 h-4 stroke-[2.5]" />
          Digital Outpasses &amp; QR ({passes.length})
        </button>

        <button
          onClick={() => setActiveTab('mess')}
          className={`px-4 py-2 rounded-xl font-black transition-all border-2 border-slate-900 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'mess'
              ? 'bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_#0f172a]'
              : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0f172a]'
          }`}
        >
          <Utensils className="w-4 h-4 stroke-[2.5]" />
          Weekly Mess Dining Menu
        </button>

        <button
          onClick={() => setActiveTab('room')}
          className={`px-4 py-2 rounded-xl font-black transition-all border-2 border-slate-900 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'room'
              ? 'bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_#0f172a]'
              : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0f172a]'
          }`}
        >
          <Home className="w-4 h-4 stroke-[2.5]" />
          Room &amp; Amenities
        </button>
      </div>

      {/* Tab 1: Digital Outpass & Gate Passes */}
      {activeTab === 'outpass' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passes.map((pass) => (
              <div
                key={pass.id}
                className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#0f172a] space-y-4 hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-950 bg-yellow-200 px-2 py-0.5 rounded border border-slate-900">
                        {pass.passNo}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 ${
                          pass.status === 'approved'
                            ? 'bg-emerald-200 text-emerald-950'
                            : 'bg-amber-200 text-amber-950'
                        }`}
                      >
                        {pass.status}
                      </span>
                    </div>
                    <h3 className="font-black text-sm text-slate-950 mt-1">{pass.reason}</h3>
                  </div>

                  <button
                    onClick={() => setViewingPass(pass)}
                    className="p-2.5 rounded-xl bg-yellow-300 hover:bg-yellow-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] transition-colors cursor-pointer"
                    title="View QR Gate Pass"
                  >
                    <QrCode className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                    <span className="text-[10px] text-slate-600 block uppercase font-black">Exit Time</span>
                    <span className="text-slate-950 font-bold">{pass.outDate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                    <span className="text-[10px] text-slate-600 block uppercase font-black">Return By</span>
                    <span className="text-slate-950 font-bold">{pass.inDate}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  <span className="text-slate-900 font-bold block text-[11px]">Destination:</span>
                  <span className="text-slate-800">{pass.destination}</span>
                </div>

                {pass.wardenRemarks && (
                  <div className="p-2.5 rounded-xl bg-yellow-50 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a] text-[11px] text-slate-900 font-medium flex items-start gap-2">
                    <UserCheck className="w-4 h-4 text-slate-950 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span><strong>Warden Remarks:</strong> {pass.wardenRemarks}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Weekly Mess Menu */}
      {activeTab === 'mess' && (
        <div className="space-y-4">
          {/* Day Picker */}
          <div className="grid grid-cols-7 gap-1 bg-slate-100 border-2 border-slate-900 p-1.5 rounded-2xl shadow-[2px_2px_0px_#0f172a]">
            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedDay === d
                    ? 'bg-yellow-300 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Day Meal Plan Cards */}
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a] space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-950">{selectedDay} Dining Schedule</h3>
                <p className="text-xs text-slate-600 font-medium">Central Dining Hall 1 &amp; 2 • Falcon Mess Council</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-200 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                FSSAI Inspected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Breakfast */}
              <div className="p-4 rounded-xl bg-yellow-50/50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-950 font-black">
                  <span className="flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 stroke-[2.5]" /> Breakfast
                  </span>
                  <span className="font-mono text-slate-600 text-[10px]">07:30 - 09:30 AM</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{selectedMenu.breakfast}</p>
              </div>

              {/* Lunch */}
              <div className="p-4 rounded-xl bg-yellow-50/50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-950 font-black">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 stroke-[2.5]" /> Lunch
                  </span>
                  <span className="font-mono text-slate-600 text-[10px]">12:30 - 02:30 PM</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{selectedMenu.lunch}</p>
              </div>

              {/* High Tea */}
              <div className="p-4 rounded-xl bg-yellow-50/50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-950 font-black">
                  <span className="flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 stroke-[2.5]" /> Snacks &amp; Tea
                  </span>
                  <span className="font-mono text-slate-600 text-[10px]">05:00 - 06:15 PM</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{selectedMenu.snacks}</p>
              </div>

              {/* Dinner */}
              <div className="p-4 rounded-xl bg-yellow-50/50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-950 font-black">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 stroke-[2.5]" /> Dinner
                  </span>
                  <span className="font-mono text-slate-600 text-[10px]">08:00 - 10:00 PM</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{selectedMenu.dinner}</p>
              </div>
            </div>

            {selectedMenu.specialDietNote && (
              <div className="p-3 rounded-xl bg-yellow-100 border-2 border-slate-900 text-xs text-slate-950 font-bold flex items-center gap-2 shadow-[1.5px_1.5px_0px_#0f172a]">
                <Sparkles className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span>Special Diet Note: {selectedMenu.specialDietNote}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Room & Amenities */}
      {activeTab === 'room' && (
        <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-950">Room Allotment &amp; Resident Directory</h3>
              <p className="text-xs text-slate-600 font-medium">{user.hostelBlock} • Room {user.roomNo}</p>
            </div>
            <button
              onClick={onOpenMaintenanceGrievance}
              className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_#0f172a]"
            >
              Report Room Maintenance
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border-2 border-slate-900 shadow-[2.5px_2.5px_0px_#0f172a] space-y-2">
              <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider">Roommates</span>
              <p className="font-black text-slate-950">David Chen (2024CS108)</p>
              <p className="font-black text-slate-950">Rohit Patel (2024CS119)</p>
              <p className="text-[11px] text-slate-600 font-bold">Occupancy: 3 / 3 Beds</p>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-slate-900 shadow-[2.5px_2.5px_0px_#0f172a] space-y-2">
              <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider">Hostel Warden</span>
              <p className="font-black text-slate-950">Prof. K. Venkatesh</p>
              <p className="text-slate-700 font-medium">Office: Ground Floor, Block-B</p>
              <p className="text-[11px] text-indigo-700 font-bold">Emergency: +1 (555) 789-2044</p>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-slate-900 shadow-[2.5px_2.5px_0px_#0f172a] space-y-2">
              <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider">Curfew &amp; Gates</span>
              <p className="font-black text-slate-950">Main Gate Closes: 10:00 PM</p>
              <p className="text-slate-700 font-medium">Night Study Room: 24x7 Open</p>
              <p className="text-[11px] text-slate-600 font-bold">Late entry requires digital outpass</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Apply for Outpass */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-[8px_8px_0px_#0f172a] text-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <h3 className="font-black text-sm text-slate-950">Apply for Gate Outpass / Night Pass</h3>
              <button onClick={() => setShowPassModal(false)} className="text-slate-600 hover:text-black">
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleCreatePass} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="font-black text-slate-900 block mb-1">Purpose / Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Inter-University Hackathon / Weekend Home Visit"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              <div>
                <label className="font-black text-slate-900 block mb-1">Destination Address</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Tech Park Convention Center / Home Address"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-900 block mb-1">Exit Date &amp; Time</label>
                  <input
                    type="text"
                    value={outDate}
                    onChange={(e) => setOutDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a] font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-black text-slate-900 block mb-1">Return Date &amp; Time</label>
                  <input
                    type="text"
                    value={inDate}
                    onChange={(e) => setInDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a] font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="px-3.5 py-2 text-slate-700 hover:text-black font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neo-btn bg-teal-300 hover:bg-teal-400 text-slate-950 px-5 py-2 font-black shadow-[2.5px_2.5px_0px_#0f172a]"
                >
                  Submit &amp; Generate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Generated QR Pass */}
      {viewingPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-[8px_8px_0px_#0f172a] text-slate-950 p-6 space-y-4 text-center">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <span className="text-xs font-black text-slate-950">Campus Security Gatepass</span>
              <button onClick={() => setViewingPass(null)} className="text-slate-600 hover:text-black">
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="bg-yellow-100 border-2 border-slate-900 p-4 rounded-2xl inline-block mx-auto shadow-[3px_3px_0px_#0f172a]">
              <QrCode className="w-36 h-36 text-slate-950" />
            </div>

            <div>
              <span className="font-mono text-sm font-black text-slate-950 block">{viewingPass.passNo}</span>
              <p className="text-xs text-slate-900 font-black mt-1">{viewingPass.studentName} ({viewingPass.rollNo})</p>
              <p className="text-[11px] text-slate-600 font-medium">{viewingPass.reason}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border-2 border-slate-900 text-left text-[11px] space-y-1 font-medium shadow-[1.5px_1.5px_0px_#0f172a]">
              <div><span className="text-slate-600 font-bold">Exit:</span> <strong>{viewingPass.outDate}</strong></div>
              <div><span className="text-slate-600 font-bold">Return:</span> <strong>{viewingPass.inDate}</strong></div>
              <div><span className="text-slate-600 font-bold">Destination:</span> {viewingPass.destination}</div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 text-xs font-black shadow-[2.5px_2.5px_0px_#0f172a] flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
              Print Security Slip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
