import { useState, useRef, useEffect } from "react";
import { Tag, Search, X, Check, Clock, FileText, Trash2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CreateQuizForm
// Drop-in replacement for the {showCreateForm && (...)} block.
// Props: showCreateForm, editQuiz, formData, setFormData, categories,
//        saving, handleCreateQuiz, handleSaveEditQuiz,
//        setShowCreateForm, setEditQuiz
// ─────────────────────────────────────────────────────────────────────────────
const CreateQuizForm = ({
  showCreateForm,
  editQuiz,
  formData,
  setFormData,
  categories = [],
  saving,
  handleCreateQuiz,
  handleSaveEditQuiz,
  setShowCreateForm,
  setEditQuiz,
}) => {
  const [categorySearch, setCategorySearch] = useState("");
  const searchRef = useRef(null);

  // Reset search when form opens/closes
  useEffect(() => {
    if (!showCreateForm) setCategorySearch("");
  }, [showCreateForm]);

  if (!showCreateForm) return null;

  /* ── helpers ── */
  const isAdded = (id) => formData.config.some((c) => c.category_id === id);

  const toggleCategory = (categoryId) => {
    if (isAdded(categoryId)) {
      setFormData({
        ...formData,
        config: formData.config.filter((c) => c.category_id !== categoryId),
      });
    } else {
      setFormData({
        ...formData,
        config: [
          ...formData.config,
          { category_id: categoryId, question_count: 10 },
        ],
      });
    }
  };

  const handleClose = () => {
    setShowCreateForm(false);
    setEditQuiz(null);
    setCategorySearch("");
    setFormData({ title: "", duration: 60, rules: [], config: [] });
  };

  // filtered list for the tag grid
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const totalQuestions = formData.config.reduce(
    (s, c) => s + (parseInt(c.question_count) || 0),
    0
  );

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/20 rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 h-20 w-20 bg-[var(--color-secondary)]/15 rounded-bl-2xl blur-xl -translate-y-6 translate-x-6 hidden sm:block pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-16 w-16 bg-[var(--color-primary)]/15 rounded-tr-2xl blur-lg translate-y-4 -translate-x-4 hidden sm:block pointer-events-none" />

      {/* ━━━━━━━━ Scrollable body ━━━━━━━━ */}
      <div className="relative z-10 max-h-[82vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-primary)]/40 scrollbar-track-transparent p-4 sm:p-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[var(--color-primary)] rounded-lg sm:rounded-xl flex items-center justify-center shadow-xl shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent leading-tight">
              {editQuiz ? "Edit Quiz" : "Create New Quiz"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-[var(--color-primary)]/20 hover:scale-105 rounded-lg sm:rounded-xl transition-all duration-200 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Title + Duration ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 tracking-wide uppercase">
              Quiz Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-[var(--color-muted)]/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80  text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 transition-all shadow-sm hover:shadow-md text-sm"
              placeholder="e.g. Mid-term Aptitude Test"
            />
          </div>
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 tracking-wide uppercase">
              Duration (minutes)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center pointer-events-none">
                <Clock className="w-3 h-3 text-[var(--color-secondary)]" />
              </div>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
                className="w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-[var(--color-muted)]/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80  text-[var(--color-text)] transition-all shadow-sm hover:shadow-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Categories section ── */}
        <div className="pt-4 sm:pt-5 border-t border-[var(--color-muted)]/10">

          {/* Section heading */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[var(--color-primary)]/20 border border-[var(--color-secondary)]/30 rounded-md sm:rounded-lg flex items-center justify-center shrink-0">
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-secondary)]" />
            </div>
            <span className="text-sm sm:text-base font-bold text-[var(--color-text)]">
              Categories
            </span>
            {formData.config.length > 0 && (
              <span className="ml-auto text-[10px] sm:text-xs px-2 py-0.5 bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/25 text-[var(--color-primary)] rounded-full font-semibold shrink-0">
                {formData.config.length} selected
              </span>
            )}
          </div>

          {/* Search filter bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Filter categories…"
              className="w-full pl-9 pr-8 py-2 sm:py-2.5 border border-[var(--color-muted)]/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80  text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 transition-all text-xs sm:text-sm"
            />
            {categorySearch && (
              <button
                onClick={() => setCategorySearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ── Category tag grid (always visible, filtered by search) ── */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-5 text-xs text-[var(--color-text-muted)]">
              No categories match &ldquo;{categorySearch}&rdquo;
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
              {filteredCategories.map((category) => {
                const added = isAdded(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-1.5 shadow-sm hover:shadow-md ${
                      added
                        ? "bg-[var(--color-primary)] text-white hover:scale-105 border border-[var(--color-primary)]/50"
                        : "bg-[var(--color-card)]/70 text-[var(--color-text-muted)] border border-[var(--color-muted)]/20 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                    }`}
                  >
                    <Tag
                      className={`w-3 h-3 shrink-0 ${added ? "text-white/80" : ""}`}
                    />
                    {/* Full name — no truncation in the tag */}
                    <span>{category.name}</span>
                    {added && (
                      <Check className="w-3 h-3 ml-0.5 shrink-0 text-white/90" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Config rows — question count per selected category ── */}
          {formData.config.length > 0 && (
            <div className="border-t border-[var(--color-muted)]/10 pt-3 mt-1">
              <p className="text-[10px] sm:text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                Questions per category
              </p>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--color-primary)]/40 scrollbar-track-transparent">
                {formData.config.map((cfg, index) => {
                  const categoryName =
                    categories.find((cat) => cat.id === cfg.category_id)
                      ?.name || "Unknown";
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border border-[var(--color-muted)]/15 rounded-lg sm:rounded-xl bg-[var(--color-card)]/50 backdrop-blur-sm hover:border-[var(--color-primary)]/30 transition-all group"
                    >
                      {/* Category badge — full name, wraps if needed */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 text-[var(--color-primary)] text-[11px] sm:text-xs font-semibold rounded-lg shrink-0 max-w-[45%]">
                        <Tag className="w-3 h-3 shrink-0" />
                        <span className="truncate" title={categoryName}>
                          {categoryName}
                        </span>
                      </div>

                      {/* Count input */}
                      <input
                        type="number"
                        value={cfg.question_count}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            config: formData.config.map((c, i) =>
                              i === index
                                ? {
                                    ...c,
                                    question_count:
                                      parseInt(e.target.value) || 0,
                                  }
                                : c
                            ),
                          })
                        }
                        min="0"
                        placeholder="Count"
                        className="flex-1 min-w-0 px-2.5 py-1.5 sm:py-2 border border-[var(--color-muted)]/15 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]/40 outline-none bg-[var(--color-card)]/70 text-xs sm:text-sm font-medium text-[var(--color-text)] transition-all"
                      />

                      {/* Remove — appears on hover */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cfg.category_id)}
                        className="shrink-0 p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Total badge */}
              <div className="flex justify-end mt-2">
                <span className="text-[10px] sm:text-xs text-[var(--color-text-muted)] px-2.5 py-1 bg-[var(--color-bg)]/60 border border-[var(--color-muted)]/15 rounded-lg">
                  Total:{" "}
                  <span className="font-bold text-[var(--color-primary)]">
                    {totalQuestions}
                  </span>{" "}
                  questions
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Submit button — always at bottom of scroll area ── */}
        <div className="flex gap-2 sm:gap-3 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[var(--color-muted)]/10">
          <button
            type="button"
            onClick={editQuiz ? handleSaveEditQuiz : handleCreateQuiz}
            disabled={saving}
            className="flex-1 h-10 sm:h-11 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:opacity-60 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 border border-[var(--color-primary)]/30"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{editQuiz ? "Saving…" : "Creating…"}</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{editQuiz ? "Save Changes" : "Create Quiz"}</span>
              </>
            )}
          </button>
        </div>

      </div>{/* end scrollable body */}
    </div>
  );
};

export default CreateQuizForm;