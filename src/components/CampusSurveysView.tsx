import React, { useState, useEffect, useMemo } from 'react';
import {
  Vote,
  Plus,
  CheckCircle2,
  BarChart3,
  Clock,
  Users,
  Sparkles,
  Search,
  Building2,
  GraduationCap,
  Calendar,
  Download,
  AlertCircle,
  Trash2,
  Lock,
  Unlock,
  Activity,
  Play,
  Pause,
  TrendingUp,
  Check,
  X,
  Pin,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  UserCheck,
  Eye,
  PieChart as PieChartIcon,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import {
  UserProfile,
  CampusSurvey,
  SurveyCategory,
  SurveyOption,
  SurveyVoterRecord
} from '../types';

export const VOTE_COLORS = [
  '#183153', // Deep Navy
  '#2563eb', // Blue
  '#059669', // Emerald
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#db2777', // Rose Pink
  '#0891b2', // Cyan
  '#4f46e5', // Indigo
];

// Recharts Donut Chart Component
export const SurveyDonutChart: React.FC<{
  options: SurveyOption[];
  totalVotes: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}> = ({ options, totalVotes, height = 210, innerRadius = 52, outerRadius = 76 }) => {
  const chartData = useMemo(() => {
    if (totalVotes === 0) {
      return [{ name: 'No votes yet', value: 1, votes: 0, percentage: 0, color: '#e2e8f0' }];
    }
    return options.map((opt, i) => ({
      name: opt.text,
      value: opt.votes,
      votes: opt.votes,
      percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
      color: VOTE_COLORS[i % VOTE_COLORS.length],
    }));
  }, [options, totalVotes]);

  return (
    <div className="relative w-full flex items-center justify-center select-none" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <RechartsTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-xl text-xs z-50 min-w-[190px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: data.color }}
                    />
                    <span className="truncate">{data.name}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-4 text-slate-600 font-medium">
                    <span>{data.votes.toLocaleString()} votes</span>
                    <span className="font-extrabold text-slate-900 text-sm">{data.percentage}%</span>
                  </div>
                </div>
              );
            }}
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={totalVotes > 0 ? 3 : 0}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={500}
          >
            {chartData.map((entry, index) => (
              <Cell key={`donut-cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Donut Center Count */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums leading-none">
          {totalVotes.toLocaleString()}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
          Total Votes
        </span>
      </div>
    </div>
  );
};

// Recharts Horizontal Progress Bar Chart Component
export const SurveyProgressBarChart: React.FC<{
  options: SurveyOption[];
  totalVotes: number;
  height?: number;
}> = ({ options, totalVotes, height }) => {
  const barData = useMemo(() => {
    return options.map((opt, i) => ({
      label: `Choice ${String.fromCharCode(65 + i)}`,
      name: opt.text.length > 28 ? opt.text.substring(0, 26) + '…' : opt.text,
      fullName: opt.text,
      percentage: totalVotes > 0 ? Number(((opt.votes / totalVotes) * 100).toFixed(1)) : 0,
      votes: opt.votes,
      fill: VOTE_COLORS[i % VOTE_COLORS.length],
    }));
  }, [options, totalVotes]);

  const computedHeight = height || Math.max(options.length * 44 + 20, 150);

  return (
    <div className="w-full" style={{ height: computedHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={barData}
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="label"
            width={72}
            tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const item = payload[0].payload;
              return (
                <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-xl text-xs z-50 min-w-[200px]">
                  <p className="font-bold text-slate-900 mb-1 leading-snug">{item.fullName}</p>
                  <div className="flex items-center justify-between gap-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.fill }} />
                      {item.votes.toLocaleString()} votes
                    </span>
                    <span className="font-extrabold text-slate-900">{item.percentage}%</span>
                  </div>
                </div>
              );
            }}
          />
          <Bar
            dataKey="percentage"
            radius={[0, 8, 8, 0]}
            barSize={18}
            isAnimationActive={true}
            animationDuration={500}
          >
            {barData.map((entry, index) => (
              <Cell key={`bar-cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Recharts Single-Row Segmented Progress Bar (100% distribution)
export const SurveySegmentedProgressBar: React.FC<{
  options: SurveyOption[];
  totalVotes: number;
}> = ({ options, totalVotes }) => {
  const stackedData = useMemo(() => {
    const row: Record<string, number | string> = { name: 'Distribution' };
    options.forEach((opt, i) => {
      row[`opt_${i}`] = totalVotes > 0 ? Number(((opt.votes / totalVotes) * 100).toFixed(1)) : 0;
    });
    return [row];
  }, [options, totalVotes]);

  if (totalVotes === 0) {
    return (
      <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80" />
    );
  }

  return (
    <div className="w-full h-5 rounded-lg overflow-hidden border border-slate-200/80 bg-slate-50">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={stackedData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          {options.map((opt, i) => (
            <Bar
              key={`stack-bar-${opt.id}`}
              dataKey={`opt_${i}`}
              stackId="vote-distribution"
              fill={VOTE_COLORS[i % VOTE_COLORS.length]}
              isAnimationActive={true}
              animationDuration={400}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface VoteProgressionPoint {
  time: string;
  shortTime: string;
  votes: number;
  increment: number;
}

export function generateSurveyVoteProgression(survey: CampusSurvey): VoteProgressionPoint[] {
  const total = survey.totalVotes;
  if (total === 0) {
    return [
      { time: 'Day 1', shortTime: 'D1', votes: 0, increment: 0 },
      { time: 'Day 2', shortTime: 'D2', votes: 0, increment: 0 },
      { time: 'Day 3', shortTime: 'D3', votes: 0, increment: 0 },
      { time: 'Day 4', shortTime: 'D4', votes: 0, increment: 0 },
      { time: 'Day 5', shortTime: 'D5', votes: 0, increment: 0 },
      { time: 'Current', shortTime: 'Now', votes: 0, increment: 0 },
    ];
  }

  // Derive stable pseudo-variance based on survey.id
  let hash = 0;
  for (let i = 0; i < survey.id.length; i++) {
    hash = (hash * 31 + survey.id.charCodeAt(i)) % 1000;
  }
  const factor = (hash % 8) / 100; // 0.00 to 0.07

  const c1 = Math.max(1, Math.round(total * (0.16 + factor)));
  const c2 = Math.max(c1 + 1, Math.round(total * (0.38 + factor * 0.5)));
  const c3 = Math.max(c2 + 1, Math.round(total * (0.62 + factor * 0.3)));
  const c4 = Math.max(c3 + 1, Math.round(total * (0.79 + factor * 0.2)));
  const c5 = Math.max(c4 + 1, Math.round(total * (0.91 + factor * 0.1)));
  const c6 = total;

  let startDate = new Date('2026-09-12T09:00:00');
  try {
    const parsed = Date.parse(survey.publishedAt);
    if (!isNaN(parsed)) {
      startDate = new Date(parsed);
    }
  } catch (e) {
    // fallback
  }

  const formatShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const dates: string[] = [];
  for (let step = 0; step < 6; step++) {
    const cur = new Date(startDate.getTime() + step * 24 * 60 * 60 * 1000);
    dates.push(formatShort(cur));
  }
  const lastLabel = survey.status === 'active' ? 'Today' : dates[5];

  return [
    { time: `${dates[0]} (Launch)`, shortTime: dates[0], votes: c1, increment: c1 },
    { time: `${dates[1]} (Day 2)`, shortTime: dates[1], votes: c2, increment: Math.max(0, c2 - c1) },
    { time: `${dates[2]} (Day 3)`, shortTime: dates[2], votes: c3, increment: Math.max(0, c3 - c2) },
    { time: `${dates[3]} (Day 4)`, shortTime: dates[3], votes: c4, increment: Math.max(0, c4 - c3) },
    { time: `${dates[4]} (Day 5)`, shortTime: dates[4], votes: c5, increment: Math.max(0, c5 - c4) },
    { time: `${lastLabel} (Latest)`, shortTime: lastLabel, votes: c6, increment: Math.max(0, c6 - c5) },
  ];
}

// Small Sparkline component showing vote progression over time for survey cards
export const SurveyVoteSparkline: React.FC<{
  survey: CampusSurvey;
  height?: number;
}> = ({ survey, height = 36 }) => {
  const data = useMemo(
    () => generateSurveyVoteProgression(survey),
    [survey.id, survey.totalVotes, survey.publishedAt, survey.status]
  );
  const lastPoint = data[data.length - 1];
  const recentGain = lastPoint?.increment || 0;
  const peakPoint = useMemo(() => [...data].sort((a, b) => b.increment - a.increment)[0], [data]);
  const gradientId = `sparkline-grad-${survey.id}`;

  return (
    <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300/80 rounded-xl p-2.5 transition">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
          <TrendingUp className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span>Vote Progression</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold">
          <span className="text-emerald-700 bg-emerald-100/70 border border-emerald-200/50 px-1.5 py-0.5 rounded-md font-bold">
            +{recentGain.toLocaleString()} recent
          </span>
          <span className="text-slate-400 hidden sm:inline tabular-nums">
            Peak: {peakPoint?.shortTime || 'Day 3'}
          </span>
        </div>
      </div>

      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <RechartsTooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const pt = payload[0].payload as VoteProgressionPoint;
                return (
                  <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-lg text-[11px] z-50 pointer-events-none">
                    <p className="font-bold text-slate-900">{pt.time}</p>
                    <div className="flex items-center gap-2 text-slate-600 mt-0.5 font-medium">
                      <span className="font-black text-[#183153]">{pt.votes.toLocaleString()} total</span>
                      <span className="text-emerald-600 font-bold">(+{pt.increment.toLocaleString()})</span>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="votes"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 3.5, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Full Timeline Chart Component showing vote progression over time with axes & statistics
export const SurveyVoteProgressionChart: React.FC<{
  survey: CampusSurvey;
  height?: number;
}> = ({ survey, height = 180 }) => {
  const data = useMemo(
    () => generateSurveyVoteProgression(survey),
    [survey.id, survey.totalVotes, survey.publishedAt, survey.status]
  );
  const peakPoint = useMemo(() => [...data].sort((a, b) => b.increment - a.increment)[0], [data]);
  const avgDaily = Math.round(survey.totalVotes / Math.max(1, data.length));
  const gradientId = `progression-grad-${survey.id}`;

  return (
    <div className="space-y-3 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Progression of Votes Over Time
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Cumulative timeline of campus ballots recorded from launch to current
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-lg">
            <Activity className="h-3 w-3 animate-pulse" />
            {survey.status === 'active' ? 'Active Trajectory' : 'Final Tally'}
          </span>
        </div>
      </div>

      {/* Main Progression Area/Line Chart */}
      <div className="w-full pt-2" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="shortTime"
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <RechartsTooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const pt = payload[0].payload as VoteProgressionPoint;
                return (
                  <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-xl text-xs z-50 min-w-[190px]">
                    <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1.5">{pt.time}</p>
                    <div className="space-y-1 text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Cumulative Ballots:</span>
                        <strong className="text-[#183153] tabular-nums">{pt.votes.toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>Period Influx:</span>
                        <strong className="font-bold tabular-nums">+{pt.increment.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="votes"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              isAnimationActive={true}
              animationDuration={500}
              activeDot={{ r: 5, fill: '#183153', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Progression KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Ballots</span>
          <span className="text-sm font-black text-slate-900 tabular-nums">{survey.totalVotes.toLocaleString()}</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Peak Influx</span>
          <span className="text-sm font-black text-emerald-700 tabular-nums">+{peakPoint?.increment.toLocaleString() || 0}</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Avg. Daily Ballots</span>
          <span className="text-sm font-black text-slate-900 tabular-nums">~{avgDaily.toLocaleString()}/day</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Peak Interval</span>
          <span className="text-sm font-black text-blue-700 truncate block">{peakPoint?.shortTime || 'Mid-Survey'}</span>
        </div>
      </div>
    </div>
  );
};

// Combined Real-Time Visualizer (Donut Chart + Progress Bar + Legend)
export const SurveyRealTimeVisualizer: React.FC<{
  survey: CampusSurvey;
  titlePrefix?: string;
}> = ({ survey, titlePrefix }) => {
  const topOption = useMemo(() => {
    return [...survey.options].sort((a, b) => b.votes - a.votes)[0];
  }, [survey.options]);

  return (
    <div className="space-y-4">
      {/* 100% Real-time Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span>Real-Time Vote Progress Bar</span>
          <span className="text-slate-700 tabular-nums">
            {survey.totalVotes.toLocaleString()} ballots registered
          </span>
        </div>
        <SurveySegmentedProgressBar options={survey.options} totalVotes={survey.totalVotes} />
      </div>

      {/* Dual Column: Donut Chart & Vertical Progress Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
        {/* Donut Chart with Center Tally */}
        <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/70 pb-4 md:pb-0 md:pr-4">
          <div className="w-full flex items-center justify-between mb-1 px-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <PieChartIcon className="h-3.5 w-3.5 text-blue-600" />
              Donut Distribution
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              <Activity className="h-2.5 w-2.5 animate-pulse" /> Live
            </span>
          </div>
          <SurveyDonutChart options={survey.options} totalVotes={survey.totalVotes} height={190} />
          {topOption && survey.totalVotes > 0 && (
            <p className="text-[11px] font-medium text-slate-500 mt-1 text-center">
              Leading: <strong className="text-slate-800">{topOption.text}</strong>
            </p>
          )}
        </div>

        {/* Real-time Progress Bar Chart */}
        <div className="md:col-span-7 flex flex-col justify-center pl-0 md:pl-2">
          <div className="w-full flex items-center justify-between mb-1 px-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BarChart2 className="h-3.5 w-3.5 text-blue-600" />
              Option Progress Bars
            </span>
            <span className="text-[11px] font-semibold text-slate-400">0% – 100% scale</span>
          </div>
          <SurveyProgressBarChart options={survey.options} totalVotes={survey.totalVotes} />
        </div>
      </div>

      {/* Option Legend Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {survey.options.map((opt, i) => {
          const color = VOTE_COLORS[i % VOTE_COLORS.length];
          const pct = survey.totalVotes > 0 ? Math.round((opt.votes / survey.totalVotes) * 100) : 0;
          const isLead = topOption?.id === opt.id && survey.totalVotes > 0;
          return (
            <div
              key={opt.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/70 bg-white text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-md shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-bold text-slate-500 shrink-0">
                  {String.fromCharCode(65 + i)}:
                </span>
                <span className="font-semibold text-slate-800 truncate" title={opt.text}>
                  {opt.text}
                </span>
                {isLead && (
                  <span className="shrink-0 text-[10px] font-extrabold px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded">
                    Lead
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 pl-2">
                <span className="text-slate-500 tabular-nums">{opt.votes}</span>
                <span className="font-extrabold text-slate-900 tabular-nums">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Vote Progression Over Time Line Chart */}
      <SurveyVoteProgressionChart survey={survey} />
    </div>
  );
};

interface CampusSurveysViewProps {
  user: UserProfile;
  surveys: CampusSurvey[];
  onVote: (surveyId: string, optionId: string) => void;
  onPublishSurvey: (newSurvey: CampusSurvey) => void;
  onToggleStatus: (surveyId: string) => void;
  onDeleteSurvey: (surveyId: string) => void;
  onSimulateIncomingVote?: (surveyId: string, optionId: string) => void;
}

const CATEGORIES: { id: SurveyCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Polls', icon: Vote },
  { id: 'academics', label: 'Academics', icon: GraduationCap },
  { id: 'dining_hostel', label: 'Dining & Hostel', icon: Building2 },
  { id: 'campus_life', label: 'Campus Life', icon: Users },
  { id: 'facilities', label: 'Facilities', icon: Activity },
  { id: 'events', label: 'Events', icon: Calendar },
];

export const CampusSurveysView: React.FC<CampusSurveysViewProps> = ({
  user,
  surveys,
  onVote,
  onPublishSurvey,
  onToggleStatus,
  onDeleteSurvey,
  onSimulateIncomingVote,
}) => {
  // Navigation & Filtering
  const [selectedCategory, setSelectedCategory] = useState<SurveyCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'active' | 'pending' | 'voted' | 'closed'>('all');

  // Interactive Selection State (map of surveyId -> selectedOptionId)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [recentlyVotedId, setRecentlyVotedId] = useState<string | null>(null);

  // Admin Modal & Analytics
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [analyticsSurvey, setAnalyticsSurvey] = useState<CampusSurvey | null>(null);

  // Real-Time Simulation Engine Toggle
  const [isLiveSimActive, setIsLiveSimActive] = useState(true);
  const [livePulseTick, setLivePulseTick] = useState(0);

  // Active Surveys Visualizer Spotlight State
  const activeSurveys = useMemo(() => surveys.filter(s => s.status === 'active'), [surveys]);
  const [spotlightSurveyId, setSpotlightSurveyId] = useState<string>('');
  const [isSpotlightVisible, setIsSpotlightVisible] = useState(true);

  // Card view toggles (surveyId -> 'options' | 'charts')
  const [cardViews, setCardViews] = useState<Record<string, 'options' | 'charts'>>({});
  const [expandedCardCharts, setExpandedCardCharts] = useState<Record<string, boolean>>({});

  const selectedSpotlightSurvey = useMemo(() => {
    if (spotlightSurveyId) {
      const found = surveys.find(s => s.id === spotlightSurveyId);
      if (found) return found;
    }
    return activeSurveys[0] || surveys[0];
  }, [spotlightSurveyId, surveys, activeSurveys]);

  // New Survey Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<SurveyCategory>('academics');
  const [formAudience, setFormAudience] = useState('All Campus');
  const [formExpiryDays, setFormExpiryDays] = useState(7);
  const [formAnonymous, setFormAnonymous] = useState(true);
  const [formPinned, setFormPinned] = useState(false);
  const [formOptions, setFormOptions] = useState<string[]>([
    'Option A: Full implementation with overnight services',
    'Option B: Phased pilot project across selected blocks',
    'Option C: Maintain current schedule'
  ]);
  const [formError, setFormError] = useState('');

  // Check if current user has voted on a specific survey
  const hasUserVoted = (survey: CampusSurvey) => {
    return survey.voters.some(v => v.userId === user.id || v.userRollNo === user.rollNo);
  };

  // Get user's selected option if voted
  const getUserSelectedOptionId = (survey: CampusSurvey) => {
    const record = survey.voters.find(v => v.userId === user.id || v.userRollNo === user.rollNo);
    return record?.selectedOptionId;
  };

  // Real-time background simulation: subtly adds incoming votes every 9 seconds when active
  useEffect(() => {
    if (!isLiveSimActive) return;

    const interval = setInterval(() => {
      const activePolls = surveys.filter(s => s.status === 'active');
      if (activePolls.length === 0) return;

      // Pick a random active poll and a random option
      const randomPoll = activePolls[Math.floor(Math.random() * activePolls.length)];
      if (randomPoll.options.length === 0) return;
      const randomOption = randomPoll.options[Math.floor(Math.random() * randomPoll.options.length)];

      if (onSimulateIncomingVote) {
        onSimulateIncomingVote(randomPoll.id, randomOption.id);
      }
      setLivePulseTick(prev => prev + 1);
    }, 9000);

    return () => clearInterval(interval);
  }, [isLiveSimActive, surveys, onSimulateIncomingVote]);

  // Handle student voting
  const handleVoteSubmit = (surveyId: string) => {
    const chosenOptionId = selectedOptions[surveyId];
    if (!chosenOptionId) return;

    setSubmittingId(surveyId);
    setTimeout(() => {
      onVote(surveyId, chosenOptionId);
      setSubmittingId(null);
      setRecentlyVotedId(surveyId);
      setTimeout(() => setRecentlyVotedId(null), 3000);
    }, 350);
  };

  // Handle publishing a new survey
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) {
      setFormError('Please enter a descriptive poll question or title.');
      return;
    }
    if (!formDesc.trim()) {
      setFormError('Please provide a brief background or description.');
      return;
    }
    const cleanOptions = formOptions.map(o => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setFormError('Please provide at least 2 distinct voting options.');
      return;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + formExpiryDays);
    const dateStr = expiryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newSurvey: CampusSurvey = {
      id: `poll-${Date.now()}`,
      title: formTitle.trim(),
      description: formDesc.trim(),
      category: formCategory,
      createdBy: user.role === 'admin' ? user.name : 'Administrative Council',
      creatorRole: user.role,
      publishedAt: 'Just now',
      expiresAt: `${dateStr}, 11:59 PM`,
      status: 'active',
      allowAnonymous: formAnonymous,
      pinned: formPinned,
      targetAudience: formAudience,
      totalVotes: 0,
      options: cleanOptions.map((text, idx) => ({
        id: `opt-${Date.now()}-${idx + 1}`,
        text,
        votes: 0
      })),
      voters: []
    };

    onPublishSurvey(newSurvey);
    setIsCreateModalOpen(false);

    // Reset Form
    setFormTitle('');
    setFormDesc('');
    setFormCategory('academics');
    setFormAudience('All Campus');
    setFormExpiryDays(7);
    setFormAnonymous(true);
    setFormPinned(false);
    setFormOptions([
      'Option A: Full implementation with overnight services',
      'Option B: Phased pilot project across selected blocks',
      'Option C: Maintain current schedule'
    ]);
  };

  // Option input manipulators
  const handleAddOptionInput = () => {
    if (formOptions.length >= 6) return;
    setFormOptions(prev => [...prev, `Option ${String.fromCharCode(65 + prev.length)}: `]);
  };

  const handleUpdateOptionInput = (index: number, val: string) => {
    setFormOptions(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveOptionInput = (index: number) => {
    if (formOptions.length <= 2) return;
    setFormOptions(prev => prev.filter((_, i) => i !== index));
  };

  // Filtered surveys
  const filteredSurveys = useMemo(() => {
    return surveys
      .filter(survey => {
        // Category filter
        if (selectedCategory !== 'all' && survey.category !== selectedCategory) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = survey.title.toLowerCase().includes(q);
          const matchesDesc = survey.description.toLowerCase().includes(q);
          const matchesOption = survey.options.some(opt => opt.text.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesOption) return false;
        }
        // Status & Participation filter
        const voted = hasUserVoted(survey);
        if (filterState === 'active' && survey.status !== 'active') return false;
        if (filterState === 'closed' && survey.status !== 'closed') return false;
        if (filterState === 'voted' && !voted) return false;
        if (filterState === 'pending' && (voted || survey.status !== 'active')) return false;

        return true;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.totalVotes - a.totalVotes;
      });
  }, [surveys, selectedCategory, searchQuery, filterState, user]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const activeCount = surveys.filter(s => s.status === 'active').length;
    const totalResponses = surveys.reduce((acc, curr) => acc + curr.totalVotes, 0);
    const myVotedCount = surveys.filter(s => hasUserVoted(s)).length;
    const pendingMyVote = surveys.filter(s => s.status === 'active' && !hasUserVoted(s)).length;

    return {
      activeCount,
      totalResponses,
      myVotedCount,
      pendingMyVote,
      turnoutRate: '78.4%'
    };
  }, [surveys, user]);

  // Download survey responses as CSV
  const handleExportCSV = (survey: CampusSurvey) => {
    const headers = ['Option Number', 'Option Text', 'Vote Count', 'Percentage'];
    const rows = survey.options.map((opt, idx) => {
      const pct = survey.totalVotes > 0 ? ((opt.votes / survey.totalVotes) * 100).toFixed(1) : '0.0';
      return [
        `Option ${idx + 1}`,
        `"${opt.text.replace(/"/g, '""')}"`,
        opt.votes,
        `${pct}%`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [
      `"Survey Title: ${survey.title.replace(/"/g, '""')}"`,
      `"Status: ${survey.status}"`,
      `"Total Ballots Cast: ${survey.totalVotes}"`,
      `"Published Date: ${survey.publishedAt}"`,
      '',
      headers.join(','),
      ...rows
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus-poll-${survey.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#183153] text-white shadow-sm">
                <Vote className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    Campus Surveys & Live Polls
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Network
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  Real-time collegiate voting, policy feedback, hostel reviews, and student democracy
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Real-time simulation toggle */}
            <button
              type="button"
              onClick={() => setIsLiveSimActive(!isLiveSimActive)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                isLiveSimActive
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
              title="Toggles simulated live incoming campus votes every few seconds"
            >
              {isLiveSimActive ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Live Feed On</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-slate-500" />
                  <span>Resume Live Feed</span>
                </>
              )}
            </button>

            {/* Admin Poll Creator Trigger */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#183153] hover:bg-[#22446d] text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Publish New Poll</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Polls</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{stats.activeCount}</span>
              <span className="text-xs font-semibold text-emerald-600">Open to vote</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Ballots Cast</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{stats.totalResponses.toLocaleString()}</span>
              <span className="text-xs font-semibold text-slate-500">Across campus</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Your Participation</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{stats.myVotedCount}</span>
              <span className="text-xs font-semibold text-slate-500">
                {stats.pendingMyVote > 0 ? `${stats.pendingMyVote} pending` : 'All caught up'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Campus Turnout</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{stats.turnoutRate}</span>
              <span className="text-xs font-semibold text-emerald-600">+4.2% this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Surveys Real-Time Progress Bar & Donut Chart Spotlight (Recharts) */}
      {selectedSpotlightSurvey && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                  <PieChartIcon className="h-3 w-3 text-blue-600" />
                  Active Surveys Recharts Visualizer
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Real-Time Telemetry
                </span>
                {selectedSpotlightSurvey.status === 'active' && (
                  <span className="text-[11px] font-semibold text-slate-500">
                    Category: <strong className="text-slate-800 capitalize">{selectedSpotlightSurvey.category.replace('_', ' ')}</strong>
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {selectedSpotlightSurvey.title}
              </h2>
              <p className="text-xs text-slate-600 line-clamp-1">
                {selectedSpotlightSurvey.description}
              </p>
            </div>

            {/* Switch Active Poll Selector */}
            {activeSurveys.length > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
                {activeSurveys.map(s => {
                  const isCurrent = s.id === selectedSpotlightSurvey.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSpotlightSurveyId(s.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                        isCurrent
                          ? 'bg-white text-[#183153] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {s.title.length > 20 ? s.title.slice(0, 18) + '…' : s.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Render the Recharts Visualizer for the spotlight survey */}
          <SurveyRealTimeVisualizer survey={selectedSpotlightSurvey} />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-[#183153] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Filter + Search */}
        <div className="flex items-center gap-2">
          {/* Quick status filter select */}
          <select
            value={filterState}
            onChange={e => setFilterState(e.target.value as any)}
            className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Poll States</option>
            <option value="active">Active Only</option>
            <option value="pending">Pending My Vote</option>
            <option value="voted">Voted by Me</option>
            <option value="closed">Closed / Concluded</option>
          </select>

          {/* Search box */}
          <div className="relative flex-1 md:w-56">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search polls..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Surveys List */}
      <div className="space-y-4">
        {filteredSurveys.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Vote className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching surveys found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your category selection, search terms, or status filter to see other campus polls.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setFilterState('all');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#183153] bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredSurveys.map(survey => {
            const isVoted = hasUserVoted(survey);
            const userChosenOptId = getUserSelectedOptionId(survey);
            const isCurrentSubmitting = submittingId === survey.id;
            const isJustVoted = recentlyVotedId === survey.id;
            const isClosed = survey.status === 'closed';

            // Find winning / top option
            const topOption = [...survey.options].sort((a, b) => b.votes - a.votes)[0];

            return (
              <div
                key={survey.id}
                className={`bg-white border rounded-2xl p-5 sm:p-6 transition shadow-sm ${
                  survey.pinned ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Poll Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {survey.pinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                          <Pin className="h-2.5 w-2.5" /> Pinned Poll
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {survey.category.replace('_', ' ')}
                      </span>

                      <span className="text-[11px] font-semibold text-slate-500">
                        Audience: <strong className="text-slate-700">{survey.targetAudience}</strong>
                      </span>

                      {isClosed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                          <Lock className="h-3 w-3" /> Closed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Clock className="h-3 w-3" /> Ends {survey.expiresAt}
                        </span>
                      )}

                      {survey.allowAnonymous && (
                        <span className="text-[10px] font-medium text-slate-400" title="Ballots are submitted anonymously">
                          • Anonymous Ballot
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {survey.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {survey.description}
                    </p>
                  </div>

                  {/* Real-time Vote Counter & Badges */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base sm:text-xl font-black text-slate-900 tabular-nums">
                          {survey.totalVotes.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">votes</span>
                        <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 block">
                        Published by {survey.createdBy}
                      </span>
                    </div>

                    {isVoted && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                        Response Recorded
                      </span>
                    )}
                  </div>
                </div>

                {/* Real-Time Vote Progression Sparkline */}
                <div className="mt-3.5">
                  <SurveyVoteSparkline survey={survey} />
                </div>

                {/* Card View Switcher: Ballot vs Recharts Live Charts */}
                <div className="flex items-center justify-between gap-2 mt-3.5 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    {cardViews[survey.id] === 'charts' ? (
                      <>
                        <PieChartIcon className="h-3.5 w-3.5 text-blue-600" />
                        Interactive Visualizer &amp; Progression
                      </>
                    ) : (
                      <>
                        <Vote className="h-3.5 w-3.5 text-slate-500" />
                        {isVoted || isClosed ? 'Certified Results & Ballot' : 'Cast Your Ballot'}
                      </>
                    )}
                  </span>

                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setCardViews(prev => ({ ...prev, [survey.id]: 'options' }))}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        cardViews[survey.id] !== 'charts'
                          ? 'bg-white text-slate-900 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ballot
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardViews(prev => ({ ...prev, [survey.id]: 'charts' }))}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                        cardViews[survey.id] === 'charts'
                          ? 'bg-white text-[#183153] font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <PieChartIcon className="h-3 w-3 text-blue-600" />
                      <span>Live Charts</span>
                      {survey.status === 'active' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </button>
                  </div>
                </div>

                {cardViews[survey.id] === 'charts' ? (
                  <div className="mt-3.5">
                    <SurveyRealTimeVisualizer survey={survey} />
                  </div>
                ) : (
                  <>
                    {/* Options List / Voting Interface */}
                    <div className="space-y-2.5 mt-3">
                      {survey.options.map((option, idx) => {
                        const percentage = survey.totalVotes > 0
                          ? Math.round((option.votes / survey.totalVotes) * 100)
                          : 0;
                        const isSelected = selectedOptions[survey.id] === option.id;
                        const isUserPick = userChosenOptId === option.id;
                        const isWinning = topOption?.id === option.id && survey.totalVotes > 0;

                        // If user has already voted or poll is closed, display live results bar
                        if (isVoted || isClosed) {
                          return (
                            <div
                              key={option.id}
                              className={`relative overflow-hidden rounded-xl border p-3.5 transition ${
                                isUserPick
                                  ? 'border-blue-300 bg-blue-50/40 ring-1 ring-blue-300'
                                  : 'border-slate-200/90 bg-slate-50/50'
                              }`}
                            >
                              {/* Animated percentage fill bar */}
                              <div
                                className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ease-out opacity-20 ${
                                  isUserPick
                                    ? 'bg-blue-600'
                                    : isWinning
                                    ? 'bg-emerald-600'
                                    : 'bg-slate-400'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />

                              <div className="relative z-10 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="font-extrabold text-xs text-slate-400 shrink-0">
                                    #{idx + 1}
                                  </span>
                                  <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                                    {option.text}
                                  </span>

                                  {isUserPick && (
                                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                      <UserCheck className="h-3 w-3" /> Your Choice
                                    </span>
                                  )}

                                  {isWinning && (
                                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                      <TrendingUp className="h-3 w-3" /> Leading
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs font-bold text-slate-500 tabular-nums">
                                    {option.votes} votes
                                  </span>
                                  <span className="text-xs sm:text-sm font-black text-slate-900 tabular-nums w-12 text-right">
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Active voting mode for students who haven't voted yet
                        return (
                          <label
                            key={option.id}
                            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition select-none ${
                              isSelected
                                ? 'border-[#183153] bg-blue-50/60 ring-2 ring-[#183153]'
                                : 'border-slate-200 bg-white hover:bg-slate-50/80'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <input
                                type="radio"
                                name={`survey-${survey.id}`}
                                checked={isSelected}
                                onChange={() => {
                                  setSelectedOptions(prev => ({ ...prev, [survey.id]: option.id }));
                                }}
                                className="h-4 w-4 text-[#183153] border-slate-300 focus:ring-[#183153]"
                              />
                              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                                {option.text}
                              </span>
                            </div>

                            <span className="text-[11px] font-bold text-slate-400 shrink-0">
                              Choice {String.fromCharCode(65 + idx)}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Expandable Recharts Visualizer for Voted/Closed Polls */}
                    {(isVoted || isClosed) && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setExpandedCardCharts(prev => ({ ...prev, [survey.id]: !prev[survey.id] }))}
                          className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition"
                        >
                          <PieChartIcon className="h-3.5 w-3.5 text-blue-600" />
                          <span>
                            {expandedCardCharts[survey.id]
                              ? 'Hide Real-Time Visualizer'
                              : 'Expand Real-Time Donut, Progress & Progression Timeline'}
                          </span>
                        </button>
                        {expandedCardCharts[survey.id] && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <SurveyRealTimeVisualizer survey={survey} />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Card Footer: Vote Action or Admin Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-3.5 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {isVoted ? (
                      <span className="text-slate-500 text-[11px]">
                        Results are updated in real-time as students cast their ballots.
                      </span>
                    ) : isClosed ? (
                      <span className="text-slate-500 text-[11px]">
                        This poll has concluded. Final certified votes displayed above.
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">
                        One response per verified university profile. Your selection is confidential.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {/* If user hasn't voted and poll is active: Submit Button */}
                    {!isVoted && !isClosed && (
                      <button
                        type="button"
                        disabled={!selectedOptions[survey.id] || isCurrentSubmitting}
                        onClick={() => handleVoteSubmit(survey.id)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 ${
                          selectedOptions[survey.id] && !isCurrentSubmitting
                            ? 'bg-[#183153] hover:bg-[#22446d] text-white cursor-pointer'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        {isCurrentSubmitting ? (
                          <>
                            <Activity className="h-4 w-4 animate-spin" />
                            <span>Recording Ballot...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Submit Response</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Analytics / Demographics Breakdown button for all users */}
                    <button
                      type="button"
                      onClick={() => setAnalyticsSurvey(survey)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="View demographic breakdown and analytics"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Analytics</span>
                    </button>

                    {/* Admin Controls (Status toggle & delete) */}
                    {(user.role === 'admin' || user.role === 'faculty') && (
                      <>
                        <button
                          type="button"
                          onClick={() => onToggleStatus(survey.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
                          title={isClosed ? 'Reopen poll' : 'Close poll'}
                        >
                          {isClosed ? (
                            <>
                              <Unlock className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Reopen</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3.5 w-3.5 text-amber-600" />
                              <span>Close</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this campus poll?')) {
                              onDeleteSurvey(survey.id);
                            }
                          }}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-100 transition"
                          title="Delete poll"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Analytics & Demographic Breakdown Modal */}
      {analyticsSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
                  Poll Intelligence & Analytics
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 line-clamp-1">
                  {analyticsSurvey.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsSurvey(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Snapshot metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Ballots</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    {analyticsSurvey.totalVotes.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Status</span>
                  <span className="text-sm font-extrabold capitalize text-slate-800 mt-1 block">
                    {analyticsSurvey.status}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Audience</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block truncate">
                    {analyticsSurvey.targetAudience}
                  </span>
                </div>
              </div>

              {/* Option Distribution with Recharts Donut & Progress Bar */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Vote Distribution (Recharts Analytics)
                </h4>
                <SurveyRealTimeVisualizer survey={analyticsSurvey} />
              </div>

              {/* Departmental Sample Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Cohort & Department Participation Share
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100">
                    <span className="text-slate-600 block text-[11px]">Computer Science</span>
                    <strong className="text-slate-900 font-extrabold text-sm">42%</strong>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
                    <span className="text-slate-600 block text-[11px]">Electronics & Comm.</span>
                    <strong className="text-slate-900 font-extrabold text-sm">28%</strong>
                  </div>
                  <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-100">
                    <span className="text-slate-600 block text-[11px]">Mechanical & Civil</span>
                    <strong className="text-slate-900 font-extrabold text-sm">18%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/60">
              <button
                type="button"
                onClick={() => handleExportCSV(analyticsSurvey)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV Report</span>
              </button>

              <button
                type="button"
                onClick={() => setAnalyticsSurvey(null)}
                className="px-4 py-2 text-xs font-bold bg-[#183153] text-white rounded-xl hover:bg-[#22446d]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin New Poll Creator Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
                  Administrator Studio
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Publish New Campus Survey
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePublish}>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Poll Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Poll Question / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. 24/7 Library Opening Hours for Finals"
                    className="w-full text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Context & Policy Background <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    rows={2}
                    placeholder="Provide context on why this poll is being launched and what decisions it influences..."
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Category & Target Audience Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Category</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value as any)}
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="academics">Academics</option>
                      <option value="dining_hostel">Dining & Hostel</option>
                      <option value="campus_life">Campus Life</option>
                      <option value="facilities">Facilities</option>
                      <option value="events">Events</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Target Audience</label>
                    <input
                      type="text"
                      value={formAudience}
                      onChange={e => setFormAudience(e.target.value)}
                      placeholder="e.g. All Campus, Hostel Residents"
                      className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Expiration Days & Options */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Voting Options <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Min 2, Max 6 choices
                    </span>
                  </div>

                  <div className="space-y-2 mt-1">
                    {formOptions.map((optText, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-400 w-6 text-center">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          value={optText}
                          onChange={e => handleUpdateOptionInput(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="flex-1 text-xs font-semibold border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        {formOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionInput(index)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                            title="Remove option"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    {formOptions.length < 6 && (
                      <button
                        type="button"
                        onClick={handleAddOptionInput}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#183153] hover:bg-blue-50 rounded-lg transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Another Choice</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Toggles: Anonymous & Pinned */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formAnonymous}
                      onChange={e => setFormAnonymous(e.target.checked)}
                      className="rounded text-[#183153] focus:ring-[#183153]"
                    />
                    <span>Allow Anonymous Student Ballots</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formPinned}
                      onChange={e => setFormPinned(e.target.checked)}
                      className="rounded text-[#183153] focus:ring-[#183153]"
                    />
                    <span>Pin to Top of Feed</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#183153] hover:bg-[#22446d] text-white rounded-xl shadow-sm transition active:scale-95"
                >
                  Publish to Campus Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
