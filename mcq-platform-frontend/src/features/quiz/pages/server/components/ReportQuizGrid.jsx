// ReportQuizGrid.jsx
import { useState, useMemo } from "react";
import { Users, Tag, Search, X, LayoutGrid, List, Clock, ChevronRight, SlidersHorizontal } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Shared badge
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ children }) => (
  <span className="px-2.5 sm:px-3 py-1.5 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-xs font-medium rounded-lg flex items-center gap-1 shadow-sm hover:shadow-md transition-all flex-shrink-0">
    <Tag className="h-3 w-3" />
    {children}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// Grid card  — original markup preserved 1:1, onClick wired through prop
// ─────────────────────────────────────────────────────────────────────────────
const QuizCard = ({ quiz, onCardClick }) => (
  <div
    key={quiz.id}
    onClick={() => onCardClick(quiz)}
    className="group bg-[var(--color-card)]/50 relative border border-[var(--color-muted)]/20 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-secondary)]/30 cursor-pointer"
  >
    {/* Luxury Purple Blobs */}
    <div className="h-14 sm:h-16 w-14 sm:w-16 blur-xl bg-[var(--color-secondary)]/25 absolute -top-5 sm:-top-6 -right-5 sm:-right-6" />
    <div className="h-10 w-10 blur-lg bg-[var(--color-primary)]/20 absolute top-2 right-2" />

    <div className="space-y-4 sm:space-y-6 relative z-10">
      {/* Header */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-all duration-300 leading-tight">
            {quiz.title}
          </h3>
          <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-secondary)]" />
          </div>
        </div>

        {/* Quiz Code & Stats */}
        <div className="flex flex-col gap-3">
          {/* Quiz Code */}
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[var(--color-primary)]/5 border border-[var(--color-secondary)]/15 rounded-xl backdrop-blur-sm">
            <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-pulse" />
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-medium text-[var(--color-text-muted)]/80 uppercase tracking-wide">
                Quiz Code
              </span>
              <span className="block text-base sm:text-lg font-black tracking-wider text-[var(--color-secondary)] truncate">
                {quiz.quiz_code}
              </span>
            </div>
            <div className="w-px h-7 bg-[var(--color-muted)]/30" />
            <div className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium flex items-center gap-1">
              <Users className="h-3 w-3" />
              {quiz.totalStudents}
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/15 rounded-xl backdrop-blur-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-[var(--color-text-muted)]/80 uppercase tracking-wide">
                Duration
              </span>
              <span className="block text-base sm:text-lg font-semibold text-[var(--color-secondary)]">
                {quiz.duration}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {quiz.categories.slice(0, 3).map((cat, i) => (
          <span
            key={i}
            className="px-2.5 sm:px-3 py-1.5 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-xs font-medium rounded-lg flex items-center gap-1 shadow-sm hover:shadow-md transition-all flex-shrink-0"
          >
            <Tag className="h-3 w-3" />
            {cat}
          </span>
        ))}
        {quiz.categories.length > 3 && (
          <span className="px-2.5 sm:px-3 py-1.5 bg-[var(--color-muted)]/20 text-[var(--color-text-muted)] text-xs rounded-lg font-medium border border-[var(--color-muted)]/30 shadow-sm">
            +{quiz.categories.length - 3} more
          </span>
        )}
      </div>
    </div>

    {/* Luxury Purple Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/8 via-[var(--color-secondary)]/4 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl blur pointer-events-none" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Table row
// ─────────────────────────────────────────────────────────────────────────────
const QuizTableRow = ({ quiz, index, onCardClick }) => (
  <tr
    onClick={() => onCardClick(quiz)}
    className="group border-b border-[var(--color-muted)]/10 hover:bg-[var(--color-secondary)]/5 transition-all duration-200 cursor-pointer"
  >
    <td className="px-4 py-4 text-xs text-[var(--color-text-muted)] font-mono w-10">
      {String(index + 1).padStart(2, "0")}
    </td>
    <td className="px-4 py-4">
      <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-colors duration-200 leading-tight">
        {quiz.title}
      </span>
    </td>
    <td className="px-4 py-4 hidden sm:table-cell">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full animate-pulse shrink-0" />
        <span className="text-sm font-black tracking-wider text-[var(--color-secondary)]">
          {quiz.quiz_code}
        </span>
      </div>
    </td>
    <td className="px-4 py-4 hidden md:table-cell">
      <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
        <Clock className="h-3.5 w-3.5 text-[var(--color-secondary)]/60 shrink-0" />
        {quiz.duration}
      </div>
    </td>
    <td className="px-4 py-4 hidden sm:table-cell">
      <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
        <Users className="h-3.5 w-3.5 text-[var(--color-secondary)]/60 shrink-0" />
        {quiz.totalStudents}
      </div>
    </td>
    <td className="px-4 py-4 hidden lg:table-cell">
      <div className="flex flex-wrap gap-1.5">
        {quiz.categories.slice(0, 2).map((cat, i) => (
          <Badge key={i}>{cat}</Badge>
        ))}
        {quiz.categories.length > 2 && (
          <span className="px-2 py-1 bg-[var(--color-muted)]/20 text-[var(--color-text-muted)] text-xs rounded-lg font-medium border border-[var(--color-muted)]/30">
            +{quiz.categories.length - 2}
          </span>
        )}
      </div>
    </td>
    <td className="px-4 py-4 w-8">
      <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--color-secondary)] transition-all duration-200" />
    </td>
  </tr>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main — all original props kept exactly as-is
// ─────────────────────────────────────────────────────────────────────────────
const ReportQuizGrid = ({
  quizzes = [],
  view,
  setSelectedQuiz,
  setView,
  onQuizClick,
}) => {
  // ── original click logic — untouched ──────────────────────────────────────
  const handleQuizClick = (quiz) => {
    if (onQuizClick) {
      onQuizClick(quiz);
    } else if (setSelectedQuiz && setView) {
      setSelectedQuiz(quiz);
      setView("submissions");
    }
  };

  // ── original guard — untouched ────────────────────────────────────────────
  if (view !== "quizzes") return null;

  // ── new local state (filter + display mode) ───────────────────────────────
  const [displayMode, setDisplayMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // All unique categories across quizzes
  const allCategories = useMemo(() => {
    const set = new Set();
    quizzes.forEach((q) => q.categories?.forEach((c) => set.add(c)));
    return ["all", ...Array.from(set).sort()];
  }, [quizzes]);

  // Filtered list
  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      if (search) {
        const s = search.toLowerCase();
        if (!q.title?.toLowerCase().includes(s) && !q.quiz_code?.toLowerCase().includes(s))
          return false;
      }
      if (durationFilter !== "all") {
        const mins = typeof q.duration === "number" ? q.duration : parseInt(String(q.duration));
        if (!isNaN(mins)) {
          if (durationFilter === "short"  && mins > 30)           return false;
          if (durationFilter === "medium" && (mins <= 30 || mins > 60)) return false;
          if (durationFilter === "long"   && mins <= 60)          return false;
        }
      }
      if (categoryFilter !== "all" && !q.categories?.includes(categoryFilter)) return false;
      return true;
    });
  }, [quizzes, search, durationFilter, categoryFilter]);

  const hasActiveFilters = search || durationFilter !== "all" || categoryFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setDurationFilter("all");
    setCategoryFilter("all");
  };

  const durationOptions = [
    { value: "all",    label: "All" },
    { value: "short",  label: "≤ 30 min" },
    { value: "medium", label: "31–60 min" },
    { value: "long",   label: "> 60 min" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ━━━━━━━ Toolbar ━━━━━━━ */}
      <div className="flex flex-col gap-3">

        {/* Row 1: search + filters toggle + view toggle */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or code…"
              className="w-full pl-9 pr-8 py-2 sm:py-2.5 border border-[var(--color-muted)]/20 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80  text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 text-xs sm:text-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 ${
              showFilters || hasActiveFilters
                ? "bg-[var(--color-secondary)]/15 border-[var(--color-secondary)]/40 text-[var(--color-secondary)]"
                : "border-[var(--color-muted)]/20 bg-[var(--color-card)]/80 text-[var(--color-text-muted)] hover:border-[var(--color-secondary)]/30 hover:text-[var(--color-secondary)]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] ml-0.5" />
            )}
          </button>

          {/* Grid / Table toggle */}
          <div className="flex items-center gap-0.5 p-1 bg-[var(--color-card)]/80 border border-[var(--color-muted)]/20 rounded-xl shrink-0">
            <button
              onClick={() => setDisplayMode("grid")}
              title="Grid view"
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                displayMode === "grid"
                  ? "bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDisplayMode("table")}
              title="Table view"
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                displayMode === "table"
                  ? "bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: expanded filter panel */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 bg-[var(--color-card)]/50 border border-[var(--color-muted)]/15 rounded-xl backdrop-blur-sm">
            {/* Duration pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mr-0.5">
                Duration
              </span>
              {durationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDurationFilter(opt.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    durationFilter === opt.value
                      ? "bg-[var(--color-secondary)]/20 border-[var(--color-secondary)]/40 text-[var(--color-secondary)]"
                      : "border-[var(--color-muted)]/20 text-[var(--color-text-muted)] hover:border-[var(--color-secondary)]/30 hover:text-[var(--color-secondary)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:block w-px h-5 bg-[var(--color-muted)]/20 mx-1" />

            {/* Category select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                Category
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs border border-[var(--color-muted)]/20 bg-[var(--color-card)]/80 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all max-w-[140px] sm:max-w-[200px]"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center justify-between px-0.5">
          <p className="text-xs text-[var(--color-text-muted)]">
            {filtered.length === quizzes.length ? (
              <span>{quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""}</span>
            ) : (
              <span>
                <span className="font-semibold text-[var(--color-secondary)]">{filtered.length}</span>
                {" "}of {quizzes.length} quizzes
              </span>
            )}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[10px] text-[var(--color-secondary)] hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ━━━━━━━ Empty state ━━━━━━━ */}
      {filtered.length === 0 && (
        <div className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-[var(--color-secondary)]/50" />
          </div>
          <p className="text-base font-semibold text-[var(--color-text)] mb-1">No quizzes found</p>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--color-secondary)]/15 border border-[var(--color-secondary)]/30 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/25 transition-all"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ━━━━━━━ Grid view ━━━━━━━ */}
      {displayMode === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onCardClick={handleQuizClick} />
          ))}
        </div>
      )}

      {/* ━━━━━━━ Table view ━━━━━━━ */}
      {displayMode === "table" && filtered.length > 0 && (
        <div className="bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-[var(--color-muted)]/15 bg-[var(--color-secondary)]/5">
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider w-10">#</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Code</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Duration</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Students</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Categories</th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((quiz, i) => (
                  <QuizTableRow key={quiz.id} quiz={quiz} index={i} onCardClick={handleQuizClick} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportQuizGrid;