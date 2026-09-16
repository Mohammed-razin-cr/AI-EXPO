import React, { useState } from 'react';
import { X, Lock, Shield, GraduationCap, Briefcase, Check } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUserRole: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUserRole,
}) => {
  const [identifier, setIdentifier] = useState(currentUser.rollNo);
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectUserRole(selectedRole);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleQuickDemoSwitch = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') setIdentifier('2024CS104');
    if (role === 'faculty') setIdentifier('FAC-802');
    if (role === 'admin') setIdentifier('ADM-001');
    onSelectUserRole(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-[8px_8px_0px_#0f172a] text-slate-950">
        <div className="p-5 border-b-2 border-slate-900 flex items-center justify-between bg-yellow-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-slate-950 shadow-[1.5px_1.5px_0px_#0f172a]">
              <Shield className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950">Campus SSO &amp; Role Access</h3>
              <p className="text-xs text-slate-700 font-medium">Authenticate identity or switch campus view</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-700 hover:text-black hover:bg-yellow-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Demo Role Picker */}
          <div>
            <label className="text-xs font-black text-slate-900 block mb-2">
              Instant Demo Role Profile:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('student')}
                className={`p-2.5 rounded-xl border-2 border-slate-900 text-center transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-yellow-300 text-slate-950 shadow-[2.5px_2.5px_0px_#0f172a] font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0f172a] font-bold'
                }`}
              >
                <GraduationCap className="w-5 h-5 mx-auto mb-1 stroke-[2.5]" />
                <span className="text-xs block">Student</span>
                <span className="text-[10px] text-slate-600 block">Alex R.</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('faculty')}
                className={`p-2.5 rounded-xl border-2 border-slate-900 text-center transition-all cursor-pointer ${
                  selectedRole === 'faculty'
                    ? 'bg-yellow-300 text-slate-950 shadow-[2.5px_2.5px_0px_#0f172a] font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0f172a] font-bold'
                }`}
              >
                <Briefcase className="w-5 h-5 mx-auto mb-1 stroke-[2.5]" />
                <span className="text-xs block">Faculty</span>
                <span className="text-[10px] text-slate-600 block">Dr. Thorne</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('admin')}
                className={`p-2.5 rounded-xl border-2 border-slate-900 text-center transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-yellow-300 text-slate-950 shadow-[2.5px_2.5px_0px_#0f172a] font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0f172a] font-bold'
                }`}
              >
                <Shield className="w-5 h-5 mx-auto mb-1 stroke-[2.5]" />
                <span className="text-xs block">Admin</span>
                <span className="text-[10px] text-slate-600 block">Dean Vance</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-900 block mb-1">
                Institutional ID / Roll Number
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm text-slate-950 font-bold focus:outline-none focus:bg-yellow-50 shadow-[1.5px_1.5px_0px_#0f172a]"
                placeholder="e.g. 2024CS104"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-900 block mb-1">
                Campus Portal Password / PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-sm text-slate-950 font-bold focus:outline-none focus:bg-yellow-50 shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
                <Lock className="w-4 h-4 text-slate-600 absolute right-3 top-3 stroke-[2.5]" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700 font-bold pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-2 border-slate-900 text-yellow-400 focus:ring-0" />
                <span>Keep me signed in</span>
              </label>
              <span className="text-slate-900 underline cursor-pointer">Forgot password?</span>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 text-sm font-black shadow-[3px_3px_0px_#0f172a] flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-5 h-5 text-emerald-800 stroke-[3]" />
                  Authenticated!
                </>
              ) : (
                `Enter as ${selectedRole.toUpperCase()}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
