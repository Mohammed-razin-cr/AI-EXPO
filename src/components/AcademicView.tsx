import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  Award,
  TrendingUp,
  CheckCircle2,
  FileDown,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { AcademicCourse, TimetableSlot, UserProfile } from '../types';

interface AcademicViewProps {
  user: UserProfile;
  courses: AcademicCourse[];
  timetable: TimetableSlot[];
  onOpenDocumentRequest: () => void;
}

export const AcademicView: React.FC<AcademicViewProps> = ({
  user,
  courses,
  timetable,
  onOpenDocumentRequest,
}) => {
  const [selectedDay, setSelectedDay] = useState<TimetableSlot['day']>('Monday');
  const days: TimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const dailySchedule = timetable.filter((slot) => slot.day === selectedDay);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Academic Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CGPA Card */}
        <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3.5px_3.5px_0px_#0f172a] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Cumulative CGPA
            </span>
            <span className="p-1.5 rounded-lg bg-yellow-200 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-950 font-mono">{user.cgpa || 8.84}</span>
            <span className="text-xs text-slate-500 font-bold">/ 10.0</span>
            <span className="text-[10px] font-black text-emerald-950 bg-emerald-200 px-2 py-0.5 rounded-md border border-slate-900 shadow-[1px_1px_0px_#0f172a] ml-auto">
              Top 5%
            </span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-1">Current Sem GPA: {user.currentGpa || 9.12}</p>
        </div>

        {/* Overall Attendance */}
        <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3.5px_3.5px_0px_#0f172a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Overall Attendance
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-200 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-950 font-mono">{user.overallAttendance}%</span>
            <span className="text-[10px] font-black text-slate-600">Min 75% Req.</span>
          </div>
          <div className="w-full bg-slate-100 border border-slate-900 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-2 rounded-full border-r border-slate-900"
              style={{ width: `${user.overallAttendance}%` }}
            />
          </div>
        </div>

        {/* Registered Courses */}
        <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3.5px_3.5px_0px_#0f172a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Registered Credits
            </span>
            <span className="p-1.5 rounded-lg bg-amber-200 text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-950 font-mono">16</span>
            <span className="text-xs text-slate-600 font-bold">Credits (5 Courses)</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-1">{user.semester} • Regular Status</p>
        </div>

        {/* Exam Hall Ticket Shortcut */}
        <div className="neo-card bg-yellow-200 border-2 border-slate-900 rounded-2xl p-4 shadow-[3.5px_3.5px_0px_#0f172a] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-950 uppercase tracking-wider">
              Mid-Term Hall Ticket
            </span>
            <GraduationCap className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="mt-2">
            <p className="text-xs font-black text-slate-950">Spring 2026 Seating Allocated</p>
            <p className="text-[10px] text-slate-700 font-bold mt-0.5">Hall 3B, Desk #24</p>
          </div>
          <button
            onClick={onOpenDocumentRequest}
            className="mt-2 py-1.5 px-3 neo-btn bg-white hover:bg-yellow-100 text-slate-950 text-[11px] font-black shadow-[2px_2px_0px_#0f172a] flex items-center justify-between"
          >
            <span>Request Official Docs</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main Grid: Courses & Attendance + Interactive Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Enrolled Courses & Attendance Warning */}
        <div className="lg:col-span-7 space-y-4">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[5px_5px_0px_#0f172a] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-950">Enrolled Courses &amp; Attendance</h3>
                <p className="text-xs text-slate-600 font-medium">Track class requirements and syllabus progression</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded bg-yellow-200 border border-slate-900 shadow-[1px_1px_0px_#0f172a] text-slate-950">
                Sem 6
              </span>
            </div>

            <div className="space-y-3.5">
              {courses.map((course) => {
                const isWarning = course.attendancePercentage < 75;
                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-950 bg-yellow-200 px-2 py-0.5 rounded border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                            {course.code}
                          </span>
                          <span className="text-xs text-slate-600 font-bold">{course.credits} Credits</span>
                        </div>
                        <h4 className="font-black text-sm text-slate-950 mt-1">{course.title}</h4>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          {course.instructor} • {course.room}
                        </p>
                      </div>

                      {/* Attendance Dial */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-1.5">
                          {isWarning && <AlertTriangle className="w-4 h-4 text-rose-600 stroke-[2.5]" />}
                          <span
                            className={`text-lg font-black font-mono ${
                              isWarning ? 'text-rose-600' : 'text-emerald-700'
                            }`}
                          >
                            {course.attendancePercentage}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-600 font-bold block">
                          {course.classesAttended}/{course.totalClasses} classes
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Warning Alert */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                        <span>Syllabus Covered: <strong>{course.syllabusProgress}%</strong></span>
                        <span>Schedule: <strong>{course.schedule}</strong></span>
                      </div>
                      <div className="w-full bg-slate-100 border border-slate-900 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full border-r border-slate-900"
                          style={{ width: `${course.syllabusProgress}%` }}
                        />
                      </div>
                    </div>

                    {isWarning && (
                      <div className="p-2.5 rounded-lg bg-rose-100 border-2 border-slate-900 text-[11px] text-rose-950 flex items-center gap-2 font-black shadow-[1.5px_1.5px_0px_#0f172a]">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700 stroke-[2.5]" />
                        <span>
                          Attendance is below mandatory 75% cutoff! Attend next 2 sessions to regain eligibility.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Interactive Weekly Timetable */}
        <div className="lg:col-span-5 space-y-4">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[5px_5px_0px_#0f172a] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-950">Daily Class Schedule</h3>
                <p className="text-xs text-slate-600 font-medium">Live lecture &amp; lab timetable</p>
              </div>
              <Clock className="w-4 h-4 text-slate-700 stroke-[2.5]" />
            </div>

            {/* Day Selector */}
            <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-xl border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    selectedDay === d
                      ? 'bg-yellow-300 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]'
                      : 'text-slate-700 hover:text-black'
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Day Schedule List */}
            <div className="space-y-2.5">
              {dailySchedule.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 font-bold">
                  No classes scheduled for {selectedDay}.
                </div>
              ) : (
                dailySchedule.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-xl bg-white border-2 border-slate-900 shadow-[2.5px_2.5px_0px_#0f172a] flex items-center justify-between gap-3 hover:-translate-y-0.5 transition-transform"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-black text-slate-950">
                          {slot.courseCode}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-black border border-slate-900 ${
                            slot.type === 'Lab'
                              ? 'bg-amber-200 text-slate-950'
                              : 'bg-yellow-200 text-slate-950'
                          }`}
                        >
                          {slot.type}
                        </span>
                      </div>
                      <h4 className="font-black text-xs text-slate-950">{slot.courseTitle}</h4>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {slot.instructor} • {slot.room}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-black text-slate-950 block">
                        {slot.time}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">Scheduled</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
