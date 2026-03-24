import { useState, useEffect, useRef } from "react";
import {
  X,
  KeyRound,
  ShieldX,
  ShieldCheck,
  AlertCircle,
  Play,
  ChevronRight,
  Clock,
  Eye,
  ArrowLeft,
  MonitorOff,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Wifi,
} from "lucide-react";

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

// ─── Instructions Step ────────────────────────────────────────────────────────

const InstructionsStep = ({ quiz, onProceed, onClose }) => (
  <div className="flex flex-col h-full">
    {/* Static top section */}
    <div className="shrink-0">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
      </div>

      <div className="text-center mb-3">
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-0.5">
          Before You Begin
        </h2>
        <p className="text-xs text-[var(--color-text-muted)]">
          Read carefully for{" "}
          <span className="text-[var(--color-primary)] font-semibold">
            {quiz.title}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
          <Clock className="w-3 h-3 text-[var(--color-primary)]" />
          <span className="text-xs font-medium text-[var(--color-primary)]">
            {quiz.duration}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
          <BookOpen className="w-3 h-3 text-[var(--color-primary)]" />
          <span className="text-xs font-medium text-[var(--color-primary)]">
            {quiz.totalQuestions} Questions
          </span>
        </div>
      </div>
    </div>

    {/* Scrollable rules — grows and shrinks with available space */}
    <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 mb-3 scrollbar-thin scrollbar-thumb-[var(--color-muted)]/30 scrollbar-track-transparent">
      {RULES.map(({ icon: Icon, color, bg, title, desc }, i) => (
        <div
          key={i}
          className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${bg}`}
        >
          <div className="shrink-0 w-7 h-7 rounded-lg bg-[var(--color-card)]/60 flex items-center justify-center mt-0.5">
            <Icon className={`w-3.5 h-3.5 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--color-text)] mb-0.5">
              {title}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              {desc}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Static bottom section */}
    <div className="shrink-0">
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 mb-3">
        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-red-400 leading-relaxed">
          <span className="font-semibold">Violation policy:</span> Tab switch,
          minimize, or back navigation = 1 strike. 3 strikes = auto-submit.
        </p>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onClose}
          className="flex-1 h-10 rounded-xl border border-[var(--color-muted)]/40 text-[var(--color-text-muted)] hover:bg-[var(--color-muted)]/10 hover:text-[var(--color-text)] font-medium text-sm transition-all duration-200"
        >
          Cancel
        </button>
        <button
          onClick={onProceed}
          className="flex-1 h-10 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 text-sm"
        >
          I Understand
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

// ─── Code Step ────────────────────────────────────────────────────────────────

const CodeStep = ({ quiz, onSuccess, onBack }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
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
    if (code.trim().toUpperCase() === quiz.quiz_code.toUpperCase()) {
      setError("");
      onSuccess(quiz.id);
    } else {
      setError("Incorrect quiz code. Please try again.");
      triggerShake();
      setCode("");
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className={`flex flex-col h-full justify-center ${
        shake ? "animate-[shake_0.4s_ease-in-out]" : ""
      }`}
    >
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center">
          <KeyRound className="w-7 h-7 text-[var(--color-primary)]" />
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
          Enter Quiz Code
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          Enter the access code to unlock{" "}
          <span className="text-[var(--color-primary)] font-medium">
            {quiz.title}
          </span>
        </p>
      </div>

      <div className="flex justify-center mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">
            Instructions acknowledged — you're ready
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
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
            className={`w-full h-14 px-5 pr-12 rounded-xl bg-[var(--color-bg)]/60 border text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 text-center tracking-[0.25em] text-lg font-semibold focus:outline-none transition-all duration-200 ${
              error
                ? "border-red-500/60 focus:border-red-500"
                : "border-[var(--color-muted)]/40 focus:border-[var(--color-primary)]/70"
            }`}
            autoComplete="off"
            spellCheck="false"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {error ? (
              <ShieldX className="w-5 h-5 text-red-500/70" />
            ) : code.length > 0 ? (
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]/60" />
            ) : null}
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm text-red-400 px-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 h-12 rounded-xl border border-[var(--color-muted)]/40 text-[var(--color-text-muted)] hover:bg-[var(--color-muted)]/10 hover:text-[var(--color-text)] font-medium transition-all duration-200 flex items-center justify-center gap-1.5 text-sm"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="flex-1 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <Play className="w-4 h-4" />
            Start Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

const QuizCodeModal = ({ quiz, onClose, onSuccess }) => {
  const [step, setStep] = useState("instructions");

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal shell — capped height, never touches viewport edges */}
      <div
        className="relative z-10 w-full max-w-md flex flex-col bg-[var(--color-card)]/85 backdrop-blur-2xl border border-[var(--color-muted)]/40 rounded-3xl shadow-2xl overflow-hidden"
        style={{
          height: "min(660px, calc(100dvh - 48px))",
          boxShadow:
            "0 0 60px color-mix(in srgb, var(--color-primary) 13%, transparent), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-[var(--color-primary)]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[var(--color-secondary)]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-muted)]/20 hover:text-[var(--color-text)] transition-all duration-200 z-10"
        >
          <X size={18} />
        </button>

        {/* Step indicator — fixed at top */}
        <div className="shrink-0 flex items-center justify-center gap-2 pt-5 pb-3 px-6">
          {["instructions", "code"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                  step === s
                    ? "bg-[var(--color-primary)] text-white scale-110"
                    : s === "code" && step === "instructions"
                    ? "bg-[var(--color-muted)]/20 text-[var(--color-text-muted)]"
                    : "bg-[var(--color-primary)]/30 text-[var(--color-primary)]"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-200 ${
                  step === s
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {s === "instructions" ? "Instructions" : "Enter Code"}
              </span>
              {i === 0 && (
                <div
                  className={`w-6 h-0.5 rounded-full transition-all duration-300 ${
                    step === "code"
                      ? "bg-[var(--color-primary)]/60"
                      : "bg-[var(--color-muted)]/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content area — fills remaining height, step manages its own scroll */}
        <div className="flex-1 min-h-0 px-6 pb-6">
          {step === "instructions" ? (
            <InstructionsStep
              quiz={quiz}
              onProceed={() => setStep("code")}
              onClose={onClose}
            />
          ) : (
            <CodeStep
              quiz={quiz}
              onSuccess={onSuccess}
              onBack={() => setStep("instructions")}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-3px); }
          90%       { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
};

export default QuizCodeModal;