import { useState } from "react";
import { Trash2, Edit3 } from "lucide-react";

const QuestionsList = ({ questions, onClearAll, onUpdateQuestions }) => {
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleEditQuestion = (question, index) => {
    setEditingQuestion({ ...question, index });
  };

  const handleSaveQuestion = (updatedQuestion) => {
    onUpdateQuestions((prev) =>
      prev.map((q, i) => (i === editingQuestion.index ? updatedQuestion : q))
    );
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (index) => {
    onUpdateQuestions((prev) => prev.filter((_, i) => i !== index));
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
            key={index}
            className="border border-[var(--color-muted)]/30 rounded-xl p-5 hover:bg-[var(--color-surface)]/50 transition-all"
          >
            {editingQuestion?.index === index ? (
              <div className="space-y-4">
                <textarea
                  value={editingQuestion.question_text}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question_text: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none resize-vertical min-h-[80px] text-sm"
                  placeholder="Enter question..."
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
                    className="px-4 py-2 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 bg-white"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                  <button
                    onClick={() => handleSaveQuestion(editingQuestion)}
                    className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-medium shadow-lg hover:shadow-xl"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingQuestion(null)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-medium"
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
                      <span className="font-medium text-[var(--color-text)]">A:</span> {question.option_a}
                    </div>
                    <div>
                      <span className="font-medium text-[var(--color-text)]">B:</span> {question.option_b}
                    </div>
                    <div>
                      <span className="font-medium text-[var(--color-text)]">C:</span> {question.option_c}
                    </div>
                    <div>
                      <span className="font-medium text-[var(--color-text)]">D:</span> {question.option_d}
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
                    onClick={() => handleDeleteQuestion(index)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                    title="Delete"
                  >
                    <Trash2 size={16} />
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
