import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  GraduationCap,
  Users,
  Check,
  Key,
  ArrowRight,
  RefreshCw,
  X,
  Lock,
  Building2,
  Fingerprint,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUserRole: (role: UserRole) => void;
  targetRole?: UserRole;
  onNavigateToProfile?: () => void;
  onResetDemoData?: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  currentUser,
  onSelectUserRole,
  targetRole,
  onNavigateToProfile,
  onResetDemoData,
}: LoginModalProps) {
  const [activePortal, setActivePortal] = useState<UserRole>(targetRole || currentUser.role);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  // Student Form State
  const [studentId, setStudentId] = useState('2024CS104');
  const [studentPass, setStudentPass] = useState('student2024');

  // Faculty Form State (Different Credentials & Department Key)
  const [facultyId, setFacultyId] = useState('FAC-802');
  const [facultyDept, setFacultyDept] = useState('Computer Science & Engineering');
  const [facultyKey, setFacultyKey] = useState('FACULTY#802');
  const [facultyAgreed, setFacultyAgreed] = useState(true);

  // Admin Form State (Different Master UID, Master Passphrase & 2FA Token)
  const [adminUid, setAdminUid] = useState('ADM-001');
  const [adminPassphrase, setAdminPassphrase] = useState('ADMIN*DEAN2026');
  const [admin2FaCode, setAdmin2FaCode] = useState('849201');
  const [adminAuditConfirmed, setAdminAuditConfirmed] = useState(true);

  useEffect(() => {
    if (targetRole) {
      setActivePortal(targetRole);
    } else if (isOpen) {
      setActivePortal(currentUser.role);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [targetRole, isOpen, currentUser.role]);

  if (!isOpen) return null;

  const handleAutofillStudent = () => {
    setStudentId('2024CS104');
    setStudentPass('student2024');
    setErrorMsg(null);
  };

  const handleAutofillFaculty = () => {
    setFacultyId('FAC-802');
    setFacultyDept('Computer Science & Engineering');
    setFacultyKey('FACULTY#802');
    setFacultyAgreed(true);
    setErrorMsg(null);
  };

  const handleAutofillAdmin = () => {
    setAdminUid('ADM-001');
    setAdminPassphrase('ADMIN*DEAN2026');
    setAdmin2FaCode('849201');
    setAdminAuditConfirmed(true);
    setErrorMsg(null);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanId = studentId.trim().toLowerCase();
    if (!cleanId || !studentPass.trim()) {
      setErrorMsg('Please enter both your Student Roll Number / Campus Email and password.');
      return;
    }

    if (
      cleanId === '2024cs104' ||
      cleanId === 'alex.rivera@campus.edu' ||
      cleanId === 'student' ||
      cleanId.startsWith('2024')
    ) {
      setSuccessMsg('Student credentials authenticated. Loading academic dashboard...');
      setTimeout(() => {
        onSelectUserRole('student');
        onClose();
      }, 500);
    } else {
      setErrorMsg('Unrecognized student roll number. For demo, use 2024CS104 or click "Autofill Student Credentials".');
    }
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanId = facultyId.trim().toUpperCase();
    if (!cleanId || !facultyKey.trim()) {
      setErrorMsg('Please provide Faculty Staff ID and Department Security Key.');
      return;
    }

    if (!facultyAgreed) {
      setErrorMsg('Please certify your departmental faculty appointment by checking the confirmation box.');
      return;
    }

    if (
      cleanId === 'FAC-802' ||
      cleanId === 'A.THORNE@CAMPUS.EDU' ||
      cleanId === 'FACULTY' ||
      cleanId.startsWith('FAC')
    ) {
      if (facultyKey.trim() !== 'FACULTY#802' && facultyKey.trim().length < 4) {
        setErrorMsg('Invalid Faculty Security Key. For demo, use FACULTY#802 or click "Autofill Faculty Credentials".');
        return;
      }
      setSuccessMsg('Faculty credentials verified. Academic staff elevation granted.');
      setTimeout(() => {
        onSelectUserRole('faculty');
        onClose();
      }, 500);
    } else {
      setErrorMsg('Faculty identification not found in academic registry. Demo ID: FAC-802.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUid = adminUid.trim().toUpperCase();
    if (!cleanUid || !adminPassphrase.trim()) {
      setErrorMsg('Executive Administrator UID and Master Passphrase are required.');
      return;
    }

    if (admin2FaCode.trim().length !== 6) {
      setErrorMsg('Please provide the 6-digit TOTP / Hardware Token Security Code (Demo: 849201).');
      return;
    }

    if (!adminAuditConfirmed) {
      setErrorMsg('Administrative governance regulations require confirming system audit logging.');
      return;
    }

    if (
      cleanUid === 'ADM-001' ||
      cleanUid === 'ELEANOR.VANCE@CAMPUS.EDU' ||
      cleanUid === 'ADMIN' ||
      cleanUid.startsWith('ADM')
    ) {
      if (adminPassphrase.trim() !== 'ADMIN*DEAN2026' && adminPassphrase.trim().length < 5) {
        setErrorMsg('Invalid Master Passphrase. For demo, use ADMIN*DEAN2026 or click "Autofill Dean Credentials".');
        return;
      }
      setSuccessMsg('Executive Registrar & Dean Master Clearance Verified. Session logging initiated.');
      setTimeout(() => {
        onSelectUserRole('admin');
        onClose();
      }, 500);
    } else {
      setErrorMsg('Administrative UID not recognized on secure governance network. Demo UID: ADM-001.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0B2038] text-white grid place-items-center shadow-sm">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-950">Campus Authentication Gateway</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Yukti SSO
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Independent authentication portals for Students, Faculty Instructors, and Campus Administrators
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg text-slate-400 hover:text-slate-700 p-1.5 transition hover:bg-slate-100"
            aria-label="Close authentication modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Active Session Bar */}
        <div className="bg-slate-100/70 px-6 py-2.5 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Currently Authenticated:</span>
            <span className="font-bold text-slate-900">{currentUser.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              currentUser.role === 'admin'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : currentUser.role === 'faculty'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-blue-100 text-blue-900 border border-blue-300'
            }`}>
              {currentUser.role}
            </span>
          </div>

          {onNavigateToProfile && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToProfile();
              }}
              className="text-blue-700 hover:text-blue-900 font-bold hover:underline flex items-center gap-1"
            >
              <span>View Dossier</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Portal Selection Tabs - 3 Distinct Access Portals */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            {/* Student Tab */}
            <button
              type="button"
              onClick={() => {
                setActivePortal('student');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                activePortal === 'student'
                  ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span>Student Portal</span>
            </button>

            {/* Faculty Tab */}
            <button
              type="button"
              onClick={() => {
                setActivePortal('faculty');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                activePortal === 'faculty'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Faculty Gateway</span>
            </button>

            {/* Admin Tab */}
            <button
              type="button"
              onClick={() => {
                setActivePortal('admin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                activePortal === 'admin'
                  ? 'bg-[#0B2038] text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Admin Vault</span>
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-3 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Authentication Failed</span>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-start gap-3 text-xs text-emerald-800 animate-fadeIn">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* ================= PORTAL 1: STUDENT LOGIN ================= */}
          {activePortal === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white grid place-items-center font-bold">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Undergraduate &amp; Graduate Student Access</h3>
                    <p className="text-xs text-slate-500">Single Sign-On for course registrations, exams, gate passes &amp; hostel</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillStudent}
                  className="text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Autofill Demo</span>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Roll Number or Institutional Email
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 2024CS104 or alex.rivera@campus.edu"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Default demo account: 2024CS104</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Portal Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={studentPass}
                      onChange={(e) => setStudentPass(e.target.value)}
                      placeholder="Enter student password"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Default demo password: student2024</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 text-xs text-slate-600 space-y-1.5">
                <span className="font-bold text-slate-800 block">Student Clearance Level: Standard</span>
                <p>Grants access to course timetable, attendance tracking, transcript requests, hostel outpass, and campus surveys.</p>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" />
                <span>Sign In as Student (Alex Rivera)</span>
              </button>
            </form>
          )}

          {/* ================= PORTAL 2: FACULTY LOGIN (DIFFERENT ACCESS) ================= */}
          {activePortal === 'faculty' && (
            <form onSubmit={handleFacultySubmit} className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-700 text-white grid place-items-center font-bold">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-emerald-950">Academic Faculty &amp; Instructor Gateway</h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        Staff Intranet
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Restricted to teaching faculty, course coordinators, and departmental academic heads
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillFaculty}
                  className="text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Autofill Faculty</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Faculty Identification Number (FID)
                    </label>
                    <input
                      type="text"
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                      placeholder="e.g. FAC-802"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono uppercase focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Default: FAC-802</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Academic Department
                    </label>
                    <select
                      value={facultyDept}
                      onChange={(e) => setFacultyDept(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-medium focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                      <option value="Electrical Engineering">Electrical &amp; Electronics</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Dean Directorate">Dean of Academics Office</option>
                    </select>
                    <span className="text-[11px] text-slate-400 mt-1 block">Assigned academic unit</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Faculty Departmental Security Key / Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={facultyKey}
                      onChange={(e) => setFacultyKey(e.target.value)}
                      placeholder="Enter faculty security key"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Default staff key: FACULTY#802</span>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={facultyAgreed}
                    onChange={(e) => setFacultyAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700">
                    I confirm my faculty appointment as an accredited course instructor and agree to university grade certification integrity standards.
                  </span>
                </label>
              </div>

              <div className="rounded-xl border border-emerald-200 p-3 bg-emerald-50/50 text-xs text-emerald-900 space-y-1.5">
                <span className="font-bold block">Faculty Clearance Level: Academic Staff (Tier II)</span>
                <p>Grants authority to certify grade registries, endorse student bona-fide transcripts, configure laboratory quotas, and issue departmental advisories.</p>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-3 text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <Fingerprint className="h-4 w-4" />
                <span>Authenticate Faculty Gateway (Dr. Aris Thorne)</span>
              </button>
            </form>
          )}

          {/* ================= PORTAL 3: ADMIN LOGIN (DIFFERENT ACCESS) ================= */}
          {activePortal === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="rounded-2xl border border-amber-300 bg-[#0B2038] text-white p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-400 text-slate-950 grid place-items-center font-bold">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">Executive Administration Vault</h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        High Assurance
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Restricted to Dean of Academic Affairs, University Registrar, and Campus Governance Board
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillAdmin}
                  className="text-xs font-bold text-amber-300 bg-white/10 hover:bg-white/20 border border-amber-400/40 px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Autofill Dean</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Master Administrator UID
                    </label>
                    <input
                      type="text"
                      value={adminUid}
                      onChange={(e) => setAdminUid(e.target.value)}
                      placeholder="e.g. ADM-001"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono uppercase focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Default: ADM-001</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      2FA Hardware Token / Security PIN
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={admin2FaCode}
                      onChange={(e) => setAdmin2FaCode(e.target.value)}
                      placeholder="6-digit TOTP"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono tracking-widest text-center focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Default: 849201</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institutional Master Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassphrase}
                      onChange={(e) => setAdminPassphrase(e.target.value)}
                      placeholder="Enter master passphrase"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-100 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Default: ADMIN*DEAN2026</span>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-200 bg-amber-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminAuditConfirmed}
                    onChange={(e) => setAdminAuditConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-amber-700 focus:ring-amber-500"
                  />
                  <span className="text-xs text-amber-950">
                    I acknowledge that this executive session will be cryptographically hashed and logged to the permanent University Governance Audit Trail.
                  </span>
                </label>
              </div>

              <div className="rounded-xl border border-slate-900/10 p-3 bg-slate-900 text-white text-xs space-y-1.5">
                <span className="font-bold text-amber-400 block">Executive Clearance Level: Institutional Dean (Tier I - Full)</span>
                <p className="text-slate-300">Unlocks AI grievance auto-triage overrides, university-wide emergency broadcasts, gatepass final seals, and institution-wide analytics.</p>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0B2038] hover:bg-[#123154] text-amber-400 border border-amber-400/40 py-3 text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Verify Master Credentials &amp; Unlock Admin Vault</span>
              </button>
            </form>
          )}

          {/* Sandbox Controls */}
          {onResetDemoData && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Testing local persistence data?</span>
              <button
                type="button"
                onClick={() => {
                  onResetDemoData();
                  setResetConfirmed(true);
                  setTimeout(() => setResetConfirmed(false), 3000);
                }}
                className="hover:text-slate-800 font-bold flex items-center gap-1 text-slate-600"
              >
                <RefreshCw className="h-3 w-3" />
                <span>{resetConfirmed ? 'Demo Reset Complete!' : 'Reset Demo Records'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50/70">
          <span className="text-[11px] text-slate-400">Yukti Multi-Role RBAC • Local Mode</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
