import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  Filter,
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  ArrowRight,
  Eye
} from 'lucide-react';
import { requestAI } from '../lib/localDemo';
import { CampusFindItem, CampusFindType, CampusFindCategory, UserProfile } from '../types';

interface CampusFindViewProps {
  items: CampusFindItem[];
  user: UserProfile;
  onAddItem: (item: CampusFindItem) => void;
  onUpdateItemStatus: (id: string, status: CampusFindItem['status']) => void;
}

export const CampusFindView: React.FC<CampusFindViewProps> = ({
  items,
  user,
  onAddItem,
  onUpdateItemStatus
}) => {
  const [matchState,setMatchState] = useState<{loading:boolean,error:string,matches:{matchedItemId:string,confidence:number,reason:string}[]}>({loading:false,error:'',matches:[]});
  const [matchingFor,setMatchingFor] = useState('');
  const findMatches = async (item:CampusFindItem) => {
    setMatchingFor(item.title); setMatchState({loading:true,error:'',matches:[]});
    try { const data = await requestAI('/api/campus-find/match',{newItem:item,existingItems:items.slice(0,100)}); setMatchState({loading:false,error:'',matches:data.matches}); }
    catch(error) { setMatchState({loading:false,error:error instanceof Error?error.message:'Matching failed.',matches:[]}); }
  };
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<CampusFindType>('lost');

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<CampusFindCategory>('electronics');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContact, setFormContact] = useState(user.email);
  const [formImage, setFormImage] = useState<string | null>(null);

  // Claim Modal State
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<CampusFindItem | null>(null);
  const [enteredClaimCode, setEnteredClaimCode] = useState('');
  const [claimFeedback, setClaimFeedback] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 512*1024) { setMatchState({loading:false,error:'Use a JPEG, PNG or WebP image under 512 KB for browser storage.',matches:[]}); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setFormImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formLocation.trim()) return;

    const newItem: CampusFindItem = {
      id: `cf-${Date.now()}`,
      type: reportType,
      title: formTitle,
      category: formCategory,
      description: formDescription,
      location: formLocation,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      reporterName: user.name,
      reporterContact: formContact || user.email,
      imageUri: formImage || undefined,
      status: 'open',
      claimCode: `CL-${Math.floor(1000 + Math.random() * 9000)}`
    };

    onAddItem(newItem);
    void findMatches(newItem);
    setShowReportModal(false);
    // Reset Form
    setFormTitle('');
    setFormLocation('');
    setFormDescription('');
    setFormImage(null);
  };

  const handleVerifyClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForClaim) return;

    if (enteredClaimCode.trim().toUpperCase() === selectedItemForClaim.claimCode.toUpperCase()) {
      onUpdateItemStatus(selectedItemForClaim.id, 'returned');
      setClaimFeedback('Handover recorded in this local demo. A claim code does not independently prove ownership.');
      setTimeout(() => {
        setSelectedItemForClaim(null);
        setClaimFeedback(null);
        setEnteredClaimCode('');
      }, 1200);
    } else {
      setClaimFeedback('Incorrect verification claim code. Check your confirmation receipt.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {matchingFor && <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-3" aria-label="Matching results"><h2 className="font-bold">Possible matches for {matchingFor}</h2><p className="text-xs">Local MiniLM semantic similarity—not proof of ownership.</p>{matchState.loading ? <p role="status">Comparing item descriptions…</p> : matchState.matches.length ? matchState.matches.map(match=><p key={match.matchedItemId}>{items.find(item=>item.id===match.matchedItemId)?.title} · {match.confidence}% similarity<br/><small>{match.reason}</small></p>) : <p>No likely matches found.</p>}</section>}
      {matchState.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{matchState.error}</p>}
      {/* Header Banner */}
      <div className="neo-card bg-[#FFFDF9] border-2 border-slate-900 rounded-2xl p-6 sm:p-7 shadow-[5px_5px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="neo-pill bg-teal-200 text-slate-950 font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            AI-Assisted Lost &amp; Found Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">
            CampusFind — Lost &amp; Found Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xl mt-1 leading-relaxed">
            Misplaced an item or found belongings on campus? Register here with location tags and let our smart matcher link lost and found reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setReportType('lost');
              setShowReportModal(true);
            }}
            className="neo-btn bg-rose-400 hover:bg-rose-500 text-slate-950 px-4 py-2.5 font-black text-xs sm:text-sm shadow-[3px_3px_0px_#0f172a] flex items-center gap-1.5"
            id="report-lost-item-btn"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Report Lost Item
          </button>

          <button
            onClick={() => {
              setReportType('found');
              setShowReportModal(true);
            }}
            className="neo-btn bg-teal-300 hover:bg-teal-400 text-slate-950 px-4 py-2.5 font-black text-xs sm:text-sm shadow-[3px_3px_0px_#0f172a] flex items-center gap-1.5"
            id="report-found-item-btn"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            Report Found Item
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3.5px_3.5px_0px_#0f172a] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-700 absolute left-3 top-2.5 stroke-[2.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, tags, buildings..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs sm:text-sm text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]">
            {(['all', 'lost', 'found'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider font-black text-[11px] transition-all cursor-pointer ${
                  filterType === t
                    ? t === 'lost'
                      ? 'bg-rose-400 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]'
                      : t === 'found'
                      ? 'bg-teal-300 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]'
                      : 'bg-yellow-300 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold shadow-[1.5px_1.5px_0px_#0f172a] focus:outline-none focus:bg-yellow-50"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics &amp; Gadgets</option>
            <option value="id_card">Student IDs &amp; Cards</option>
            <option value="backpack">Backpacks &amp; Bags</option>
            <option value="keys">Keys &amp; FOBs</option>
            <option value="books">Books &amp; Stationery</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-600 bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a]">
            <Tag className="w-10 h-10 mx-auto text-slate-400 mb-2 stroke-[2.5]" />
            <p className="text-sm font-black text-slate-950">No matching campus items found</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">Try resetting filters or lodge a new report.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isLost = item.type === 'lost';
            return (
              <div
                key={item.id}
                className="neo-card bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_#0f172a] flex flex-col hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] transition-all group"
              >
                {/* Photo or Placeholder */}
                {item.imageUri ? (
                  <div className="h-44 w-full bg-slate-100 relative overflow-hidden border-b-2 border-slate-900">
                    <img
                      src={item.imageUri}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a] ${
                          isLost ? 'bg-rose-300 text-slate-950' : 'bg-teal-200 text-slate-950'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-24 w-full bg-yellow-50/50 p-3 flex items-start justify-between border-b-2 border-slate-900">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a] ${
                        isLost ? 'bg-rose-300 text-slate-950' : 'bg-teal-200 text-slate-950'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                      {item.category}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-black text-sm text-slate-950 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-700 border-t-2 border-slate-100 pt-2.5 font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 stroke-[2.5]" />
                      <span className="truncate font-bold text-slate-900">{item.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 stroke-[2.5]" />
                        {item.date}
                      </span>
                      <span
                        className={`font-black uppercase text-[10px] px-1.5 py-0.5 rounded border border-slate-900 ${
                          item.status === 'returned'
                            ? 'bg-emerald-200 text-emerald-950'
                            : item.status === 'matched'
                            ? 'bg-amber-200 text-amber-950'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <button disabled={matchState.loading} className="min-h-11 rounded-lg border border-slate-200 text-sm px-3 disabled:opacity-50" onClick={()=>findMatches(item)}>Find possible matches</button>
                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between border-t-2 border-slate-100">
                    <span className="text-[10px] font-mono font-bold text-slate-600">
                      Ref: {item.claimCode}
                    </span>

                    {item.status !== 'returned' ? (
                      <button
                        onClick={() => setSelectedItemForClaim(item)}
                        className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 text-xs px-3 py-1.5 font-black shadow-[2px_2px_0px_#0f172a] flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                        Record handover
                      </button>
                    ) : (
                      <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Handed Over
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-[8px_8px_0px_#0f172a] text-slate-950">
            <div className="p-5 border-b-2 border-slate-900 flex items-center justify-between bg-yellow-50/50">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3.5 h-3.5 rounded-full border border-slate-900 ${
                    reportType === 'lost' ? 'bg-rose-400' : 'bg-teal-300'
                  }`}
                />
                <h3 className="font-black text-base text-slate-950">
                  Report {reportType === 'lost' ? 'Lost Belonging' : 'Found Item'}
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-600 hover:text-black p-1"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="p-5 space-y-4 text-xs font-medium">
              <div>
                <label className="font-black text-slate-900 block mb-1">Item Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Black Dell Laptop Charger / Student ID / Casio Watch"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-900 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="id_card">Student ID</option>
                    <option value="backpack">Backpack</option>
                    <option value="keys">Keys</option>
                    <option value="books">Books</option>
                    <option value="accessories">Accessories</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-black text-slate-900 block mb-1">Location on Campus</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Turing Hall 102 / Library 2nd Fl"
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-slate-900 block mb-1">Description &amp; Marks</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Unique features, serial number, scratch marks, stickers, case color..."
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-medium focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                />
              </div>

              <div>
                <label className="font-black text-slate-900 block mb-1">Upload Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagePick}
                  className="text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-2 file:border-slate-900 file:text-xs file:font-black file:bg-yellow-200 file:text-slate-950 hover:file:bg-yellow-300 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-black font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neo-btn bg-teal-300 hover:bg-teal-400 text-slate-950 px-5 py-2 font-black shadow-[2.5px_2.5px_0px_#0f172a]"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim Verification Dialog */}
      {selectedItemForClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-[8px_8px_0px_#0f172a] text-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <h3 className="font-black text-sm text-slate-950">Item Handover &amp; Claim Verification</h3>
              <button
                onClick={() => setSelectedItemForClaim(null)}
                className="text-slate-600 hover:text-black p-1"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-yellow-50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-xs space-y-1">
              <p className="font-black text-slate-950 text-sm">{selectedItemForClaim.title}</p>
              <p className="text-slate-700 font-medium">{selectedItemForClaim.location}</p>
              <p className="text-indigo-800 font-mono text-[11px] font-bold">Reporter: {selectedItemForClaim.reporterName} ({selectedItemForClaim.reporterContact})</p>
            </div>

            <form onSubmit={handleVerifyClaim} className="space-y-3 text-xs">
              <div>
                <label className="font-black text-slate-900 block mb-1">
                  Enter 6-Digit Claim Code or Secret Code (Hint: {selectedItemForClaim.claimCode})
                </label>
                <input
                  type="text"
                  value={enteredClaimCode}
                  onChange={(e) => setEnteredClaimCode(e.target.value)}
                  placeholder="e.g. CL-8012"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-mono font-bold uppercase tracking-wider focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              {claimFeedback && (
                <div className={`p-2.5 rounded-xl border-2 border-slate-900 text-[11px] font-black ${
                  claimFeedback.includes('Success') ? 'bg-emerald-200 text-emerald-950' : 'bg-rose-200 text-rose-950'
                }`}>
                  {claimFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForClaim(null)}
                  className="px-3.5 py-1.5 text-slate-700 hover:text-black font-bold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 px-4 py-2 font-black shadow-[2.5px_2.5px_0px_#0f172a]"
                >
                  Verify Ownership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
