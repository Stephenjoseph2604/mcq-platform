// components/Navbar.jsx - Mobile menu with avatar + logout
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Home, BookOpen, User, Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    console.log('Logout function placeholder');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-transparent w-screen backdrop-blur-md cursor-pointer select-none  fixed top-0 z-50 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Left: Compact Logo + MCQ Text */}
          <Link to="/" className="flex items-center gap-2 group hover:scale-105 transition-all duration-200">
            <div className="w-10 h-10 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg flex items-center justify-center group-hover:bg-[var(--color-primary)]/20">
              <BookOpen className="h-5 w-5 text-[var(--color-primary)] group-hover:scale-110" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-primary)] bg-clip-text text-transparent">
                MCQ
              </h1>
              <p className="text-xs text-[var(--color-text-muted)]">Default</p>
            </div>
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
              Quiz
            </Link>
          </div>

          {/* Desktop Right: Avatar + Name + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md hover:scale-105 transition-all duration-200 cursor-pointer flex-shrink-0">
                S
              </div>
              <div className="flex flex-col text-right min-w-[60px]">
                <p className="text-sm font-semibold text-[var(--color-text)] truncate">Stephen</p>
                <p className="text-xs text-[var(--color-text-muted)]">Student</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-10 h-10 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex-shrink-0"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

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
      {isMobileMenuOpen && (
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
                Quiz
              </Link>
            </div>

            {/* Mobile User Profile + Logout */}
            <div className="pt-4 border-t border-[var(--color-muted)]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">Stephen</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Student</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full h-12  bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
