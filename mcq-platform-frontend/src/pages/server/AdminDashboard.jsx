import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  FileText,
  Calendar,
  Award,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { getAdmin } from "../../utils/auth";
import { adminAPI } from "../../services/api";
import DotGrid from "../../components/DotGrid";

const sampleData = [
  { name: "English", questions: 25, students: 45 },
  { name: "Aptitude", questions: 30, students: 52 },
  { name: "Logical", questions: 20, students: 38 },
  { name: "Technical", questions: 50, students: 67 },
];

const highlightedDates = [
  new Date("2026-02-18"),
  new Date("2026-02-19"),
  new Date("2026-02-20"),
];

export const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  const adminData = getAdmin();

  // Fallback if no admin data (shouldn't happen if AdminProtectedRoute works)
  const adminProfile = adminData || {
    name: "XXXXXXXX",
    email: "xxxx@admin.com",
    role: "Super Admin",
    created_at: "YYYY-MM-DD",
  };
  const [stats, setStats] = useState({
    categories: 0,
    questions: 0,
    departments: 0,
    quizzes: 0,
    students: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await adminAPI.getMeta();
        if (response.data.success) {
          // ✅ Extract from response.data.message
          setStats(response.data.message);
        } else {
          throw new Error(response.data.message || "Failed to load stats");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);
  const formatDate = (date) => format(date, "MMM dd, yyyy");

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            Welcome back, {adminProfile.name}!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--color-text-muted)]">
            {formatDate(new Date())}
          </span>
          <div className="w-12 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-[var(--color-text)]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
        {/* Admin Profile Card - Enhanced Theme */}
        <div className="xl:col-span-2">
          <div className="bg-[var(--color-card)]/30 relative backdrop-blur-xl border border-[var(--color-muted)]/40 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
          
          <div className="absolute h-15 aspect-square bg-primary rounded-full -top-3 -right-3 blur-2xl animate-pulse"/>
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 rounded-3xl flex items-center justify-center shadow-2xl font-bold text-2xl text-[var(--color-text)] border-3 border-[var(--color-primary)]/40">
                  {adminProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[var(--color-success)] rounded-full border-4 border-[var(--color-card)] shadow-md" />
              </div>
            </div>

            {/* Name & Role */}
            <div className="text-center mb-6 space-y-2">
              <h3 className="text-2xl font-black bg-gradient-to-r from-[var(--color-text)] to-[var(--color-primary)] bg-clip-text text-transparent leading-tight truncate">
                {adminProfile.name}
              </h3>
              <p className="text-[var(--color-primary)] font-semibold px-4 py-1.5 bg-[var(--color-primary)]/10 rounded-xl inline-block border border-[var(--color-primary)]/30 backdrop-blur-sm shadow-sm">
                {adminProfile.role}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between py-2.5 px-4 bg-[var(--color-card)]/50 backdrop-blur-sm rounded-xl border border-[var(--color-muted)]/20 hover:bg-[var(--color-card)] hover:border-[var(--color-primary)]/20 transition-all">
                <span className="text-[var(--color-text-muted)] font-medium flex items-center gap-2">
                  <Mail size={14} />
                  Email
                </span>
                <span className="font-mono text-[var(--color-text)] text-base truncate max-w-[60%] text-right">
                  {adminProfile.email}
                </span>
              </div>
              <div className="flex justify-between py-2.5 px-4 bg-[var(--color-card)]/50 backdrop-blur-sm rounded-xl border border-[var(--color-muted)]/20 hover:bg-[var(--color-card)] hover:border-[var(--color-primary)]/20 transition-all">
                <span className="text-[var(--color-text-muted)] font-medium flex items-center gap-2">
                  <Calendar size={14} />
                  Joined
                </span>
                <span className="text-[var(--color-text)] font-medium">
                  {formatDate(adminProfile.created_at)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="group flex items-center justify-center gap-2 p-3.5 text-sm bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md h-14 font-semibold text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 hover:border-[var(--color-secondary)]/40 backdrop-blur-sm hover:scale-[1.02]">
                <Settings
                  size={16}
                  className="group-hover:rotate-12 transition-transform duration-200"
                />
                Settings
              </button>
              <button className="group flex items-center justify-center gap-2 p-3.5 text-sm bg-[var(--color-danger)]/10 hover:bg-[var(--color-danger)]/20 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md h-14 font-semibold text-[var(--color-danger)] border border-[var(--color-danger)]/30 hover:border-[var(--color-danger)]/40 backdrop-blur-sm hover:scale-[1.02]">
                <LogOut
                  size={16}
                  className="group-hover:rotate-180 transition-transform duration-200"
                />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {[
            {
              label: "Categories",
              value: stats.categories,
              icon: BookOpen,
              color: "from-purple-stat",
            },
            {
              label: "Questions",
              value: stats.questions,
              icon: FileText,
              color: "from-emerald-stat",
            },
            {
              label: "Departments",
              value: stats.departments,
              icon: Users,
              color: "from-blue-stat",
            },
            {
              label: "Quizzes",
              value: stats.quizzes,
              icon: Award,
              color: "from-orange-stat",
            },
            {
              label: "Students",
              value: stats.students,
              icon: BarChart3,
              color: "from-indigo-stat",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-[var(--color-card)]/20 backdrop-blur-xl border border-[var(--color-muted)]/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-2xl bg-linear-to-r ${stat.color} to${stat.color} shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-[var(--color-text)]" />
                </div>
                <div className="p-2 bg-[var(--color-muted)]/20 rounded-xl group-hover:bg-[var(--color-muted)]/30 transition-all">
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-[var(--color-text)] mb-1">
                  {stat.value}
                </p>
                <p className="text-[var(--color-text-muted)] font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-card)]/30 backdrop-blur-xl border border-[var(--color-muted)]/30 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-[var(--color-primary)]" />
              Category Analytics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sampleData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--color-muted)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fill: "var(--color-text-muted)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fill: "var(--color-text-muted)" }}
                />
                <Tooltip />
                <Bar
                  dataKey="questions"
                  fill="var(--color-primary)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="students"
                  fill="var(--color-secondary)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cute Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-card)]/50 backdrop-blur-xl border border-[var(--color-muted)]/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[var(--color-primary)]" />
                Schedule
              </h3>
              <div className="flex gap-1 text-sm">
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        1,
                      ),
                    )
                  }
                  className="p-1 hover:bg-[var(--color-muted)]/20 rounded-lg transition-all text-[var(--color-text-muted)]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  className="p-1 hover:bg-[var(--color-muted)]/20 rounded-lg transition-all text-[var(--color-text-muted)]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="react-calendar-custom">
              <ReactCalendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date }) =>
                  highlightedDates.some(
                    (hDate) => hDate.toDateString() === date.toDateString(),
                  )
                    ? "highlight"
                    : null
                }
                navigationLabel={null}
                prevLabel={<ChevronLeft size={20} />}
                nextLabel={<ChevronRight size={20} />}
                tileContent={({ date }) =>
                  highlightedDates.some(
                    (hDate) => hDate.toDateString() === date.toDateString(),
                  ) ? (
                    <div className="w-2 h-2 bg-[var(--color-success)] rounded-full mx-auto mt-1" />
                  ) : null
                }
              />
            </div>
            <p className="text-center mt-4 text-sm text-[var(--color-text-muted)]">
              {format(selectedDate, "MMMM yyyy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
