import { useState } from "react";
import { Trash2, Edit3 } from "lucide-react";

const QuestionsList = ({
  questions,
  onClearAll,
  onUpdateQuestions,
  onApiUpdateQuestion,
  onApiDeleteQuestion,
}) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleEditQuestion = (question, index) => {
    setEditingQuestion({ ...question, index });
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion?.id) {
      alert("Question ID not found");
      return;
    }

    setSaving(true);

    try {
      // Get original question for comparison
      const originalQuestion = questions[editingQuestion.index];
      const changedFields = {};

      // Only include fields that actually changed
      if (editingQuestion.question_text !== originalQuestion.question_text) {
        changedFields.question_text = editingQuestion.question_text;
      }
      if (editingQuestion.option_a !== originalQuestion.option_a) {
        changedFields.option_a = editingQuestion.option_a;
      }
      if (editingQuestion.option_b !== originalQuestion.option_b) {
        changedFields.option_b = editingQuestion.option_b;
      }
      if (editingQuestion.option_c !== originalQuestion.option_c) {
        changedFields.option_c = editingQuestion.option_c;
      }
      if (editingQuestion.option_d !== originalQuestion.option_d) {
        changedFields.option_d = editingQuestion.option_d;
      }
      if (editingQuestion.correct_option !== originalQuestion.correct_option) {
        changedFields.correct_option = editingQuestion.correct_option;
      }

      // If no changes, just exit edit mode
      if (Object.keys(changedFields).length === 0) {
        setEditingQuestion(null);
        return;
      }

      // Call API with only changed fields
      await onApiUpdateQuestion(editingQuestion.id, changedFields);

      // Optimistically update local state
      onUpdateQuestions((prev) =>
        prev.map((q, i) =>
          i === editingQuestion.index ? { ...q, ...changedFields } : q,
        ),
      );

      setEditingQuestion(null);
    } catch (error) {
      alert("Failed to update question");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    setDeleting(questionId);
    try {
      await onApiDeleteQuestion(questionId);
      // Parent will handle state update
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete question");
    } finally {
      setDeleting(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
      {/* Purple Glow Accent */}
      <div className="absolute top-0 right-0 h-20 w-20 bg-[var(--color-secondary)]/10 rounded-bl-2xl blur-2xl -translate-y-6 translate-x-6" />

      <div className="flex items-center justify-between mb-5 sm:mb-6 relative z-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          Questions ({questions.length})
        </h2>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-danger)]/10 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20 hover:text-[var(--color-danger)] border border-[var(--color-danger)]/20 rounded-xl transition-all duration-200 font-medium text-sm hover:shadow-md shadow-sm"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4 max-h-[550px] sm:max-h-[600px] overflow-y-auto pr-2 sm:pr-3 -mr-2 sm:-mr-3 scrollbar-thin scrollbar-thumb-[var(--color-secondary)]/40 scrollbar-track-[var(--color-card)]">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="group border border-[var(--color-muted)]/15 rounded-xl p-4 sm:p-5 hover:border-[var(--color-secondary)]/20 hover:bg-[var(--color-card)]/30 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {editingQuestion?.index === index ? (
              <div className="space-y-3 sm:space-y-4">
                <textarea
                  value={editingQuestion.question_text || ""}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question_text: e.target.value,
                    })
                  }
                  className="w-full p-3 sm:p-3.5 border border-[var(--color-muted)]/20 rounded-xl focus:ring-3 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/40 outline-none resize-vertical min-h-[75px] sm:min-h-[80px] text-sm bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 shadow-sm hover:shadow-md transition-all"
                  placeholder="Enter question..."
                  disabled={saving}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <input
                    value={editingQuestion.option_a || ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        option_a: e.target.value,
                      })
                    }
                    className="p-3 sm:p-3.5 border border-[var(--color-muted)]/20 rounded-xl focus:ring-3 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/40 outline-none text-sm bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 shadow-sm hover:shadow-md transition-all"
                    placeholder="Option A"
                    disabled={saving}
                  />
                  <input
                    value={editingQuestion.option_b || ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        option_b: e.target.value,
                      })
                    }
                    className="p-3 sm:p-3.5 border border-[var(--color-muted)]/20 rounded-xl focus:ring-3 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/40 outline-none text-sm bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 shadow-sm hover:shadow-md transition-all"
                    placeholder="Option B"
                    disabled={saving}
                  />
                  <input
                    value={editingQuestion.option_c || ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        option_c: e.target.value,
                      })
                    }
                    className="p-3 sm:p-3.5 border border-[var(--color-muted)]/20 rounded-xl focus:ring-3 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/40 outline-none text-sm bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 shadow-sm hover:shadow-md transition-all"
                    placeholder="Option C"
                    disabled={saving}
                  />
                  <input
                    value={editingQuestion.option_d || ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        option_d: e.target.value,
                      })
                    }
                    className="p-3 sm:p-3.5 border border-[var(--color-muted)]/20 rounded-xl focus:ring-3 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/40 outline-none text-sm bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 shadow-sm hover:shadow-md transition-all"
                    placeholder="Option D"
                    disabled={saving}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
                  <select
                    value={editingQuestion.correct_option || "A"}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        correct_option: e.target.value,
                      })
                    }
                    className="px-3 sm:px-4 py-2.5 border border-[var(--color-muted)]/20 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 bg-[var(--color-card)]/80 backdrop-blur-sm text-sm text-[var(--color-text)] shadow-sm hover:shadow-md transition-all flex-1 sm:flex-none"
                    disabled={saving}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                  <button
                    onClick={handleSaveQuestion}
                    disabled={saving}
                    className="px-5 sm:px-6 py-2.5 h-11 bg-[var(--color-success)] hover:bg-[var(--color-success-dark)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-1 sm:flex-none"
                  >
                    {saving ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-5 sm:px-6 py-2.5 h-11 bg-[var(--color-muted)]/30 hover:bg-[var(--color-muted)]/50 text-[var(--color-text-muted)] border border-[var(--color-muted)]/30 hover:border-[var(--color-secondary)]/30 text-sm font-medium rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 flex-1 sm:flex-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[var(--color-text)] mb-2 sm:mb-3 text-base sm:text-lg leading-tight">
                    Q{index + 1}: {question.question_text}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-sm text-[var(--color-text-muted)]">
                    <div className="flex items-center gap-1.5 p-2 bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-lg">
                      <span className="text-[var(--color-secondary)] font-semibold min-w-[16px]">
                        A
                      </span>
                      {question.option_a}
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-lg">
                      <span className="text-[var(--color-secondary)] font-semibold min-w-[16px]">
                        B
                      </span>
                      {question.option_b}
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-lg">
                      <span className="text-[var(--color-secondary)] font-semibold min-w-[16px]">
                        C
                      </span>
                      {question.option_c}
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-lg">
                      <span className="text-[var(--color-secondary)] font-semibold min-w-[16px]">
                        D
                      </span>
                      {question.option_d}
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-muted)]/20">
                    <span className="inline-flex items-center gap-1.5 bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 text-xs px-3 py-1.5 rounded-xl font-semibold backdrop-blur-sm">
                      ✓ Correct:{" "}
                      <strong className="text-[var(--color-success)]">
                        {question.correct_option}
                      </strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 flex-shrink-0">
                  <button
                    onClick={() => handleEditQuestion(question, index)}
                    className="p-2 group-hover:bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/20 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    disabled={deleting === question.id}
                    className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    title="Delete"
                  >
                    {deleting === question.id ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsList;
