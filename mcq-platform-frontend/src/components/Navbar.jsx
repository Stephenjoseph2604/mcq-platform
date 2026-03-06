import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  BookOpen,
  User,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { getUser, logout } from "../utils/auth";
import renaatus from "/renaatus.png";
import DotGrid from "./DotGrid";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(null);

  // Get real user data from your auth.js
  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    logout(); // Your exact logout function
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
    
      <nav className="bg-transparent w-screen backdrop-blur-md cursor-pointer select-none fixed top-0 z-50 py-3 px-4 sm:px-6">
        <DotGrid/>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left: Compact Logo + MCQ Text */}
          <Link
            to="/"
            className="group hover:scale-105 transition-all duration-200 flex items-center"
          >
            <img
              src={renaatus}
              alt="MCQ"
              className="h-10 pt-1 w-auto scale-160 brightness-0 invert-[1]"
            />
          </Link>

          {/* Desktop Center Nav */}
          <div className="hidden md:flex items-center gap-6 mx-12">
            <Link
              to="/"
              className="px-3 py-1.5 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-md transition-all duration-200 flex items-center gap-1.5"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/quiz"
              className="px-3 py-1.5 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-md transition-all duration-200 flex items-center gap-1.5"
            >
              <BookOpen className="h-4 w-4" />
              Quizzes
            </Link>
          </div>

          {/* Desktop Right: Real User Avatar + Name + Logout */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center text-text font-bold text-base shadow-md hover:scale-105 transition-all duration-200 cursor-pointer flex-shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex flex-col text-right min-w-[80px]">
                  <p className="text-sm font-semibold text-[var(--color-text)] truncate max-w-[120px]">
                    {user.name || "Student"}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] capitalize">
                    {user.department || user.role || "student"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogoutClick}
                className="w-10 h-10 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] hover:text-[var(--color-bg)] hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex-shrink-0"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <div className="w-9 h-9 bg-[var(--color-card)]/80 rounded-lg flex items-center justify-center animate-pulse border border-[var(--color-primary)]/20">
                <div className="w-5 h-5 bg-[var(--color-primary)]/40 rounded-full" />
              </div>
              <div className="h-9 w-20 bg-[var(--color-card)]/80 rounded animate-pulse border border-[var(--color-primary)]/20" />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-lg transition-all duration-200 flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden select-none cursor-pointer fixed top-16 left-0 w-screen bg-transparent backdrop-blur-md border-b border-[var(--color-muted)]/50 shadow-xl z-40 py-4 px-4">
          <div className="max-w-6xl mx-auto space-y-3">
            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-4 py-3 text-base font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-xl transition-all duration-200 flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                Home
              </Link>
              <Link
                to="/quiz"
                className="px-4 py-3 text-base font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-xl transition-all duration-200 flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5 flex-shrink-0" />
                Quizzes
              </Link>
            </div>

            {/* Mobile User Profile + Logout */}
            <div className="pt-4 border-t border-[var(--color-muted)]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center text-text font-bold text-xl shadow-lg flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {user.name || "Student"}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] capitalize">
                      {user.department || user.role || "student"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogoutClick}
                className="w-full h-12 bg-primary text-text hover:bg-[var(--color-secondary)]  rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && user && (
        <div className="fixed inset-0 bg-[var(--color-bg)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-card)]/40 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[var(--color-muted)]/50 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-[var(--color-primary)]/30">
                <AlertTriangle className="w-10 h-10 text-[var(--color-primary)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                Confirm Logout
              </h2>
              <p className="text-[var(--color-text-muted)] mb-6">
                Are you sure you want to logout,{" "}
                <strong className="text-[var(--color-text)]">
                  {user.name}
                </strong>
                ? You'll need to login again.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmLogout}
                className="flex-1 h-12 bg-primary text-text font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>

              <button
                onClick={cancelLogout}
                className="flex-1 h-12 bg-[var(--color-card)] hover:bg-[var(--color-card)]/80 text-[var(--color-text)] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Navbar;
