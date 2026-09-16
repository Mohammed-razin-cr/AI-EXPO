import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  FileText,
  AlertCircle,
  Home,
  Megaphone,
  MessageSquare,
  BarChart3,
  Bot,
  Bell,
  LayoutDashboard,
  Building2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { AssistantDrawer } from './components/AssistantDrawer';
import { LandingPageView } from './components/LandingPageView';
import { AcademicView } from './components/AcademicView';
import { PromiseCheckView } from './components/PromiseCheckView';
import { CampusFindView } from './components/CampusFindView';
import { DocumentRequestView } from './components/DocumentRequestView';
import { ComplaintManagementView } from './components/ComplaintManagementView';
import { HostelServicesView } from './components/HostelServicesView';
import { AnnouncementsNotificationsView } from './components/AnnouncementsNotificationsView';
import { FeedbackView } from './components/FeedbackView';
import { AdminDashboardView } from './components/AdminDashboardView';

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
} from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_STUDENT);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentLanguage, setCurrentLanguage] = useState<string>('English');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Ensure clean, daylight appearance without dark mode
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-light-theme');
  }, []);

  // Application Data States
  const [courses] = useState<AcademicCourse[]>(SAMPLE_COURSES);
  const [timetable] = useState<TimetableSlot[]>(SAMPLE_TIMETABLE);
  const [documents, setDocuments] = useState<DocumentRequest[]>(SAMPLE_DOCUMENTS);
  const [complaints, setComplaints] = useState<SmartComplaint[]>(SAMPLE_COMPLAINTS);
  const [passes, setPasses] = useState<HostelPass[]>(SAMPLE_HOSTEL_PASSES);
  const [messMenu] = useState<MessMenuDay[]>(SAMPLE_MESS_MENU);
  const [announcements] = useState<CampusAnnouncement[]>(SAMPLE_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<CampusNotification[]>(SAMPLE_NOTIFICATIONS);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(SAMPLE_FEEDBACK);
  const [campusFindItems, setCampusFindItems] = useState<CampusFindItem[]>(SAMPLE_CAMPUS_FIND_ITEMS);

  // Role Switcher
  const handleSwitchRole = (role: UserRole) => {
    if (role === 'student') setCurrentUser(INITIAL_USER_STUDENT);
    else if (role === 'faculty') setCurrentUser(INITIAL_USER_FACULTY);
    else if (role === 'admin') setCurrentUser(INITIAL_USER_ADMIN);
  };

  // Notification Actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
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
        message: `Warden approved outpass for ${newPass.destination}. Show QR code to campus gate security.`,
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

  // Tab List - Concise & Uncluttered
  const TABS = [
    { id: 'landing', label: 'Overview', icon: LayoutDashboard },
    { id: 'academic', label: 'Academics', icon: GraduationCap },
    { id: 'promisecheck', label: 'PromiseCheck AI', icon: ShieldCheck },
    { id: 'campusfind', label: 'CampusFind', icon: Sparkles },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'hostel', label: 'Hostel & Mess', icon: Building2 },
    { id: 'announcements', label: 'Notices', icon: Megaphone },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'admin', label: 'Admin', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-slate-900 flex flex-col selection:bg-yellow-300 selection:text-slate-950 neo-grid-pattern">
      {/* Top Navigation */}
      <Navbar
        user={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Clean, Unified Sub-Navigation (hidden on landing page) */}
      {activeTab !== 'landing' && (
        <nav className="border-b-2 border-slate-900 bg-white sticky top-16 z-30 shadow-[0px_2px_0px_#0f172a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-yellow-300 text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]'
                        : 'text-slate-600 hover:text-slate-950 font-bold hover:bg-slate-100 border border-transparent'
                    }`}
                    id={`tab-btn-${tab.id}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPageView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAssistant={(prompt) => setIsAssistantOpen(true)}
            onSwitchRole={handleSwitchRole}
            currentUser={currentUser}
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

        {activeTab === 'admin' && (
          <AdminDashboardView
            user={currentUser}
            complaints={complaints}
            documents={documents}
            feedback={feedbackList}
            onUpdateComplaintStatus={handleUpdateComplaintStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-slate-900 bg-white py-6 text-center text-xs text-slate-800 transition-colors duration-200 shadow-[0px_-2px_0px_#0f172a]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 uppercase tracking-tight">Campus360 AI &amp; PromiseCheck</span>
            <span className="text-slate-500">•</span>
            <span className="font-bold text-slate-700">Unified Student Intelligence &amp; Decision Support</span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 font-mono">
            Protected by Campus360 AI • PromiseCheck Decision Support System • Powered by Google Gemini
          </p>
        </div>
      </footer>

      {/* Multilingual Voice/Text AI Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        user={currentUser}
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
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onSelectUserRole={handleSwitchRole}
      />
    </div>
  );
}
