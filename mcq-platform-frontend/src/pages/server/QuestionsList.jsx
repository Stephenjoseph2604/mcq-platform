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
          i === editingQuestion.index ? { ...q, ...changedFields } : q
        )
      );

      setEditingQuestion(null);
    } catch (error) {
      console.error("Save failed:", error);
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
    <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--color-text)]">
          Questions ({questions.length})
        </h2>
        <button
          onClick={onClearAll}
          className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {questions.map((question, index) => (
          <div
            key={question.id} // Changed from index to question.id
            className="border border-[var(--color-muted)]/30 rounded-xl p-5 hover:bg-[var(--color-surface)]/50 transition-all"
          >
            {editingQuestion?.index === index ? (
              <div className="space-y-4">
                <textarea
                  value={editingQuestion.question_text || ""}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question_text: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none resize-vertical min-h-[80px] text-sm"
                  placeholder="Enter question..."
                  disabled={saving}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    value={editingQuestion.option_a || ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        option_a: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
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
                    className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
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
                    className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
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
                    className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
                    placeholder="Option D"
                    disabled={saving}
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <select
                    value={editingQuestion.correct_option || "A"}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        correct_option: e.target.value,
                      })
                    }
                    className="px-4 py-2 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 bg-white text-sm"
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
                    className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[var(--color-text)] mb-3 text-lg leading-tight">
                    Q{index + 1}: {question.question_text}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[var(--color-text-muted)]">
                    <div>
                      <span className="font-medium text-[var(--color-text)]">A:</span>{" "}
                      {question.option_a}
                    </div>
                    <div>
                      <span className="font-medium text-[var(--color-text)]">B:</span>{" "}
                      {question.option_b}
                    </div>
                    <div>
                      <span className="font-medium text-[var(--color-text)]">C:</span>{" "}
                      {question.option_c}
                    </div>
                    <div>
                      <span className="font-medium text-[var(--color-text)]">D:</span>{" "}
                      {question.option_d}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[var(--color-muted)]/30">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      ✓ Correct: <strong>{question.correct_option}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1 flex-shrink-0">
                  <button
                    onClick={() => handleEditQuestion(question, index)}
                    className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-xl transition-all duration-200"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    disabled={deleting === question.id}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all duration-200 disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === question.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
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
