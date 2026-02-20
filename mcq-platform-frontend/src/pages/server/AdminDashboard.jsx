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
          console.log('✅ Admin stats loaded:', response.data.message);
        } else {
          throw new Error(response.data.message || 'Failed to load stats');
        }
      } catch (err) {
        console.error('Stats fetch error:', err);
        setError(err.message);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);
  const formatDate = (date) => format(date, "MMM dd, yyyy");

  return (
    <div className=" min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {adminProfile.name}!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {formatDate(new Date())}
          </span>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
        {/* Admin Profile Card - Extended Width Only */}
        <div className="xl:col-span-2">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
            {/* Avatar - Centered */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl font-bold text-2xl text-white border-4 border-white/30">
                  {adminProfile.name.charAt(0)}
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md" />
              </div>
            </div>

            {/* Name & Role - BELOW Avatar */}
            <div className="text-center mb-6 space-y-2">
              <h3 className="text-2xl font-black text-gray-900 leading-tight truncate">
                {adminProfile.name}
              </h3>
              <p className="text-blue-600 font-semibold px-4 py-1 bg-blue-50 rounded-xl inline-block">
                {adminProfile.role}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between py-2 px-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="font-mono text-gray-900 text-base">
                  {" "}
                  {/* Removed max-w limit */}
                  {adminProfile.email}
                </span>
              </div>
              <div className="flex justify-between py-2 px-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-medium">Joined</span>
                <span className="text-gray-900 font-medium">
                  {adminProfile.created_at}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-4 text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl transition-all shadow-sm hover:shadow-md h-14 font-medium">
                <Settings size={16} />
                Settings
              </button>
              <button className="flex items-center justify-center gap-2 p-4 text-sm bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 rounded-2xl transition-all shadow-sm hover:shadow-md h-14 font-medium text-red-700">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Adjusted */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {[
            {
              label: "Categories",
              value: stats.categories,
              icon: BookOpen,
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Questions",
              value: stats.questions,
              icon: FileText,
              color: "from-emerald-500 to-teal-500",
            },
            {
              label: "Departments",
              value: stats.departments,
              icon: Users,
              color: "from-blue-500 to-indigo-500",
            },
            {
              label: "Quizzes",
              value: stats.quizzes,
              icon: Award,
              color: "from-orange-500 to-red-500",
            },
            {
              label: "Students",
              value: stats.students,
              icon: BarChart3,
              color: "from-indigo-500 to-purple-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-all">
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Category Analytics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sampleData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                <Tooltip />
                <Bar dataKey="questions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="students" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cute Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
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
                  className="p-1 hover:bg-gray-200 rounded-lg transition-all"
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
                  className="p-1 hover:bg-gray-200 rounded-lg transition-all"
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
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1" />
                  ) : null
                }
              />
            </div>
            <p className="text-center mt-4 text-sm text-gray-600">
              {format(selectedDate, "MMMM yyyy")}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .react-calendar-custom :global(.react-calendar) {
          border: none !important;
          border-radius: 1rem !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
          background: white !important;
        }
        .react-calendar-custom :global(.react-calendar__navigation) {
          margin-bottom: 1rem !important;
          height: 2rem !important;
        }
        .react-calendar-custom :global(.react-calendar__navigation__label) {
          font-weight: 700 !important;
          font-size: 1.1rem !important;
          color: #1e293b !important;
        }
        .react-calendar-custom :global(.react-calendar__tile) {
          border-radius: 0.75rem !important;
          padding: 0.75rem 0.5rem !important;
          margin: 0.125rem !important;
          height: 3rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-weight: 600 !important;
          transition: all 0.2s !important;
        }
        .react-calendar-custom :global(.react-calendar__tile:enabled:hover),
        .react-calendar-custom :global(.react-calendar__tile:enabled:focus) {
          background: #e0f2fe !important;
          border-radius: 0.75rem !important;
        }
        .react-calendar-custom :global(.highlight) {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          color: white !important;
        }
        .react-calendar-custom :global(.react-calendar__tile--active) {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};
