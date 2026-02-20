import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  PlayCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";


const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const handleStartQuizzes = () => {
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16  relative overflow-hidden">
      {/* Enhanced Wide Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, var(--color-muted) 1px, transparent 0),
            radial-gradient(circle at 25px 25px, var(--color-muted) 1px, transparent 0),
            radial-gradient(circle at 50px 50px, var(--color-primary) 1px, transparent 0),
            radial-gradient(circle at 75px 75px, var(--color-secondary) 1px, transparent 0)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Wider Floating Particles - Better Screen Coverage */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-10 w-80 h-80 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 left-5 w-64 h-64 bg-[var(--color-secondary)]/10 rounded-full blur-3xl animate-blob animation-delay-2s"></div>
        <div className="absolute bottom-1/4 -left-10 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl animate-blob animation-delay-4s"></div>
        <div className="absolute top-1/2 right-5 w-72 h-72 bg-[var(--color-secondary)]/8 rounded-full blur-3xl animate-blob animation-delay-6s"></div>
      </div>

      {/* WIDER Main Container */}
      <div className="relative z-10  text-center max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full space-y-8 px-4 sm:px-6 lg:px-8 pt-10">
        {/* Wider Main Icon */}
        <div
          className={`w-28 h-28 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border-4 border-[var(--color-primary)]/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto shadow-2xl group ${isVisible ? "animate-float-in" : ""}`}
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-[var(--color-primary)] animate-ping opacity-75" />
            <BookOpen className="w-16 h-16 text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        {/* Wider Title Area */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[var(--color-text)] via-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent leading-tight relative overflow-hidden px-4">
            Welcome to
            <span className="inline-block">
              <span className="shine bg-gradient-to-r from-transparent via-white/20 to-transparent absolute inset-0 -skew-x-12 animate-shine" />
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[var(--color-text)] via-[var(--color-primary)]/80 to-[var(--color-secondary)]/80 bg-clip-text text-transparent drop-shadow-lg px-4">
            MCQ Platform ✨
          </h2>
        </div>

        {/* Wider Description */}
        <p className="text-xl md:text-2xl text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed px-6">
          Test your skills with comprehensive MCQs across
          <span className="inline-flex items-center gap-1 bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-2xl backdrop-blur-sm border border-[var(--color-primary)]/20 animate-pulse mx-1">
            <span className="font-bold text-[var(--color-primary)]">
              Technical
            </span>
            <Sparkles className="w-4 h-4 text-[var(--color-primary)] opacity-80" />
          </span>
          ,
          <span className="font-bold text-[var(--color-primary)] mx-1">
            Aptitude
          </span>
          ,
          <span className="font-bold text-[var(--color-primary)] mx-1">
            Logical
          </span>
          , and
          <span className="font-bold text-[var(--color-primary)] mx-1">
            English
          </span>
          .
        </p>

        {/* Wider Premium Button */}
        <button
          onClick={handleStartQuizzes}
          className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 overflow-hidden backdrop-blur-xl border border-white/20 mx-auto"
        >
          <span>Start Your First Quiz</span>
          <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />

          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent rounded-3xl -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-500 blur" />
          <div className="absolute inset-0 ring-2 ring-[var(--color-primary)]/50 -translate-y-1 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
        </button>
      </div>

      <style jsx>{`
        @keyframes float-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(20px, -20px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-25deg);
          }
          100% {
            transform: translateX(300%) skewX(-25deg);
          }
        }
        .animate-float-in {
          animation: float-in 0.8s ease-out forwards;
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2s {
          animation-delay: 2s;
        }
        .animation-delay-4s {
          animation-delay: 4s;
        }
        .animation-delay-6s {
          animation-delay: 6s;
        }
        .shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default Home;
// {/* Wider Feature Cards Grid */}
// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12 px-4">
//   {/* Feature cards content remains exactly the same */}
//   <div className="group relative p-7 lg:p-8 bg-[var(--color-card)]/60 backdrop-blur-xl rounded-2xl border border-[var(--color-muted)]/40 shadow-xl hover:shadow-2xl hover:border-[var(--color-primary)]/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden col-span-1 md:col-span-2 xl:col-span-1">
//     <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//     <div className="flex items-start gap-4 relative z-10">
//       <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-300 flex-shrink-0">
//         <ShieldCheck className="w-7 h-7 text-white" />
//       </div>
//       <div>
//         <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">Secure & Fair</h3>
//         <p className="text-base text-[var(--color-text-muted)] leading-relaxed">Proctored exams with strict time limits</p>
//       </div>
//     </div>
//   </div>

//   <div className="group relative p-7 lg:p-8 bg-[var(--color-card)]/60 backdrop-blur-xl rounded-2xl border border-[var(--color-muted)]/40 shadow-xl hover:shadow-2xl hover:border-[var(--color-primary)]/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden col-span-1 md:col-span-2 xl:col-span-1">
//     <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//     <div className="flex items-start gap-4 relative z-10">
//       <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-300 flex-shrink-0">
//         <PlayCircle className="w-7 h-7 text-white" />
//       </div>
//       <div>
//         <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">Instant Results</h3>
//         <p className="text-base text-[var(--color-text-muted)] leading-relaxed">Detailed scores immediately after completion</p>
//       </div>
//     </div>
//   </div>

//   <div className="group relative p-7 lg:p-8 bg-[var(--color-card)]/60 backdrop-blur-xl rounded-2xl border border-[var(--color-muted)]/40 shadow-xl hover:shadow-2xl hover:border-[var(--color-secondary)]/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden xl:col-span-1 hidden xl:block">
//     <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)]/10 to-blue-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//     <div className="flex items-start gap-4 relative z-10">
//       <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-secondary)] to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-300 flex-shrink-0">
//         <Sparkles className="w-7 h-7 text-white" />
//       </div>
//       <div>
//         <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-secondary)] transition-colors">Modern Design</h3>
//         <p className="text-base text-[var(--color-text-muted)] leading-relaxed">Beautiful responsive interface</p>
//       </div>
//     </div>
//   </div>

//   <div className="group relative p-7 lg:p-8 bg-[var(--color-card)]/60 backdrop-blur-xl rounded-2xl border border-[var(--color-muted)]/40 shadow-xl hover:shadow-2xl hover:border-green-500/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden xl:col-span-1 hidden xl:block">
//     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//     <div className="flex items-start gap-4 relative z-10">
//       <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-300 flex-shrink-0">
//         <BookOpen className="w-7 h-7 text-white" />
//       </div>
//       <div>
//         <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 group-hover:text-purple-600 transition-colors">Varied Topics</h3>
//         <p className="text-base text-[var(--color-text-muted)] leading-relaxed">Technical, aptitude & more</p>
//       </div>
//     </div>
//   </div>
// </div>
