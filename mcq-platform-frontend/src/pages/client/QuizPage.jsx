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
} from "lucide-react";
import { quizAPI } from "../../services/api";
import { encryptId } from "../../utils/encryption";
import Loader from "../../components/Loader";
import DotGrid from "../../components/DotGrid";
import FloatingParticles from "../../components/FloatingParticles";
import QuizCodeModal from "./QuizCodeModal";
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

const QuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null); // quiz object for modal

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await quizAPI.getQuizzes();
        if (response.data.success) {
          setQuizzes(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch quizzes");
        }
      } catch (err) {
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [navigate]);

  // Opens the code modal instead of navigating directly
  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  // Called when the correct code is entered
  const handleCodeSuccess = (quizId) => {
    setSelectedQuiz(null);
    const encryptedQuizId = encryptId(quizId);
    navigate(`/quiz/${encryptedQuizId}`);
  };

  if (loading) return <Loader message="Fetching Quiz..." />;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <DotGrid />
      <FloatingParticles />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--color-text)] via-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-4">
            Available Quizzes
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Choose a quiz to test your knowledge and track your progress
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-[var(--color-card)]/80 border border-[var(--color-primary)]/30 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-[var(--color-primary)] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">
                  Error
                </h3>
                <p className="text-[var(--color-text-muted)]">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Quizzes */}
        {quizzes.length === 0 && !loading && !error && (
          <div className="text-center py-24">
            <BookOpen className="h-24 w-24 text-[var(--color-muted)] mx-auto mb-8 opacity-50" />
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
              No quizzes available
            </h2>
            <p className="text-xl text-[var(--color-text-muted)] max-w-md mx-auto">
              Check back later for new quizzes
            </p>
          </div>
        )}

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group bg-[var(--color-card)]/50 relative border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-primary)]/30"
            >
              {/* Decorative Blob */}
              <div className="h-15 w-15 blur-lg rounded-full bg-[var(--color-primary)]/30 absolute -top-5 -right-5" />

              <div className="space-y-6">
                {/* Title */}
                <h3 className="text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-300 leading-tight">
                  {quiz.title}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)] mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{quiz.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{quiz.totalQuestions} questions</span>
                  </div>
                </div>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-2">
                  {quiz.categories.slice(0, 4).map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-medium rounded-lg hover:bg-[var(--color-primary)]/25 transition-colors duration-200 flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3 inline -ml-1 mr-1 align-middle flex-shrink-0" />
                      {category.name}
                    </span>
                  ))}
                </div>

                {/* Start Button — now passes full quiz object */}
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full h-14 bg-gradient-to-r from-[var(--color-primary)]/80 to-[var(--color-bg)]/20 text-text rounded-4xl font-semibold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 active:scale-90 transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    Start Quiz
                    <Play className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </button>
              </div>

              {/* Card glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Code Modal */}
      {selectedQuiz && (
        <QuizCodeModal
          quiz={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          onSuccess={handleCodeSuccess}
        />
      )}
    </div>
  );
};

export default QuizPage;