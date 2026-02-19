// QuizPage.jsx
import { useState } from "react";
import {
  Plus,
  Edit3,
  Clock,
  BookOpen,
  Tag,
  Play,
  BookPlus,
} from "lucide-react";
import AdminHeader from "../../components/AdminHeader";

const categories = ["English", "Aptitude", "Logical", "Technical"];

export const AdminQuizPage = () => {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "MCQ Placement Test",
      quiz_code: "MCQ2026",
      duration_minutes: 60,
      totalQuestions: 50,
      categories: ["English", "Aptitude", "Logical", "Technical"],
    },
    {
      id: 2,
      title: "Technical Interview Prep",
      quiz_code: "TECH2026",
      duration_minutes: 45,
      totalQuestions: 40,
      categories: ["Technical", "Logical"],
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    quiz_code: "",
    duration_minutes: 60,
    rules: [
      "No switching tabs",
      "No going back once answered",
      "Auto submit on time expiry",
    ],
    config: [
      { category_id: 1, question_count: 10 },
      { category_id: 2, question_count: 10 },
      { category_id: 3, question_count: 10 },
      { category_id: 4, question_count: 20 },
    ],
  });

  const [editQuiz, setEditQuiz] = useState(null);

  // Handle Create Quiz Form
  const handleCreateQuiz = () => {
    console.log("CREATE QUIZ JSON:", JSON.stringify(formData, null, 2));
    const newQuiz = {
      id: Math.max(...quizzes.map((q) => q.id), 0) + 1,
      title: formData.title,
      quiz_code: formData.quiz_code,
      duration_minutes: formData.duration_minutes,
      totalQuestions: formData.config.reduce(
        (sum, c) => sum + c.question_count,
        0,
      ),
      categories: formData.config.map((c) => categories[c.category_id - 1]),
    };
    setQuizzes((prev) => [...prev, newQuiz]);
    setShowCreateForm(false);
    setFormData({
      title: "",
      quiz_code: "",
      duration_minutes: 60,
      rules: [
        "No switching tabs",
        "No going back once answered",
        "Auto submit on time expiry",
      ],
      config: [
        { category_id: 1, question_count: 10 },
        { category_id: 2, question_count: 10 },
        { category_id: 3, question_count: 10 },
        { category_id: 4, question_count: 20 },
      ],
    });
  };

  // Handle Edit Quiz
  const handleEditQuiz = (quiz) => {
    const editData = {
      title: quiz.title,
      duration_minutes: quiz.duration_minutes,
      config: quiz.categories.map((catName, index) => ({
        category_id: categories.indexOf(catName) + 1,
        question_count: 10, // Default, you can make this editable
      })),
    };
    setFormData(editData);
    setEditQuiz(quiz);
    setShowCreateForm(true);
  };

  const handleSaveEditQuiz = () => {
    console.log("EDIT QUIZ JSON:", JSON.stringify(formData, null, 2));
    setQuizzes((prev) =>
      prev.map((q) => (q.id === editQuiz.id ? { ...q, ...formData } : q)),
    );
    setShowCreateForm(false);
    setEditQuiz(null);
    setFormData({
      title: "",
      quiz_code: "",
      duration_minutes: 60,
      rules: [],
      config: [],
    });
  };

  const formatDuration = (minutes) => `${minutes} min`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      
        <AdminHeader title={"Admin Quiz Management"} des={"Create and manage quizzes for students"}/>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary)]/90 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <BookPlus size={18} />
            Create Quiz
          </button>
          <button className="px-6 py-2.5 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 rounded-xl font-semibold hover:bg-[var(--color-secondary)]/20 transition-all duration-200 flex items-center gap-2">
            <BookOpen size={18} />
            Load Questions
          </button>
        </div>
      </div>

      {/* Create/Edit Quiz Form */}
      {showCreateForm && (
        <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {editQuiz ? "Edit Quiz" : "Create New Quiz"}
            </h2>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditQuiz(null);
                setFormData({
                  title: "",
                  quiz_code: "",
                  duration_minutes: 60,
                  rules: [],
                  config: [],
                });
              }}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-[var(--color-surface)]"
                placeholder="Enter quiz title"
              />
            </div>
            {editQuiz ? null : (
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                  Quiz Code
                </label>
                <input
                  type="text"
                  value={formData.quiz_code}
                  onChange={(e) =>
                    setFormData({ ...formData, quiz_code: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-[var(--color-surface)]"
                  placeholder="e.g. MCQ2026"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration_minutes: parseInt(e.target.value),
                  })
                }
                min="1"
                className="w-full px-4 py-2.5 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-[var(--color-surface)]"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-4">
              Category Configuration
            </label>

            {/* Category Tags - Click to Add/Remove */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((categoryName, index) => {
                const categoryId = index + 1;
                const isAdded = formData.config.some(
                  (c) => c.category_id === categoryId,
                );

                return (
                  <button
                    key={categoryId}
                    onClick={() => {
                      if (isAdded) {
                        // Remove category
                        setFormData({
                          ...formData,
                          config: formData.config.filter(
                            (c) => c.category_id !== categoryId,
                          ),
                        });
                      } else {
                        // Add category
                        setFormData({
                          ...formData,
                          config: [
                            ...formData.config,
                            { category_id: categoryId, question_count: 10 },
                          ],
                        });
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm ${
                      isAdded
                        ? "bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg hover:scale-105 border-2 border-[var(--color-primary)]/50"
                        : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-muted)]/30 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)] hover:shadow-md"
                    }`}
                  >
                    <Tag size={14} />
                    {categoryName}
                    {isAdded && (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Current Quiz Categories Configuration */}
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
              {formData.config.map((config, index) => {
                const categoryName = categories[config.category_id - 1];

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border border-[var(--color-muted)]/30 rounded-xl bg-[var(--color-surface)]/50"
                  >
                    {/* Category Name (read-only) */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm font-medium rounded-xl">
                      <Tag size={14} />
                      {categoryName}
                    </div>

                    {/* Question Count */}
                    <input
                      type="number"
                      value={config.question_count}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          config: formData.config.map((c, i) =>
                            i === index
                              ? {
                                  ...c,
                                  question_count: parseInt(e.target.value) || 0,
                                }
                              : c,
                          ),
                        })
                      }
                      min="0"
                      className="flex-1 px-4 py-2 border border-[var(--color-muted)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none bg-white text-sm"
                      placeholder="Question count"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={editQuiz ? handleSaveEditQuiz : handleCreateQuiz}
              className="flex-1 h-12 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary)]/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {editQuiz ? "Save Changes" : "Create Quiz"}
            </button>
          </div>
        </div>
      )}

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="group bg-[var(--color-card)] relative border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-primary)]/30"
          >
            {/* Edit Icon Top Right */}
            <button
              onClick={() => handleEditQuiz(quiz)}
              className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Edit Quiz"
            >
              <Edit3 size={18} className="text-[var(--color-primary)]" />
            </button>

            <div className="h-15 blur-lg w-15 rounded-full bg-[var(--color-primary)] absolute -top-5 -right-5" />

            {/* Quiz Card Content */}
            <div className="space-y-6">
              {/* Title */}
              <h3 className="text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-300 leading-tight">
                {quiz.title}
              </h3>

              {/* Stats Row */}
              <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(quiz.duration_minutes)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{quiz.totalQuestions} questions</span>
                </div>
              </div>

              {/* Categories Tags */}
              <div className="flex flex-wrap gap-2">
                {quiz.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-medium rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors duration-200"
                  >
                    <Tag className="h-3 w-3 inline -ml-1 mr-1 align-middle" />
                    {category}
                  </span>
                ))}
              </div>

              {/* Clean Start Quiz Button */}
              <button className="w-full h-14 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl active:scale-90 transition-all flex items-center justify-center gap-3">
                <span className="flex items-center gap-3">
                  Start Quiz
                  <Play className="h-5 w-5" />
                </span>
              </button>
            </div>

            {/* Subtle card glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};
