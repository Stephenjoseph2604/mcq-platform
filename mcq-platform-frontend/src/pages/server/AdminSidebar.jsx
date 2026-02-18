import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Students", icon: Users, href: "/admin/students" },
  { name: "Quiz", icon: BookOpen, href: "/admin/quiz" },
  { name: "Reports", icon: BarChart3, href: "/admin/reports" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export const AdminSidebar = () => {
  return (
    <aside className="sticky inset-y-0 left-0 z-40 h-screen w-10vw lg:w-[20vw] bg-[var(--color-surface)] border-r border-[var(--color-muted)]/50 flex flex-col">
      {/* Logo & Name (text hidden on mobile) */}
      <div className="p-4 border-b border-[var(--color-muted)]/30 flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 rounded-xl flex items-center justify-center">
          <LayoutDashboard size={20} className="text-[var(--color-primary)]" />
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
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-600 transition-all duration-200">
          <LogOut size={18} />
          <span className="text-sm hidden lg:block">Logout</span>
        </button>
      </div>
    </aside>
  );
};
