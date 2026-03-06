// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   BookOpen,
//   BarChart3,
//   Settings,
//   LogOut,
//   FileQuestionMark,
//   AlertTriangle,
//   Bell,
// } from "lucide-react";
// import { adminLogout, getAdmin } from "../../utils/auth";
// import { useEffect, useState } from "react";
// import xplore from '/itcorp.png'
// const navItems = [
//   { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
//   { name: "Students", icon: Users, href: "/admin/students" },
//   { name: "Quiz", icon: BookOpen, href: "/admin/quiz" },
//   {
//     name: "Load Questions",
//     icon: FileQuestionMark,
//     href: "/admin/loadquestions",
//   },
//   { name: "Reports", icon: BarChart3, href: "/admin/reports" },
//   { name: "Requests", icon: Bell, href: "/admin/requests" },
//   { name: "Settings", icon: Settings, href: "/admin/settings" },
// ];

// export const AdminSidebar = () => {
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [user, setUser] = useState(null);

//   // Get real user data from your auth.js
//   useEffect(() => {
//     const userData = getAdmin();
//     setUser(userData);
//   }, []);

// return (
//   <>
//     <aside className="sticky inset-y-0 left-0 z-40 h-screen w-16 lg:w-[20vw] bg-card/50 flex flex-col">
//       {/* Logo & Name (text hidden on mobile) */}
//       <div className="p-4 border-b border-[var(--color-muted)]/30 flex items-center gap-3">
//         <div className="w-10 h-10  rounded-xl flex items-center justify-center">
//           <img
//             src={xplore}
//             alt="Admin"
//             className="h-full w-9/10"
//           />
//         </div>
//         <span className="text-lg font-bold text-[var(--color-text)] hidden lg:block">
//           Admin Panel
//         </span>
//       </div>

//       {/* Nav links */}
//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//         {navItems.map(({ name, icon: Icon, href }) => (
//           <NavLink
//             key={name}
//             to={href}
//             className={({ isActive }) =>
//               `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
//                 isActive
//                   ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] shadow-lg"
//                   : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:shadow-md"
//               }`
//             }
//           >
//             <Icon size={18} />
//             <span className="text-sm font-medium hidden lg:block">
//               {name}
//             </span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* Bottom logout (icon only on mobile) */}
//       <div className="p-3 border-t border-[var(--color-muted)]/30">
//         <button
//           onClick={() => setShowLogoutConfirm(true)}
//           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] hover:shadow-md transition-all duration-200"
//         >
//           <LogOut size={18} />
//           <span className="text-sm hidden lg:block">Logout</span>
//         </button>
//       </div>
//     </aside>

//     {/* Logout Confirmation Modal */}
//     {showLogoutConfirm && user && (
//       <div className="fixed inset-0 bg-[var(--color-bg)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-[var(--color-card)]/50 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[var(--color-muted)]/50 shadow-2xl">
//           <div className="text-center mb-6">
//             <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-[var(--color-primary)]/30">
//               <AlertTriangle className="w-10 h-10 text-[var(--color-primary)]" />
//             </div>
//             <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
//               Confirm Logout
//             </h2>
//             <p className="text-[var(--color-text-muted)] mb-6">
//               Are you sure you want to logout, <strong>{user.name}</strong>?
//               You'll need to login again.
//             </p>
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={adminLogout}
//               className="flex-1 h-12 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-text)] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
//             >
//               <LogOut className="h-5 w-5" />
//               Logout
//             </button>
//             <button
//               onClick={() => setShowLogoutConfirm(false)}
//               className="flex-1 h-12 bg-muted/10 hover:bg-muted/20 text-text font-semibold rounded-xl shadow-lg hover:shadow-xl border border-[var(--color-muted)]/30 transition-all duration-200"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </>
// );

// };

// ============== New Nav Bar ========================
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  FileQuestionMark,
  AlertTriangle,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { adminLogout, getAdmin } from "../../utils/auth";
import { useEffect, useState } from "react";
import xplore from "/itcorp.png";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
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
    dropdown: [{ name: "All Quizzes", href: "/admin/quiz" }],
  },
  {
    name: "Questions",
    icon: FileQuestionMark,
    href: "/admin/loadquestions",
    dropdown: [{ name: "Load Questions", href: "/admin/loadquestions" }],
  },
  { name: "Reports", icon: BarChart3, href: "/admin/reports" },
  { name: "Requests", icon: Bell, href: "/admin/requests" },
  { name: "Employees", icon: Users, href: "/admin/employees" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export const AdminSidebar = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const userData = getAdmin();
    setUser(userData);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({});
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    closeAllDropdowns();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 right-4 z-50 lg:hidden p-3 bg-[var(--color-card)]/20 text-text backdrop-blur-xl rounded-xl shadow-xl border border-[var(--color-muted)]/50 hover:shadow-2xl transition-all duration-200"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="sticky inset-y-0 left-0 z-40 h-screen w-16 lg:w-[20vw] bg-card/50 flex flex-col hidden lg:flex">
        {/* Logo & Name */}
        <div className="p-4 border-b border-[var(--color-muted)]/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <img src={xplore} alt="Admin" className="h-full w-9/10" />
          </div>
          <span className="text-lg font-bold text-[var(--color-text)]">
            Admin Panel
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ name, icon: Icon, href, dropdown }) => (
            <div key={name} className="relative">
              <NavLink
                to={href}
                onClick={() => dropdown && toggleDropdown(name)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer w-full ${
                    isActive || openDropdowns[name]
                      ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-semibold shadow-lg"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:shadow-md"
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-base font-medium flex-1">{name}</span>
                {dropdown && (
                  <div
                    className={`transition-transform duration-200 ${
                      openDropdowns[name] ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                )}
              </NavLink>

              {/* Desktop Dropdown - SAME as Mobile (No border/bg) */}
              {dropdown && openDropdowns[name] && (
                <div className="pl-8 space-y-1 mt-2 border-l-2 border-[var(--color-primary)]/30">
                  {dropdown.map(({ name: subName, href: subHref }) => (
                    <NavLink
                      key={subName}
                      to={subHref}
                      onClick={closeAllDropdowns}
                      className={({ isActive }) =>
                        `block px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                          location.pathname === subHref
                            ? "bg-[var(--color-primary)]/30 text-[var(--color-primary)] font-medium"
                            : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]"
                        }`
                      }
                    >
                      {subName}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom logout */}
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

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMobileMenu}
          />

          {/* Mobile Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-card/95 backdrop-blur-2xl shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden">
            {/* Mobile Header */}
            <div className="p-6 border-b border-[var(--color-muted)]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <img src={xplore} alt="Admin" className="h-full w-9/10" />
                </div>
                <span className="text-xl font-bold text-[var(--color-text)]">
                  Admin Panel
                </span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-xl text-text hover:bg-[var(--color-muted)]/20 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map(({ name, icon: Icon, href, dropdown }) => (
                <div key={name}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer w-full ${
                      location.pathname === href
                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-semibold shadow-lg"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:shadow-md"
                    }`}
                    onClick={() => dropdown && toggleDropdown(name)}
                  >
                    <Icon size={20} />
                    <span className="text-base font-medium flex-1">{name}</span>
                    {dropdown && (
                      <div
                        className={`transition-transform duration-200 ${
                          openDropdowns[name] ? "rotate-180" : ""
                        }`}
                      >
                        <ChevronDown size={18} />
                      </div>
                    )}
                  </div>

                  {/* Mobile Dropdown - IDENTICAL to Desktop now */}
                  {dropdown && openDropdowns[name] && (
                    <div className="pl-8 space-y-1 mt-2 border-l-2 border-[var(--color-primary)]/30">
                      {dropdown.map(({ name: subName, href: subHref }) => (
                        <NavLink
                          key={subName}
                          to={subHref}
                          onClick={closeMobileMenu}
                          className={({ isActive }) =>
                            `block px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-[var(--color-primary)]/30 text-[var(--color-primary)] font-semibold"
                                : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]"
                            }`
                          }
                        >
                          {subName}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Logout */}
            <div className="p-4 border-t border-[var(--color-muted)]/30 mt-4">
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
                onClick={adminLogout}
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
