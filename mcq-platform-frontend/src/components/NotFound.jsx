import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertOctagon, BookOpen, Sparkles } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-20 flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16 relative overflow-hidden">
      {/* Same Dot Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, var(--color-muted) 1px, transparent 0),
            radial-gradient(circle at 25px 25px, var(--color-muted) 1px, transparent 0),
            radial-gradient(circle at 50px 50px, var(--color-primary) 1px, transparent 0),
            radial-gradient(circle at 75px 75px, var(--color-secondary) 1px, transparent 0)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 left-5 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-blob animation-delay-2s"></div>
        <div className="absolute bottom-1/4 -left-10 w-96 h-96 bg-red-400/5 rounded-full blur-3xl animate-blob animation-delay-4s"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full space-y-8">
        {/* 404 Icon */}
        <div className="w-32 h-32 bg-gradient-to-br from-red-500/10 to-red-400/10 border-4 border-red-500/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
          <div className="relative">
            <AlertOctagon className="w-16 h-16 text-red-500 drop-shadow-lg" />
            <Sparkles className="w-5 h-5 absolute -top-2 -right-2 text-red-400 animate-ping opacity-75" />
          </div>
        </div>

        {/* Big 404 Numbers */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent drop-shadow-2xl leading-none">
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

   

        {/* Return Home Button */}
        <button
          onClick={handleGoHome}
          className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 overflow-hidden backdrop-blur-xl border border-white/20 mx-auto"
        >
          <ArrowLeft className="h-7 w-7 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Return to Home</span>
          
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent rounded-3xl -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-500 blur" />
          <div className="absolute inset-0 ring-2 ring-[var(--color-primary)]/50 -translate-y-1 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
        </button>

        {/* Subtext */}
        <p className="text-sm text-[var(--color-text-muted)] opacity-75 px-6">
          Don't worry, everything is fine! Just head back to safety.
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2s { animation-delay: 2s; }
        .animation-delay-4s { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default NotFound;
