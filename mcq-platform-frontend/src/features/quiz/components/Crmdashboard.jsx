// CRMDashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All dashboard data lives in DASHBOARD_DATA below.
// To connect real APIs: replace DASHBOARD_DATA fields with your API responses,
// set `loading: true` while fetching, then `loading: false` when done.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  Users, BookOpen, FileText, Briefcase, Award, TrendingUp, TrendingDown,
  BarChart3, DollarSign, GraduationCap, Building2, ClipboardList,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Search,
  ChevronRight, Activity, Target, Zap, Star,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { getUser } from '../../../utils/auth'
import { format } from "date-fns";

// ─────────────────────────────────────────────────────────────────────────────
// ✏️  DASHBOARD DATA — edit this single object to update every metric
// ─────────────────────────────────────────────────────────────────────────────
const DASHBOARD_DATA = {
  // ── KPI cards ──────────────────────────────────────────────────────────────
  kpis: [
    {
      id: "revenue",
      label: "Total Revenue",
      value: "₹ 24,85,000",
      raw: 2485000,
      change: +18.4,
      period: "vs last month",
      icon: DollarSign,
      color: "emerald",
    },
    {
      id: "students",
      label: "Students Enrolled",
      value: "3,842",
      raw: 3842,
      change: +12.1,
      period: "vs last month",
      icon: GraduationCap,
      color: "blue",
    },
    {
      id: "employees",
      label: "Employees",
      value: "148",
      raw: 148,
      change: +4.2,
      period: "vs last month",
      icon: Users,
      color: "violet",
    },
    {
      id: "quizzes",
      label: "Active Quizzes",
      value: "27",
      raw: 27,
      change: +3,
      period: "vs last month",
      icon: ClipboardList,
      color: "amber",
    },
    {
      id: "jobs",
      label: "Open Positions",
      value: "14",
      raw: 14,
      change: -2,
      period: "vs last month",
      icon: Briefcase,
      color: "rose",
    },
    {
      id: "departments",
      label: "Departments",
      value: "9",
      raw: 9,
      change: 0,
      period: "no change",
      icon: Building2,
      color: "teal",
    },
    {
      id: "questions",
      label: "Question Bank",
      value: "1,240",
      raw: 1240,
      change: +6.8,
      period: "vs last month",
      icon: FileText,
      color: "orange",
    },
    {
      id: "placements",
      label: "Placements",
      value: "312",
      raw: 312,
      change: +22.5,
      period: "vs last month",
      icon: Award,
      color: "pink",
    },
  ],

  // ── Revenue chart (monthly) ─────────────────────────────────────────────
  revenueChart: [
    { month: "Jul", revenue: 1420000, target: 1500000 },
    { month: "Aug", revenue: 1680000, target: 1600000 },
    { month: "Sep", revenue: 1550000, target: 1700000 },
    { month: "Oct", revenue: 1920000, target: 1800000 },
    { month: "Nov", revenue: 2100000, target: 2000000 },
    { month: "Dec", revenue: 1850000, target: 2100000 },
    { month: "Jan", revenue: 2350000, target: 2200000 },
    { month: "Feb", revenue: 2485000, target: 2300000 },
  ],

  // ── Student enrolment trend ─────────────────────────────────────────────
  studentChart: [
    { month: "Jul", enrolled: 280, completed: 210, dropped: 18 },
    { month: "Aug", enrolled: 320, completed: 248, dropped: 22 },
    { month: "Sep", enrolled: 295, completed: 230, dropped: 15 },
    { month: "Oct", enrolled: 410, completed: 335, dropped: 28 },
    { month: "Nov", enrolled: 480, completed: 392, dropped: 32 },
    { month: "Dec", enrolled: 350, completed: 290, dropped: 20 },
    { month: "Jan", enrolled: 520, completed: 425, dropped: 35 },
    { month: "Feb", enrolled: 580, completed: 460, dropped: 42 },
  ],

  // ── Department distribution (pie) ──────────────────────────────────────
  departmentChart: [
    { name: "Engineering", value: 38, color: "#8b5cf6" },
    { name: "Management",  value: 24, color: "#06b6d4" },
    { name: "Design",      value: 14, color: "#f59e0b" },
    { name: "Marketing",   value: 12, color: "#10b981" },
    { name: "HR & Admin",  value: 8,  color: "#f43f5e" },
    { name: "Finance",     value: 4,  color: "#6366f1" },
  ],

  // ── Quiz performance by category ───────────────────────────────────────
  quizPerformance: [
    { category: "Aptitude",  avgScore: 72, attempts: 420 },
    { category: "English",   avgScore: 68, attempts: 380 },
    { category: "Technical", avgScore: 64, attempts: 510 },
    { category: "Logical",   avgScore: 76, attempts: 340 },
    { category: "HR",        avgScore: 82, attempts: 290 },
  ],

  // ── Recent activity feed ────────────────────────────────────────────────
  recentActivity: [
    { id: 1, type: "student",  icon: GraduationCap, color: "blue",   text: "42 new students enrolled in Web Dev batch",       time: "2m ago" },
    { id: 2, type: "quiz",     icon: ClipboardList, color: "violet", text: "MERN Stack Quiz activated — 128 attempts so far",  time: "18m ago" },
    { id: 3, type: "job",      icon: Briefcase,     color: "amber",  text: "3 new job postings added by HR team",              time: "1h ago" },
    { id: 4, type: "revenue",  icon: DollarSign,    color: "emerald",text: "₹ 1,20,000 fee collection processed",              time: "2h ago" },
    { id: 5, type: "employee", icon: Users,         color: "teal",   text: "2 new trainers onboarded in Engineering dept",     time: "3h ago" },
    { id: 6, type: "award",    icon: Award,         color: "pink",   text: "18 students placed at Infosys & TCS this week",    time: "5h ago" },
  ],

  // ── Top performing students ─────────────────────────────────────────────
  topStudents: [
    { rank: 1, name: "Aanya Sharma",   dept: "Engineering",  score: 94, badge: "🥇" },
    { rank: 2, name: "Rithvik Nair",   dept: "Management",   score: 91, badge: "🥈" },
    { rank: 3, name: "Pooja Iyer",     dept: "Engineering",  score: 89, badge: "🥉" },
    { rank: 4, name: "Karthik Raj",    dept: "Design",       score: 87, badge: "⭐" },
    { rank: 5, name: "Divya Menon",    dept: "Marketing",    score: 85, badge: "⭐" },
  ],

  // ── Quick stats row ─────────────────────────────────────────────────────
  quickStats: {
    avgQuizScore:    73.2,
    courseCompRate:  79.4,
    placementRate:   81.2,
    retentionRate:   88.6,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Color map — controls accent colours for KPI cards & badges
// ─────────────────────────────────────────────────────────────────────────────
const COLOR = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", icon: "bg-emerald-500/15" },
  blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400",    icon: "bg-blue-500/15" },
  violet:  { bg: "bg-violet-500/10",  border: "border-violet-500/20",  text: "text-violet-400",  icon: "bg-violet-500/15" },
  amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-400",   icon: "bg-amber-500/15" },
  rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-400",    icon: "bg-rose-500/15" },
  teal:    { bg: "bg-teal-500/10",    border: "border-teal-500/20",    text: "text-teal-400",    icon: "bg-teal-500/15" },
  orange:  { bg: "bg-orange-500/10",  border: "border-orange-500/20",  text: "text-orange-400",  icon: "bg-orange-500/15" },
  pink:    { bg: "bg-pink-500/10",    border: "border-pink-500/20",    text: "text-pink-400",    icon: "bg-pink-500/15" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton components
// ─────────────────────────────────────────────────────────────────────────────
const SkeletonBox = ({ className = "" }) => (
  <div className={`animate-pulse bg-[var(--color-muted)]/20 rounded-xl ${className}`} />
);

const KPICardSkeleton = () => (
  <div className="bg-[var(--color-card)]/30 border border-[var(--color-muted)]/20 rounded-2xl p-5 space-y-4">
    <div className="flex items-center justify-between">
      <SkeletonBox className="w-10 h-10 rounded-xl" />
      <SkeletonBox className="w-16 h-5 rounded-lg" />
    </div>
    <SkeletonBox className="w-24 h-7 rounded-lg" />
    <SkeletonBox className="w-32 h-4 rounded-lg" />
  </div>
);

const ChartSkeleton = ({ height = "h-64" }) => (
  <div className={`${height} flex items-end gap-2 px-4 pb-4`}>
    {[55, 80, 65, 90, 70, 85, 60, 95].map((h, i) => (
      <div key={i} className="flex-1 animate-pulse bg-[var(--color-muted)]/20 rounded-t-lg" style={{ height: `${h}%` }} />
    ))}
  </div>
);

const ActivitySkeleton = () => (
  <div className="space-y-4">
    {[1,2,3,4].map((i) => (
      <div key={i} className="flex items-start gap-3">
        <SkeletonBox className="w-9 h-9 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="w-full h-4 rounded-lg" />
          <SkeletonBox className="w-16 h-3 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Custom Tooltip for recharts
// ─────────────────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/30 rounded-xl px-3 py-2 shadow-2xl text-xs">
      <p className="font-semibold text-[var(--color-text)] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {prefix}{typeof p.value === "number" && p.value > 9999
            ? `₹ ${(p.value / 100000).toFixed(1)}L`
            : p.value}
        </p>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Quick stat progress bar
// ─────────────────────────────────────────────────────────────────────────────
const ProgressStat = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1.5">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className={`font-bold ${color}`}>{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-[var(--color-muted)]/20 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color.replace("text-", "bg-")}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main CRMDashboard
// ─────────────────────────────────────────────────────────────────────────────
export const CRMDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const adminData = getUser();

  // Simulate fetch — replace with your real API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(DASHBOARD_DATA); // swap with: const res = await adminAPI.getDashboard(); setData(res.data);
      setLoading(false);
    }, 1800); // remove timeout in production
    return () => clearTimeout(timer);
  }, []);

  const adminName = adminData?.name ?? "Admin";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

      {/* ━━━━━━━━ Header ━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-1 uppercase tracking-widest font-medium">
            Enterprise CRM
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent leading-tight">
            Dashboard
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            Welcome back, <span className="text-[var(--color-text)] font-semibold">{adminName}</span> — {format(new Date(), "EEEE, dd MMM yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search…"
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-[var(--color-muted)]/20 bg-[var(--color-card)]/80 text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 w-48 transition-all"
            />
          </div>
          {/* Notification bell */}
          <button className="relative p-2.5 rounded-xl border border-[var(--color-muted)]/20 bg-[var(--color-card)]/80 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary)] rounded-full" />
          </button>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center font-bold text-white text-sm shadow-lg">
            {adminName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* ━━━━━━━━ KPI Cards ━━━━━━━━ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <KPICardSkeleton key={i} />)
          : data.kpis.map((kpi) => {
              const c = COLOR[kpi.color];
              const Icon = kpi.icon;
              const isUp = kpi.change > 0;
              const isFlat = kpi.change === 0;
              return (
                <div
                  key={kpi.id}
                  className={`group relative bg-[var(--color-card)]/40 backdrop-blur-xl border ${c.border} rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer`}
                >
                  {/* Glow */}
                  <div className={`absolute -top-4 -right-4 w-16 h-16 ${c.bg} rounded-full blur-xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 ${c.icon} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${c.text}`} />
                      </div>
                      {!isFlat && (
                        <span className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-lg ${isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {Math.abs(kpi.change)}%
                        </span>
                      )}
                    </div>
                    <p className={`text-xl sm:text-2xl font-black ${c.text} mb-0.5 leading-none`}>{kpi.value}</p>
                    <p className="text-xs text-[var(--color-text-muted)] font-medium">{kpi.label}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]/60 mt-1">{kpi.period}</p>
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* ━━━━━━━━ Charts row 1 — Revenue + Students ━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

        {/* Revenue Area Chart */}
        <div className="lg:col-span-3 bg-[var(--color-card)]/40 backdrop-blur-xl border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">Revenue Overview</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Monthly revenue vs target</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-primary)]" />Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-secondary)]/60" />Target</span>
            </div>
          </div>
          {loading ? <ChartSkeleton height="h-52" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.revenueChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tgtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--color-secondary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-muted)" strokeOpacity={0.3} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} tickFormatter={(v) => `${(v/100000).toFixed(0)}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "var(--color-primary)" }} />
                <Area type="monotone" dataKey="target"  name="Target"  stroke="var(--color-secondary)" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#tgtGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Department Pie */}
        <div className="lg:col-span-2 bg-[var(--color-card)]/40 backdrop-blur-xl border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">By Department</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Employee distribution</p>
          </div>
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <SkeletonBox className="w-36 h-36 rounded-full" />
              <div className="w-full space-y-2">{[1,2,3].map(i=><SkeletonBox key={i} className="h-4 rounded-lg" />)}</div>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={data.departmentChart} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {data.departmentChart.map((entry, i) => (
                      <Cell key={i} fill={entry.color} opacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-muted)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-1">
                {data.departmentChart.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                      <span className="text-[var(--color-text-muted)]">{d.name}</span>
                    </div>
                    <span className="font-semibold text-[var(--color-text)]">{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ━━━━━━━━ Charts row 2 — Student Trend + Quiz Performance ━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Student bar chart */}
        <div className="bg-[var(--color-card)]/40 backdrop-blur-xl border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">Student Enrolment</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Monthly enrolled / completed</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400" />Enrolled</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />Completed</span>
            </div>
          </div>
          {loading ? <ChartSkeleton height="h-48" /> : (
            <ResponsiveContainer width="100%" height={185}>
              <BarChart data={data.studentChart} barCategoryGap="30%" margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-muted)" strokeOpacity={0.3} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="enrolled"  name="Enrolled"  fill="#60a5fa" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quiz performance line chart */}
        <div className="bg-[var(--color-card)]/40 backdrop-blur-xl border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">Quiz Performance</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Avg score by category</p>
            </div>
          </div>
          {loading ? <ChartSkeleton height="h-48" /> : (
            <ResponsiveContainer width="100%" height={185}>
              <BarChart data={data.quizPerformance} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 10 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--color-muted)" strokeOpacity={0.3} />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} width={68} />
                <Tooltip formatter={(v) => [`${v}%`, "Avg Score"]} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-muted)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="avgScore" name="Avg Score" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ━━━━━━━━ Bottom row — Activity + Top Students + Progress ━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-[var(--color-card)]/40 backdrop-blur-xl border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">Recent Activity</h3>
            <button className="text-xs text-[var(--color-primary)] hover:underline">View all</button>
          </div>
          {loading ? <ActivitySkeleton /> : (
            <div className="space-y-3">
              {data.recentActivity.map((act) => {
                const c = COLOR[act.color];
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3 group">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 ${c.icon} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${c.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-[var(--color-text)] leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                        {act.text}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{act.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Students */}
        <div className="lg:col-span-1 bg-[var(--color-card)]/40 backdrop-blur-xl border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">Top Students</h3>
            <button className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-0.5">
              All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i=>(
              <div key={i} className="flex items-center gap-3">
                <SkeletonBox className="w-7 h-7 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <SkeletonBox className="h-3.5 w-32 rounded" />
                  <SkeletonBox className="h-3 w-20 rounded" />
                </div>
                <SkeletonBox className="h-5 w-10 rounded-lg" />
              </div>
            ))}</div>
          ) : (
            <div className="space-y-3">
              {data.topStudents.map((s) => (
                <div key={s.rank} className="flex items-center gap-3 group hover:bg-[var(--color-primary)]/5 rounded-xl p-1.5 -mx-1.5 transition-all cursor-pointer">
                  <span className="text-base shrink-0 w-6 text-center">{s.badge}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)] transition-colors">{s.name}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate">{s.dept}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg shrink-0">
                    {s.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Progress */}
        <div className="lg:col-span-1 bg-[var(--color-card)]/40 backdrop-blur-xl border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="mb-5">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">Key Metrics</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Performance indicators</p>
          </div>
          {loading ? (
            <div className="space-y-5">{[1,2,3,4].map(i=>(
              <div key={i} className="space-y-2">
                <div className="flex justify-between"><SkeletonBox className="h-3 w-32 rounded" /><SkeletonBox className="h-3 w-10 rounded" /></div>
                <SkeletonBox className="h-2 rounded-full" />
              </div>
            ))}</div>
          ) : (
            <div className="space-y-5">
              <ProgressStat label="Avg Quiz Score"     value={data.quickStats.avgQuizScore}    color="text-violet-400" />
              <ProgressStat label="Course Completion"  value={data.quickStats.courseCompRate}   color="text-blue-400" />
              <ProgressStat label="Placement Rate"     value={data.quickStats.placementRate}    color="text-emerald-400" />
              <ProgressStat label="Student Retention"  value={data.quickStats.retentionRate}    color="text-amber-400" />
            </div>
          )}

          {/* Mini highlights */}
          {!loading && (
            <div className="grid grid-cols-2 gap-2 mt-6">
              {[
                { icon: Zap,    label: "Avg quiz score",   val: `${data.quickStats.avgQuizScore}%`, color: "text-violet-400" },
                { icon: Target, label: "Placement rate",   val: `${data.quickStats.placementRate}%`, color: "text-emerald-400" },
                { icon: Star,   label: "Completion",       val: `${data.quickStats.courseCompRate}%`, color: "text-blue-400" },
                { icon: Activity,label:"Retention",        val: `${data.quickStats.retentionRate}%`, color: "text-amber-400" },
              ].map((m, i) => (
                <div key={i} className={`flex flex-col items-center p-2.5 bg-[var(--color-muted)]/10 rounded-xl border border-[var(--color-muted)]/15`}>
                  <m.icon className={`w-4 h-4 ${m.color} mb-1`} />
                  <span className={`text-sm font-black ${m.color}`}>{m.val}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)] text-center leading-tight mt-0.5">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CRMDashboard;