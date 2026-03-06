import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertOctagon, BookOpen, Sparkles } from 'lucide-react';
import DotGrid from './DotGrid'; // Use your existing components
import FloatingParticles from './FloatingParticles';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-20 flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16 relative overflow-hidden">
      {/* Your existing DotGrid & FloatingParticles */}
      <DotGrid />
      <FloatingParticles />

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full space-y-8">
        {/* 404 Icon - Purple Theme */}
        <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 border-4 border-[var(--color-primary)]/40 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse group">
          <div className="relative">
            <AlertOctagon className="w-16 h-16 text-[var(--color-primary)] drop-shadow-lg" />
            <Sparkles className="w-5 h-5 absolute -top-2 -right-2 text-[var(--color-secondary)] animate-ping opacity-75" />
          </div>
        </div>

        {/* Big 404 Numbers - Purple Gradient */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-purple-stat)] bg-clip-text text-transparent drop-shadow-2xl leading-none">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text)] drop-shadow-lg">
            Oops! Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-xl md:text-2xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed px-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Return Home Button - Luxury Purple */}
        <button
          onClick={handleGoHome}
          className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-purple-stat)] text-[var(--color-text)] font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 overflow-hidden backdrop-blur-xl border border-[var(--color-primary)]/30 mx-auto btn-color"
        >
          <ArrowLeft className="h-7 w-7 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Return to Home</span>
          
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-text)]/20 via-[var(--color-text)]/10 to-transparent rounded-3xl -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-500 blur" />
          <div className="absolute inset-0 ring-2 ring-[var(--color-primary)]/50 -translate-y-1 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
        </button>

        {/* Subtext */}
        <p className="text-sm text-[var(--color-text-muted)] opacity-75 px-6">
          Don't worry, everything is fine! Just head back to safety.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
