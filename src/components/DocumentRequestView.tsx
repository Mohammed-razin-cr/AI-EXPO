import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Printer,
  ShieldCheck,
  Eye,
  X,
  Sparkles,
  QrCode
} from 'lucide-react';
import { createDemoDocument } from '../lib/demoDocument';
import { ServiceDialog } from './ServiceUI';
import { DocumentRequest, DocumentType, UserProfile } from '../types';

interface DocumentRequestViewProps {
  documents: DocumentRequest[];
  user: UserProfile;
  onRequestNew: (doc: DocumentRequest) => void;
}

export const DocumentRequestView: React.FC<DocumentRequestViewProps> = ({
  documents,
  user,
  onRequestNew,
}) => {
  const [pdfUrl,setPdfUrl] = useState('');
  const [downloadError,setDownloadError] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('bonafide');
  const [purpose, setPurpose] = useState('');
  const [isExpress, setIsExpress] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentRequest | null>(null);

  useEffect(() => {
    let disposed=false; let url='';
    setPdfUrl(''); setDownloadError('');
    if(previewDoc) createDemoDocument(previewDoc).then(blob=>{if(disposed)return;url=URL.createObjectURL(blob);setPdfUrl(url);}).catch(()=>{if(!disposed)setDownloadError('Could not generate PDF. Close and reopen to retry.');});
    return ()=>{disposed=true;if(url)URL.revokeObjectURL(url);};
  },[previewDoc]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    const titles: Record<DocumentType, string> = {
      bonafide: 'Bonafide Student Certificate',
      transcript: 'Official Academic Transcript (Sem 1-6)',
      noc: 'No Objection Certificate (NOC)',
      id_card: 'Replacement Student Smart ID Card',
      bus_pass: 'Metro / City Bus Transit Concession Pass'
    };

    const newDoc: DocumentRequest = {
      id: `doc-${Date.now()}`,
      refCode: `DOC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: selectedType,
      title: titles[selectedType],
      purpose,
      studentName: user.name,
      rollNo: user.rollNo,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      expectedDate: isExpress ? 'Within 24 Hours' : '3-5 Working Days',
      status: 'submitted',
      urgency: isExpress ? 'express' : 'normal',
      timeline: [
        { title: 'Application Submitted', date: 'Just now', status: 'done', desc: 'Lodge received in registrar queue.' },
        { title: 'Academic Record Clearance', date: 'Pending', status: 'current', desc: 'Verifying course enrollment and fee receipts.' },
        { title: 'HOD Digital Seal', date: 'Pending', status: 'pending', desc: 'Authorization signature from department head.' },
        { title: 'Document Ready', date: 'Pending', status: 'pending', desc: 'Downloadable sample PDF. Not institutionally verified.' }
      ],
      verifierRemarks: 'Application queued for automated eligibility check.'
    };

    onRequestNew(newDoc);
    setShowNewModal(false);
    setPurpose('');
    setIsExpress(false);
  };

  const getStatusBadge = (status: DocumentRequest['status']) => {
    switch (status) {
      case 'ready':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-200 text-emerald-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Ready for Download
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-200 text-amber-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 stroke-[2.5]" /> Under Review
          </span>
        );
      case 'hod_approved':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-sky-200 text-sky-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" /> HOD Signed
          </span>
        );
      case 'rejected': return <span className="text-sm text-red-700 font-semibold">Rejected in demo review</span>;
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 stroke-[2.5]" /> Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="neo-card bg-[#FFFDF9] border-2 border-slate-900 rounded-2xl p-6 sm:p-7 shadow-[5px_5px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="neo-pill bg-yellow-200 text-slate-950 font-black mb-2">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            Digital Registrar Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">
            Document Request &amp; Status Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xl mt-1 leading-relaxed">
            Request sample campus documents, advance approvals in the demo Admin view, and download a PDF when ready.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 px-4 py-2.5 font-black text-xs sm:text-sm shadow-[3px_3px_0px_#0f172a] flex items-center gap-2 self-start sm:self-auto"
          id="new-document-request-btn"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Request New Certificate
        </button>
      </div>

      {/* Document List with Status Tracking Stepper */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#0f172a] space-y-4 hover:-translate-y-0.5 transition-transform"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-900 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-slate-950 bg-yellow-200 px-2 py-0.5 rounded border border-slate-900">
                    {doc.refCode}
                  </span>
                  {doc.urgency === 'express' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-200 text-orange-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                      Express SLA
                    </span>
                  )}
                </div>
                <h3 className="font-black text-base text-slate-950 mt-1">{doc.title}</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">Purpose: {doc.purpose}</p>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(doc.status)}
                {doc.status === 'ready' && (
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 text-xs px-3.5 py-1.5 font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a]"
                  >
                    <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                    View &amp; Download
                  </button>
                )}
              </div>
            </div>

            {/* Visual Application Stepper */}
            <div>
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider mb-3">
                Application Progress Timeline:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {doc.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border-2 transition-colors ${
                      step.status === 'done'
                        ? 'bg-emerald-100 border-slate-900 text-emerald-950 shadow-[2px_2px_0px_#0f172a]'
                        : step.status === 'current'
                        ? 'bg-yellow-200 border-slate-900 text-slate-950 shadow-[2.5px_2.5px_0px_#0f172a]'
                        : 'bg-slate-50 border-slate-300 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        Step {idx + 1}
                      </span>
                      {step.status === 'done' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
                      ) : step.status === 'current' ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <h4 className="font-black text-xs text-slate-950">{step.title}</h4>
                    <p className="text-[10px] text-slate-700 font-medium mt-1 line-clamp-2">{step.desc}</p>
                    <span className="text-[9px] text-slate-600 block mt-1 font-mono font-bold">{step.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {doc.verifierRemarks && (
              <div className="text-[11px] text-slate-800 font-medium bg-yellow-50 p-2.5 rounded-xl border-2 border-slate-900 flex items-center gap-2 shadow-[1.5px_1.5px_0px_#0f172a]">
                <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0 stroke-[2.5]" />
                <span>Registrar Remarks: {doc.verifierRemarks}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: New Document Request */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-[8px_8px_0px_#0f172a] text-slate-950">
            <div className="p-5 border-b-2 border-slate-900 flex items-center justify-between bg-yellow-50">
              <h3 className="font-black text-base text-slate-950">Apply for Institutional Document</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-600 hover:text-black p-1"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-5 space-y-4 text-xs font-medium">
              <div>
                <label className="font-black text-slate-900 block mb-1">Document Category</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as DocumentType)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                >
                  <option value="bonafide">Bonafide Student Certificate</option>
                  <option value="transcript">Official Academic Transcript</option>
                  <option value="noc">No Objection Certificate (NOC for Internships)</option>
                  <option value="id_card">Duplicate Student Smart ID Card</option>
                  <option value="bus_pass">Metro / City Transit Concession Pass</option>
                </select>
              </div>

              <div>
                <label className="font-black text-slate-900 block mb-1">
                  Purpose / Intended Recipient
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Passport application, Bank education loan, Summer internship"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-yellow-100 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-950 block">Express Processing</span>
                  <span className="text-[11px] text-slate-700 font-medium">
                    Expedited 24-hour turnaround with prioritized HOD queue
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isExpress}
                  onChange={(e) => setIsExpress(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-slate-900 text-slate-950 cursor-pointer"
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
                  className="neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 px-5 py-2 font-black shadow-[2.5px_2.5px_0px_#0f172a]"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewDoc && <ServiceDialog title="Sample document" onClose={()=>setPreviewDoc(null)}><div className="service-form"><p><strong>Demo only—not an official certificate.</strong> This PDF contains the selected request details, not a registrar signature or verified academic record.</p><h3 className="text-xl font-semibold">{previewDoc.title}</h3><p>{previewDoc.studentName} · {previewDoc.rollNo}<br/>{previewDoc.refCode}<br/>Purpose: {previewDoc.purpose}</p>{downloadError&&<p role="alert">{downloadError}</p>}{pdfUrl ? <a className="service-primary" href={pdfUrl} download={previewDoc.refCode+'-sample.pdf'}><Download size={16}/>Download sample PDF</a> : !downloadError && <p role="status">Preparing your sample PDF…</p>}</div></ServiceDialog>}

    </div>
  );
};
