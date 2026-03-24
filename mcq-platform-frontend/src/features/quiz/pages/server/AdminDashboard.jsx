// import { useEffect, useState } from "react";
// import {
//   Users,
//   BookOpen,
//   FileText,
//   Calendar,
//   Award,
//   BarChart3,
//   Settings,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   Mail,
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";
// import { Calendar as ReactCalendar } from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { format } from "date-fns";
// import { getUser } from "../../../../utils/auth";
// import { adminAPI } from "../../../../services/api";

// const sampleData = [
//   { name: "English", questions: 25, students: 45 },
//   { name: "Aptitude", questions: 30, students: 52 },
//   { name: "Logical", questions: 20, students: 38 },
//   { name: "Technical", questions: 50, students: 67 },
// ];

// const highlightedDates = [
//   new Date("2026-02-18"),
//   new Date("2026-02-19"),
//   new Date("2026-02-20"),
// ];

// export const AdminDashboard = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeTab, setActiveTab] = useState("overview");

//   const adminData = getUser();

//   // Fallback if no admin data (shouldn't happen if AdminProtectedRoute works)
//   const adminProfile = adminData || {
//     name: "XXXXXXXX",
//     email: "xxxx@admin.com",
//     role: "Super Admin",
//     created_at: "YYYY-MM-DD",
//   };
//   const [stats, setStats] = useState({
//     categories: 0,
//     questions: 0,
//     departments: 0,
//     quizzes: 0,
//     students: 0,
//   });
//   const [loadingStats, setLoadingStats] = useState(true);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setLoadingStats(true);
//         const response = await adminAPI.getMeta();
//         if (response.data.success) {
//           // console.log(response.data);
          
//           // ✅ Extract from response.data.message
//           setStats(response.data.message);
//         } else {
//           throw new Error(response.data.message || "Failed to load stats");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoadingStats(false);
//       }
//     };

//     fetchStats();
//   }, []);
//   const formatDate = (date) => format(date, "MMM dd, yyyy");

//   return (
//     <div className="min-h-screen bg-[var(--color-bg)] p-6">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
//         <div>
//           <h1 className="text-4xl font-black bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent">
//             Admin Dashboard
//           </h1>
//           <p className="text-[var(--color-text-muted)] mt-2">
//             Welcome back, {adminProfile.name}!
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-[var(--color-text-muted)]">
//             {formatDate(new Date())}
//           </span>
//           <div className="w-12 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center shadow-lg">
//             <Calendar className="w-6 h-6 text-[var(--color-text)]" />
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
//         {/* Admin Profile Card - Enhanced Theme */}
//         <div className="xl:col-span-2">
//           <div className="bg-[var(--color-card)]/30 relative backdrop-blur-xl border border-[var(--color-muted)]/40 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
          
//           <div className="absolute h-15 aspect-square bg-primary rounded-full -top-3 -right-3 blur-2xl animate-pulse"/>
//             {/* Avatar */}
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 rounded-3xl flex items-center justify-center shadow-2xl font-bold text-2xl text-[var(--color-text)] border-3 border-[var(--color-primary)]/40">
//                   {adminProfile.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[var(--color-success)] rounded-full border-4 border-[var(--color-card)] shadow-md" />
//               </div>
//             </div>

//             {/* Name & Role */}
//             <div className="text-center mb-6 space-y-2">
//               <h3 className="text-2xl font-black bg-gradient-to-r from-[var(--color-text)] to-[var(--color-primary)] bg-clip-text text-transparent leading-tight truncate">
//                 {adminProfile.name}
//               </h3>
//               <p className="text-[var(--color-primary)] font-semibold px-4 py-1.5 bg-[var(--color-primary)]/10 rounded-xl inline-block border border-[var(--color-primary)]/30 backdrop-blur-sm shadow-sm">
//                 {adminProfile.role}
//               </p>
//             </div>

//             {/* Details */}
//             <div className="space-y-3 text-sm mb-6">
//               <div className="flex justify-between py-2.5 px-4 bg-[var(--color-card)]/50 backdrop-blur-sm rounded-xl border border-[var(--color-muted)]/20 hover:bg-[var(--color-card)] hover:border-[var(--color-primary)]/20 transition-all">
//                 <span className="text-[var(--color-text-muted)] font-medium flex items-center gap-2">
//                   <Mail size={14} />
//                   Email
//                 </span>
//                 <span className="font-mono text-[var(--color-text)] text-base truncate max-w-[60%] text-right">
//                   {adminProfile.email}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2.5 px-4 bg-[var(--color-card)]/50 backdrop-blur-sm rounded-xl border border-[var(--color-muted)]/20 hover:bg-[var(--color-card)] hover:border-[var(--color-primary)]/20 transition-all">
//                 <span className="text-[var(--color-text-muted)] font-medium flex items-center gap-2">
//                   <Calendar size={14} />
//                   Joined
//                 </span>
//                 <span className="text-[var(--color-text)] font-medium">
//                   {formatDate(adminProfile.created_at)}
//                 </span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="grid grid-cols-2 gap-3">
//               <button className="group flex items-center justify-center gap-2 p-3.5 text-sm bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md h-14 font-semibold text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 hover:border-[var(--color-secondary)]/40 backdrop-blur-sm hover:scale-[1.02]">
//                 <Settings
//                   size={16}
//                   className="group-hover:rotate-12 transition-transform duration-200"
//                 />
//                 Settings
//               </button>
//               <button className="group flex items-center justify-center gap-2 p-3.5 text-sm bg-[var(--color-danger)]/10 hover:bg-[var(--color-danger)]/20 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md h-14 font-semibold text-[var(--color-danger)] border border-[var(--color-danger)]/30 hover:border-[var(--color-danger)]/40 backdrop-blur-sm hover:scale-[1.02]">
//                 <LogOut
//                   size={16}
//                   className="group-hover:rotate-180 transition-transform duration-200"
//                 />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
//           {[
//             {
//               label: "Categories",
//               value: stats.categories,
//               icon: BookOpen,
//               color: "from-purple-stat",
//             },
//             {
//               label: "Questions",
//               value: stats.questions,
//               icon: FileText,
//               color: "from-emerald-stat",
//             },
//             {
//               label: "Departments",
//               value: stats.departments,
//               icon: Users,
//               color: "from-blue-stat",
//             },
//             {
//               label: "Quizzes",
//               value: stats.quizzes,
//               icon: Award,
//               color: "from-orange-stat",
//             },
//             {
//               label: "Students",
//               value: stats.students,
//               icon: BarChart3,
//               color: "from-indigo-stat",
//             },
//           ].map((stat, index) => (
//             <div
//               key={index}
//               className="group bg-[var(--color-card)]/20 backdrop-blur-xl border border-[var(--color-muted)]/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div
//                   className={`p-3 rounded-2xl bg-linear-to-r ${stat.color} to${stat.color} shadow-lg`}
//                 >
//                   <stat.icon className="w-6 h-6 text-[var(--color-text)]" />
//                 </div>
//                 <div className="p-2 bg-[var(--color-muted)]/20 rounded-xl group-hover:bg-[var(--color-muted)]/30 transition-all">
//                   <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-3xl font-black text-[var(--color-text)] mb-1">
//                   {stat.value}
//                 </p>
//                 <p className="text-[var(--color-text-muted)] font-medium">
//                   {stat.label}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Charts */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-[var(--color-card)]/30 backdrop-blur-xl border border-[var(--color-muted)]/30 rounded-3xl p-8 shadow-2xl">
//             <h3 className="text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-3">
//               <BarChart3 className="w-8 h-8 text-[var(--color-primary)]" />
//               Category Analytics
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={sampleData}>
//                 <CartesianGrid
//                   vertical={false}
//                   strokeDasharray="3 3"
//                   stroke="var(--color-muted)"
//                 />
//                 <XAxis
//                   dataKey="name"
//                   axisLine={false}
//                   tickLine={false}
//                   tickMargin={10}
//                   tick={{ fill: "var(--color-text-muted)" }}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tickMargin={10}
//                   tick={{ fill: "var(--color-text-muted)" }}
//                 />
//                 <Tooltip />
//                 <Bar
//                   dataKey="questions"
//                   fill="var(--color-primary)"
//                   radius={[8, 8, 0, 0]}
//                 />
//                 <Bar
//                   dataKey="students"
//                   fill="var(--color-secondary)"
//                   radius={[8, 8, 0, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Cute Calendar */}
//         <div className="lg:col-span-1">
//           <div className="bg-[var(--color-card)]/50 backdrop-blur-xl border border-[var(--color-muted)]/30 rounded-3xl p-6 shadow-2xl">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
//                 <Calendar className="w-6 h-6 text-[var(--color-primary)]" />
//                 Schedule
//               </h3>
//               <div className="flex gap-1 text-sm">
//                 <button
//                   onClick={() =>
//                     setSelectedDate(
//                       new Date(
//                         selectedDate.getFullYear(),
//                         selectedDate.getMonth(),
//                         1,
//                       ),
//                     )
//                   }
//                   className="p-1 hover:bg-[var(--color-muted)]/20 rounded-lg transition-all text-[var(--color-text-muted)]"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={() =>
//                     setSelectedDate(
//                       new Date(
//                         selectedDate.getFullYear(),
//                         selectedDate.getMonth() + 1,
//                         1,
//                       ),
//                     )
//                   }
//                   className="p-1 hover:bg-[var(--color-muted)]/20 rounded-lg transition-all text-[var(--color-text-muted)]"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             </div>

//             <div className="react-calendar-custom">
//               <ReactCalendar
//                 onChange={setSelectedDate}
//                 value={selectedDate}
//                 tileClassName={({ date }) =>
//                   highlightedDates.some(
//                     (hDate) => hDate.toDateString() === date.toDateString(),
//                   )
//                     ? "highlight"
//                     : null
//                 }
//                 navigationLabel={null}
//                 prevLabel={<ChevronLeft size={20} />}
//                 nextLabel={<ChevronRight size={20} />}
//                 tileContent={({ date }) =>
//                   highlightedDates.some(
//                     (hDate) => hDate.toDateString() === date.toDateString(),
//                   ) ? (
//                     <div className="w-2 h-2 bg-[var(--color-success)] rounded-full mx-auto mt-1" />
//                   ) : null
//                 }
//               />
//             </div>
//             <p className="text-center mt-4 text-sm text-[var(--color-text-muted)]">
//               {format(selectedDate, "MMMM yyyy")}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




// =============New DashBoard =============

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              ENTERPRISE ADMIN DASHBOARD                      ║
 * ║──────────────────────────────────────────────────────────────║
 * ║  EASY CUSTOMIZATION GUIDE:                                   ║
 * ║  1. DASHBOARD_CONFIG  — change titles, icons, routes         ║
 * ║  2. STAT_CARDS_CONFIG — add/remove stat cards                ║
 * ║  3. CHART_CONFIG      — tweak chart colors, labels, height   ║
 * ║  4. ACTIVITY_CONFIG   — mock or real recent activity feed    ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// import { useEffect, useState } from "react";
// import {
//   Users, BookOpen, FileText, Calendar, Award, BarChart3,
//   Settings, LogOut, ChevronRight, Mail, TrendingUp, TrendingDown,
//   Activity, Bell, Search, Shield, Zap, Globe, Clock,
// } from "lucide-react";
// import {
//   ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
//   CartesianGrid, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend,
// } from "recharts";
// import { format, subDays } from "date-fns";
// import { getUser } from "../../../../utils/auth";
// import { adminAPI } from "../../../../services/api";

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // ✏️  SECTION 1: DASHBOARD GLOBAL CONFIG
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const DASHBOARD_CONFIG = {
//   title: "Admin Dashboard",
//   subtitle: (name) => `Welcome back, ${name}`,
//   brandAccent: "var(--color-primary)",
//   showNotifications: true,
//   showSearch: true,
//   showQuickActions: true,
// };

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // ✏️  SECTION 2: STAT CARDS CONFIG
// //     Add, remove, or reorder cards here.
// //     `key` maps to the `stats` object from API.
// //     `trend` = "up" | "down" — cosmetic indicator.
// //     `delta` = string shown next to trend arrow.
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const STAT_CARDS_CONFIG = [
//   {
//     key: "categories",
//     label: "Categories",
//     icon: BookOpen,
//     gradient: "from-violet-500/20 to-purple-600/10",
//     iconColor: "text-violet-400",
//     borderAccent: "border-violet-500/30",
//     trend: "up",
//     delta: "+2 this month",
//   },
//   {
//     key: "questions",
//     label: "Questions",
//     icon: FileText,
//     gradient: "from-emerald-500/20 to-teal-600/10",
//     iconColor: "text-emerald-400",
//     borderAccent: "border-emerald-500/30",
//     trend: "up",
//     delta: "+18 this week",
//   },
//   {
//     key: "departments",
//     label: "Departments",
//     icon: Globe,
//     gradient: "from-sky-500/20 to-blue-600/10",
//     iconColor: "text-sky-400",
//     borderAccent: "border-sky-500/30",
//     trend: "up",
//     delta: "No change",
//   },
//   {
//     key: "quizzes",
//     label: "Quizzes",
//     icon: Award,
//     gradient: "from-amber-500/20 to-orange-600/10",
//     iconColor: "text-amber-400",
//     borderAccent: "border-amber-500/30",
//     trend: "up",
//     delta: "+5 active",
//   },
//   {
//     key: "students",
//     label: "Students",
//     icon: Users,
//     gradient: "from-rose-500/20 to-pink-600/10",
//     iconColor: "text-rose-400",
//     borderAccent: "border-rose-500/30",
//     trend: "up",
//     delta: "+24 this week",
//   },
// ];

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // ✏️  SECTION 3: CHART CONFIG
// //     Swap data sources, colors, and chart type here.
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const CHART_CONFIG = {
//   barChart: {
//     title: "Category Analytics",
//     height: 260,
//     bars: [
//       { key: "questions", label: "Questions", color: "var(--color-primary)" },
//       { key: "students",  label: "Students",  color: "var(--color-secondary)" },
//     ],
//     // Replace with real API data
//     data: [
//       { name: "English",   questions: 25, students: 45 },
//       { name: "Aptitude",  questions: 30, students: 52 },
//       { name: "Logical",   questions: 20, students: 38 },
//       { name: "Technical", questions: 50, students: 67 },
//       { name: "HR",        questions: 15, students: 29 },
//     ],
//   },
//   areaChart: {
//     title: "Student Activity (Last 7 Days)",
//     height: 200,
//     color: "var(--color-primary)",
//     // Replace with real API data
//     data: Array.from({ length: 7 }, (_, i) => ({
//       date: format(subDays(new Date(), 6 - i), "EEE"),
//       active: Math.floor(Math.random() * 60) + 20,
//       new: Math.floor(Math.random() * 20) + 5,
//     })),
//   },
//   pieChart: {
//     title: "Quiz Distribution",
//     height: 200,
//     colors: ["#7c3aed", "#10b981", "#f59e0b", "#3b82f6", "#ef4444"],
//     data: [
//       { name: "English",   value: 25 },
//       { name: "Aptitude",  value: 30 },
//       { name: "Logical",   value: 20 },
//       { name: "Technical", value: 50 },
//       { name: "HR",        value: 15 },
//     ],
//   },
// };

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // ✏️  SECTION 4: RECENT ACTIVITY CONFIG
// //     Replace `mockActivity` with an API call.
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const mockActivity = [
//   { id: 1, type: "student",  message: "Arjun Kumar enrolled in Technical Quiz", time: "2m ago",  icon: Users,    color: "text-sky-400" },
//   { id: 2, type: "quiz",     message: "New aptitude quiz published",             time: "18m ago", icon: Award,    color: "text-amber-400" },
//   { id: 3, type: "question", message: "15 new questions added to English",       time: "1h ago",  icon: FileText, color: "text-emerald-400" },
//   { id: 4, type: "system",   message: "Daily backup completed successfully",     time: "3h ago",  icon: Shield,   color: "text-violet-400" },
//   { id: 5, type: "student",  message: "Priya Nair completed Logical Reasoning",  time: "5h ago",  icon: Zap,      color: "text-rose-400" },
// ];

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // SKELETON COMPONENTS — reusable loading placeholders
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const SkeletonPulse = ({ className = "" }) => (
//   <div className={`animate-pulse rounded-xl bg-[var(--color-muted)]/20 ${className}`} />
// );

// const StatCardSkeleton = () => (
//   <div className="bg-[var(--color-card)]/30 border border-[var(--color-muted)]/20 rounded-2xl p-5 space-y-4">
//     <div className="flex items-center justify-between">
//       <SkeletonPulse className="w-10 h-10 rounded-xl" />
//       <SkeletonPulse className="w-16 h-5 rounded-lg" />
//     </div>
//     <SkeletonPulse className="w-16 h-8 rounded-lg" />
//     <SkeletonPulse className="w-24 h-4 rounded-md" />
//   </div>
// );

// const ProfileSkeleton = () => (
//   <div className="bg-[var(--color-card)]/30 border border-[var(--color-muted)]/20 rounded-2xl p-6 space-y-5">
//     <div className="flex flex-col items-center gap-3">
//       <SkeletonPulse className="w-20 h-20 rounded-2xl" />
//       <SkeletonPulse className="w-32 h-6 rounded-lg" />
//       <SkeletonPulse className="w-20 h-5 rounded-full" />
//     </div>
//     <div className="space-y-3">
//       <SkeletonPulse className="w-full h-10 rounded-xl" />
//       <SkeletonPulse className="w-full h-10 rounded-xl" />
//     </div>
//     <div className="grid grid-cols-2 gap-3">
//       <SkeletonPulse className="h-11 rounded-xl" />
//       <SkeletonPulse className="h-11 rounded-xl" />
//     </div>
//   </div>
// );

// const ChartSkeleton = ({ height = 260 }) => (
//   <div className="space-y-3">
//     <SkeletonPulse className="w-48 h-6 rounded-lg" />
//     <div className="flex items-end gap-3" style={{ height }}>
//       {[65, 45, 80, 55, 70, 40, 60, 75].map((h, i) => (
//         <div key={i} className="flex-1 flex flex-col justify-end gap-1">
//           <SkeletonPulse className="w-full rounded-t-md" style={{ height: `${h}%` }} />
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const ActivitySkeleton = () => (
//   <div className="space-y-4">
//     {Array.from({ length: 5 }).map((_, i) => (
//       <div key={i} className="flex items-start gap-3">
//         <SkeletonPulse className="w-8 h-8 rounded-xl flex-shrink-0" />
//         <div className="flex-1 space-y-1.5">
//           <SkeletonPulse className="w-full h-4 rounded-md" />
//           <SkeletonPulse className="w-16 h-3 rounded-md" />
//         </div>
//       </div>
//     ))}
//   </div>
// );

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // CUSTOM TOOLTIP for Recharts
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/40 rounded-xl p-3 shadow-2xl text-sm">
//       <p className="text-[var(--color-text-muted)] font-medium mb-2">{label}</p>
//       {payload.map((p, i) => (
//         <div key={i} className="flex items-center gap-2">
//           <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
//           <span className="text-[var(--color-text)]">{p.name}: <strong>{p.value}</strong></span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // MAIN COMPONENT
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// export const AdminDashboard = () => {
//   const [loading, setLoading]   = useState(true);
//   const [stats, setStats]       = useState({});
//   const [error, setError]       = useState(null);
//   const [activeChart, setActiveChart] = useState("bar"); // "bar" | "area"
//   const [searchOpen, setSearchOpen]   = useState(false);

//   const adminData    = getUser();
//   const adminProfile = adminData || {
//     name: "Admin User",
//     email: "admin@example.com",
//     role: "Super Admin",
//     created_at: new Date().toISOString(),
//   };

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setLoading(true);
//         const response = await adminAPI.getMeta();
//         if (response.data.success) {
//           setStats(response.data.message);
//         } else {
//           throw new Error(response.data.message || "Failed to load stats");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         // Small delay so skeleton is visually readable
//         setTimeout(() => setLoading(false), 800);
//       }
//     };
//     fetchStats();
//   }, []);

//   const formatDate = (d) => {
//     try { return format(new Date(d), "MMM dd, yyyy"); }
//     catch { return "—"; }
//   };

//   return (
//     <div className="min-h-screen bg-[var(--color-bg)]">
//       {/* ── TOP HEADER BAR ────────────────────────────── */}
//       <header className="sticky top-0 z-30 border-b border-[var(--color-muted)]/20
//                          bg-[var(--color-bg)]/80 backdrop-blur-xl px-6 py-4">
//         <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
//           {/* Title */}
//           <div>
//             <h1 className="text-2xl font-black bg-gradient-to-r
//                            from-[var(--color-primary)] via-[var(--color-secondary)]
//                            to-[var(--color-primary)] bg-clip-text text-transparent">
//               {DASHBOARD_CONFIG.title}
//             </h1>
//             <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
//               {DASHBOARD_CONFIG.subtitle(adminProfile.name)}
//             </p>
//           </div>

//           {/* Right actions */}
//           <div className="flex items-center gap-3">
//             {DASHBOARD_CONFIG.showSearch && (
//               <button
//                 onClick={() => setSearchOpen(!searchOpen)}
//                 className="p-2 rounded-xl bg-[var(--color-card)]/40 border border-[var(--color-muted)]/20
//                            text-[var(--color-text-muted)] hover:text-[var(--color-text)]
//                            hover:bg-[var(--color-card)] transition-all"
//               >
//                 <Search size={17} />
//               </button>
//             )}
//             {DASHBOARD_CONFIG.showNotifications && (
//               <button className="relative p-2 rounded-xl bg-[var(--color-card)]/40
//                                  border border-[var(--color-muted)]/20
//                                  text-[var(--color-text-muted)] hover:text-[var(--color-text)]
//                                  hover:bg-[var(--color-card)] transition-all">
//                 <Bell size={17} />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
//               </button>
//             )}
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br
//                             from-[var(--color-primary)] to-[var(--color-secondary)]
//                             flex items-center justify-center font-bold text-sm
//                             text-white shadow-lg cursor-pointer select-none">
//               {adminProfile.name.charAt(0).toUpperCase()}
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
//         {/* ── TOP ROW: Profile + Stat Cards ───────────── */}
//         <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
//           {/* Profile Card */}
//           {loading ? (
//             <div className="xl:col-span-1"><ProfileSkeleton /></div>
//           ) : (
//             <div className="xl:col-span-1">
//               <div className="relative bg-[var(--color-card)]/30 backdrop-blur-xl
//                               border border-[var(--color-muted)]/30 rounded-2xl p-6
//                               shadow-xl overflow-hidden">
//                 {/* Decorative glow */}
//                 <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full
//                                 bg-[var(--color-primary)]/20 blur-2xl pointer-events-none" />

//                 {/* Avatar */}
//                 <div className="flex justify-center mb-5">
//                   <div className="relative">
//                     <div className="w-20 h-20 rounded-2xl bg-gradient-to-br
//                                     from-[var(--color-primary)]/30 to-[var(--color-secondary)]/20
//                                     border border-[var(--color-primary)]/30
//                                     flex items-center justify-center
//                                     text-2xl font-black text-[var(--color-text)] shadow-lg">
//                       {adminProfile.name.charAt(0).toUpperCase()}
//                     </div>
//                     <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4
//                                      bg-emerald-500 rounded-full border-2 border-[var(--color-card)]" />
//                   </div>
//                 </div>

//                 {/* Info */}
//                 <div className="text-center mb-5">
//                   <p className="font-black text-lg text-[var(--color-text)] truncate">
//                     {adminProfile.name}
//                   </p>
//                   <span className="mt-1 inline-block text-xs font-semibold px-3 py-1
//                                    rounded-full bg-[var(--color-primary)]/15
//                                    text-[var(--color-primary)]
//                                    border border-[var(--color-primary)]/25">
//                     {adminProfile.role}
//                   </span>
//                 </div>

//                 {/* Meta rows */}
//                 <div className="space-y-2 text-sm mb-5">
//                   {[
//                     { icon: Mail,     label: "Email",  value: adminProfile.email },
//                     { icon: Calendar, label: "Joined", value: formatDate(adminProfile.created_at) },
//                     { icon: Clock,    label: "Today",  value: format(new Date(), "MMM dd, yyyy") },
//                   ].map(({ icon: Icon, label, value }) => (
//                     <div key={label}
//                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
//                                     bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20">
//                       <Icon size={13} className="text-[var(--color-text-muted)] flex-shrink-0" />
//                       <span className="text-[var(--color-text-muted)] font-medium w-12 flex-shrink-0">{label}</span>
//                       <span className="text-[var(--color-text)] truncate text-xs font-medium">{value}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Buttons */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold
//                                      bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]
//                                      border border-[var(--color-secondary)]/25
//                                      hover:bg-[var(--color-secondary)]/20 transition-all">
//                     <Settings size={13} /> Settings
//                   </button>
//                   <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold
//                                      bg-[var(--color-danger)]/10 text-[var(--color-danger)]
//                                      border border-[var(--color-danger)]/25
//                                      hover:bg-[var(--color-danger)]/20 transition-all">
//                     <LogOut size={13} /> Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Stat Cards Grid */}
//           <div className="xl:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//             {loading
//               ? Array.from({ length: STAT_CARDS_CONFIG.length }).map((_, i) => (
//                   <StatCardSkeleton key={i} />
//                 ))
//               : STAT_CARDS_CONFIG.map((card) => {
//                   const Icon = card.icon;
//                   const value = stats[card.key] ?? 0;
//                   return (
//                     <div
//                       key={card.key}
//                       className={`group relative bg-gradient-to-br ${card.gradient}
//                                   border ${card.borderAccent}
//                                   rounded-2xl p-5 shadow-lg
//                                   hover:shadow-2xl hover:-translate-y-1
//                                   transition-all duration-300 cursor-pointer overflow-hidden`}
//                     >
//                       {/* Decorative circle */}
//                       <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full
//                                       bg-white/5 group-hover:scale-150 transition-transform duration-500" />

//                       <div className="flex items-center justify-between mb-4">
//                         <div className={`p-2 rounded-xl bg-[var(--color-card)]/40 ${card.iconColor}`}>
//                           <Icon size={18} />
//                         </div>
//                         {card.trend === "up"
//                           ? <TrendingUp size={14} className="text-emerald-400" />
//                           : <TrendingDown size={14} className="text-rose-400" />
//                         }
//                       </div>

//                       <p className="text-3xl font-black text-[var(--color-text)] tabular-nums">
//                         {value.toLocaleString()}
//                       </p>
//                       <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-1">
//                         {card.label}
//                       </p>
//                       <p className={`text-xs mt-1.5 font-medium
//                                      ${card.trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
//                         {card.delta}
//                       </p>
//                     </div>
//                   );
//                 })
//             }
//           </div>
//         </div>

//         {/* ── CHARTS ROW ──────────────────────────────── */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Chart (Bar / Area toggle) */}
//           <div className="lg:col-span-2 bg-[var(--color-card)]/30 backdrop-blur-xl
//                           border border-[var(--color-muted)]/30 rounded-2xl p-6 shadow-xl">
//             <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
//               <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2">
//                 <BarChart3 size={18} className="text-[var(--color-primary)]" />
//                 {activeChart === "bar"
//                   ? CHART_CONFIG.barChart.title
//                   : CHART_CONFIG.areaChart.title}
//               </h3>
//               {/* Chart type toggle */}
//               <div className="flex items-center gap-1 p-1 rounded-xl
//                               bg-[var(--color-muted)]/10 border border-[var(--color-muted)]/20">
//                 {[
//                   { key: "bar",  label: "Bar" },
//                   { key: "area", label: "Trend" },
//                 ].map(({ key, label }) => (
//                   <button
//                     key={key}
//                     onClick={() => setActiveChart(key)}
//                     className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
//                       ${activeChart === key
//                         ? "bg-[var(--color-primary)] text-white shadow-sm"
//                         : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
//                       }`}
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {loading ? (
//               <ChartSkeleton height={CHART_CONFIG.barChart.height} />
//             ) : activeChart === "bar" ? (
//               <ResponsiveContainer width="100%" height={CHART_CONFIG.barChart.height}>
//                 <BarChart data={CHART_CONFIG.barChart.data} barCategoryGap="30%">
//                   <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-muted)" opacity={0.4} />
//                   <XAxis dataKey="name" axisLine={false} tickLine={false}
//                          tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
//                   <YAxis axisLine={false} tickLine={false}
//                          tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
//                   <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.1 }} />
//                   <Legend formatter={(v) => <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>{v}</span>} />
//                   {CHART_CONFIG.barChart.bars.map((b) => (
//                     <Bar key={b.key} dataKey={b.key} name={b.label}
//                          fill={b.color} radius={[6, 6, 0, 0]} />
//                   ))}
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <ResponsiveContainer width="100%" height={CHART_CONFIG.areaChart.height}>
//                 <AreaChart data={CHART_CONFIG.areaChart.data}>
//                   <defs>
//                     <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
//                     </linearGradient>
//                     <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-muted)" opacity={0.4} />
//                   <XAxis dataKey="date" axisLine={false} tickLine={false}
//                          tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
//                   <YAxis axisLine={false} tickLine={false}
//                          tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend formatter={(v) => <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>{v}</span>} />
//                   <Area type="monotone" dataKey="active" name="Active" stroke="var(--color-primary)"
//                         strokeWidth={2} fill="url(#colorActive)" />
//                   <Area type="monotone" dataKey="new" name="New" stroke="var(--color-secondary)"
//                         strokeWidth={2} fill="url(#colorNew)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           {/* Pie Chart */}
//           <div className="bg-[var(--color-card)]/30 backdrop-blur-xl
//                           border border-[var(--color-muted)]/30 rounded-2xl p-6 shadow-xl">
//             <h3 className="font-bold text-[var(--color-text)] mb-5 flex items-center gap-2">
//               <Activity size={18} className="text-[var(--color-secondary)]" />
//               {CHART_CONFIG.pieChart.title}
//             </h3>
//             {loading ? (
//               <div className="flex flex-col items-center gap-4">
//                 <SkeletonPulse className="w-40 h-40 rounded-full" />
//                 <div className="w-full space-y-2">
//                   {Array.from({ length: 4 }).map((_, i) => (
//                     <SkeletonPulse key={i} className="w-full h-4 rounded-md" />
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <ResponsiveContainer width="100%" height={CHART_CONFIG.pieChart.height}>
//                   <PieChart>
//                     <Pie
//                       data={CHART_CONFIG.pieChart.data}
//                       cx="50%" cy="50%"
//                       innerRadius={52} outerRadius={80}
//                       paddingAngle={3} dataKey="value"
//                     >
//                       {CHART_CONFIG.pieChart.data.map((_, i) => (
//                         <Cell key={i} fill={CHART_CONFIG.pieChart.colors[i % CHART_CONFIG.pieChart.colors.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 {/* Legend */}
//                 <div className="space-y-2 mt-2">
//                   {CHART_CONFIG.pieChart.data.map((item, i) => (
//                     <div key={item.name} className="flex items-center justify-between text-xs">
//                       <div className="flex items-center gap-2">
//                         <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
//                              style={{ background: CHART_CONFIG.pieChart.colors[i % CHART_CONFIG.pieChart.colors.length] }} />
//                         <span className="text-[var(--color-text-muted)]">{item.name}</span>
//                       </div>
//                       <span className="font-bold text-[var(--color-text)]">{item.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* ── BOTTOM ROW: Recent Activity + Quick Stats ─ */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Recent Activity */}
//           <div className="lg:col-span-2 bg-[var(--color-card)]/30 backdrop-blur-xl
//                           border border-[var(--color-muted)]/30 rounded-2xl p-6 shadow-xl">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2">
//                 <Zap size={18} className="text-amber-400" />
//                 Recent Activity
//               </h3>
//               <button className="text-xs font-semibold text-[var(--color-primary)]
//                                  hover:underline transition-all">
//                 View all
//               </button>
//             </div>
//             {loading ? (
//               <ActivitySkeleton />
//             ) : (
//               <div className="space-y-3">
//                 {mockActivity.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <div
//                       key={item.id}
//                       className="flex items-start gap-3 p-3 rounded-xl
//                                  bg-[var(--color-card)]/30 border border-[var(--color-muted)]/15
//                                  hover:bg-[var(--color-card)]/50 transition-all group"
//                     >
//                       <div className={`p-2 rounded-xl bg-[var(--color-card)]/60 ${item.color} flex-shrink-0`}>
//                         <Icon size={14} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm text-[var(--color-text)] leading-snug">
//                           {item.message}
//                         </p>
//                         <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.time}</p>
//                       </div>
//                       <ChevronRight size={14}
//                         className="text-[var(--color-text-muted)] opacity-0
//                                    group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Quick Stats / Mini Summary */}
//           <div className="bg-[var(--color-card)]/30 backdrop-blur-xl
//                           border border-[var(--color-muted)]/30 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
//             <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2">
//               <BarChart3 size={18} className="text-[var(--color-primary)]" />
//               Quick Snapshot
//             </h3>

//             {loading ? (
//               <div className="space-y-4">
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <div key={i} className="space-y-1.5">
//                     <div className="flex justify-between">
//                       <SkeletonPulse className="w-20 h-3 rounded" />
//                       <SkeletonPulse className="w-8 h-3 rounded" />
//                     </div>
//                     <SkeletonPulse className="w-full h-2 rounded-full" />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="space-y-5 flex-1">
//                 {[
//                   { label: "Questions Coverage", value: stats.questions, max: 200, color: "bg-violet-500" },
//                   { label: "Student Enrollment",  value: stats.students,  max: 300, color: "bg-emerald-500" },
//                   { label: "Quiz Completion",      value: stats.quizzes,   max: 50,  color: "bg-amber-500" },
//                   { label: "Dept. Coverage",       value: stats.departments, max: 20, color: "bg-sky-500" },
//                 ].map(({ label, value = 0, max, color }) => {
//                   const pct = Math.min(100, Math.round((value / max) * 100));
//                   return (
//                     <div key={label}>
//                       <div className="flex justify-between text-xs mb-1.5">
//                         <span className="text-[var(--color-text-muted)] font-medium">{label}</span>
//                         <span className="text-[var(--color-text)] font-bold">{pct}%</span>
//                       </div>
//                       <div className="w-full h-2 rounded-full bg-[var(--color-muted)]/20">
//                         <div
//                           className={`h-2 rounded-full ${color} transition-all duration-700`}
//                           style={{ width: `${pct}%` }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {/* System status */}
//             {!loading && (
//               <div className="mt-auto pt-4 border-t border-[var(--color-muted)]/20">
//                 <div className="flex items-center gap-2 text-xs">
//                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//                   <span className="text-[var(--color-text-muted)]">All systems operational</span>
//                 </div>
//                 <p className="text-xs text-[var(--color-text-muted)] mt-1">
//                   Last sync: {format(new Date(), "hh:mm a")}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };




// ================ New 2 ==========

/**
 * ENTERPRISE ADMIN DASHBOARD — RESPONSIVE BENTO GRID
 *
 * Layout (desktop 12-col):
 *  Row 1 │ Profile (3 col, tall) │ 5 stat cards (9 col, compact) │
 *  Row 2 │ Main chart (8 col)    │ Donut chart (4 col)            │
 *  Row 3 │ Activity feed (8 col) │ Quick snapshot (4 col)         │
 *
 * Responsive:
 *  Mobile  → all sections stack, 1 col
 *  Tablet  → stat cards 2-col grid, charts stack
 *  Desktop → full 12-col bento
 *
 * CUSTOMIZATION:
 *  1. DASHBOARD_CONFIG  — title, subtitle, header toggles
 *  2. STAT_CARDS_CONFIG — add/remove stat cards, color accent
 *  3. CHART_CONFIG      — data, bar keys, colors
 *  4. mockActivity      — swap array with real API call
 */

import { useEffect, useState } from "react";
import {
  Users, BookOpen, FileText, Calendar, Award, BarChart3,
  Settings, LogOut, Mail, TrendingUp, TrendingDown,
  Activity, Bell, Search, Shield, Zap, Globe, Clock,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";
import { format, subDays } from "date-fns";
import { getUser } from "../../../../utils/auth";
import { adminAPI } from "../../../../services/api";

// ─────────────────────────────────────────────────────
// 1. DASHBOARD CONFIG
// ─────────────────────────────────────────────────────
const DASHBOARD_CONFIG = {
  title: "Admin Dashboard",
  subtitle: (name) => `Welcome back, ${name}`,
  showNotifications: true,
  showSearch: true,
};

// ─────────────────────────────────────────────────────
// 2. STAT CARDS CONFIG
// ─────────────────────────────────────────────────────
const STAT_CARDS_CONFIG = [
  { key: "categories",  label: "Categories",  icon: BookOpen, accent: "violet", trend: "up",   delta: "+2 this month"  },
  { key: "questions",   label: "Questions",   icon: FileText, accent: "emerald",trend: "up",   delta: "+18 this week"  },
  { key: "departments", label: "Departments", icon: Globe,    accent: "sky",    trend: "up",   delta: "Stable"         },
  { key: "quizzes",     label: "Quizzes",     icon: Award,    accent: "amber",  trend: "up",   delta: "+5 active"      },
  { key: "students",    label: "Students",    icon: Users,    accent: "rose",   trend: "up",   delta: "+24 this week"  },
];

// Dynamic colors via inline style (Tailwind can't do arbitrary rgba at runtime)
const ACCENTS = {
  violet:  { bg: "rgba(139,92,246,.13)",  border: "rgba(139,92,246,.3)",  icon: "#a78bfa", glow: "rgba(139,92,246,.18)" },
  emerald: { bg: "rgba(16,185,129,.13)",  border: "rgba(16,185,129,.3)",  icon: "#34d399", glow: "rgba(16,185,129,.18)" },
  sky:     { bg: "rgba(14,165,233,.13)",  border: "rgba(14,165,233,.3)",  icon: "#38bdf8", glow: "rgba(14,165,233,.18)" },
  amber:   { bg: "rgba(245,158,11,.13)",  border: "rgba(245,158,11,.3)",  icon: "#fbbf24", glow: "rgba(245,158,11,.18)" },
  rose:    { bg: "rgba(244,63,94,.13)",   border: "rgba(244,63,94,.3)",   icon: "#fb7185", glow: "rgba(244,63,94,.18)"  },
};

// ─────────────────────────────────────────────────────
// 3. CHART CONFIG
// ─────────────────────────────────────────────────────
const CHART_CONFIG = {
  bar: {
    title: "Category Analytics",
    bars: [
      { key: "questions", label: "Questions", color: "var(--color-primary)"   },
      { key: "students",  label: "Students",  color: "var(--color-secondary)" },
    ],
    data: [
      { name: "English",   questions: 25, students: 45 },
      { name: "Aptitude",  questions: 30, students: 52 },
      { name: "Logical",   questions: 20, students: 38 },
      { name: "Technical", questions: 50, students: 67 },
      { name: "HR",        questions: 15, students: 29 },
    ],
  },
  area: {
    title: "Student Activity — Last 7 Days",
    data: Array.from({ length: 7 }, (_, i) => ({
      date:   format(subDays(new Date(), 6 - i), "EEE"),
      active: Math.floor(Math.random() * 60) + 20,
      new:    Math.floor(Math.random() * 20) + 5,
    })),
  },
  pie: {
    title: "Quiz Distribution",
    colors: ["#7c3aed","#10b981","#f59e0b","#3b82f6","#ef4444"],
    data: [
      { name: "English",   value: 25 },
      { name: "Aptitude",  value: 30 },
      { name: "Logical",   value: 20 },
      { name: "Technical", value: 50 },
      { name: "HR",        value: 15 },
    ],
  },
};

// ─────────────────────────────────────────────────────
// 4. ACTIVITY FEED — swap with real API
// ─────────────────────────────────────────────────────
const mockActivity = [
  { id:1, message:"Arjun Kumar enrolled in Technical Quiz",      time:"2m ago",  icon:Users,    color:"#38bdf8" },
  { id:2, message:"New aptitude quiz published",                  time:"18m ago", icon:Award,    color:"#fbbf24" },
  { id:3, message:"15 new questions added to English category",   time:"1h ago",  icon:FileText, color:"#34d399" },
  { id:4, message:"Daily system backup completed successfully",   time:"3h ago",  icon:Shield,   color:"#a78bfa" },
  { id:5, message:"Priya Nair completed Logical Reasoning quiz",  time:"5h ago",  icon:Zap,      color:"#fb7185" },
  { id:6, message:"New department 'Design' was created",          time:"6h ago",  icon:Globe,    color:"#fbbf24" },
];

// ─────────────────────────────────────────────────────
// GLASS CARD — base wrapper
// ─────────────────────────────────────────────────────
const Card = ({ children, className = "", style = {} }) => (
  <div
    className={`relative overflow-hidden rounded-2xl ${className}`}
    style={{
      background: "var(--color-card,rgba(255,255,255,.04))",
      border: "1px solid rgba(255,255,255,.09)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      boxShadow: "0 4px 20px rgba(0,0,0,.2)",
      ...style,
    }}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────────────
// SKELETON ATOMS
// ─────────────────────────────────────────────────────
const Bone = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-white/[.07] ${className}`} />
);

const StatCardSkeleton = () => (
  <Card className="p-4 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <Bone className="w-9 h-9 rounded-xl" />
      <Bone className="w-10 h-4" />
    </div>
    <Bone className="w-12 h-7 rounded-lg" />
    <Bone className="w-20 h-3" />
    <Bone className="w-24 h-3" />
  </Card>
);

const ProfileSkeleton = () => (
  <Card className="p-6 flex flex-col gap-4 h-full">
    <div className="flex flex-col items-center gap-3">
      <Bone className="w-16 h-16 rounded-2xl" />
      <Bone className="w-28 h-4" />
      <Bone className="w-20 h-5 rounded-full" />
    </div>
    <Bone className="w-full h-10 rounded-xl" />
    <Bone className="w-full h-10 rounded-xl" />
    <Bone className="w-full h-10 rounded-xl" />
    <div className="mt-auto grid grid-cols-2 gap-2">
      <Bone className="h-10 rounded-xl" />
      <Bone className="h-10 rounded-xl" />
    </div>
  </Card>
);

const ChartSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Bone className="w-40 h-5" />
    <div className="flex items-end gap-2 h-52">
      {[55,75,40,90,60,80,45,70].map((h,i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <Bone className="w-full rounded-t-md" style={{ height:`${h}%` }} />
        </div>
      ))}
    </div>
  </div>
);

const ActivitySkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {[1,2,3,4,5,6].map(i => (
      <div key={i} className="flex gap-3 p-3 rounded-2xl" style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)" }}>
        <Bone className="w-8 h-8 rounded-xl flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Bone className="w-full h-3" />
          <Bone className="w-16 h-3" />
        </div>
      </div>
    ))}
  </div>
);

const PieSkeleton = () => (
  <div className="flex flex-col items-center gap-3">
    <Bone className="w-36 h-36 rounded-full" />
    {[1,2,3,4,5].map(i => (
      <div key={i} className="flex justify-between w-full">
        <Bone className="w-20 h-3" />
        <Bone className="w-6 h-3" />
      </div>
    ))}
  </div>
);

const ProgressSkeleton = () => (
  <div className="flex flex-col gap-5">
    {[1,2,3,4].map(i => (
      <div key={i} className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Bone className="w-28 h-3" />
          <Bone className="w-8 h-3" />
        </div>
        <Bone className="w-full h-2 rounded-full" />
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────
// RECHARTS CUSTOM TOOLTIP
// ─────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-sm shadow-2xl"
         style={{ background:"var(--color-card,#1a1a2e)", border:"1px solid rgba(255,255,255,.12)" }}>
      <p className="font-semibold mb-2" style={{ color:"var(--color-text-muted)", fontSize:11 }}>{label}</p>
      {payload.map((p,i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background:p.color }} />
          <span style={{ color:"var(--color-text)", fontSize:12 }}>{p.name}: <strong>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────
export const AdminDashboard = () => {
  const [loading, setLoading]         = useState(true);
  const [stats, setStats]             = useState({});
  const [activeChart, setActiveChart] = useState("bar");

  const adminData    = getUser();
  const adminProfile = adminData || {
    name:"Admin User", email:"admin@example.com",
    role:"Super Admin", created_at:new Date().toISOString(),
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getMeta();
        if (res.data.success) setStats(res.data.message);
      } catch (_) {}
      finally { setTimeout(() => setLoading(false), 900); }
    };
    fetchStats();
  }, []);

  const fmtDate = (d) => { try { return format(new Date(d),"MMM dd, yyyy"); } catch { return "—"; } };

  return (
    <div className="min-h-screen" style={{ background:"var(--color-bg)" }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3"
              style={{ borderBottom:"1px solid rgba(255,255,255,.07)", background:"transparent", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)" }}>
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black leading-tight"
                style={{ background:"linear-gradient(135deg,var(--color-primary),var(--color-secondary))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              {DASHBOARD_CONFIG.title}
            </h1>
            <p className="text-xs mt-0.5" style={{ color:"var(--color-text-muted)" }}>
              {DASHBOARD_CONFIG.subtitle(adminProfile.name)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {DASHBOARD_CONFIG.showSearch && (
              <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                      style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.09)", color:"var(--color-text-muted)" }}>
                <Search size={15} />
              </button>
            )}
            {DASHBOARD_CONFIG.showNotifications && (
              <button className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.09)", color:"var(--color-text-muted)" }}>
                <Bell size={15} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500"
                      style={{ border:"1.5px solid var(--color-bg)" }} />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg cursor-pointer"
                 style={{ background:"linear-gradient(135deg,var(--color-primary),var(--color-secondary))" }}>
              {adminProfile.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* ══════════════════════════════════════════════
            ROW 1 — Profile + Stat Cards
            Desktop: profile takes ~3/12, cards take 9/12
            Tablet:  profile full width, cards 2-col grid
            Mobile:  all stack
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* Profile Card — fixed intrinsic height, doesn't stretch to stat cards */}
          <div className="lg:col-span-4">
            {loading ? <ProfileSkeleton /> : (
              <Card className="p-5">
                {/* Glow */}
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                     style={{ background:"var(--color-primary,.5)", opacity:.07, filter:"blur(32px)" }} />

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg"
                         style={{ background:"linear-gradient(135deg,rgba(124,58,237,.25),rgba(6,182,212,.15))", border:"1.5px solid rgba(124,58,237,.3)", color:"var(--color-text)" }}>
                      {adminProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500"
                          style={{ border:"2px solid var(--color-bg,#0a0a14)" }} />
                  </div>
                </div>

                {/* Name + role */}
                <div className="text-center mb-4">
                  <p className="font-black text-base leading-snug truncate" style={{ color:"var(--color-text)" }}>
                    {adminProfile.name}
                  </p>
                  <span className="inline-block mt-1.5 text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background:"rgba(124,58,237,.15)", color:"var(--color-primary,#a78bfa)", border:"1px solid rgba(124,58,237,.28)" }}>
                    {adminProfile.role}
                  </span>
                </div>

                {/* Meta rows */}
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { Icon:Mail,     label:"Email",  value:adminProfile.email },
                    { Icon:Calendar, label:"Joined", value:fmtDate(adminProfile.created_at) },
                    { Icon:Clock,    label:"Today",  value:format(new Date(),"MMM dd, yyyy") },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                         style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)" }}>
                      <Icon size={12} style={{ color:"var(--color-text-muted)", flexShrink:0 }} />
                      <span className="text-xs font-semibold w-10 flex-shrink-0" style={{ color:"var(--color-text-muted)" }}>{label}</span>
                      <span className="text-xs truncate" style={{ color:"var(--color-text)" }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                          style={{ color:"var(--color-secondary,#06b6d4)", background:"rgba(6,182,212,.1)", border:"1px solid rgba(6,182,212,.25)" }}>
                    <Settings size={12} /> Settings
                  </button>
                  <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                          style={{ color:"#f43f5e", background:"rgba(244,63,94,.1)", border:"1px solid rgba(244,63,94,.25)" }}>
                    <LogOut size={12} /> Logout
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* Stat Cards — compact height, NOT aligned to profile height */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length:5 }).map((_,i) => <StatCardSkeleton key={i} />)
              : STAT_CARDS_CONFIG.map(cfg => {
                  const Icon   = cfg.icon;
                  const colors = ACCENTS[cfg.accent];
                  const value  = stats[cfg.key] ?? 0;
                  return (
                    <Card key={cfg.key}
                          className="p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
                          style={{ background:colors.bg, border:`1px solid ${colors.border}` }}>
                      {/* Corner glow */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
                           style={{ background:colors.glow, filter:"blur(18px)" }} />

                      {/* Icon row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-xl" style={{ background:"rgba(255,255,255,.08)", color:colors.icon }}>
                          <Icon size={16} />
                        </div>
                        {cfg.trend === "up"
                          ? <TrendingUp  size={13} color="#34d399" />
                          : <TrendingDown size={13} color="#fb7185" />
                        }
                      </div>

                      {/* Value */}
                      <p className="text-2xl font-black leading-none tabular-nums mb-1" style={{ color:"var(--color-text)" }}>
                        {value.toLocaleString()}
                      </p>
                      <p className="text-xs font-semibold mb-1" style={{ color:"var(--color-text-muted)" }}>
                        {cfg.label}
                      </p>
                      <p className="text-xs font-medium" style={{ color: cfg.trend==="up" ? "#34d399":"#fb7185" }}>
                        {cfg.delta}
                      </p>
                    </Card>
                  );
                })
            }
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            ROW 2 — Main Chart + Pie
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Main chart */}
          <div className="lg:col-span-8">
            <Card className="p-5 h-full">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-bold text-sm flex items-center gap-2" style={{ color:"var(--color-text)" }}>
                  <BarChart3 size={16} color="var(--color-primary)" />
                  {activeChart==="bar" ? CHART_CONFIG.bar.title : CHART_CONFIG.area.title}
                </h3>
                {/* Toggle */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)" }}>
                  {[{key:"bar",label:"Bar"},{key:"area",label:"Trend"}].map(({key,label}) => (
                    <button key={key} onClick={() => setActiveChart(key)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: activeChart===key ? "var(--color-primary)" : "transparent",
                              color:      activeChart===key ? "#fff" : "var(--color-text-muted)",
                              border:"none", cursor:"pointer",
                            }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? <ChartSkeleton /> : activeChart==="bar" ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={CHART_CONFIG.bar.data} barCategoryGap="32%">
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:"var(--color-text-muted)", fontSize:11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill:"var(--color-text-muted)", fontSize:11 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(255,255,255,.03)" }} />
                    <Legend formatter={v => <span style={{ color:"var(--color-text-muted)", fontSize:11 }}>{v}</span>} />
                    {CHART_CONFIG.bar.bars.map(b => (
                      <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[5,5,0,0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={CHART_CONFIG.area.data}>
                    <defs>
                      <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--color-primary)"   stopOpacity={.35} />
                        <stop offset="95%" stopColor="var(--color-primary)"   stopOpacity={0}   />
                      </linearGradient>
                      <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--color-secondary)" stopOpacity={.35} />
                        <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill:"var(--color-text-muted)", fontSize:11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill:"var(--color-text-muted)", fontSize:11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={v => <span style={{ color:"var(--color-text-muted)", fontSize:11 }}>{v}</span>} />
                    <Area type="monotone" dataKey="active" name="Active" stroke="var(--color-primary)"   strokeWidth={2.5} fill="url(#ga)" />
                    <Area type="monotone" dataKey="new"    name="New"    stroke="var(--color-secondary)" strokeWidth={2.5} fill="url(#gb)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Pie / Donut */}
          <div className="lg:col-span-4">
            <Card className="p-5 h-full">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-4" style={{ color:"var(--color-text)" }}>
                <Activity size={16} color="var(--color-secondary)" />
                {CHART_CONFIG.pie.title}
              </h3>
              {loading ? <PieSkeleton /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={CHART_CONFIG.pie.data} cx="50%" cy="50%"
                           innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                        {CHART_CONFIG.pie.data.map((_,i) => (
                          <Cell key={i} fill={CHART_CONFIG.pie.colors[i % CHART_CONFIG.pie.colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 mt-3">
                    {CHART_CONFIG.pie.data.map((item,i) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0"
                               style={{ background:CHART_CONFIG.pie.colors[i % CHART_CONFIG.pie.colors.length] }} />
                          <span className="text-xs" style={{ color:"var(--color-text-muted)" }}>{item.name}</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color:"var(--color-text)" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            ROW 3 — Activity Feed + Quick Snapshot
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Activity Feed */}
          <div className="lg:col-span-8">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm flex items-center gap-2" style={{ color:"var(--color-text)" }}>
                  <Zap size={16} color="#fbbf24" />
                  Recent Activity
                </h3>
                <button className="text-xs font-semibold transition-opacity hover:opacity-70"
                        style={{ color:"var(--color-primary)", background:"none", border:"none", cursor:"pointer", padding:0 }}>
                  View all →
                </button>
              </div>
              {loading ? <ActivitySkeleton /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mockActivity.map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id}
                           className="flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all"
                           style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)" }}
                           onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.06)"}
                           onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.03)"}>
                        <div className="flex-shrink-0 p-2 rounded-xl flex items-center"
                             style={{ background:`${item.color}18`, color:item.color }}>
                          <Icon size={13} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs leading-snug" style={{ color:"var(--color-text)" }}>{item.message}</p>
                          <p className="text-xs mt-1" style={{ color:"var(--color-text-muted)" }}>{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Snapshot */}
          <div className="lg:col-span-4">
            <Card className="p-5 flex flex-col gap-5 h-full">
              <h3 className="font-bold text-sm flex items-center gap-2" style={{ color:"var(--color-text)" }}>
                <BarChart3 size={16} color="var(--color-primary)" />
                Quick Snapshot
              </h3>

              {loading ? <ProgressSkeleton /> : (
                <div className="flex-1 flex flex-col gap-5">
                  {[
                    { label:"Questions Coverage", value:stats.questions,    max:200, color:"#7c3aed" },
                    { label:"Student Enrollment",  value:stats.students,    max:300, color:"#10b981" },
                    { label:"Quiz Completion",      value:stats.quizzes,    max:50,  color:"#f59e0b" },
                    { label:"Dept. Coverage",       value:stats.departments,max:20,  color:"#3b82f6" },
                  ].map(({ label, value=0, max, color }) => {
                    const pct = Math.min(100, Math.round((value/max)*100));
                    return (
                      <div key={label}>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs font-medium" style={{ color:"var(--color-text-muted)" }}>{label}</span>
                          <span className="text-xs font-bold" style={{ color:"var(--color-text)" }}>{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background:"rgba(255,255,255,.08)" }}>
                          <div className="h-1.5 rounded-full transition-all duration-700"
                               style={{ width:`${pct}%`, background:`linear-gradient(90deg,${color}aa,${color})`, boxShadow:`0 0 6px ${color}55` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!loading && (
                <div className="pt-4" style={{ borderTop:"1px solid rgba(255,255,255,.08)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs" style={{ color:"var(--color-text-muted)" }}>All systems operational</span>
                  </div>
                  <p className="text-xs" style={{ color:"var(--color-text-muted)" }}>
                    Last sync: {format(new Date(),"hh:mm a")}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

      </main>
    </div>
  );
};