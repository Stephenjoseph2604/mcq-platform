import { useState,useMemo, useRef, useEffect } from "react";
import { Edit3,Search, Clock, BookOpen, Users, Tag, Trash2, AlertTriangle, X, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DeleteConfirmOverlay — user must type the exact quiz title to confirm
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmOverlay = ({ quiz, onConfirm, onCancel }) => {
  const [typed, setTyped] = useState("");
  const inputRef = useRef(null);
  const isMatch = typed === quiz.title;

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
    const handler = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  // live hint: are they on the right track?
  const hint = () => {
    if (typed.length === 0) return null;
    if (isMatch) return null;
    if (quiz.title.startsWith(typed))
      return <span className="text-yellow-400">Keep typing…</span>;
    return <span className="text-red-400">Doesn't match — check and try again.</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-md"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-md bg-[var(--color-card)] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          boxShadow: "0 0 60px rgba(239,68,68,0.13), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Red accent stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500/70 via-red-400 to-red-500/70" />

        {/* Decorative glow */}
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-muted)]/20 hover:text-[var(--color-text)] transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Icon + heading */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] mb-1">
                Delete Quiz?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                This will permanently delete{" "}
                <span className="font-semibold text-[var(--color-text)]">
                  {quiz.title}
                </span>
                {" "}and all its data.{" "}
                <span className="text-red-400 font-semibold">
                  This action cannot be undone.
                </span>
              </p>
            </div>
          </div>

          {/* Confirmation input */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wide">
              Type the quiz title to confirm
            </label>

            {/* Title hint chip */}
            <div className="flex items-center gap-2 px-3 py-2 mb-2.5 bg-[var(--color-bg)]/60 border border-[var(--color-muted)]/20 rounded-lg">
              <span className="text-[11px] text-[var(--color-text-muted)] shrink-0">
                Required:
              </span>
              <code className="text-xs font-mono font-semibold text-[var(--color-text)] truncate">
                {quiz.title}
              </code>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              placeholder="Type the quiz title here…"
              autoComplete="off"
              spellCheck="false"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-[var(--color-bg)]/70 text-[var(--color-text)] placeholder-[var(--color-text-muted)]/30 ${
                typed.length === 0
                  ? "border-[var(--color-muted)]/30 focus:border-[var(--color-muted)]/50"
                  : isMatch
                  ? "border-red-500/70 ring-2 ring-red-500/20"
                  : quiz.title.startsWith(typed)
                  ? "border-yellow-500/40 focus:border-yellow-500/60"
                  : "border-red-500/30 focus:border-red-500/50"
              }`}
            />

            {/* Live hint */}
            <div className="min-h-[18px] mt-1.5 text-[11px] px-0.5">
              {hint()}
              {isMatch && (
                <span className="text-red-400 font-medium">
                  ✓ Title matched — you can now delete.
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5">
            <button
              onClick={onCancel}
              className="flex-1 h-10 rounded-xl border border-[var(--color-muted)]/30 text-[var(--color-text-muted)] hover:bg-[var(--color-muted)]/10 hover:text-[var(--color-text)] text-sm font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => isMatch && onConfirm(quiz.id)}
              disabled={!isMatch}
              className={`flex-1 h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                isMatch
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/30 active:scale-95"
                  : "bg-red-500/15 text-red-400/40 cursor-not-allowed border border-red-500/15"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// QuizGrid
// Props: quizzes, handleEditQuiz, handleDeleteQuiz
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Single quiz card — original markup preserved 1:1
// ─────────────────────────────────────────────────────────────────────────────
const QuizCard = ({ quiz, handleEditQuiz, setDeleteTarget }) => (
  <div
    key={quiz.id}
    className="group bg-[var(--color-card)]/30 relative border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-secondary)]/40"
  >
    {/* Action buttons */}
    <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
      <button
        onClick={() => handleEditQuiz(quiz)}
        className="p-2 rounded-xl backdrop-blur-sm shadow-lg bg-[var(--color-card)]/70 border border-[var(--color-muted)]/20 text-[var(--color-text-muted)] hover:bg-[var(--color-secondary)]/15 hover:border-[var(--color-secondary)]/30 hover:text-[var(--color-secondary)] hover:scale-110 opacity-40 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200"
        title="Edit Quiz"
      >
        <Edit3 size={15} />
      </button>
      <button
        onClick={() => setDeleteTarget(quiz)}
        className="p-2 rounded-xl backdrop-blur-sm shadow-lg bg-[var(--color-card)]/70 border border-[var(--color-muted)]/20 text-[var(--color-text-muted)] hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 hover:scale-110 opacity-40 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200"
        title="Delete Quiz"
      >
        <Trash2 size={15} />
      </button>
    </div>
 
    <div className="h-16 w-16 blur-xl rounded-full bg-[var(--color-secondary)]/30 absolute -top-6 -right-6 pointer-events-none" />
 
    <div className="space-y-6 relative z-10">
      <h3 className="text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-all duration-300 leading-tight pr-20">
        {quiz.title}
      </h3>
 
      <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)] mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[var(--color-secondary)]/70" />
          <span>{quiz.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[var(--color-secondary)]/70" />
          <span>{quiz.totalQuestions} questions</span>
        </div>
      </div>
 
      <div className="flex items-center gap-4 p-4 bg-[var(--color-primary)]/3 border border-[var(--color-secondary)]/20 rounded-xl backdrop-blur-sm">
        <div className="w-2.5 h-2.5 bg-[var(--color-secondary)] rounded-full animate-pulse shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="block text-xs font-medium text-[var(--color-text-muted)]/80 uppercase tracking-wide">Quiz Code</span>
          <span className="block text-lg font-black tracking-wider text-[var(--color-secondary)] truncate">{quiz.quiz_code}</span>
        </div>
        <div className="w-px h-8 bg-[var(--color-muted)]/30 shrink-0" />
        <div className="p-1.5 bg-[var(--color-secondary)]/10 rounded-lg shrink-0">
          <Users className="h-4 w-4 text-[var(--color-text-muted)]" />
        </div>
      </div>
 
      <div className="flex flex-wrap gap-2">
        {quiz.categories.slice(0, 3).map((category, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-xs font-medium rounded-lg hover:bg-[var(--color-secondary)]/20 hover:border-[var(--color-primary)]/40 transition-all duration-200 flex items-center gap-1"
          >
            <Tag className="h-3 w-3 flex-shrink-0" />
            {category.name}
          </span>
        ))}
        {quiz.categories.length > 3 && (
          <span className="px-3 py-1.5 bg-[var(--color-muted)]/20 text-[var(--color-text-muted)] text-xs rounded-lg font-medium border border-[var(--color-muted)]/30">
            +{quiz.categories.length - 3} more
          </span>
        )}
      </div>
    </div>
 
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/8 via-[var(--color-secondary)]/4 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl blur pointer-events-none" />
  </div>
);
 
// ─────────────────────────────────────────────────────────────────────────────
// Table row
// ─────────────────────────────────────────────────────────────────────────────
const QuizTableRow = ({ quiz, index, handleEditQuiz, setDeleteTarget }) => (
  <tr className="group border-b border-[var(--color-muted)]/10 hover:bg-[var(--color-secondary)]/5 transition-all duration-200">
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
        <span className="text-sm font-black tracking-wider text-[var(--color-secondary)]">{quiz.quiz_code}</span>
      </div>
    </td>
    <td className="px-4 py-4 hidden md:table-cell">
      <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
        <Clock className="h-3.5 w-3.5 text-[var(--color-secondary)]/60 shrink-0" />
        {quiz.duration}
      </div>
    </td>
    <td className="px-4 py-4 hidden md:table-cell">
      <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
        <BookOpen className="h-3.5 w-3.5 text-[var(--color-secondary)]/60 shrink-0" />
        {quiz.totalQuestions}
      </div>
    </td>
    <td className="px-4 py-4 hidden lg:table-cell">
      <div className="flex flex-wrap gap-1.5">
        {quiz.categories.slice(0, 2).map((category, i) => (
          <span
            key={i}
            className="px-2.5 py-1 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-xs font-medium rounded-lg flex items-center gap-1"
          >
            <Tag className="h-3 w-3 flex-shrink-0" />
            {category.name}
          </span>
        ))}
        {quiz.categories.length > 2 && (
          <span className="px-2 py-1 bg-[var(--color-muted)]/20 text-[var(--color-text-muted)] text-xs rounded-lg font-medium border border-[var(--color-muted)]/30">
            +{quiz.categories.length - 2}
          </span>
        )}
      </div>
    </td>
    {/* Actions */}
    <td className="px-4 py-4">
      <div className="flex items-center gap-1 justify-end">
        <button
          onClick={() => handleEditQuiz(quiz)}
          className="p-1.5 rounded-lg bg-[var(--color-card)]/70 border border-[var(--color-muted)]/20 text-[var(--color-text-muted)] hover:bg-[var(--color-secondary)]/15 hover:border-[var(--color-secondary)]/30 hover:text-[var(--color-secondary)] hover:scale-110 transition-all duration-200"
          title="Edit Quiz"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => setDeleteTarget(quiz)}
          className="p-1.5 rounded-lg bg-[var(--color-card)]/70 border border-[var(--color-muted)]/20 text-[var(--color-text-muted)] hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 hover:scale-110 transition-all duration-200"
          title="Delete Quiz"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </td>
  </tr>
);
 
// ─────────────────────────────────────────────────────────────────────────────
// Main — original props + original logic untouched
// ─────────────────────────────────────────────────────────────────────────────
const QuizGrid = ({ quizzes, handleEditQuiz, handleDeleteQuiz }) => {
  // ── original state ────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
 
  // ── original confirm handler ──────────────────────────────────────────────
  const onConfirmDelete = (id) => {
    handleDeleteQuiz?.(id);
    setDeleteTarget(null);
  };
 
  // ── new local state ───────────────────────────────────────────────────────
  const [displayMode, setDisplayMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
 
  // All unique category names across quizzes
  const allCategories = useMemo(() => {
    const set = new Set();
    quizzes?.forEach((q) => q.categories?.forEach((c) => set.add(c.name)));
    return ["all", ...Array.from(set).sort()];
  }, [quizzes]);
 
  // Filtered list
  const filtered = useMemo(() => {
    return (quizzes ?? []).filter((q) => {
      if (search) {
        const s = search.toLowerCase();
        if (!q.title?.toLowerCase().includes(s) && !q.quiz_code?.toLowerCase().includes(s))
          return false;
      }
      if (durationFilter !== "all") {
        const mins = typeof q.duration === "number" ? q.duration : parseInt(String(q.duration));
        if (!isNaN(mins)) {
          if (durationFilter === "short"  && mins > 30)                return false;
          if (durationFilter === "medium" && (mins <= 30 || mins > 60)) return false;
          if (durationFilter === "long"   && mins <= 60)               return false;
        }
      }
      if (categoryFilter !== "all" && !q.categories?.some((c) => c.name === categoryFilter))
        return false;
      return true;
    });
  }, [quizzes, search, durationFilter, categoryFilter]);
 
  const hasActiveFilters = search || durationFilter !== "all" || categoryFilter !== "all";
  const clearFilters = () => { setSearch(""); setDurationFilter("all"); setCategoryFilter("all"); };
 
  const durationOptions = [
    { value: "all",    label: "All" },
    { value: "short",  label: "≤ 30 min" },
    { value: "medium", label: "31–60 min" },
    { value: "long",   label: "> 60 min" },
  ];
 
  return (
    <>
      <div className="space-y-4 sm:space-y-5">
 
        {/* ━━━━━━━ Toolbar ━━━━━━━ */}
        <div className="flex flex-col gap-3">
 
          {/* Row 1 */}
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
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
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
              {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] ml-0.5" />}
            </button>
 
            {/* Grid / Table toggle */}
            <div className="flex items-center gap-0.5 p-1 bg-[var(--color-card)]/80 border border-[var(--color-muted)]/20 rounded-xl shrink-0">
              <button
                onClick={() => setDisplayMode("grid")}
                title="Grid view"
                className={`p-1.5 rounded-lg transition-all duration-200 ${displayMode === "grid" ? "bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDisplayMode("table")}
                title="Table view"
                className={`p-1.5 rounded-lg transition-all duration-200 ${displayMode === "table" ? "bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
 
          {/* Row 2: filter panel */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 bg-[var(--color-card)]/50 border border-[var(--color-muted)]/15 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mr-0.5">Duration</span>
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
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Category</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg text-xs border border-[var(--color-muted)]/20 bg-[var(--color-card)]/80 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all max-w-[160px] sm:max-w-[220px]"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat === "all" ? "All categories" : cat}</option>
                  ))}
                </select>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          )}
 
          {/* Result count */}
          <div className="flex items-center justify-between px-0.5">
            <p className="text-xs text-[var(--color-text-muted)]">
              {filtered.length === (quizzes?.length ?? 0) ? (
                <span>{filtered.length} quiz{filtered.length !== 1 ? "zes" : ""}</span>
              ) : (
                <span>
                  <span className="font-semibold text-[var(--color-secondary)]">{filtered.length}</span>
                  {" "}of {quizzes?.length ?? 0} quizzes
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                handleEditQuiz={handleEditQuiz}
                setDeleteTarget={setDeleteTarget}
              />
            ))}
          </div>
        )}
 
        {/* ━━━━━━━ Table view ━━━━━━━ */}
        {displayMode === "table" && filtered.length > 0 && (
          <div className="bg-[var(--color-card)]/30 border border-[var(--color-muted)]/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px]">
                <thead>
                  <tr className="border-b border-[var(--color-muted)]/15 bg-[var(--color-secondary)]/5">
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider w-10">#</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Code</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Duration</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Questions</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Categories</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((quiz, i) => (
                    <QuizTableRow
                      key={quiz.id}
                      quiz={quiz}
                      index={i}
                      handleEditQuiz={handleEditQuiz}
                      setDeleteTarget={setDeleteTarget}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
 
      {/* ── original Delete Confirmation Overlay — untouched ── */}
      {deleteTarget && (
        <DeleteConfirmOverlay
          quiz={deleteTarget}
          onConfirm={onConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};
 
export default QuizGrid;