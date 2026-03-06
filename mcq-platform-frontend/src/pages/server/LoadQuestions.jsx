import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, Plus } from "lucide-react";
import BulkLoadForm from "./BulkLoadForm";
import QuestionsList from "./QuestionsList";
import { questionsAPI } from "../../services/api";
import AdminHeader from "../../components/AdminHeader";

const categories = [
  { id: 1, name: "English", questionCount: 25 },
  { id: 2, name: "Aptitude", questionCount: 30 },
  { id: 3, name: "Logical", questionCount: 20 },
  {
    id: 4,
    name: "Technical",
    questionCount: 50,
    departments: [
      { id: 1, name: "CSE", code: "CSE" },
      { id: 2, name: "ECE", code: "ECE" },
      { id: 3, name: "MECH", code: "MECH" },
    ],
  },
];

// Sample questions data
const sampleQuestionsData = {
  1: [
    // English
    {
      question_text: "Choose the correct synonym for 'Happy'",
      option_a: "Sad",
      option_b: "Joyful",
      option_c: "Angry",
      option_d: "Tired",
      correct_option: "B",
    },
  ],
  2: [
    // Aptitude
    {
      question_text: "If 2 + 3 = 10, 7 + 2 = 63, 6 + 5 = 66, then 8 + 4 = ?",
      option_a: "96",
      option_b: "100",
      option_c: "92",
      option_d: "98",
      correct_option: "A",
    },
  ],
  3: [
    // Logical
    {
      question_text: "Find the next number: 2, 4, 8, 16, ?",
      option_a: "24",
      option_b: "32",
      option_c: "28",
      option_d: "30",
      correct_option: "B",
    },
  ],
  4: {
    // Technical - by department
    1: [
      // CSE
      {
        question_text: "What does CPU stand for?",
        option_a: "Central Processing Unit",
        option_b: "Computer Processing Unit",
        option_c: "Central Programming Unit",
        option_d: "Control Processing Unit",
        correct_option: "A",
      },
      {
        question_text: "Which data structure follows FIFO principle?",
        option_a: "Stack",
        option_b: "Queue",
        option_c: "Tree",
        option_d: "Graph",
        correct_option: "B",
      },
    ],
    2: [
      // ECE
      {
        question_text: "What does LED stand for?",
        option_a: "Light Emitting Diode",
        option_b: "Laser Emitting Device",
        option_c: "Light Energy Diode",
        option_d: "Low Energy Device",
        correct_option: "A",
      },
    ],
    3: [
      // MECH
      {
        question_text: "What is the unit of force?",
        option_a: "Watt",
        option_b: "Newton",
        option_c: "Joule",
        option_d: "Pascal",
        correct_option: "B",
      },
    ],
  },
};

export const LoadQuestions = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]); // Now from API
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await questionsAPI.getCategoriesCount();
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const loadCategoryQuestions = async () => {
    if (selectedCategory?.id === 4 && !selectedDepartment) {
      alert("Please select a department for Technical category");
      return;
    }

    try {
      setLoadingQuestions(true);
      const response = await questionsAPI.getQuestionsByCategory(
        selectedCategory.id,
        selectedCategory.id === 4 ? selectedDepartment.department_id : null,
      );

      if (response.data.success) {
        setQuestions(response.data.data);
        setActiveTab("questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleBulkLoad = (newQuestions) => {
    setQuestions(newQuestions);
    setActiveTab("questions");
  };
  // NEW: Update question via API
  const handleUpdateQuestion = async (questionId, updatedFields) => {
    try {
      const response = await questionsAPI.updateQuestion(
        questionId,
        updatedFields,
      );
      if (response.data.success) {
        // Update local state with API response or original data
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId ? { ...q, ...updatedFields } : q,
          ),
        );
        console.log("Question updated successfully");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question");
    }
  };

  // NEW: Delete question via API
  const handleDeleteQuestion = async (questionId) => {
    try {
      const response = await questionsAPI.deleteQuestion(questionId);
      if (response.data.success) {
        // Remove from local state
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
        console.log("Question deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  };

  const handleClearAll = () => {
    setQuestions([]);
    setActiveTab("categories");
  };

  const departments =
    selectedCategory?.id === 4 ? selectedCategory.departments || [] : [];

  if (loadingCategories) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen flex items-center justify-center">
        <div className="text-lg text-[var(--color-text-muted)]">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Header - same as before */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminHeader
          title={"Load Questions"}
          des={"Load the questions for your categories"}
        />
        {activeTab !== "bulk-load" && (
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("bulk-load")}
              className="px-6 py-2.5 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 rounded-xl font-semibold hover:bg-[var(--color-secondary)]/20 transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={18} />
              Bulk Load
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-muted)]/30">
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 px-6 font-medium transition-all ${
            activeTab === "categories"
              ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Categories
        </button>
        {questions.length > 0 && (
          <button
            onClick={() => setActiveTab("questions")}
            className={`pb-3 px-6 font-medium transition-all ml-1 ${
              activeTab === "questions"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Questions ({questions.length})
          </button>
        )}
      </div>

      {/* Categories Tab - Luxury Purple Violet Theme */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => {
                setSelectedCategory(category);

                if (category.name !== "Technical") setSelectedDepartment(null);
              }}
              className={`group bg-[var(--color-card)]/50 border-2 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative ${
                selectedCategory?.id === category.id
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 bg-[var(--color-primary)]/3"
                  : "border-[var(--color-muted)]/20 hover:border-[var(--color-secondary)]/30"
              }`}
            >
              {/* Subtle Purple Glow */}
              <div className="absolute top-0 right-0 h-16 w-16 bg-[var(--color-secondary)]/10 rounded-bl-2xl blur-xl -translate-y-4 translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg border border-[var(--color-secondary)]/30 backdrop-blur-sm ${
                      selectedCategory?.id === category.id
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-primary)]/15"
                    }`}
                  >
                    <BookOpen
                      className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-200 ${
                        selectedCategory?.id === category.id
                          ? "text-white"
                          : "text-[var(--color-secondary)]"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text)] text-base sm:text-lg leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
                      {category.totalQuestions} questions
                    </p>
                  </div>
                </div>
                {selectedCategory?.id === category.id && (
                  <div className="w-7 h-7 sm:w-6 sm:h-6 bg-[var(--color-success)] text-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                )}
              </div>

              {/* Department selector for Technical */}
              {category.id === 4 && selectedCategory?.id === category.id && (
                <div className="mt-4 pt-3 sm:pt-4 border-t border-[var(--color-muted)]/15">
                  <select
                    value={selectedDepartment?.department_id || ""}
                    onChange={(e) => {
                      const dept = category.departments.find(
                        (d) => d.department_id === parseInt(e.target.value),
                      );
                      setSelectedDepartment(dept);
                    }}
                    className="w-full px-3 sm:px-4 py-2.5 border border-[var(--color-muted)]/20 rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80 backdrop-blur-sm text-sm text-[var(--color-text)] shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <option value="">Select Department</option>
                    {category.departments.map((dept) => (
                      <option
                        key={dept.department_id}
                        value={dept.department_id}
                      >
                        {dept.department_name} ({dept.questionCount} Qs)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedCategory?.id === category.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    loadCategoryQuestions();
                  }}
                  disabled={loadingQuestions}
                  className="mt-4 w-full h-10 sm:h-11 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:bg-[var(--color-muted)]/30 disabled:text-[var(--color-text-muted)] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 border border-[var(--color-primary)]/20 disabled:cursor-not-allowed"
                >
                  {loadingQuestions ? (
                    <>
                      <svg
                        className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-spin"
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
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 sm:w-4.5 sm:h-4.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Questions
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bulk Load & Questions Components */}
      {activeTab === "bulk-load" && (
        <BulkLoadForm
          categories={categories}
          departments={departments}
          onLoadQuestions={handleBulkLoad}
          onCancel={() => setActiveTab("categories")}
        />
      )}

      {activeTab === "questions" && questions.length > 0 && (
        <QuestionsList
          questions={questions}
          onClearAll={handleClearAll}
          onUpdateQuestions={setQuestions}
          onApiUpdateQuestion={handleUpdateQuestion}
          onApiDeleteQuestion={handleDeleteQuestion}
        />
      )}
    </div>
  );
};
