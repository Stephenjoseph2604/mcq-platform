// ============== Admin Nav Bar with Role-Based Access ========================
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  FileQuestion,
  AlertTriangle,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { logout, getUser } from "../../../../utils/auth";
import { useEffect, useState } from "react";
import xplore from "/itcorp.png";

// ─── Role constants ───────────────────────────────────────────────────────────
// Add / rename roles here as your system grows.
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
};

// ─── Nav items ────────────────────────────────────────────────────────────────
// `roles` — array of roles that can see this item.
// Omit `roles` (or set to undefined) to show the item to ALL roles.
// ─────────────────────────────────────────────────────────────────────────────
const navItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    // no `roles` → visible to everyone
  },
  {
    name: "Students",
    icon: Users,
    href: "/admin/students",
    dropdown: [{ name: "All Students", href: "/admin/students" }],
  },
  {
    name: "Quiz",
    icon: BookOpen,
    href: "/admin/quiz",
    dropdown: [
      { name: "All Quizzes", href: "/admin/quiz" },
      { name: "Load Questions", href: "/admin/loadquestions" },
      { name: "Reports", href: "/admin/reports" },
    ],
  },
  {
    name: "Requests",
    icon: Bell,
    href: "/admin/requests",
  },
  {
    name: "Employees",
    icon: Users,
    href: "/admin/employees",
    roles: [ROLES.SUPER_ADMIN], // only SUPER_ADMIN
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/admin/settings",
    roles: [ROLES.SUPER_ADMIN], // only SUPER_ADMIN
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getNavItemClass = (isActive) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer w-full ${
    isActive
      ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-semibold shadow-lg"
      : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:shadow-md"
  }`;

const getSubItemClass = (isActive) =>
  `block px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
    isActive
      ? "bg-[var(--color-primary)]/30 text-[var(--color-primary)] font-semibold"
      : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]"
  }`;

// Returns true if the current user role is allowed to see this nav item
const isAllowed = (itemRoles, userRole) => {
  if (!itemRoles || itemRoles.length === 0) return true; // no restriction
  return itemRoles.includes(userRole);
};

// ─── Component ────────────────────────────────────────────────────────────────
export const AdminSidebar = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const userData = getUser(); // reads from localStorage key "admin"
    setUser(userData);
    setUserRole(userData?.role ?? null);
  }, []);

  // Auto-open dropdown if current path matches a dropdown item
  useEffect(() => {
    const autoOpen = {};
    navItems.forEach(({ name, dropdown }) => {
      if (dropdown?.some((item) => location.pathname.startsWith(item.href))) {
        autoOpen[name] = true;
      }
    });
    setOpenDropdowns(autoOpen);
  }, [location.pathname]);

  const toggleDropdown = (name) =>
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isNavItemActive = (href, dropdown) => {
    if (dropdown)
      return dropdown.some((item) => location.pathname.startsWith(item.href));
    return location.pathname === href;
  };

  // Filtered nav items based on role
  const visibleNavItems = navItems.filter((item) =>
    isAllowed(item.roles, userRole),
  );

  // ── NavItems renderer ──────────────────────────────────────────────────────
  const NavItems = ({ onLinkClick }) => (
    <>
      {visibleNavItems.map(({ name, icon: Icon, href, dropdown }) => {
        const active = isNavItemActive(href, dropdown);
        return (
          <div key={name}>
            {dropdown ? (
              <button
                onClick={() => toggleDropdown(name)}
                className={getNavItemClass(active)}
              >
                <Icon size={20} />
                <span className="text-base font-medium flex-1 text-left">
                  {name}
                </span>
                <span
                  className={`transition-transform duration-200 ${
                    openDropdowns[name] ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={18} />
                </span>
              </button>
            ) : (
              <NavLink
                to={href}
                onClick={onLinkClick}
                className={({ isActive }) => getNavItemClass(isActive)}
              >
                <Icon size={20} />
                <span className="text-base font-medium flex-1">{name}</span>
              </NavLink>
            )}

            {dropdown && openDropdowns[name] && (
              <div className="pl-8 space-y-1 mt-1 border-l-2 border-[var(--color-primary)]/30">
                {dropdown.map(({ name: subName, href: subHref }) => (
                  <NavLink
                    key={subName}
                    to={subHref}
                    onClick={onLinkClick}
                    className={({ isActive }) => getSubItemClass(isActive)}
                  >
                    {subName}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  // ── Role badge (shown under the logo in sidebar) ───────────────────────────
  const RoleBadge = () => {
    if (!userRole) return null;
    const isSuperAdmin = userRole === ROLES.SUPER_ADMIN;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
          isSuperAdmin
            ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30"
            : "bg-[var(--color-muted)]/20 text-[var(--color-text-muted)] border border-[var(--color-muted)]/30"
        }`}
      >
        {isSuperAdmin ? "Super Admin" : "Admin"}
      </span>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 right-4 z-50 lg:hidden p-3 bg-[var(--color-card)]/20 text-text backdrop-blur-xl rounded-xl shadow-xl border border-[var(--color-muted)]/50 hover:shadow-2xl transition-all duration-200"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 inset-y-0 left-0 z-40 h-screen w-16 lg:w-[20vw] bg-card/50 flex-col hidden lg:flex">
        {/* Logo + role badge */}
        <div className="p-4 border-b border-[var(--color-muted)]/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <img
              src={xplore}
              alt="Admin"
              className="h-full w-9/10 object-contain"
            />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-lg font-bold text-[var(--color-text)] truncate leading-tight">
              Admin Panel
            </span>
            <RoleBadge />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavItems onLinkClick={undefined} />
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[var(--color-muted)]/30">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] hover:shadow-md transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-card/95 backdrop-blur-2xl shadow-2xl flex flex-col lg:hidden">
            {/* Mobile Header */}
            <div className="p-6 border-b border-[var(--color-muted)]/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src={xplore}
                    alt="Admin"
                    className="h-full w-9/10 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-bold text-[var(--color-text)] leading-tight">
                    Admin Panel
                  </span>
                  <RoleBadge />
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-xl text-text hover:bg-[var(--color-muted)]/20 transition-all duration-200"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <NavItems onLinkClick={closeMobileMenu} />
            </nav>

            {/* Mobile Logout */}
            <div className="p-4 border-t border-[var(--color-muted)]/30 shrink-0">
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                  closeMobileMenu();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] hover:shadow-md transition-all duration-200"
              >
                <LogOut size={20} />
                <span className="text-base font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && user && (
        <div className="fixed inset-0 bg-[var(--color-bg)]/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--color-card)]/50 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[var(--color-muted)]/50 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-[var(--color-primary)]/30">
                <AlertTriangle className="w-10 h-10 text-[var(--color-primary)]" />
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
                onClick={logout}
                className="flex-1 h-12 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-text)] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-12 bg-muted/10 hover:bg-muted/20 text-text font-semibold rounded-xl shadow-lg hover:shadow-xl border border-[var(--color-muted)]/30 transition-all duration-200"
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
