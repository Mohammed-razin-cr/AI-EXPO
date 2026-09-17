import React, { useState } from 'react';
import { useLocalDemoState } from './lib/localDemo';
import { LocalDemoStatus } from './components/LocalDemoStatus';
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  FileText,
  AlertCircle,
  Megaphone,
  MessageSquare,
  BarChart3,
  LayoutDashboard,
  Building2,
  Vote,
  User,
  Key,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { CampusNavigation } from './components/CampusNavigation';
import { LoginModal } from './components/LoginModal';
import { AssistantDrawer } from './components/AssistantDrawer';
import { LandingPageView } from './components/LandingPageView';
import { PublicLandingPage } from './components/PublicLandingPage';
import { YuktiLogo } from './components/YuktiLogo';
import { AcademicView } from './components/AcademicView';
import { PromiseCheckView } from './components/PromiseCheckView';
import { CampusFindView } from './components/CampusFindView';
import { DocumentRequestView } from './components/DocumentRequestView';
import { ComplaintManagementView } from './components/ComplaintManagementView';
import { HostelServicesView } from './components/HostelServicesView';
import { AnnouncementsNotificationsView } from './components/AnnouncementsNotificationsView';
import { FeedbackView } from './components/FeedbackView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { CampusSurveysView } from './components/CampusSurveysView';
import { ProfileView } from './components/ProfileView';

import {
  UserProfile,
  UserRole,
  AcademicCourse,
  TimetableSlot,
  DocumentRequest,
  SmartComplaint,
  HostelPass,
  MessMenuDay,
  CampusAnnouncement,
  CampusNotification,
  FeedbackItem,
  CampusFindItem,
  CampusSurvey,
} from './types';

import {
  INITIAL_USER_STUDENT,
  INITIAL_USER_FACULTY,
  INITIAL_USER_ADMIN,
  SAMPLE_COURSES,
  SAMPLE_TIMETABLE,
  SAMPLE_DOCUMENTS,
  SAMPLE_COMPLAINTS,
  SAMPLE_HOSTEL_PASSES,
  SAMPLE_MESS_MENU,
  SAMPLE_ANNOUNCEMENTS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_FEEDBACK,
  SAMPLE_CAMPUS_FIND_ITEMS,
  SAMPLE_SURVEYS,
} from './data/mockData';

const MODULE_IDS = ['landing', 'overview', 'profile', 'academic', 'promisecheck', 'campusfind', 'documents', 'complaints', 'hostel', 'announcements', 'feedback', 'surveys', 'admin'];
const readLocation = () => {
  const id = window.location.hash.slice(1);
  return MODULE_IDS.includes(id) ? id : 'landing';
};

export default function App() {
  const [currentUser, setCurrentUser] = useLocalDemoState<UserProfile>('user-profile', INITIAL_USER_STUDENT);
  const [activeTab, updateActiveTab] = useState<string>(readLocation);
  const setActiveTab = (id: string) => {
    if (!MODULE_IDS.includes(id)) return;
    if (window.location.hash !== '#' + id) window.history.pushState(null, '', '#' + id);
    updateActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  React.useEffect(() => {
    const syncLocation = () => { updateActiveTab(readLocation()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('popstate', syncLocation);
    window.addEventListener('hashchange', syncLocation);
    return () => { window.removeEventListener('popstate', syncLocation); window.removeEventListener('hashchange', syncLocation); };
  }, []);
  const [currentLanguage, setCurrentLanguage] = useState<string>('English');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginTargetRole, setLoginTargetRole] = useState<UserRole | undefined>(undefined);

  const handleOpenLogin = (role?: UserRole) => {
    setLoginTargetRole(role);
    setIsLoginModalOpen(true);
  };

  // Ensure clean, daylight appearance without dark mode
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-light-theme');
  }, []);

  // Application Data States
  const [courses] = useState<AcademicCourse[]>(SAMPLE_COURSES);
  const [timetable] = useState<TimetableSlot[]>(SAMPLE_TIMETABLE);
  const [documents, setDocuments] = useLocalDemoState<DocumentRequest[]>('documents',SAMPLE_DOCUMENTS);
  const [complaints, setComplaints] = useLocalDemoState<SmartComplaint[]>('complaints',SAMPLE_COMPLAINTS);
  const [passes, setPasses] = useLocalDemoState<HostelPass[]>('passes',SAMPLE_HOSTEL_PASSES);
  const [messMenu] = useState<MessMenuDay[]>(SAMPLE_MESS_MENU);
  const [announcements] = useState<CampusAnnouncement[]>(SAMPLE_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useLocalDemoState<CampusNotification[]>('notifications',SAMPLE_NOTIFICATIONS);
  const [feedbackList, setFeedbackList] = useLocalDemoState<FeedbackItem[]>('feedback',SAMPLE_FEEDBACK);
  const [campusFindItems, setCampusFindItems] = useLocalDemoState<CampusFindItem[]>('campusfind',SAMPLE_CAMPUS_FIND_ITEMS);
  const [surveys, setSurveys] = useLocalDemoState<CampusSurvey[]>('surveys', SAMPLE_SURVEYS);

  // Role Switcher & User Updater
  const handleSwitchRole = (role: UserRole) => {
    if (role === 'student') setCurrentUser(INITIAL_USER_STUDENT);
    else if (role === 'faculty') setCurrentUser(INITIAL_USER_FACULTY);
    else if (role === 'admin') setCurrentUser(INITIAL_USER_ADMIN);
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USER_STUDENT);
    setDocuments(SAMPLE_DOCUMENTS);
    setComplaints(SAMPLE_COMPLAINTS);
    setPasses(SAMPLE_HOSTEL_PASSES);
    setNotifications(SAMPLE_NOTIFICATIONS);
    setFeedbackList(SAMPLE_FEEDBACK);
    setCampusFindItems(SAMPLE_CAMPUS_FIND_ITEMS);
    setSurveys(SAMPLE_SURVEYS);
  };

  // Notification Actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications(prev => prev.filter(notification => !notification.read));
  };

  // Add Handlers
  const handleAddDocumentRequest = (newDoc: DocumentRequest) => {
    setDocuments((prev) => [newDoc, ...prev]);
    // Also push smart notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Document Requested: ${newDoc.title}`,
        message: `Reference ${newDoc.refCode} lodged with Registrar. Expected delivery: ${newDoc.expectedDate}.`,
        timeAgo: 'Just now',
        category: 'document',
        read: false,
        actionTab: 'documents',
      },
      ...prev,
    ]);
  };

  const handleAddComplaint = (newTicket: SmartComplaint) => {
    setComplaints((prev) => [newTicket, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Grievance Logged: ${newTicket.ticketNo}`,
        message: `AI Auto-Triage routed ticket to ${newTicket.aiTriage?.department}. Expected SLA: ${newTicket.aiTriage?.estimatedHours}h.`,
        timeAgo: 'Just now',
        category: 'complaint',
        read: false,
        actionTab: 'complaints',
      },
      ...prev,
    ]);
  };

  const handleAddComplaintComment = (complaintId: string, commentText: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const newComment = {
            id: `c-${Date.now()}`,
            sender: currentUser.name,
            role: (currentUser.role === 'student' ? 'Student' : currentUser.role === 'faculty' ? 'Warden' : 'Dean Office') as any,
            message: commentText,
            timestamp: 'Just now',
          };
          return { ...c, comments: [...c.comments, newComment] };
        }
        return c;
      })
    );
  };

  const handleUpdateComplaintStatus = (complaintId: string, status: SmartComplaint['status']) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status } : c))
    );
  };

  const handleRequestHostelPass = (newPass: HostelPass) => {
    setPasses((prev) => [newPass, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Gatepass Issued: ${newPass.passNo}`,
        message: `Demo outpass created for ${newPass.destination}. View trip details in Hostel & Mess.`,
        timeAgo: 'Just now',
        category: 'hostel',
        read: false,
        actionTab: 'hostel',
      },
      ...prev,
    ]);
  };

  const handleAddFeedback = (newFb: FeedbackItem) => {
    setFeedbackList((prev) => [newFb, ...prev]);
  };

  const handleAddCampusFindItem = (newItem: CampusFindItem) => {
    setCampusFindItems((prev) => [newItem, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `CampusFind Alert: ${newItem.title}`,
        message: `New ${newItem.type.toUpperCase()} report filed at ${newItem.location}. Claim code: ${newItem.claimCode}.`,
        timeAgo: 'Just now',
        category: 'alert',
        read: false,
        actionTab: 'campusfind',
      },
      ...prev,
    ]);
  };

  const handleUpdateCampusFindStatus = (id: string, status: CampusFindItem['status']) => {
    setCampusFindItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  // Survey Actions
  const handleVoteSurvey = (surveyId: string, optionId: string) => {
    setSurveys((prev) =>
      prev.map((survey) => {
        if (survey.id !== surveyId) return survey;
        const alreadyVoted = survey.voters.some(
          (v) => v.userId === currentUser.id || v.userRollNo === currentUser.rollNo
        );
        if (alreadyVoted) return survey;

        const updatedOptions = survey.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        const newVoterRecord: import('./types').SurveyVoterRecord = {
          userId: currentUser.id,
          userRollNo: currentUser.rollNo,
          selectedOptionId: optionId,
          timestamp: 'Just now',
          department: currentUser.department,
          year: currentUser.year,
        };
        return {
          ...survey,
          totalVotes: survey.totalVotes + 1,
          options: updatedOptions,
          voters: [newVoterRecord, ...survey.voters],
        };
      })
    );

    const targetSurvey = surveys.find((s) => s.id === surveyId);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Response Submitted',
        message: `Your ballot for "${targetSurvey?.title || 'Campus Poll'}" has been securely counted. Real-time results updated.`,
        timeAgo: 'Just now',
        category: 'academic',
        read: false,
        actionTab: 'surveys',
      },
      ...prev,
    ]);
  };

  const handlePublishSurvey = (newSurvey: CampusSurvey) => {
    setSurveys((prev) => [newSurvey, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `New Campus Poll Published`,
        message: `"${newSurvey.title}" is now live for voting across ${newSurvey.targetAudience}.`,
        timeAgo: 'Just now',
        category: 'announcement',
        read: false,
        actionTab: 'surveys',
      },
      ...prev,
    ]);
  };

  const handleToggleSurveyStatus = (surveyId: string) => {
    setSurveys((prev) =>
      prev.map((s) =>
        s.id === surveyId ? { ...s, status: s.status === 'active' ? 'closed' : 'active' } : s
      )
    );
  };

  const handleDeleteSurvey = (surveyId: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== surveyId));
  };

  const handleSimulateIncomingVote = (surveyId: string, optionId: string) => {
    setSurveys((prev) =>
      prev.map((survey) => {
        if (survey.id !== surveyId || survey.status !== 'active') return survey;
        return {
          ...survey,
          totalVotes: survey.totalVotes + 1,
          options: survey.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        };
      })
    );
  };

  // Tab List - Concise & Uncluttered (Profile is solely accessible via top right option)
  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'academic', label: 'Academics', icon: GraduationCap },
    { id: 'promisecheck', label: 'PromiseCheck', icon: ShieldCheck },
    { id: 'campusfind', label: 'CampusFind', icon: Sparkles },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'hostel', label: 'Hostel & Mess', icon: Building2 },
    { id: 'announcements', label: 'Notices', icon: Megaphone },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'surveys', label: 'Campus Surveys', icon: Vote },
    { id: 'admin', label: 'Admin', icon: BarChart3 },
  ];

  if (activeTab === 'landing') {
    return <PublicLandingPage onNavigate={setActiveTab} onExploreRole={(role) => { handleSwitchRole(role); setActiveTab(role === 'admin' ? 'admin' : 'overview'); }} />;
  }

  return (
    <div className="campus-app min-h-screen text-slate-900 flex flex-col">
      <a href="#main-content" className="sr-only z-[100] rounded-lg bg-white px-4 py-3 font-bold text-slate-950 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to main content
      </a>
      {/* Top Navigation */}
      <Navbar
        user={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenLogin={handleOpenLogin}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onClearNotifications={handleClearNotifications}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <CampusNavigation tabs={TABS} activeTab={activeTab} onNavigate={setActiveTab} onOpenAssistant={() => setIsAssistantOpen(true)} />

      {/* Main Viewport */}
      <main id="main-content" className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <LocalDemoStatus />
        {activeTab === 'overview' && (
          <LandingPageView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            courses={courses}
            timetable={timetable}
            documents={documents}
            notifications={notifications}
            announcements={announcements}
            currentUser={currentUser}
            complaints={complaints}
            passes={passes}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onSwitchRole={handleSwitchRole}
            onOpenLogin={handleOpenLogin}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicView
            user={currentUser}
            courses={courses}
            timetable={timetable}
            onOpenDocumentRequest={() => setActiveTab('documents')}
          />
        )}

        {activeTab === 'promisecheck' && <PromiseCheckView />}

        {activeTab === 'campusfind' && (
          <CampusFindView
            items={campusFindItems}
            user={currentUser}
            onAddItem={handleAddCampusFindItem}
            onUpdateItemStatus={handleUpdateCampusFindStatus}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentRequestView
            documents={documents}
            user={currentUser}
            onRequestNew={handleAddDocumentRequest}
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintManagementView
            complaints={complaints}
            user={currentUser}
            onAddComplaint={handleAddComplaint}
            onAddComment={handleAddComplaintComment}
            onUpdateStatus={handleUpdateComplaintStatus}
          />
        )}

        {activeTab === 'hostel' && (
          <HostelServicesView
            user={currentUser}
            passes={passes}
            messMenu={messMenu}
            onRequestPass={handleRequestHostelPass}
            onOpenMaintenanceGrievance={() => setActiveTab('complaints')}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsNotificationsView
            announcements={announcements}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            onClearNotifications={handleClearNotifications}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackView
            user={currentUser}
            feedbackList={feedbackList}
            onAddFeedback={handleAddFeedback}
          />
        )}

        {activeTab === 'surveys' && (
          <CampusSurveysView
            user={currentUser}
            surveys={surveys}
            onVote={handleVoteSurvey}
            onPublishSurvey={handlePublishSurvey}
            onToggleStatus={handleToggleSurveyStatus}
            onDeleteSurvey={handleDeleteSurvey}
            onSimulateIncomingVote={handleSimulateIncomingVote}
          />
        )}

        {activeTab === 'admin' && (
          currentUser.role === 'admin' ? (
            <AdminDashboardView
              user={currentUser}
              complaints={complaints}
              documents={documents}
              feedback={feedbackList}
              passes={passes}
              onUpdatePass={(id,status) => setPasses(previous => previous.map(pass => pass.id === id ? {...pass,status} : pass))}
              onUpdateDocument={(id,status) => setDocuments(previous => previous.map(doc => doc.id === id ? {...doc,status,timeline:doc.timeline.map((step,index) => {const stage = ['submitted','under_review','hod_approved','ready'].indexOf(status);return {...step,status:index <= stage ? 'done' : index === stage+1 ? 'current' : 'pending',date:index<=stage?'Updated in local demo':'Pending'};})} : doc))}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
            />
          ) : (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-[#0B2038] text-amber-400 grid place-items-center shadow-lg">
                <ShieldCheck className="h-9 w-9" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
                  Executive Clearance Required
                </span>
                <h2 className="text-2xl font-black text-slate-900">Institutional Governance Portal Locked</h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Access to executive grievance auto-triage, departmental approvals, and institutional seals requires authenticated Administrator (Dean / Registrar ADM-001) credentials.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 inline-flex items-center justify-center gap-3">
                <span>Active session:</span>
                <span className="font-bold text-slate-900">{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold capitalize">{currentUser.role}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenLogin('admin')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B2038] hover:bg-[#123154] text-amber-400 font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  <span>Authenticate via Executive Admin Portal</span>
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
                >
                  Return to Overview
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-600">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <YuktiLogo size={18} variant="color" />
            <span className="font-extrabold text-slate-900">Yukti AI</span>
            <span className="text-slate-300">•</span>
            <span>Built for student success</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            Local demo • Gemini, Groq & local MiniLM
          </p>
        </div>
      </footer>

      {/* Multilingual Voice/Text AI Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        user={currentUser}
        campusContext={{courses,timetable,documents:documents.map(d=>({title:d.title,status:d.status})),complaints:complaints.map(c=>({title:c.title,status:c.status})),passes:passes.map(p=>({destination:p.destination,status:p.status})),messMenu,announcements}}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsAssistantOpen(false);
        }}
      />

      {/* Role Switcher & Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginTargetRole(undefined);
        }}
        currentUser={currentUser}
        targetRole={loginTargetRole}
        onSelectUserRole={handleSwitchRole}
        onNavigateToProfile={() => setActiveTab('profile')}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}
