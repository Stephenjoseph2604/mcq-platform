import { useState, useCallback, useEffect } from "react";
import { Download, Plus, Trash2, Upload, Copy, FileJson } from "lucide-react";
import { categoriesAPI, departmentAPI, questionsAPI } from "../../services/api";

const BulkLoadForm = ({ onLoadQuestions, onCancel, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkMode, setBulkMode] = useState("json");
  const [bulkForm, setBulkForm] = useState({
    category_id: "",
    department_id: "",
    questionsJson: "",
    questions: [],
    typedQuestions: [
      {
        id: 1,
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "",
      },
    ],
  });

  // Fetch categories and departments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, departmentsRes] = await Promise.all([
          categoriesAPI.getAll(),
          departmentAPI.getAll(),
        ]);
        setCategories(categoriesRes.data.data || []);
        setDepartments(departmentsRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories/departments:", error);
      }
    };
    fetchData();
  }, []);

  const parseQuestionsJson = useCallback((jsonText) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        return parsed.map((q, index) => ({
          question_text: q.question_text || q.question || "",
          option_a: q.option_a || q.a || "",
          option_b: q.option_b || q.b || "",
          option_c: q.option_c || q.c || "",
          option_d: q.option_d || q.d || "",
          correct_option: q.correct_option || q.answer || q.correct || "",
        }));
      }
      return [];
    } catch (error) {
      console.error("JSON parse error:", error);
      return [];
    }
  }, []);

  const handleJsonPasteChange = (e) => {
    const jsonText = e.target.value;
    setBulkForm({
      ...bulkForm,
      questionsJson: jsonText,
      questions: parseQuestionsJson(jsonText),
    });
  };

  const copyJsonTemplate = () => {
    const template = JSON.stringify(
      [
        {
          question_text:
            "Which law states that force is proportional to the rate of change of momentum?",
          option_a: "Newton's First Law",
          option_b: "Newton's Second Law",
          option_c: "Newton's Third Law",
          option_d: "Law of Gravitation",
          correct_option: "B",
        },
        {
          question_text: "What is the unit of force?",
          option_a: "Joule",
          option_b: "Newton",
          option_c: "Watt",
          option_d: "Pascal",
          correct_option: "B",
        },
      ],
      null,
      2,
    );
    navigator.clipboard.writeText(template);
  };

  // Helper function to get selected category name
  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(
      (cat) => cat.id == bulkForm.category_id,
    );
    return selectedCategory ? selectedCategory.name : "";
  };

  const handleBulkLoad = async () => {
    if (!bulkForm.category_id) {
      alert("Please select a category");
      return;
    }
    if (getSelectedCategoryName() === "Technical" && !bulkForm.department_id) {
      alert("Please select a department for Technical category");
      return;
    }
    if (!bulkForm.questions?.some((q) => q.question_text.trim())) {
      alert("Please paste at least one question in JSON format");
      return;
    }

    setLoading(true);
    try {
      const validQuestions = bulkForm.questions.filter((q) =>
        q.question_text.trim(),
      );

      // Construct payload with category/department + questions
      const loadData = {
        category_id: parseInt(bulkForm.category_id),
        department_id: bulkForm.department_id
          ? parseInt(bulkForm.department_id)
          : null,
        questions: validQuestions,
      };
      console.log("Submitting bulk load data:", loadData);
      // Call bulk API
      const response = await questionsAPI.bulkUpload(loadData);
      console.log(response);

      if (response.data.success) {
        alert(`Successfully uploaded ${validQuestions.length} questions!`);
      } else {
        const errorData = response.data;
        alert(`Failed to upload: ${errorData.message || "Please try again"}`);
      }
    } catch (error) {
      console.error("Bulk load error:", error);
      alert("Error uploading questions. Check your JSON format and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Type mode handlers (unchanged)
  const addTypedQuestion = () => {
    const newId = Math.max(...bulkForm.typedQuestions.map((q) => q.id), 0) + 1;
    setBulkForm({
      ...bulkForm,
      typedQuestions: [
        ...bulkForm.typedQuestions,
        {
          id: newId,
          question_text: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_option: "",
        },
      ],
    });
  };

  const removeTypedQuestion = (id) => {
    setBulkForm({
      ...bulkForm,
      typedQuestions: bulkForm.typedQuestions.filter((q) => q.id !== id),
    });
  };

  const updateTypedQuestion = (id, field, value) => {
    setBulkForm({
      ...bulkForm,
      typedQuestions: bulkForm.typedQuestions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q,
      ),
    });
  };

  return (
    <div className="bg-[var(--color-card)]/40 border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm space-y-5 sm:space-y-6 max-w-4xl mx-auto relative overflow-hidden">
      {/* Purple Glow Accents */}
      <div className="absolute top-0 right-0 h-20 w-20 bg-[var(--color-secondary)]/10 rounded-bl-2xl blur-2xl -translate-y-6 translate-x-6" />
      <div className="absolute bottom-0 left-0 h-16 w-16 bg-[var(--color-primary)]/10 rounded-tr-2xl blur-xl translate-y-4 -translate-x-4" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent flex items-center gap-2">
          <Upload className="w-5 h-5 text-[var(--color-secondary)]" />
          Bulk Load Questions
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-[var(--color-muted)]/20 hover:scale-105 rounded-xl transition-all duration-200 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] shadow-sm hover:shadow-md"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-xl p-1 backdrop-blur-sm">
        <button
          onClick={() => setBulkMode("json")}
          className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all text-sm flex items-center gap-2 shadow-sm ${
            bulkMode === "json"
              ? "bg-[var(--color-primary)] text-white shadow-lg hover:shadow-xl"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/20"
          }`}
        >
          <FileJson className="w-4 h-4" />
          Paste JSON
        </button>
        <button
          onClick={() => setBulkMode("type")}
          className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all text-sm flex items-center gap-2 shadow-sm ${
            bulkMode === "type"
              ? "bg-[var(--color-primary)] text-white shadow-lg hover:shadow-xl"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/20"
          }`}
        >
          ✏️ Type Questions
        </button>
      </div>

      {/* Category & Department Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-5 bg-[var(--color-card)]/30 rounded-xl border border-[var(--color-muted)]/15 backdrop-blur-sm">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-muted)] mb-2 tracking-wide uppercase">
            Category *
          </label>
          <select
            value={bulkForm.category_id}
            onChange={(e) => {
              const categoryId = e.target.value;
              setBulkForm({
                ...bulkForm,
                category_id: categoryId,
                department_id:
                  getSelectedCategoryName() === "Technical"
                    ? bulkForm.department_id
                    : "",
              });
            }}
            className="w-full px-4 py-3 border border-[var(--color-muted)]/20 rounded-xl focus:ring-3 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] font-medium text-sm shadow-sm hover:shadow-md transition-all"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {getSelectedCategoryName() === "Technical" && (
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-muted)] mb-2 tracking-wide uppercase">
              Department *
            </label>
            <select
              value={bulkForm.department_id}
              onChange={(e) =>
                setBulkForm({ ...bulkForm, department_id: e.target.value })
              }
              className="w-full px-4 py-3 border border-[var(--color-muted)]/20 rounded-xl focus:ring-3 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] font-medium text-sm shadow-sm hover:shadow-md transition-all"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* JSON PASTE MODE */}
      {bulkMode === "json" && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[var(--color-primary)]/20 rounded-2xl p-5 sm:p-6 bg-[var(--color-primary)]/3 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <label className="text-lg font-bold text-[var(--color-primary)] flex items-center gap-2 flex-1">
                📋 Paste Questions JSON Array
              </label>
              <button
                onClick={copyJsonTemplate}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-sm rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold flex-shrink-0"
              >
                <Copy className="w-4 h-4" />
                Copy Template
              </button>
            </div>

            <div className="relative">
              <textarea
                value={bulkForm.questionsJson}
                onChange={handleJsonPasteChange}
                placeholder={`[
  {
    "question_text": "Sample question?",
    "option_a": "Option A",
    "option_b": "Option B", 
    "option_c": "Option C",
    "option_d": "Option D",
    "correct_option": "B"
  }
]`}
                className="w-full h-60 sm:h-64 p-4 sm:p-5 border-2 border-[var(--color-muted)]/15 rounded-xl focus:ring-3 focus:ring-[var(--color-secondary)]/30 focus:border-[var(--color-secondary)]/50 outline-none bg-[var(--color-card)]/70 backdrop-blur-md text-sm resize-vertical font-mono shadow-inner hover:shadow-md transition-all text-[var(--color-text)] placeholder-[var(--color-text-muted)]/40"
              />
              <div className="absolute top-3 right-3 text-xs text-[var(--color-text-muted)] bg-[var(--color-card)]/80 px-2.5 py-1.5 rounded-lg backdrop-blur-sm border border-[var(--color-muted)]/20 shadow-sm">
                {bulkForm.questions.length} questions parsed
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-sm text-[var(--color-text-muted)]">
              ✅ Supports: question_text, option_a/b/c/d, correct_option
              (A/B/C/D)
            </div>
          </div>
        </div>
      )}

      {/* TYPE MODE */}
      {bulkMode === "type" && (
        <div className="space-y-4 max-h-96 overflow-y-auto p-3 sm:p-4 pr-4 sm:pr-6 -mr-1 sm:-mr-2 scrollbar-thin scrollbar-thumb-[var(--color-secondary)]/40 scrollbar-track-[var(--color-card)]">
          {bulkForm.typedQuestions.map((question, index) => (
            <div
              key={question.id}
              className="bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4 group shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-[var(--color-text)] text-base">
                  Question {index + 1}
                </h4>
                {bulkForm.typedQuestions.length > 1 && (
                  <button
                    onClick={() => removeTypedQuestion(question.id)}
                    className="p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 hover:scale-105 rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-md"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <textarea
                  value={question.question_text}
                  onChange={(e) =>
                    updateTypedQuestion(
                      question.id,
                      "question_text",
                      e.target.value,
                    )
                  }
                  placeholder="Enter question text here..."
                  className="w-full h-14 sm:h-16 p-3 border border-[var(--color-muted)]/20 rounded-lg focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-sm text-[var(--color-text)] shadow-sm hover:shadow-md transition-all"
                />

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {["option_a", "option_b", "option_c", "option_d"].map(
                    (field) => (
                      <input
                        key={field}
                        value={question[field]}
                        onChange={(e) =>
                          updateTypedQuestion(
                            question.id,
                            field,
                            e.target.value,
                          )
                        }
                        placeholder={`Option ${field.slice(-1).toUpperCase()}`}
                        className="px-3 py-2.5 border border-[var(--color-muted)]/20 rounded-lg focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-sm text-[var(--color-text)] shadow-sm hover:shadow-md transition-all"
                      />
                    ),
                  )}
                </div>

                <select
                  value={question.correct_option}
                  onChange={(e) =>
                    updateTypedQuestion(
                      question.id,
                      "correct_option",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-2.5 border border-[var(--color-muted)]/20 rounded-lg focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-sm text-[var(--color-text)] shadow-sm hover:shadow-md transition-all"
                >
                  <option value="">Select correct option</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
          ))}

          <button
            onClick={addTypedQuestion}
            className="w-full flex items-center justify-center gap-2 h-11 sm:h-12 border-2 border-dashed border-[var(--color-muted)]/30 rounded-xl text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            Add Another Question
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[var(--color-muted)]/15">
        <button
          onClick={handleBulkLoad}
          disabled={loading || bulkForm.questions.length === 0}
          className="flex-1 h-12 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:bg-[var(--color-muted)]/30 disabled:text-[var(--color-text-muted)] text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 border border-[var(--color-primary)]/20 disabled:cursor-not-allowed"
        >
          {loading ? (
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
              Uploading {bulkForm.questions.length} questions...
            </>
          ) : (
            <>
              <Download size={18} />
              Upload Questions (
              {bulkForm.questions.filter((q) => q.question_text.trim()).length})
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-6 sm:px-8 h-12 bg-[var(--color-muted)]/20 hover:bg-[var(--color-muted)]/40 text-[var(--color-text-muted)] border border-[var(--color-muted)]/30 hover:border-[var(--color-secondary)]/30 text-sm font-semibold rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BulkLoadForm;
