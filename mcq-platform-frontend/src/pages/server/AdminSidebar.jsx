import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  FileQuestionMark,
  AlertTriangle,
} from "lucide-react";
import { adminLogout, getAdmin } from "../../utils/auth";
import { useEffect, useState } from "react";
import xplore from '/itcorp.png'
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Students", icon: Users, href: "/admin/students" },
  { name: "Quiz", icon: BookOpen, href: "/admin/quiz" },
  {
    name: "Load Questions",
    icon: FileQuestionMark,
    href: "/admin/loadquestions",
  },
  { name: "Reports", icon: BarChart3, href: "/admin/reports" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export const AdminSidebar = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(null);

  // Get real user data from your auth.js
  useEffect(() => {
    const userData = getAdmin();
    setUser(userData);
  }, []);

  return (
    <>
      <aside className="sticky inset-y-0 left-0 z-40 h-screen w-10vw lg:w-[20vw] bg-[var(--color-surface)] border-r border-[var(--color-muted)]/50 flex flex-col">
        {/* Logo & Name (text hidden on mobile) */}
        <div className="p-4 border-b border-[var(--color-muted)]/30 flex items-center gap-3">
          <div className="w-10 h-10  rounded-xl flex items-center justify-center">
            <img
              src={xplore}
              alt="Admin"
              className="h-full w-9/10 "
            />
          </div>
          <span className="text-lg font-bold text-[var(--color-text)] hidden lg:block">
            Admin Panel
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ name, icon: Icon, href }) => (
            <NavLink
              key={name}
              to={href}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                }`
              }
            >
              <Icon size={18} />
              <span className="text-sm font-medium hidden lg:block">
                {name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom logout (icon only on mobile) */}
        <div className="p-3 border-t border-[var(--color-muted)]/30">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-600 transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-sm hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-card)] backdrop-blur-xl rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[var(--color-muted)]/50 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                Confirm Logout
              </h2>
              <p className="text-[var(--color-text-muted)] mb-6">
                Are you sure you want to logout, <strong>{user.name}</strong>?
                You'll need to login again.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={adminLogout}
                className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-12 bg-[var(--color-muted)] hover:bg-[var(--color-muted)]/80 text-[var(--color-text)] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
