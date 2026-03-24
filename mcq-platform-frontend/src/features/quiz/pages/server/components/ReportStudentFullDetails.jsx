import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  BookOpen,
  User,
  Clock,
  Target,
  TrendingUp,
  Filter,
  ChevronDown,
  Layers,
} from "lucide-react";
import { reportAPI } from "../../../../../services/api";

// ── Option label pill ─────────────────────────────────────────────────────────
const OptionPill = ({ label, text, state }) => {
  // state: "correct" | "wrong" | "correct-unselected" | "neutral"
  const styles = {
    correct: "bg-[var(--color-success)]/15 border-[var(--color-success)]/50 text-[var(--color-success)]",
    wrong: "bg-[var(--color-danger)]/15 border-[var(--color-danger)]/50 text-[var(--color-danger)]",
    "correct-unselected": "bg-[var(--color-success)]/8 border-[var(--color-success)]/25 text-[var(--color-success)]/70",
    neutral: "bg-[var(--color-card)]/60 border-[var(--color-muted)]/20 text-[var(--color-text-muted)]",
  };

  const labelStyles = {
    correct: "bg-[var(--color-success)] text-white",
    wrong: "bg-[var(--color-danger)] text-white",
    "correct-unselected": "bg-[var(--color-success)]/30 text-[var(--color-success)]",
    neutral: "bg-[var(--color-muted)]/20 text-[var(--color-text-muted)]",
  };

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${styles[state]}`}>
      <span className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${labelStyles[state]}`}>
        {label}
      </span>
      <p className="text-sm leading-relaxed flex-1">{text}</p>
      {state === "correct" && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-success)]" />}
      {state === "wrong" && <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-danger)]" />}
      {state === "correct-unselected" && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-success)]/50" />}
    </div>
  );
};

// ── Single question card ──────────────────────────────────────────────────────
const QuestionCard = ({ question, index }) => {
  const { questionText, options, correctAnswer, studentAnswer, isCorrect, categoryName } = question;

  const getOptionState = (key) => {
    const isThisCorrect = key === correctAnswer;
    const isThisSelected = key === studentAnswer;

    if (isThisSelected && isThisCorrect) return "correct";
    if (isThisSelected && !isThisCorrect) return "wrong";
    if (!isThisSelected && isThisCorrect) return "correct-unselected";
    return "neutral";
  };

  return (
    <div
      className={`relative bg-[var(--color-card)]/60 border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
        isCorrect
          ? "border-[var(--color-success)]/20 hover:border-[var(--color-success)]/35"
          : "border-[var(--color-danger)]/20 hover:border-[var(--color-danger)]/35"
      }`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
          isCorrect ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"
        }`}
      />

      {/* Question header */}
      <div className="flex items-start gap-3 mb-4 pl-2">
        <div
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
            isCorrect
              ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
              : "bg-[var(--color-danger)]/15 text-[var(--color-danger)]"
          }`}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-medium">
              {categoryName}
            </span>
            {isCorrect ? (
              <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success)] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Correct
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-danger)] font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Incorrect
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base font-medium text-[var(--color-text)] leading-relaxed">
            {questionText}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
        {Object.entries(options).map(([key, text]) => (
          <OptionPill
            key={key}
            label={key}
            text={text}
            state={getOptionState(key)}
          />
        ))}
      </div>

      {/* Answer summary row */}
      {!isCorrect && studentAnswer && (
        <div className="mt-3 pl-2 flex items-center gap-4 text-xs flex-wrap">
          <span className="flex items-center gap-1.5 text-[var(--color-danger)]">
            <XCircle className="w-3.5 h-3.5" />
            Your answer: <strong>{studentAnswer}</strong>
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-success)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Correct answer: <strong>{correctAnswer}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

// ── Stat chip ─────────────────────────────────────────────────────────────────
const StatChip = ({ icon: Icon, label, value, color = "primary" }) => {
  const colors = {
    primary: "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)]",
    success: "bg-[var(--color-success)]/10 border-[var(--color-success)]/20 text-[var(--color-success)]",
    danger: "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/20 text-[var(--color-danger)]",
    secondary: "bg-[var(--color-secondary)]/10 border-[var(--color-secondary)]/20 text-[var(--color-secondary)]",
  };
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${colors[color]}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <div>
        <p className="text-xs opacity-70 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold leading-none">{value}</p>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ReportStudentFullDetails = ({ quizId, studentId, studentName, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all"); // "all" | "correct" | "wrong"
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await reportAPI.getStudentReport(quizId, studentId);
        if (res.data?.success) {
          setData(res.data.data);
        } else {
          setError(res.data?.message || "Failed to load report");
        }
      } catch {
        setError("Failed to load student report. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [quizId, studentId]);

  // ── Derived data ────────────────────────────────────────────────────────────
  const categories = data
    ? [...new Set(data.questions.map((q) => q.categoryName))]
    : [];

  const filteredQuestions = data
    ? data.questions.filter((q) => {
        const catMatch = categoryFilter === "all" || q.categoryName === categoryFilter;
        const resMatch =
          resultFilter === "all" ||
          (resultFilter === "correct" && q.isCorrect) ||
          (resultFilter === "wrong" && !q.isCorrect);
        return catMatch && resMatch;
      })
    : [];

  const formatDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const diff = new Date(end) - new Date(start);
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${m}m ${s}s`;
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-all duration-200 p-2 rounded-xl hover:bg-[var(--color-card)]/50"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--color-secondary)]/30 border-t-[var(--color-secondary)] animate-spin" />
            <p className="text-sm text-[var(--color-text-muted)]">Loading full report…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-all duration-200 p-2 rounded-xl hover:bg-[var(--color-card)]/50"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>{error || "No data available"}</p>
        </div>
      </div>
    );
  }

  const totalQ = data.questions.length;
  const correctQ = data.questions.filter((q) => q.isCorrect).length;
  const wrongQ = totalQ - correctQ;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-all duration-200 p-2 -m-2 rounded-xl hover:bg-[var(--color-card)]/50 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Full Report
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm">
              {data.student.name} · {data.student.department}
            </p>
          </div>
        </div>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-2">
          <StatChip icon={Target} label="Score" value={`${correctQ}/${totalQ}`} color="secondary" />
          <StatChip icon={TrendingUp} label="Percentage" value={`${data.attempt.percentage}%`} color={data.attempt.percentage >= 60 ? "success" : "danger"} />
          <StatChip icon={Clock} label="Duration" value={formatDuration(data.attempt.startTime, data.attempt.endTime)} color="primary" />
        </div>
      </div>

      {/* ── Student + attempt summary card ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Student info */}
        <div className="sm:col-span-2 lg:col-span-1 bg-[var(--color-card)]/60 border border-[var(--color-muted)]/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[var(--color-text)] truncate">{data.student.name}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">{data.student.email}</p>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            {data.student.department}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {formatDate(data.attempt.startTime)}
          </p>
        </div>

        {/* Overall score donut-style card */}
        <div className="bg-[var(--color-card)]/60 border border-[var(--color-muted)]/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Overall</p>
          <p className={`text-4xl font-black ${data.attempt.percentage >= 60 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
            {data.attempt.percentage}%
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{data.quiz.title}</p>
        </div>

        {/* Correct */}
        <div className="bg-[var(--color-success)]/8 border border-[var(--color-success)]/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-6 h-6 text-[var(--color-success)] mb-2" />
          <p className="text-3xl font-black text-[var(--color-success)]">{correctQ}</p>
          <p className="text-xs text-[var(--color-success)]/70 mt-1">Correct</p>
          <div className="w-full h-1.5 bg-[var(--color-success)]/15 rounded-full mt-3">
            <div className="h-1.5 bg-[var(--color-success)] rounded-full" style={{ width: `${(correctQ / totalQ) * 100}%` }} />
          </div>
        </div>

        {/* Wrong */}
        <div className="bg-[var(--color-danger)]/8 border border-[var(--color-danger)]/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <XCircle className="w-6 h-6 text-[var(--color-danger)] mb-2" />
          <p className="text-3xl font-black text-[var(--color-danger)]">{wrongQ}</p>
          <p className="text-xs text-[var(--color-danger)]/70 mt-1">Incorrect</p>
          <div className="w-full h-1.5 bg-[var(--color-danger)]/15 rounded-full mt-3">
            <div className="h-1.5 bg-[var(--color-danger)] rounded-full" style={{ width: `${(wrongQ / totalQ) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ── Per-category summary bars ───────────────────────────────────────── */}
      <div className="bg-[var(--color-card)]/60 border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6">
        <h3 className="font-bold text-[var(--color-text)] mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Layers className="w-4 h-4 text-[var(--color-secondary)]" />
          Section Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.sectionSummary.map((sec) => (
            <div key={sec.categoryId} className="flex items-center gap-3">
              <div className="w-24 sm:w-28 shrink-0">
                <p className="text-xs font-medium text-[var(--color-text)] truncate">{sec.categoryName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{sec.correctAnswers}/{sec.totalQuestions}</p>
              </div>
              <div className="flex-1 h-2 bg-[var(--color-muted)]/20 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${sec.percentage >= 60 ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`}
                  style={{ width: `${sec.percentage}%` }}
                />
              </div>
              <span className={`text-xs font-bold w-10 text-right shrink-0 ${sec.percentage >= 60 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
                {sec.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2 text-sm sm:text-base">
          <BookOpen className="w-4 h-4 text-[var(--color-secondary)]" />
          Questions
          <span className="text-xs font-normal text-[var(--color-text-muted)] ml-1">
            ({filteredQuestions.length} shown)
          </span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {/* Result filter pills */}
          {["all", "correct", "wrong"].map((f) => (
            <button
              key={f}
              onClick={() => setResultFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 capitalize ${
                resultFilter === f
                  ? f === "correct"
                    ? "bg-[var(--color-success)]/15 border-[var(--color-success)]/40 text-[var(--color-success)]"
                    : f === "wrong"
                    ? "bg-[var(--color-danger)]/15 border-[var(--color-danger)]/40 text-[var(--color-danger)]"
                    : "bg-[var(--color-secondary)]/15 border-[var(--color-secondary)]/40 text-[var(--color-secondary)]"
                  : "bg-[var(--color-card)]/50 border-[var(--color-muted)]/30 text-[var(--color-text-muted)] hover:bg-[var(--color-card)]"
              }`}
            >
              {f === "all" ? `All (${totalQ})` : f === "correct" ? `Correct (${correctQ})` : `Wrong (${wrongQ})`}
            </button>
          ))}

          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border bg-[var(--color-card)]/50 border-[var(--color-muted)]/30 text-[var(--color-text-muted)] hover:bg-[var(--color-card)] transition-all duration-200"
            >
              <Filter className="w-3.5 h-3.5" />
              {categoryFilter === "all" ? "All Categories" : categoryFilter}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-[var(--color-card)] border border-[var(--color-muted)]/30 rounded-xl shadow-xl z-20 overflow-hidden">
                {["all", ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategoryFilter(cat); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors duration-150 ${
                      categoryFilter === cat
                        ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-medium"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-card)]/80 hover:text-[var(--color-text)]"
                    }`}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Question cards ───────────────────────────────────────────────────── */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No questions match the current filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q, i) => (
            <QuestionCard
              key={q.questionId}
              question={q}
              index={data.questions.indexOf(q)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportStudentFullDetails;