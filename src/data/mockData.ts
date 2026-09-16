import {
  UserProfile,
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
  PromiseCheckResult
} from '../types';

export const INITIAL_USER_STUDENT: UserProfile = {
  id: 'usr-student-01',
  name: 'Alex Rivera',
  rollNo: '2024CS104',
  email: 'alex.rivera@campus.edu',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  semester: 'Semester 6',
  hostelBlock: 'Block-B (Falcon Hall)',
  roomNo: 'B-312',
  cgpa: 8.84,
  currentGpa: 9.12,
  overallAttendance: 84.5,
  phone: '+1 (555) 438-9201'
};

export const INITIAL_USER_FACULTY: UserProfile = {
  id: 'usr-faculty-01',
  name: 'Dr. Aris Thorne',
  rollNo: 'FAC-802',
  email: 'a.thorne@campus.edu',
  role: 'faculty',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  department: 'Computer Science & Engineering',
  year: 'Associate Professor',
  semester: 'Academic Head',
  hostelBlock: 'Faculty Quarters Q-14',
  roomNo: 'Office 402',
  cgpa: 0,
  currentGpa: 0,
  overallAttendance: 98,
  phone: '+1 (555) 892-1100'
};

export const INITIAL_USER_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  name: 'Dean Eleanor Vance',
  rollNo: 'ADM-001',
  email: 'eleanor.vance@campus.edu',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  department: 'Office of Academic Affairs & Administration',
  year: 'Administration',
  semester: 'Registrar Directorate',
  hostelBlock: 'Admin Main Tower',
  roomNo: 'Suite 101',
  cgpa: 0,
  currentGpa: 0,
  overallAttendance: 100,
  phone: '+1 (555) 200-3499'
};

export const SAMPLE_COURSES: AcademicCourse[] = [
  {
    id: 'crs-1',
    code: 'CS601',
    title: 'Distributed Systems & Cloud Computing',
    instructor: 'Dr. Aris Thorne',
    credits: 4,
    attendancePercentage: 88.5,
    classesAttended: 31,
    totalClasses: 35,
    grade: 'A',
    schedule: 'Mon, Wed 09:30 AM - 11:00 AM',
    room: 'Hall 3B',
    syllabusProgress: 72
  },
  {
    id: 'crs-2',
    code: 'CS602',
    title: 'Machine Learning & Deep Neural Networks',
    instructor: 'Prof. Sarah Jenkins',
    credits: 4,
    attendancePercentage: 73.5, // Alert below 75%
    classesAttended: 25,
    totalClasses: 34,
    grade: 'A-',
    schedule: 'Tue, Thu 11:15 AM - 12:45 PM',
    room: 'Turing Lab 102',
    syllabusProgress: 65
  },
  {
    id: 'crs-3',
    code: 'CS603',
    title: 'Advanced Database Systems & Web Architecture',
    instructor: 'Dr. Michael Chang',
    credits: 3,
    attendancePercentage: 91.2,
    classesAttended: 31,
    totalClasses: 34,
    grade: 'A+',
    schedule: 'Mon, Fri 02:00 PM - 03:30 PM',
    room: 'Hall 2A',
    syllabusProgress: 80
  },
  {
    id: 'crs-4',
    code: 'CS604',
    title: 'Software Engineering & Agile DevOps',
    instructor: 'Prof. David Brooks',
    credits: 3,
    attendancePercentage: 85.0,
    classesAttended: 28,
    totalClasses: 33,
    grade: 'B+',
    schedule: 'Wed, Fri 11:15 AM - 12:45 PM',
    room: 'Hall 4C',
    syllabusProgress: 60
  },
  {
    id: 'crs-5',
    code: 'HU601',
    title: 'Professional Ethics, Cyber Law & IPR',
    instructor: 'Dr. Fiona Gallagher',
    credits: 2,
    attendancePercentage: 95.0,
    classesAttended: 19,
    totalClasses: 20,
    grade: 'A',
    schedule: 'Thursday 02:00 PM - 04:00 PM',
    room: 'Auditorium B',
    syllabusProgress: 85
  }
];

export const SAMPLE_TIMETABLE: TimetableSlot[] = [
  { id: 'tt-1', day: 'Monday', time: '09:30 AM - 11:00 AM', courseCode: 'CS601', courseTitle: 'Distributed Systems', room: 'Hall 3B', instructor: 'Dr. Aris Thorne', type: 'Lecture' },
  { id: 'tt-2', day: 'Monday', time: '11:15 AM - 01:15 PM', courseCode: 'CS602L', courseTitle: 'ML Lab Practical', room: 'Turing Lab 102', instructor: 'Prof. Sarah Jenkins', type: 'Lab' },
  { id: 'tt-3', day: 'Monday', time: '02:00 PM - 03:30 PM', courseCode: 'CS603', courseTitle: 'Advanced Database Systems', room: 'Hall 2A', instructor: 'Dr. Michael Chang', type: 'Lecture' },
  { id: 'tt-4', day: 'Tuesday', time: '10:00 AM - 11:30 AM', courseCode: 'CS604', courseTitle: 'DevOps & CI/CD Pipeline', room: 'Hall 4C', instructor: 'Prof. David Brooks', type: 'Lecture' },
  { id: 'tt-5', day: 'Tuesday', time: '11:15 AM - 12:45 PM', courseCode: 'CS602', courseTitle: 'Machine Learning', room: 'Hall 1A', instructor: 'Prof. Sarah Jenkins', type: 'Lecture' },
  { id: 'tt-6', day: 'Wednesday', time: '09:30 AM - 11:00 AM', courseCode: 'CS601', courseTitle: 'Distributed Systems', room: 'Hall 3B', instructor: 'Dr. Aris Thorne', type: 'Lecture' },
  { id: 'tt-7', day: 'Wednesday', time: '02:00 PM - 04:00 PM', courseCode: 'CS601L', courseTitle: 'Cloud Infrastructure Lab', room: 'Cyber Lab 2', instructor: 'Dr. Aris Thorne', type: 'Lab' },
  { id: 'tt-8', day: 'Thursday', time: '11:15 AM - 12:45 PM', courseCode: 'CS602', courseTitle: 'Deep Learning', room: 'Hall 1A', instructor: 'Prof. Sarah Jenkins', type: 'Lecture' },
  { id: 'tt-9', day: 'Thursday', time: '02:00 PM - 04:00 PM', courseCode: 'HU601', courseTitle: 'Ethics & Cyber Law', room: 'Auditorium B', instructor: 'Dr. Fiona Gallagher', type: 'Tutorial' },
  { id: 'tt-10', day: 'Friday', time: '11:15 AM - 12:45 PM', courseCode: 'CS604', courseTitle: 'Software Engineering', room: 'Hall 4C', instructor: 'Prof. David Brooks', type: 'Lecture' },
  { id: 'tt-11', day: 'Friday', time: '02:00 PM - 03:30 PM', courseCode: 'CS603', courseTitle: 'Database Architecture', room: 'Hall 2A', instructor: 'Dr. Michael Chang', type: 'Lecture' },
];

export const SAMPLE_DOCUMENTS: DocumentRequest[] = [
  {
    id: 'doc-1',
    refCode: 'DOC-2026-9041',
    type: 'bonafide',
    title: 'Bonafide Student Certificate',
    purpose: 'Education Loan Renewal & Bank Passport Verification',
    studentName: 'Alex Rivera',
    rollNo: '2024CS104',
    submittedAt: '2026-09-12 10:15 AM',
    expectedDate: '2026-09-14',
    status: 'ready',
    urgency: 'normal',
    timeline: [
      { title: 'Application Submitted', date: 'Sep 12, 10:15 AM', status: 'done', desc: 'Online request lodged with verified roll number.' },
      { title: 'Academic Office Verification', date: 'Sep 12, 02:40 PM', status: 'done', desc: 'Enrollment & semester fee cleared.' },
      { title: 'HOD Digital Sign-Off', date: 'Sep 13, 11:30 AM', status: 'done', desc: 'Signed by Dr. Aris Thorne.' },
      { title: 'Certificate Issued & Ready', date: 'Sep 13, 04:00 PM', status: 'done', desc: 'Watermarked document ready for download.' }
    ],
    downloadUrl: '#preview-bonafide',
    verifierRemarks: 'All academic dues cleared. Authorized for academic year 2026-27.'
  },
  {
    id: 'doc-2',
    refCode: 'DOC-2026-9182',
    type: 'transcript',
    title: 'Official Academic Transcript (Sem 1-5)',
    purpose: 'Summer Research Internship Application (MIT Media Lab)',
    studentName: 'Alex Rivera',
    rollNo: '2024CS104',
    submittedAt: '2026-09-15 03:20 PM',
    expectedDate: '2026-09-18',
    status: 'under_review',
    urgency: 'express',
    timeline: [
      { title: 'Application Submitted', date: 'Sep 15, 03:20 PM', status: 'done', desc: 'Express processing fee paid.' },
      { title: 'Registrar Grade Audit', date: 'Sep 16, 09:00 AM', status: 'current', desc: 'Consolidating grade sheets across all 5 semesters.' },
      { title: 'Dean Sign-Off & Seal', date: 'Estimated Sep 17', status: 'pending', desc: 'Institutional seal and tamper-proof barcode.' },
      { title: 'Ready for Dispatch / Download', date: 'Estimated Sep 18', status: 'pending', desc: 'Digital PDF + Sealed physical envelope.' }
    ],
    verifierRemarks: 'Under grade audit at Controller of Examinations.'
  },
  {
    id: 'doc-3',
    refCode: 'DOC-2026-8820',
    type: 'bus_pass',
    title: 'Metro / City Bus Concession Card',
    purpose: 'Daily commute between campus and suburban residence',
    studentName: 'Alex Rivera',
    rollNo: '2024CS104',
    submittedAt: '2026-08-28 11:00 AM',
    expectedDate: '2026-09-02',
    status: 'ready',
    urgency: 'normal',
    timeline: [
      { title: 'Application Submitted', date: 'Aug 28, 11:00 AM', status: 'done', desc: 'Residential proof uploaded.' },
      { title: 'Transport Authority Endorsement', date: 'Aug 30, 04:00 PM', status: 'done', desc: 'Eligible for 50% state transit concession.' },
      { title: 'Pass Generated', date: 'Sep 01, 10:00 AM', status: 'done', desc: 'Pass valid through July 2027.' }
    ],
    downloadUrl: '#preview-buspass'
  }
];

export const SAMPLE_COMPLAINTS: SmartComplaint[] = [
  {
    id: 'cmp-1',
    ticketNo: 'CMP-2026-4402',
    title: 'Intermittent Wi-Fi dropping on Falcon Hall 3rd floor',
    category: 'it',
    location: 'Hostel Block-B, Corridor 3 (Rooms 305 - 320)',
    description: 'The Cisco Access Point AP-B3 resets every 15 minutes. Packet loss spikes to 80% during evening study hours (08:00 PM - 11:00 PM), affecting online lab submissions.',
    urgency: 'high',
    status: 'investigating',
    submittedAt: '2026-09-15 08:45 PM',
    studentName: 'Alex Rivera',
    rollNo: '2024CS104',
    aiTriage: {
      department: 'Network Operations & Campus IT',
      estimatedHours: 8,
      severityReason: 'High concurrent student impact during designated evening study/exam hours.',
      suggestedFix: 'Reboot PoE switch port and check firmware beacon conflict on 5GHz channel 36.'
    },
    comments: [
      { id: 'c-1', sender: 'Campus IT Helpdesk', role: 'IT Admin', message: 'Diagnostic ping test confirms AP-B3 dropping DHCP leases. Tech dispatched to inspect switch room B-300.', timestamp: 'Sep 16, 09:30 AM' },
      { id: 'c-2', sender: 'Alex Rivera', role: 'Student', message: 'Thank you! Still failing intermittently as of 10:00 AM.', timestamp: 'Sep 16, 10:15 AM' }
    ]
  },
  {
    id: 'cmp-2',
    ticketNo: 'CMP-2026-4318',
    title: 'Water cooler purification filter indicator red in Mess Hall 2',
    category: 'cleanliness',
    location: 'Central Mess Dining Area, Ground Floor',
    description: 'The RO UV water dispenser filter replacement light has turned red and the water has a slight metallic taste. 400+ hostellers drink here daily.',
    urgency: 'critical',
    status: 'action_taken',
    submittedAt: '2026-09-14 01:15 PM',
    studentName: 'Priya Sharma',
    rollNo: '2024CS089',
    aiTriage: {
      department: 'Estate & Water Sanitation Dept',
      estimatedHours: 4,
      severityReason: 'Direct public health risk affecting hundreds of resident students.',
      suggestedFix: 'Replace carbon & sediment RO filter cartridges immediately; conduct TDS safety check.'
    },
    comments: [
      { id: 'c-3', sender: 'Chief Sanitation Officer', role: 'Technician', message: 'Technician Mr. Robert installed fresh 5-micron pre-filter and activated carbon block. TDS reading verified at safe 110 ppm.', timestamp: 'Sep 15, 11:00 AM' }
    ],
    resolutionNotes: 'Filters replaced, TDS verified safe. Maintenance ticket closed pending student sign-off.'
  },
  {
    id: 'cmp-3',
    ticketNo: 'CMP-2026-4190',
    title: 'Broken desk arm chair in Turing Lecture Hall 102',
    category: 'academic',
    location: 'Academic Block 1, Turing Hall 102 (Row 4, Seat 8)',
    description: 'The writing tablet armrest is detached from the hinge, creating sharp screw exposure.',
    urgency: 'medium',
    status: 'resolved',
    submittedAt: '2026-09-10 11:00 AM',
    studentName: 'Marcus Vance',
    rollNo: '2024EC032',
    aiTriage: {
      department: 'Campus Furniture & Carpentry',
      estimatedHours: 24,
      severityReason: 'Minor physical safety hazard and seat deficiency in high-capacity hall.',
      suggestedFix: 'Re-tighten bracket or replace tablet arm assembly.'
    },
    comments: [
      { id: 'c-4', sender: 'Estate Supervisor', role: 'Warden', message: 'Carpentry crew replaced the broken tablet arm with a reinforced nylon swivel arm.', timestamp: 'Sep 11, 03:00 PM' }
    ],
    resolutionNotes: 'Seat repaired and tested. Operational.'
  }
];

export const SAMPLE_HOSTEL_PASSES: HostelPass[] = [
  {
    id: 'pass-1',
    passNo: 'GP-2026-1094',
    studentName: 'Alex Rivera',
    rollNo: '2024CS104',
    roomNo: 'B-312',
    reason: 'Inter-University Hackathon 2026 at Tech Hub Center',
    outDate: '2026-09-18 05:00 PM',
    inDate: '2026-09-20 09:00 PM',
    destination: 'Downtown Tech Innovation Center, Suite 400',
    status: 'approved',
    wardenRemarks: 'Approved with faculty recommendation from Dr. Thorne. Emergency contact on file verified.',
    qrPayload: 'PASS:GP-2026-1094|STUDENT:2024CS104|EXP:2026-09-20|STATUS:APPROVED'
  },
  {
    id: 'pass-2',
    passNo: 'GP-2026-1140',
    studentName: 'Alex Rivera',
    rollNo: '2024CS104',
    roomNo: 'B-312',
    reason: 'Family Emergency & Medical Checkup',
    outDate: '2026-09-25 08:00 AM',
    inDate: '2026-09-27 08:00 PM',
    destination: 'Home Residence (San Jose, CA)',
    status: 'pending',
    wardenRemarks: 'Pending parent telephonic confirmation.',
    qrPayload: 'PASS:GP-2026-1140|STUDENT:2024CS104|EXP:2026-09-27|STATUS:PENDING'
  }
];

export const SAMPLE_MESS_MENU: MessMenuDay[] = [
  {
    day: 'Monday',
    breakfast: 'Idli, Medu Vada, Coconut Chutney, Sambar, Fresh Papaya, Tea/Coffee',
    lunch: 'Steamed Basmati Rice, Paneer Butter Masala, Dal Tadka, Roti, Cucumber Salad, Curd',
    snacks: 'Vegetable Samosa with Mint Chutney, Masala Chai',
    dinner: 'Jeera Rice, Malai Kofta, Mix Veg Korma, Butter Naan, Gulab Jamun',
    specialDietNote: 'Vegan & Gluten-free porridge available upon request at Counter 1.'
  },
  {
    day: 'Tuesday',
    breakfast: 'Masala Dosa, Aloo Masala, Sambar, Poha, Banana, Tea/Coffee',
    lunch: 'Rajma Chawal, Aloo Gobi, Boondi Raita, Chapati, Green Salad',
    snacks: 'Corn Cheese Sandwiches, Coffee',
    dinner: 'Egg Curry / Mushroom Masala (veg), Peas Pulao, Dal Fry, Tandoori Roti, Kheer',
    specialDietNote: 'Egg option served at designated Counter 3 only.'
  },
  {
    day: 'Wednesday',
    breakfast: 'Poori Bhaji, Semolina Upma, Seasonal Fruits, Milk, Coffee',
    lunch: 'South Indian Thali: Rice, Rasam, Sambar, Beetroot Poriyal, Curd, Papad, Payasam',
    snacks: 'Bread Pakora with Sweet Tamarind Sauce, Tea',
    dinner: 'Chicken Biryani / Hyderabadi Veg Soya Dum Biryani, Mirchi Ka Salan, Raita, Ice Cream',
    specialDietNote: 'Halal chicken and separate vegetarian kitchen prep maintained strictly.'
  },
  {
    day: 'Thursday',
    breakfast: 'Aloo Paratha with Butter & Curd, Mixed Sprout Salad, Tea/Coffee',
    lunch: 'Chole Bhature, Steamed Rice, Yellow Dal, Onion Rings, Pickle',
    snacks: 'Bhel Puri & Sev Puri, Filter Coffee',
    dinner: 'Kadai Paneer / Kadai Chicken, Dal Makhani, Phulka, Steamed Rice, Fruit Custard',
    specialDietNote: 'Low-oil preparation available for athletics team.'
  },
  {
    day: 'Friday',
    breakfast: 'Uttapam with Tomato Chutney, Oatmeal with Honey & Nuts, Tea/Coffee',
    lunch: 'Lemon Rice, Dal Palak, Bhindi Fry, Chapati, Curd, Roasted Papad',
    snacks: 'French Fries / Peri Peri Wedges, Tea',
    dinner: 'Continental Night: Pasta Alfredo, Garlic Bread, Vegetable Au Gratin, Brownie with Fudge',
    specialDietNote: 'Gluten-free pasta option on preorder via portal.'
  },
  {
    day: 'Saturday',
    breakfast: 'Methi Thepla with Pickle, Scrambled Eggs / Paneer Bhurji, Tea/Coffee',
    lunch: 'Kadhi Pakora, Steamed Rice, Aloo Jeera, Roti, Salad',
    snacks: 'Pav Bhaji, Hot Chocolate',
    dinner: 'Veg/Non-Veg Fried Rice, Manchurian Gravy, Spring Rolls, Sweet Corn Soup',
    specialDietNote: 'Late dining counter open until 10:30 PM on weekends.'
  },
  {
    day: 'Sunday',
    breakfast: 'Club Sandwiches, Boiled Eggs, Cornflakes with Warm Milk, Fruits, Tea',
    lunch: 'Special Sunday Feast: Paneer Tikka Masala, Dum Aloo, Kashmiri Pulao, Butter Roti, Rasgulla',
    snacks: 'Biscuits & Cookies with Masala Tea',
    dinner: 'Light Khichdi, Tomato Soup, Roasted Papad, Moong Dal Halwa',
    specialDietNote: 'Detox light dinner option before week start.'
  }
];

export const SAMPLE_ANNOUNCEMENTS: CampusAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Mid-Semester Examinations Schedule Released for Spring 2026',
    category: 'academic',
    summary: 'The Examination Cell has published the comprehensive mid-term schedule for 2nd, 3rd, and 4th-year engineering disciplines. Download your personalized hall ticket with QR seating allocation before March 22.',
    date: 'Today, 09:00 AM',
    author: 'Controller of Examinations',
    badge: 'Exam Alert',
    isUrgent: true
  },
  {
    id: 'ann-2',
    title: 'Google & Microsoft Campus Placement Drive Registration Open',
    category: 'placements',
    summary: 'Registrations for 2027 graduating batch internships and 2026 full-time recruitment are open on the placement portal. Minimum CGPA criterion is 7.5. Deadline to submit verified resume: Sep 25.',
    date: 'Yesterday, 04:30 PM',
    author: 'Training & Placement Office (TPO)',
    badge: 'Tier-1 Recruiters'
  },
  {
    id: 'ann-3',
    title: 'PromiseCheck AI Advisory: Beware of Fake 100% Placement Bootcamp Offers',
    category: 'urgent',
    summary: 'University Cyber Cell reports students receiving unsolicited WhatsApp offers promising 100% placement with NBFC loan lock-ins. Use our PromiseCheck AI tool before paying any institute fee.',
    date: 'Sep 14, 02:00 PM',
    author: 'Dean of Student Welfare & Cyber Cell',
    badge: 'Student Advisory',
    isUrgent: true
  },
  {
    id: 'ann-4',
    title: 'Annual Campus Cultural Fest "AURORA 2026" Auditions',
    category: 'event',
    summary: 'Auditions for Music, Dance, Dramatics, and Hackathons kick off this Saturday at the Open Air Amphitheatre. Register via student council clubs.',
    date: 'Sep 13, 11:00 AM',
    author: 'Student Cultural Council',
    badge: 'Fest'
  }
];

export const SAMPLE_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'notif-1',
    title: 'Bonafide Certificate Ready',
    message: 'Your Bonafide Certificate (DOC-2026-9041) has been approved and is ready for download.',
    timeAgo: '12m ago',
    category: 'document',
    read: false,
    actionTab: 'documents'
  },
  {
    id: 'notif-2',
    title: 'Attendance Alert: Machine Learning (CS602)',
    message: 'Your attendance is at 73.5% (minimum required is 75%). Attend the next 2 classes to avoid exam eligibility hold.',
    timeAgo: '2h ago',
    category: 'academic',
    read: false,
    actionTab: 'academic'
  },
  {
    id: 'notif-3',
    title: 'Hostel Gate Pass Approved',
    message: 'Outpass GP-2026-1094 for Hackathon 2026 has been approved by Warden Dr. Aris Thorne.',
    timeAgo: '4h ago',
    category: 'hostel',
    read: true,
    actionTab: 'hostel'
  },
  {
    id: 'notif-4',
    title: 'IT Helpdesk Ticket Update',
    message: 'Technician dispatched for AP-B3 Wi-Fi drop issue in Falcon Hall.',
    timeAgo: '1d ago',
    category: 'complaint',
    read: true,
    actionTab: 'complaints'
  }
];

export const SAMPLE_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb-1',
    type: 'course',
    targetName: 'CS601 Distributed Systems',
    rating: 5,
    comments: 'Dr. Thorne explains consensus algorithms (Raft & Paxos) with incredible clarity and hands-on Go labs.',
    sentiment: 'positive',
    date: 'Sep 14, 2026',
    studentRoll: '2024CS104'
  },
  {
    id: 'fb-2',
    type: 'facility',
    targetName: 'Central Library 24x7 Silent Zone',
    rating: 4,
    comments: 'Great study pod ergonomics and charging ports. Air conditioning can get a bit too cold past 02:00 AM.',
    sentiment: 'positive',
    date: 'Sep 12, 2026',
    studentRoll: '2024CS089'
  },
  {
    id: 'fb-3',
    type: 'mess',
    targetName: 'Falcon Hall Mess Dinner',
    rating: 2,
    comments: 'Rotis were burnt on Wednesday night and salad ran out by 08:30 PM. Needs better portion estimation.',
    sentiment: 'critical',
    date: 'Sep 11, 2026',
    studentRoll: '2024CS112'
  }
];

export const SAMPLE_CAMPUS_FIND_ITEMS: CampusFindItem[] = [
  {
    id: 'cf-1',
    type: 'found',
    title: 'Apple AirPods Pro (2nd Gen) in Matte Black Case',
    category: 'electronics',
    description: 'Found on 2nd floor silent study table #14 in Central Library near the computer lab. White AirPods in a black silicone Spigen protective sleeve.',
    location: 'Central Library, 2nd Floor Study Wing',
    date: 'Sep 16, 2026, 09:15 AM',
    reporterName: 'Librarian desk assistant',
    reporterContact: 'library.desk@campus.edu',
    imageUri: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&auto=format&fit=crop&q=80',
    status: 'open',
    claimCode: 'CL-8012'
  },
  {
    id: 'cf-2',
    type: 'lost',
    title: 'Blue Hydro Flask Water Bottle with NASA stickers',
    category: 'accessories',
    description: 'Left behind in Turing Hall 102 after Machine Learning lecture on Tuesday morning. Has scratched base and an Apollo 11 decal.',
    location: 'Academic Block 1, Turing Hall 102',
    date: 'Sep 15, 2026, 01:00 PM',
    reporterName: 'Alex Rivera',
    reporterContact: 'alex.rivera@campus.edu',
    imageUri: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80',
    status: 'open',
    claimCode: 'CL-4921'
  },
  {
    id: 'cf-3',
    type: 'found',
    title: 'Student Smart ID Card (Roll: 2024EC058)',
    category: 'id_card',
    description: 'Belongs to Samantha Wu, Electronics Dept. Handed over to Campus Security booth.',
    location: 'Cafeteria Lawn pathway',
    date: 'Sep 15, 2026, 04:30 PM',
    reporterName: 'Security Officer Gomez',
    reporterContact: 'security.gate1@campus.edu',
    status: 'open',
    claimCode: 'CL-1934'
  },
  {
    id: 'cf-4',
    type: 'found',
    title: 'Calculus & Linear Algebra Hardcover Textbook (11th Edition)',
    category: 'books',
    description: 'Blue and gold textbook by Larson. Notes handwritten in pencil on Chapter 4.',
    location: 'Student Activity Centre (SAC) Lounge',
    date: 'Sep 14, 2026, 06:00 PM',
    reporterName: 'SAC Staff',
    reporterContact: 'sac@campus.edu',
    imageUri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    status: 'returned',
    claimCode: 'CL-3392'
  }
];

// Presets for PromiseCheck AI
export const SAMPLE_PROMISE_CHECK_PRESETS = [
  {
    name: 'Full Stack Web3 Bootcamp (Aggressive Guarantee)',
    instituteName: 'Apex Silicon Tech Academy',
    text: `🚨 100% PLACEMENT GUARANTEED OR 100% REFUND! 🚨
Become a Senior Full Stack & Web3 AI Developer in just 12 Weeks!
Average Package: $120,000 / ₹18 LPA GUARANTEED!
Government & Skill India Approved Curriculum!
Over 500+ Fortune 500 Hiring Partners waiting for our graduates.
Zero Cost EMI Available via our banking partner! No upfront burden!
⚠️ ONLY 3 SEATS REMAINING in the September Elite Batch!
Register today for just ₹10,000 to lock your seat before fee increases by 50%!
No prior coding experience required. 100% money-back guarantee if not placed in 60 days.`
  },
  {
    name: 'Govt Certified AI Fellowship with "Guaranteed Income"',
    instituteName: 'National AI & Data Institute (Private Ltd)',
    text: `OFFICIAL GOVERNMENT RECOGNIZED FELLOWSHIP PROGRAM 2026
Guaranteed Monthly Stipend of ₹45,000 / $600 from Month 1!
Direct placement as AI Prompt Engineer / Data Specialist with top MNCs.
Limited quota for university students under Youth Empowerment Scheme.
Admission fee: ₹65,000 (Non-refundable seat allocation processing charge).
Placement assistance provided until you secure an offer letter.
Immediate selection based on profile shortlisting!`
  },
  {
    name: 'Work-From-Home Part-Time Data Entry & Review Job',
    instituteName: 'Global Cloud Systems Remote LLC',
    text: `EARN $50 - $120 PER HOUR WORKING 2 HOURS DAILY FROM HOME!
No interview, immediate joining!
100% Legitimate MNC outsourcing project approved by international trade council.
Deposit ₹4,999 refundable security kit fee to receive company portal credentials and hardware allowance.
Thousands of college students already earning weekly payouts directly to bank account!`
  }
];
