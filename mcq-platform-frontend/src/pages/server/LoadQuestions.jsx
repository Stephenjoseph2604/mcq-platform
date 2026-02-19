import { useState } from "react";
import {
  BookOpen,
  Edit3,
  Trash2,
  Download,
  CheckCircle,
  Plus,
  Users,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("categories"); // "categories" | "bulk-load" | "questions"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Add bulkMode state
  const [bulkMode, setBulkMode] = useState("paste"); // "paste" | "type"

  // Update initial bulkForm state
  const [bulkForm, setBulkForm] = useState({
    category_id: "",
    department_id: "",
    bulkQuestions: "",
    questions: [],
  });

  // Get questions for clicked category
  const loadCategoryQuestions = () => {
    if (selectedCategory?.id === 4 && !selectedDepartment) {
      alert("Please select a department for Technical category");
      return;
    }

    let categoryQuestions = [];
    if (selectedCategory.id !== 4) {
      // Non-technical categories
      categoryQuestions = sampleQuestionsData[selectedCategory.id] || [];
    } else {
      // Technical category
      categoryQuestions = sampleQuestionsData[4][selectedDepartment.id] || [];
    }

    setQuestions(categoryQuestions);
    setActiveTab("questions");
  };

  // Update handleBulkCategoryChange
  const handleBulkCategoryChange = (categoryId) => {
    const category = categories.find((c) => c.id === parseInt(categoryId));
    setBulkForm({
      ...bulkForm,
      category_id: categoryId,
      department_id: categoryId === "4" ? "" : null,
      questions: categoryId === "4" ? bulkForm.questions || [] : [],
    });
  };

  const parseBulkQuestions = (text) => {
    // Simple parsing: each question separated by ---, options by new lines
    const questionsArray = text
      .split("---")
      .map((q) => q.trim())
      .filter((q) => q);
    return questionsArray
      .map((qText, index) => {
        const lines = qText
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l);
        if (lines.length >= 6) {
          return {
            question_text: lines[0],
            option_a: lines[1],
            option_b: lines[2],
            option_c: lines[3],
            option_d: lines[4],
            correct_option: lines[5],
          };
        }
        return null;
      })
      .filter((q) => q);
  };

  // Update handleBulkLoad
  const handleBulkLoad = () => {
    if (!bulkForm.category_id) {
      alert("Please select a category");
      return;
    }
    if (bulkForm.category_id === "4" && !bulkForm.department_id) {
      alert("Please select a department for Technical category");
      return;
    }
    if (!bulkForm.questions?.some((q) => q.question_text.trim())) {
      alert("Please enter at least one question");
      return;
    }

    const validQuestions = bulkForm.questions.filter((q) =>
      q.question_text.trim(),
    );
    const loadData = {
      category_id: parseInt(bulkForm.category_id),
      department_id: bulkForm.department_id
        ? parseInt(bulkForm.department_id)
        : null,
      questions: validQuestions,
    };

    console.log("BULK LOAD JSON:", JSON.stringify(loadData, null, 2));
    setQuestions(validQuestions);
    setActiveTab("questions");
  };

  const handleEditQuestion = (question, index) => {
    setEditingQuestion({ ...question, index });
  };

  const handleSaveQuestion = (updatedQuestion) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === editingQuestion.index ? updatedQuestion : q)),
    );
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const departments = categories.find((c) => c.id === 4)?.departments || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
          Load Questions
        </h1>
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

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => {
                setSelectedCategory(category);
                if (category.id !== 4) setSelectedDepartment(null);
              }}
              className={`group bg-[var(--color-card)] border-2 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden ${
                selectedCategory?.id === category.id
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30 bg-[var(--color-primary)]/5"
                  : "border-[var(--color-muted)]/50 hover:border-[var(--color-primary)]/30"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--color-primary)]/20 border-2 border-[var(--color-primary)]/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text)] text-lg">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {category.questionCount} questions
                    </p>
                  </div>
                </div>
                {selectedCategory?.id === category.id && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>

              {category.id === 4 && selectedCategory?.id === category.id && (
                <div className="mt-4 pt-4 border-t border-[var(--color-muted)]/30">
                  <select
                    value={selectedDepartment?.id || ""}
                    onChange={(e) => {
                      const dept = category.departments.find(
                        (d) => d.id === parseInt(e.target.value),
                      );
                      setSelectedDepartment(dept);
                    }}
                    className="w-full px-4 py-2 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white text-sm"
                  >
                    <option value="">Select Department (CSE, ECE, MECH)</option>
                    {category.departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
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
                  className="mt-4 w-full bg-[var(--color-primary)] text-white rounded-xl py-2.5 font-semibold hover:bg-[var(--color-primary)]/90 transition-all shadow-lg hover:shadow-xl"
                >
                  View Questions
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bulk Load Tab - DUAL MODE */}
      {activeTab === "bulk-load" && (
        <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              Add Questions
            </h2>
            <button
              onClick={() => setActiveTab("categories")}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          {/* Toggle between Paste vs Type */}
          <div className="flex bg-[var(--color-surface)]/50 border border-[var(--color-muted)]/30 rounded-xl p-1">
            <button
              onClick={() => setBulkMode("paste")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm ${
                bulkMode === "paste"
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5"
              }`}
            >
              📋 Paste Questions
            </button>
            <button
              onClick={() => setBulkMode("type")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm ${
                bulkMode === "type"
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5"
              }`}
            >
              ✏️ Type Questions
            </button>
          </div>

          {/* Category & Department Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                Category *
              </label>
              <select
                value={bulkForm.category_id}
                onChange={(e) => handleBulkCategoryChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white"
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

            {bulkForm.category_id === "4" && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                  Department *
                </label>
                <select
                  value={bulkForm.department_id}
                  onChange={(e) =>
                    setBulkForm({ ...bulkForm, department_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white"
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

          {/* PASTE MODE */}
          {bulkMode === "paste" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2">
                    📋 Paste Questions Here
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      Format: Question→A→B→C→D→Answer (--- separator)
                    </span>
                  </label>

                  {/* AI Spark Icon - Copy Prompt */}
                  <button
                    onClick={() => {
                      const aiPrompt = `Generate 10 ${categories.find((c) => c.id === parseInt(bulkForm.category_id))?.name || "technical"} MCQ questions with 4 options (A,B,C,D) and correct answer. Format each question like this:

What does CPU stand for?
A: Central Processing Unit
B: Computer Processing Unit  
C: Central Programming Unit
D: Control Processing Unit
A

---
Next question...
A: Option A
B: Option B
C: Option C
D: Option D
B

Separate each question with "---"`;

                      navigator.clipboard.writeText(aiPrompt).then(() => {
                        // Show toast/copy feedback
                        const button = event.target;
                        const originalText = button.innerHTML;
                        button.innerHTML =
                          '<span class="text-green-500">✓ Copied!</span>';
                        button.classList.add(
                          "bg-green-500/20",
                          "text-green-600",
                        );
                        setTimeout(() => {
                          button.innerHTML = originalText;
                          button.classList.remove(
                            "bg-green-500/20",
                            "text-green-600",
                          );
                        }, 1500);
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-600 hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-500/30 hover:shadow-lg rounded-xl transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95 group relative overflow-hidden"
                    title="Copy AI prompt for question generation"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    AI Prompt
                  </button>
                </div>

                <textarea
                  value={bulkForm.bulkQuestions || ""}
                  onChange={(e) =>
                    setBulkForm({ ...bulkForm, bulkQuestions: e.target.value })
                  }
                  placeholder={`What does CPU stand for?
A: Central Processing Unit
B: Computer Processing Unit
C: Central Programming Unit
D: Control Processing Unit
A

---
Which data structure follows FIFO?
A: Stack
B: Queue
C: Tree
D: Graph
B`}
                  className="w-full h-48 p-4 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white text-sm resize-vertical font-mono"
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  Questions loaded:{" "}
                  {parseBulkQuestions(bulkForm.bulkQuestions || "").length}
                </p>
              </div>
            </div>
          )}

          {/* TYPE MODE */}
          {bulkMode === "type" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[var(--color-text-muted)]">
                Questions ({bulkForm.questions?.length || 0})
              </label>

              {bulkForm.questions?.map((question, index) => (
                <div
                  key={index}
                  className="p-4 border border-[var(--color-muted)]/30 rounded-xl bg-white"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <textarea
                      value={question.question_text}
                      onChange={(e) => {
                        const newQuestions = [...(bulkForm.questions || [])];
                        newQuestions[index].question_text = e.target.value;
                        setBulkForm({ ...bulkForm, questions: newQuestions });
                      }}
                      placeholder="Enter question..."
                      className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none resize-vertical min-h-[80px] text-sm col-span-2 lg:col-span-2"
                      rows={3}
                    />

                    <div className="space-y-2">
                      <input
                        value={question.option_a}
                        onChange={(e) => {
                          const newQuestions = [...(bulkForm.questions || [])];
                          newQuestions[index].option_a = e.target.value;
                          setBulkForm({ ...bulkForm, questions: newQuestions });
                        }}
                        placeholder="Option A *"
                        className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
                      />
                      <input
                        value={question.option_b}
                        onChange={(e) => {
                          const newQuestions = [...(bulkForm.questions || [])];
                          newQuestions[index].option_b = e.target.value;
                          setBulkForm({ ...bulkForm, questions: newQuestions });
                        }}
                        placeholder="Option B *"
                        className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <input
                        value={question.option_c}
                        onChange={(e) => {
                          const newQuestions = [...(bulkForm.questions || [])];
                          newQuestions[index].option_c = e.target.value;
                          setBulkForm({ ...bulkForm, questions: newQuestions });
                        }}
                        placeholder="Option C *"
                        className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
                      />
                      <input
                        value={question.option_d}
                        onChange={(e) => {
                          const newQuestions = [...(bulkForm.questions || [])];
                          newQuestions[index].option_d = e.target.value;
                          setBulkForm({ ...bulkForm, questions: newQuestions });
                        }}
                        placeholder="Option D *"
                        className="w-full p-3 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-muted)]/30">
                    <select
                      value={question.correct_option}
                      onChange={(e) => {
                        const newQuestions = [...(bulkForm.questions || [])];
                        newQuestions[index].correct_option = e.target.value;
                        setBulkForm({ ...bulkForm, questions: newQuestions });
                      }}
                      className="px-4 py-2 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 bg-white text-sm font-medium"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        const newQuestions = [...(bulkForm.questions || [])];
                        newQuestions.splice(index, 1);
                        setBulkForm({ ...bulkForm, questions: newQuestions });
                      }}
                      className="px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all font-medium flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Question */}
              <button
                onClick={() => {
                  const newQuestions = [...(bulkForm.questions || [])];
                  newQuestions.push({
                    question_text: "",
                    option_a: "",
                    option_b: "",
                    option_c: "",
                    option_d: "",
                    correct_option: "A",
                  });
                  setBulkForm({ ...bulkForm, questions: newQuestions });
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 border-2 border-dashed border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:border-[var(--color-primary)] rounded-xl transition-all font-medium hover:bg-[var(--color-primary)]/5"
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleBulkLoad}
              disabled={
                !bulkForm.category_id ||
                (bulkMode === "paste" && !bulkForm.bulkQuestions?.trim()) ||
                (bulkMode === "type" &&
                  !bulkForm.questions?.some((q) => q.question_text.trim()))
              }
              className="flex-1 h-12 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Load Questions
              {bulkMode === "paste"
                ? `(${parseBulkQuestions(bulkForm.bulkQuestions || "").length})`
                : `(${bulkForm.questions?.length || 0})`}
            </button>
            <button
              onClick={() => {
                setBulkForm({
                  category_id: "",
                  department_id: "",
                  bulkQuestions: "",
                  questions: [],
                });
                setBulkMode("paste");
                setActiveTab("categories");
              }}
              className="px-8 h-12 bg-gray-500/20 text-[var(--color-text)] border border-[var(--color-muted)]/30 rounded-xl hover:bg-gray-500/30 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === "questions" && questions.length > 0 && (
        <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              Questions ({questions.length})
            </h2>
            <button
              onClick={() => {
                setQuestions([]);
                setActiveTab("categories");
              }}
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
                          <span className="font-medium text-[var(--color-text)]">
                            A:
                          </span>{" "}
                          {question.option_a}
                        </div>
                        <div>
                          <span className="font-medium text-[var(--color-text)]">
                            B:
                          </span>{" "}
                          {question.option_b}
                        </div>
                        <div>
                          <span className="font-medium text-[var(--color-text)]">
                            C:
                          </span>{" "}
                          {question.option_c}
                        </div>
                        <div>
                          <span className="font-medium text-[var(--color-text)]">
                            D:
                          </span>{" "}
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
      )}
    </div>
  );
};
