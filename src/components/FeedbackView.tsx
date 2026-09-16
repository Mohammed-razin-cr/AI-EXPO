import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  Sparkles,
  Send,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { FeedbackItem, UserProfile } from '../types';

interface FeedbackViewProps {
  user: UserProfile;
  feedbackList: FeedbackItem[];
  onAddFeedback: (item: FeedbackItem) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  user,
  feedbackList,
  onAddFeedback,
}) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackItem['type']>('course');
  const [targetName, setTargetName] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !comments.trim()) return;

    // Simple heuristic sentiment
    let sentiment: FeedbackItem['sentiment'] = 'neutral';
    if (rating >= 4) sentiment = 'positive';
    else if (rating <= 2) sentiment = 'critical';

    const newItem: FeedbackItem = {
      id: `fb-${Date.now()}`,
      type: feedbackType,
      targetName,
      rating,
      comments,
      sentiment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      studentRoll: user.rollNo
    };

    onAddFeedback(newItem);
    setSubmitted(true);
    setTargetName('');
    setComments('');
    setRating(5);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="neo-card bg-[#FFFDF9] border-2 border-slate-900 rounded-2xl p-6 sm:p-7 shadow-[5px_5px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="neo-pill bg-yellow-200 text-slate-950 font-black mb-2">
            <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
            Continuous Campus Improvement
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">
            Your voice matters.
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xl mt-1 leading-relaxed">
            Share what’s working and what could be better, from your classroom to the dining hall.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submit Feedback Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#0f172a] space-y-4">
            <h3 className="font-black text-sm text-slate-950 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              Share your experience
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium">
              <div>
                <label htmlFor="feedback-category" className="font-black text-slate-900 block mb-1">Feedback category</label>
                <select
                  id="feedback-category"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                >
                  <option value="course">Course &amp; Faculty Teaching</option>
                  <option value="facility">Campus Infrastructure / Labs</option>
                  <option value="mess">Mess &amp; Dining Hall</option>
                  <option value="general">General University Administration</option>
                </select>
              </div>

              <div>
                <label htmlFor="feedback-subject" className="font-black text-slate-900 block mb-1">
                  Subject / Professor / Facility Name
                </label>
                <input
                  id="feedback-subject"
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="e.g. CS601 Distributed Systems / Central Library 24x7 Silent Pod"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-bold focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              <div>
                <label className="font-black text-slate-900 block mb-1">Star Rating (1 - 5)</label>
                <div className="flex flex-wrap items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={star + (star === 1 ? ' star' : ' stars')}
                      aria-pressed={rating === star}
                      className="grid h-11 w-11 place-items-center rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 stroke-[2] ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-slate-950 ml-2 bg-yellow-100 px-2 py-0.5 rounded border border-slate-900">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label htmlFor="feedback-comments" className="font-black text-slate-900 block mb-1">Tell us more</label>
                <textarea
                  id="feedback-comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  placeholder="What went well? Where can teaching methods, equipment, or hygiene improve?"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 font-medium focus:bg-yellow-50 focus:outline-none shadow-[1.5px_1.5px_0px_#0f172a]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 neo-btn bg-yellow-300 hover:bg-yellow-400 text-slate-950 font-black shadow-[2.5px_2.5px_0px_#0f172a] flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                Submit feedback
              </button>
              {submitted && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-emerald-800">Thank you. Your feedback has been added below.</p>}
            </form>
          </div>
        </div>

        {/* Right: Recent Community Feedback */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">
              Recent Student Submissions ({feedbackList.length})
            </h3>
          </div>

          <div className="space-y-3">
            {feedbackList.map((fb) => (
              <div
                key={fb.id}
                className="neo-card bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_#0f172a] space-y-2 hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="font-black text-sm text-slate-950">{fb.targetName}</h4>
                    <span className="text-[10px] text-slate-600 uppercase font-black">
                      Category: {fb.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-xl border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 stroke-[2]" />
                    <span className="text-xs font-black text-slate-950">{fb.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-medium">{fb.comments}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-2 border-t-2 border-slate-100">
                  <span>Student ID: {fb.studentRoll.slice(0, 4)}***</span>
                  <span
                    className={`font-black capitalize px-2 py-0.5 rounded border border-slate-900 ${
                      fb.sentiment === 'positive'
                        ? 'bg-emerald-200 text-emerald-950'
                        : fb.sentiment === 'critical'
                        ? 'bg-rose-200 text-rose-950'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    AI Sentiment: {fb.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
