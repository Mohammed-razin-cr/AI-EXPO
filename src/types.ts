export type UserRole = 'student' | 'faculty' | 'admin';

export type LightThemePreset = 'swiss' | 'daylight' | 'porcelain' | 'frost' | 'linen';

export interface LightThemeOption {
  id: LightThemePreset;
  name: string;
  description: string;
  bgHex: string;
  cardHex: string;
  accentHex: string;
  borderHex: string;
}

export interface UserProfile {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  year: string;
  semester: string;
  hostelBlock: string;
  roomNo: string;
  cgpa: number;
  currentGpa: number;
  overallAttendance: number;
  phone: string;
}

export interface AcademicCourse {
  id: string;
  code: string;
  title: string;
  instructor: string;
  credits: number;
  attendancePercentage: number;
  classesAttended: number;
  totalClasses: number;
  grade?: string;
  schedule: string;
  room: string;
  syllabusProgress: number;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  courseCode: string;
  courseTitle: string;
  room: string;
  instructor: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export type DocumentType = 'bonafide' | 'transcript' | 'noc' | 'id_card' | 'bus_pass';
export type DocumentStatus = 'submitted' | 'under_review' | 'hod_approved' | 'ready' | 'rejected';

export interface DocumentTimelineStep {
  title: string;
  date: string;
  status: 'done' | 'current' | 'pending';
  desc: string;
}

export interface DocumentRequest {
  id: string;
  refCode: string;
  type: DocumentType;
  title: string;
  purpose: string;
  studentName: string;
  rollNo: string;
  submittedAt: string;
  expectedDate: string;
  status: DocumentStatus;
  urgency: 'normal' | 'express';
  timeline: DocumentTimelineStep[];
  downloadUrl?: string;
  verifierRemarks?: string;
}

export type ComplaintCategory = 'hostel' | 'mess' | 'academic' | 'it' | 'cleanliness' | 'other';
export type ComplaintUrgency = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintStatus = 'open' | 'investigating' | 'action_taken' | 'resolved';

export interface ComplaintComment {
  id: string;
  sender: string;
  role: 'Student' | 'Warden' | 'IT Admin' | 'Dean Office' | 'Technician';
  message: string;
  timestamp: string;
}

export interface SmartComplaint {
  id: string;
  ticketNo: string;
  title: string;
  category: ComplaintCategory;
  location: string;
  description: string;
  urgency: ComplaintUrgency;
  status: ComplaintStatus;
  submittedAt: string;
  studentName: string;
  rollNo: string;
  aiTriage?: {
    department: string;
    estimatedHours: number;
    severityReason: string;
    suggestedFix: string;
  };
  comments: ComplaintComment[];
  resolutionNotes?: string;
}

export interface HostelPass {
  id: string;
  passNo: string;
  studentName: string;
  rollNo: string;
  roomNo: string;
  reason: string;
  outDate: string;
  inDate: string;
  destination: string;
  status: 'pending' | 'approved' | 'rejected';
  wardenRemarks?: string;
  qrPayload: string;
}

export interface MessMenuDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  specialDietNote?: string;
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  category: 'urgent' | 'academic' | 'placements' | 'event' | 'hostel';
  summary: string;
  date: string;
  author: string;
  badge?: string;
  isUrgent?: boolean;
}

export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  category: 'academic' | 'hostel' | 'document' | 'complaint' | 'alert';
  read: boolean;
  actionTab?: string;
}

export interface FeedbackItem {
  id: string;
  type: 'course' | 'facility' | 'mess' | 'general';
  targetName: string;
  rating: number; // 1-5
  comments: string;
  sentiment: 'positive' | 'neutral' | 'critical';
  date: string;
  studentRoll: string;
}

export interface PromiseCheckClaim {
  claim: string;
  verdict: 'Verifiable' | 'Exaggerated' | 'Unsubstantiated';
  reason: string;
}

export interface PromiseCheckVagueLanguage {
  phrase: string;
  whyVague: string;
  industryReality: string;
}

export interface PromiseCheckMissingEvidence {
  missingItem: string;
  whyCritical: string;
}

export interface PromiseCheckFinancialRisk {
  riskFactor: string;
  redFlagLevel: 'High' | 'Medium' | 'Critical';
  breakdown: string;
}

export interface PromiseCheckQuestion {
  question: string;
  targetToAsk: string;
  whatToLookFor: string;
}

export interface PromiseCheckResult {
  instituteName?: string;
  overallRiskScore: number; // 0 - 100
  riskLevel: 'Low Risk' | 'Moderate Caution' | 'High Financial Risk' | 'Severe Scam Alert';
  verifiableClaims: PromiseCheckClaim[];
  vagueMarketingLanguage: PromiseCheckVagueLanguage[];
  missingEvidence: PromiseCheckMissingEvidence[];
  financialRiskIndicators: PromiseCheckFinancialRisk[];
  questionsToAsk: PromiseCheckQuestion[];
  summaryDecisionSupport: string;
}

export type CampusFindCategory = 'electronics' | 'id_card' | 'backpack' | 'keys' | 'books' | 'accessories' | 'other';
export type CampusFindType = 'lost' | 'found';
export type CampusFindStatus = 'open' | 'matched' | 'claimed' | 'returned';

export interface CampusFindItem {
  id: string;
  type: CampusFindType;
  title: string;
  category: CampusFindCategory;
  description: string;
  location: string;
  date: string;
  reporterName: string;
  reporterContact: string;
  imageUri?: string;
  status: CampusFindStatus;
  claimCode: string;
  matchedItemId?: string;
  matchReason?: string;
}
