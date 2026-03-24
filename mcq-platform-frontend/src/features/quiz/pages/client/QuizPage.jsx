import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  BookOpen,
  Tag,
  Play,
  AlertCircle,
  X,
  KeyRound,
  ShieldCheck,
  ShieldX,
  Eye,
  ArrowLeft,
  MonitorOff,
  Wifi,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { encryptId } from "../../../../utils/encryption";

import DotGrid from "../../../../components/DotGrid";
import FloatingParticles from "../../../../components/FloatingParticles";

// ─── Quiz Code Modal ────────────────────────────────────────────────────────

// const QuizCodeModal = ({ quiz, onClose, onSuccess }) => {
//   const [code, setCode] = useState("");
//   const [error, setError] = useState("");
//   const [shake, setShake] = useState(false);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     // Auto-focus input when modal opens
//     setTimeout(() => inputRef.current?.focus(), 100);
//   }, []);

//   const triggerShake = () => {
//     setShake(true);
//     setTimeout(() => setShake(false), 500);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!code.trim()) {
//       setError("Please enter the quiz code.");
//       triggerShake();
//       return;
//     }
//     if (code.trim().toUpperCase() === quiz.quiz_code.toUpperCase()) {
//       setError("");
//       onSuccess(quiz.id);
//     } else {
//       setError("Incorrect quiz code. Please try again.");
//       triggerShake();
//       setCode("");
//       inputRef.current?.focus();
//     }
//   };

//   // Close on Escape key
//   useEffect(() => {
//     const handler = (e) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/60 backdrop-blur-md"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div
//         className={`relative z-10 w-full max-w-md bg-[var(--color-card)]/80 backdrop-blur-2xl border border-[var(--color-muted)]/40 rounded-3xl p-8 shadow-2xl transition-all duration-200 ${
//           shake ? "animate-[shake_0.4s_ease-in-out]" : ""
//         }`}
//         style={{
//           boxShadow:
//             "0 0 60px var(--color-primary, #6366f1)22, 0 25px 50px rgba(0,0,0,0.5)",
//         }}
//       >
//         {/* Decorative blob */}
//         <div className="absolute -top-8 -right-8 w-24 h-24 bg-[var(--color-primary)]/20 rounded-full blur-2xl pointer-events-none" />
//         <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[var(--color-secondary)]/20 rounded-full blur-2xl pointer-events-none" />

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-muted)]/20 hover:text-[var(--color-text)] transition-all duration-200"
//         >
//           <X size={18} />
//         </button>

//         {/* Icon */}
//         <div className="flex justify-center mb-5">
//           <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center">
//             <KeyRound className="w-8 h-8 text-[var(--color-primary)]" />
//           </div>
//         </div>

//         {/* Heading */}
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1">
//             Enter Quiz Code
//           </h2>
//           <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
//             Enter the access code to unlock{" "}
//             <span className="text-[var(--color-primary)] font-medium">
//               {quiz.title}
//             </span>
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <input
//               ref={inputRef}
//               type="text"
//               value={code}
//               onChange={(e) => {
//                 setCode(e.target.value.toUpperCase());
//                 setError("");
//               }}
//               placeholder="e.g. QUIZXYZ"
//               maxLength={20}
//               className={`w-full h-14 px-5 pr-12 rounded-xl bg-[var(--color-bg)]/60 border text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 text-center tracking-[0.25em] text-lg font-semibold focus:outline-none transition-all duration-200 ${
//                 error
//                   ? "border-red-500/60 focus:border-red-500"
//                   : "border-[var(--color-muted)]/40 focus:border-[var(--color-primary)]/70"
//               }`}
//               autoComplete="off"
//               spellCheck="false"
//             />
//             {/* Status icon inside input */}
//             <div className="absolute right-4 top-1/2 -translate-y-1/2">
//               {error ? (
//                 <ShieldX className="w-5 h-5 text-red-500/70" />
//               ) : code.length > 0 ? (
//                 <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]/60" />
//               ) : null}
//             </div>
//           </div>

//           {/* Error */}
//           {error && (
//             <p className="flex items-center gap-2 text-sm text-red-400 px-1">
//               <AlertCircle className="w-4 h-4 shrink-0" />
//               {error}
//             </p>
//           )}

//           {/* Buttons */}
//           <div className="flex gap-3 pt-1">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 h-12 rounded-xl border border-[var(--color-muted)]/40 text-[var(--color-text-muted)] hover:bg-[var(--color-muted)]/10 hover:text-[var(--color-text)] font-medium transition-all duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
//             >
//               <Play className="w-4 h-4" />
//               Start Quiz
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Shake keyframe */}
//       <style>{`
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           15% { transform: translateX(-8px); }
//           30% { transform: translateX(8px); }
//           45% { transform: translateX(-6px); }
//           60% { transform: translateX(6px); }
//           75% { transform: translateX(-3px); }
//           90% { transform: translateX(3px); }
//         }
//       `}</style>
//     </div>
//   );
// };

// ─── Main Quiz Page ──────────────────────────────────────────────────────────

// const QuizPage = () => {
//   const navigate = useNavigate();
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedQuiz, setSelectedQuiz] = useState(null); // quiz object for modal

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const response = await quizAPI.getQuizzes();
//         if (response.data.success) {
//           setQuizzes(response.data.data);
//         } else {
//           setError(response.data.message || "Failed to fetch quizzes");
//         }
//       } catch (err) {
//         setError("Failed to load quizzes. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchQuizzes();
//   }, [navigate]);

//   // Opens the code modal instead of navigating directly
//   const handleStartQuiz = (quiz) => {
//     setSelectedQuiz(quiz);
//   };

//   // Called when the correct code is entered
//   const handleCodeSuccess = (quizId) => {
//     setSelectedQuiz(null);
//     const encryptedQuizId = encryptId(quizId);
//     navigate(`/quiz/${encryptedQuizId}`);
//   };

//   if (loading) return <Loader message="Fetching Quiz..." />;

//   return (
//     <div className="min-h-screen bg-[var(--color-bg)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//       <DotGrid />
//       <FloatingParticles />

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--color-text)] via-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-4">
//             Available Quizzes
//           </h1>
//           <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
//             Choose a quiz to test your knowledge and track your progress
//           </p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="max-w-2xl mx-auto mb-12">
//             <div className="bg-[var(--color-card)]/80 border border-[var(--color-primary)]/30 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4">
//               <AlertCircle className="h-6 w-6 text-[var(--color-primary)] flex-shrink-0" />
//               <div>
//                 <h3 className="font-semibold text-[var(--color-text)] mb-1">
//                   Error
//                 </h3>
//                 <p className="text-[var(--color-text-muted)]">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* No Quizzes */}
//         {quizzes.length === 0 && !loading && !error && (
//           <div className="text-center py-24">
//             <BookOpen className="h-24 w-24 text-[var(--color-muted)] mx-auto mb-8 opacity-50" />
//             <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
//               No quizzes available
//             </h2>
//             <p className="text-xl text-[var(--color-text-muted)] max-w-md mx-auto">
//               Check back later for new quizzes
//             </p>
//           </div>
//         )}

//         {/* Quizzes Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {quizzes.map((quiz) => (
//             <div
//               key={quiz.id}
//               className="group bg-[var(--color-card)]/50 relative border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-primary)]/30"
//             >
//               {/* Decorative Blob */}
//               <div className="h-15 w-15 blur-lg rounded-full bg-[var(--color-primary)]/30 absolute -top-5 -right-5" />

//               <div className="space-y-6">
//                 {/* Title */}
//                 <h3 className="text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-300 leading-tight">
//                   {quiz.title}
//                 </h3>

//                 {/* Stats */}
//                 <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)] mb-4">
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4" />
//                     <span>{quiz.duration}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <BookOpen className="h-4 w-4" />
//                     <span>{quiz.totalQuestions} questions</span>
//                   </div>
//                 </div>

//                 {/* Category Tags */}
//                 <div className="flex flex-wrap gap-2">
//                   {quiz.categories.slice(0, 4).map((category, index) => (
//                     <span
//                       key={index}
//                       className="px-3 py-1.5 bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-medium rounded-lg hover:bg-[var(--color-primary)]/25 transition-colors duration-200 flex items-center gap-1"
//                     >
//                       <Tag className="h-3 w-3 inline -ml-1 mr-1 align-middle flex-shrink-0" />
//                       {category.name}
//                     </span>
//                   ))}
//                 </div>

//                 {/* Start Button — now passes full quiz object */}
//                 <button
//                   onClick={() => handleStartQuiz(quiz)}
//                   className="w-full h-14 bg-gradient-to-r from-[var(--color-primary)]/80 to-[var(--color-bg)]/20 text-text rounded-4xl font-semibold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 active:scale-90 transition-all duration-200"
//                 >
//                   <span className="flex items-center gap-3">
//                     Start Quiz
//                     <Play className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
//                   </span>
//                 </button>
//               </div>

//               {/* Card glow */}
//               <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur pointer-events-none" />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Quiz Code Modal */}
//       {selectedQuiz && (
//         <QuizCodeModal
//           quiz={selectedQuiz}
//           onClose={() => setSelectedQuiz(null)}
//           onSuccess={handleCodeSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default QuizPage;



// ── Rules data ────────────────────────────────────────────────────────────────
const RULES = [
  {
    icon: Clock,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Time Limit",
    desc: "The timer starts immediately once you begin. You cannot pause it.",
  },
  {
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Attempt All Questions",
    desc: "Submit is only enabled after all questions are answered.",
  },
  {
    icon: Eye,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    title: "No Tab Switching",
    desc: "Switching tabs or minimizing the window counts as a violation.",
  },
  {
    icon: ArrowLeft,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    title: "No Navigation",
    desc: "Using the browser back button will trigger a violation.",
  },
  {
    icon: MonitorOff,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    title: "3 Strikes = Auto Submit",
    desc: "After 3 violations your quiz is submitted automatically.",
  },
  {
    icon: Wifi,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "Stable Connection",
    desc: "Ensure a stable internet connection throughout the quiz.",
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
const QuizPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the quiz code.");
      triggerShake();
      return;
    }
    // ── Replace with your actual handler ──────────────────────────────────
    console.log("Quiz code entered:", code.trim().toUpperCase());
    // ─────────────────────────────────────────────────────────────────────
    const encryptedQuizCode = encryptId(code.trim());
    navigate(`/quiz/${encryptedQuizCode}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations — keep your existing DotGrid / FloatingParticles */}
      <DotGrid />
      <FloatingParticles />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--color-text)] via-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Quiz Instructions
            </h1>
          </div>
          <p className="text-[var(--color-text-muted)] text-base ml-[52px]">
            Read all rules carefully, then enter your quiz code to begin.
          </p>
        </div>

        {/* ── Two-column layout ─────────────────────────────────────────── */}
        {/*   On mobile: stacks vertically (instructions first, code panel below) */}
        {/*   On lg+:    side by side — instructions left, code panel sticky right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 xl:gap-10 items-start">

          {/* ══════════════════════════════════════════════════════════════
              LEFT — Instructions
          ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">

            {/* 2-column rule cards on sm+, 1 column on xs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RULES.map(({ icon: Icon, color, bg, title, desc }, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-4 rounded-2xl border ${bg} hover:scale-[1.015] transition-transform duration-200`}
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-[var(--color-card)]/70 border border-[var(--color-muted)]/20 flex items-center justify-center mt-0.5">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text)] mb-0.5">
                      {title}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Violation warning */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400 mb-1">
                  Violation Policy
                </p>
                <p className="text-xs text-red-400/80 leading-relaxed">
                  Tab switch, minimize, or browser back = <strong>1 strike</strong>.
                  Accumulating <strong>3 strikes</strong> will automatically submit
                  your quiz regardless of completion status.
                </p>
              </div>
            </div>

            {/* Acknowledgement note */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15">
              <Tag className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                By entering the quiz code and clicking <em>Start Quiz</em>, you confirm
                that you have read and agree to all the rules above. Any attempt to
                cheat or circumvent the system may result in disqualification.
              </p>
            </div>
          </div>
          {/* ══ END LEFT ═════════════════════════════════════════════════ */}


          {/* ══════════════════════════════════════════════════════════════
              RIGHT — Code Entry Panel (sticky on lg+)
          ══════════════════════════════════════════════════════════════ */}
          <div className="lg:sticky lg:top-24">
            <div
              className="relative bg-[var(--color-card)]/60 backdrop-blur-xl border border-[var(--color-muted)]/40 rounded-3xl p-7 shadow-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 0 50px color-mix(in srgb, var(--color-primary) 10%, transparent), 0 20px 40px rgba(0,0,0,0.35)",
              }}
            >
              {/* Decorative blobs */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--color-primary)]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[var(--color-secondary)]/15 rounded-full blur-2xl pointer-events-none" />

              {/* Panel header */}
              <div className="relative text-center mb-7">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center">
                    <KeyRound className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                  Enter Quiz Code
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Type the access code provided by your instructor to unlock and
                  begin the quiz.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className={`relative space-y-4 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
              >
                {/* Code input */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setError("");
                    }}
                    placeholder="e.g. QUIZXYZ"
                    maxLength={20}
                    autoComplete="off"
                    spellCheck="false"
                    className={`w-full h-14 px-5 pr-12 rounded-xl bg-[var(--color-bg)]/70 border text-[var(--color-text)] placeholder-[var(--color-text-muted)]/40 text-center tracking-[0.3em] text-lg font-semibold focus:outline-none transition-all duration-200 ${error
                        ? "border-red-500/60 focus:border-red-500 bg-red-500/5"
                        : "border-[var(--color-muted)]/40 focus:border-[var(--color-primary)]/70 focus:bg-[var(--color-primary)]/5"
                      }`}
                  />
                  {/* Shield icon feedback */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {error ? (
                      <ShieldX className="w-5 h-5 text-red-500/70" />
                    ) : code.length > 0 ? (
                      <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]/60" />
                    ) : null}
                  </div>
                </div>

                {/* Inline error */}
                {error && (
                  <p className="flex items-center gap-2 text-sm text-red-400 px-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-[var(--color-primary)]/80 to-[var(--color-bg)]/20 text-[var(--color-text)] font-semibold rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 text-base"
                >
                  Start Quiz
                  <Play className="w-5 h-5" />
                </button>
              </form>

              {/* Divider + hint */}
              <div className="relative mt-6 mb-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-muted)]/20" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-transparent text-xs text-[var(--color-text-muted)]/50">
                    Need help?
                  </span>
                </div>
              </div>
              <p className="text-center text-xs text-[var(--color-text-muted)]/50 leading-relaxed">
                Contact your instructor if you haven't received a quiz code or if
                it isn't working.
              </p>
            </div>
          </div>
          {/* ══ END RIGHT ════════════════════════════════════════════════ */}

        </div>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(8px); }
          45%      { transform: translateX(-6px); }
          60%      { transform: translateX(6px); }
          75%      { transform: translateX(-3px); }
          90%      { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
};

export default QuizPage;

