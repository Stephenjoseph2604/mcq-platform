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
    <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bulk Load Questions
        </h2>
        <button
          onClick={onCancel}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-lg p-1 hover:bg-[var(--color-muted)]/20 rounded-lg"
        >
          ✕
        </button>
      </div>

      {/* Mode Toggle - JSON vs Type */}
      <div className="flex bg-[var(--color-surface)]/50 border border-[var(--color-muted)]/30 rounded-xl p-1">
        <button
          onClick={() => setBulkMode("json")}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm flex items-center gap-2 ${
            bulkMode === "json"
              ? "bg-[var(--color-primary)] text-white shadow-md"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5"
          }`}
        >
          <FileJson className="w-4 h-4" />
          Paste JSON Array
        </button>
        <button
          onClick={() => setBulkMode("type")}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm flex items-center gap-2 ${
            bulkMode === "type"
              ? "bg-[var(--color-primary)] text-white shadow-md"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5"
          }`}
        >
          ✏️ Type Questions
        </button>
      </div>

      {/* Category & Department Selection - ALWAYS VISIBLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[var(--color-surface)]/30 rounded-xl border border-[var(--color-muted)]/20">
        <div>
          <label className="block text-sm font-bold text-[var(--color-text)] mb-2">
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
            className="w-full px-4 py-2.5 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white font-medium"
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
            <label className="block text-sm font-bold text-[var(--color-text)] mb-2">
              Department *
            </label>
            <select
              value={bulkForm.department_id}
              onChange={(e) =>
                setBulkForm({ ...bulkForm, department_id: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white font-medium"
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
          <div className="border border-dashed border-[var(--color-primary)]/30 rounded-2xl p-6 bg-gradient-to-br from-[var(--color-primary)]/5 to-blue-50/50">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-lg font-bold text-[var(--color-primary)] flex items-center gap-2">
                📋 Paste Questions JSON Array Only
              </label>
              <button
                onClick={copyJsonTemplate}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-xl hover:bg-[var(--color-primary)]/90 shadow-lg hover:shadow-xl transition-all font-medium"
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
    "question_text": "Which law states that force is proportional to the rate of change of momentum?",
    "option_a": "Newton's First Law",
    "option_b": "Newton's Second Law", 
    "option_c": "Newton's Third Law",
    "option_d": "Law of Gravitation",
    "correct_option": "B"
  },
  {
    "question_text": "What is the SI unit of force?",
    "option_a": "Joule",
    "option_b": "Newton",
    "option_c": "Watt",
    "option_d": "Pascal",
    "correct_option": "B"
  }
]`}
                className="w-full h-64 p-5 border-2 border-dashed border-[var(--color-muted)]/20 rounded-xl focus:ring-3 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/50 outline-none bg-white/90 text-sm resize-vertical font-mono shadow-inner"
              />
              <div className="absolute top-3 right-3 text-xs text-[var(--color-text-muted)] bg-black/5 px-2 py-1 rounded-lg backdrop-blur-sm">
                {bulkForm.questions.length} questions parsed
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3">
              <span className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-1">
                ✅ Supports: question_text/question, option_a/a, option_b/b,
                etc.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TYPE MODE - Unchanged from previous */}
      {bulkMode === "type" && (
        <div className="space-y-4 max-h-96 overflow-y-auto p-2">
          {bulkForm.typedQuestions.map((question, index) => (
            <div
              key={question.id}
              className="bg-[var(--color-surface)]/50 border border-[var(--color-muted)]/30 rounded-xl p-5 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-[var(--color-text)]">
                  Question {index + 1}
                </h4>
                {bulkForm.typedQuestions.length > 1 && (
                  <button
                    onClick={() => removeTypedQuestion(question.id)}
                    className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                  className="w-full h-16 p-3 border border-[var(--color-muted)]/30 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white text-sm"
                />

                <div className="grid grid-cols-2 gap-3">
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
                        className="px-3 py-2.5 border border-[var(--color-muted)]/30 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white"
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
                  className="w-full px-3 py-2.5 border border-[var(--color-muted)]/30 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white"
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
            className="w-full flex items-center justify-center gap-2 h-12 border-2 border-dashed border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all font-medium"
          >
            <Plus size={18} />
            Add Another Question
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[var(--color-muted)]/20">
        <button
          onClick={handleBulkLoad}
          disabled={loading || bulkForm.questions.length === 0}
          className="flex-1 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white rounded-xl font-semibold hover:from-[var(--color-primary)]/90 hover:to-[var(--color-primary)] disabled:bg-[var(--color-muted)] disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          className="px-8 h-12 bg-gray-500/20 text-[var(--color-text)] border border-[var(--color-muted)]/30 rounded-xl hover:bg-gray-500/30 transition-all font-medium flex items-center justify-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BulkLoadForm;
