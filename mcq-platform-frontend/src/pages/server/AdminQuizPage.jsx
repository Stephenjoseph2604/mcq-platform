// QuizPage.jsx
import { useEffect, useState } from "react";
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
import { quizAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

// const categories = ["English", "Aptitude", "Logical", "Technical"];

export const AdminQuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editQuiz, setEditQuiz] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    quiz_code: "",
    duration: 60,
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await quizAPI.getCategories();
        if (response.data.success) {
          setCategories(response.data.data); // ✅ [{id: 1, name: "English"}, ...]
          console.log("✅ Categories loaded:", response.data.data);
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ FETCH QUIZZES FROM API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await quizAPI.getQuizzes();

        if (response.data.success) {
          // ✅ Set quizzes from API response
          console.log(response.data.data);

          setQuizzes(response.data.data || response.data.quizzes || []);
        } else {
          throw new Error(response.data.message || "Failed to fetch quizzes");
        }
      } catch (err) {
        console.error("Fetch quizzes error:", err);
        setError(err.message || "Failed to load quizzes");
        setQuizzes([]); // Empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 text-center">
        <h3 className="font-bold text-lg mb-2">Failed to load quizzes</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle Create Quiz Form
  const handleCreateQuiz = async () => {
    if (
      !formData.title ||
      !formData.quiz_code ||
      formData.config.length === 0
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const createData = {
        title: formData.title.trim(),
        quiz_code: formData.quiz_code.trim(),
        duration_minutes: formData.duration,
        rules: formData.rules,
        config: formData.config,
      };

      console.log("🔄 Creating quiz:", createData);

      const response = await quizAPI.createQuiz(createData); // POST /api/quiz/

      if (response.data.success) {
        alert(`✅ "${formData.title}" created successfully!`);

        // Refresh quizzes list
        const quizzesResponse = await quizAPI.getQuizzes();
        setQuizzes(quizzesResponse.data.data);

        // Reset form
        setShowCreateForm(false);
        setFormData({
          title: "",
          quiz_code: "",
          duration: 60,
          rules: [
            "No switching tabs",
            "No going back once answered",
            "Auto submit on time expiry",
          ],
          config: [],
        });
      } else {
        alert(`❌ Create failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Create error:", error);
      alert(
        `❌ Error: ${error.response?.data?.message || "Failed to create quiz"}`,
      );
    }
  };

  // Handle Edit Quiz
  const handleEditQuiz = (quiz) => {
    setEditQuiz(quiz);
    setShowCreateForm(true);
    console.log(quiz);

    // Parse "100 min" → 100
    const parseDuration = (durationStr) => {
      if (!durationStr) return 60;
      const numMatch = durationStr.match(/(\d+)/);
      return numMatch ? parseInt(numMatch[1]) : 60;
    };

    // ✅ FIXED: Use actual question_count from quiz.categories
    const config = quiz.categories.map((cat) => ({
      category_id: cat.id,
      question_count: cat.question_count || 10, // ✅ Uses 5 from your JSON
    }));

    setFormData({
      title: quiz.title,
      quiz_code: quiz.quiz_code,
      duration: parseDuration(quiz.duration), // 100
      rules: [
        "No switching tabs",
        "No going back once answered",
        "Auto submit on time expiry",
      ],
      config: config, // ✅ [{category_id:1, question_count:5}, ...]
    });
  };

  const handleSaveEditQuiz = async () => {
    if (!editQuiz?.id || !formData.title || formData.config.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const updateData = {
        title: formData.title.trim(),
        quiz_code: formData.quiz_code.trim(), // Include for edit
        duration_minutes: formData.duration,
        rules: formData.rules,
        config: formData.config,
      };

      console.log("🔄 Updating quiz:", updateData);

      const response = await quizAPI.updateQuiz(editQuiz.id, updateData);

      if (response.data.success) {
        alert(`✅ "${formData.title}" updated successfully!`);

        // Refresh list
        const quizzesResponse = await quizAPI.getQuizzes();
        setQuizzes(quizzesResponse.data.data);

        // Reset
        setShowCreateForm(false);
        setEditQuiz(null);
        setFormData({
          title: "",
          quiz_code: "",
          duration: 60,
          rules: [
            "No switching tabs",
            "No going back once answered",
            "Auto submit on time expiry",
          ],
          config: [],
        });
      }
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.message || "Update failed"}`);
    }
  };

  const formatDuration = (minutes) => `${minutes} min`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminHeader
          title={"Admin Quiz Management"}
          des={"Create and manage quizzes for students"}
        />
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary)]/90 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <BookPlus size={18} />
            Create Quiz
          </button>
          <button onClick={()=>navigate('/admin/loadquestions')} className="px-6 py-2.5 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 rounded-xl font-semibold hover:bg-[var(--color-secondary)]/20 transition-all duration-200 flex items-center gap-2">
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
                  duration: 60,
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
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
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
              {categories.map((category) => {
                // ✅ FIXED: category object
                const isAdded = formData.config.some(
                  (c) => c.category_id === category.id, // ✅ category.id
                );

                return (
                  <button
                    key={category.id} // ✅ FIXED: category.id
                    onClick={() => {
                      if (isAdded) {
                        setFormData({
                          ...formData,
                          config: formData.config.filter(
                            (c) => c.category_id !== category.id,
                          ),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          config: [
                            ...formData.config,
                            { category_id: category.id, question_count: 10 }, // ✅ category.id
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
                    {category.name} {/* ✅ FIXED: category.name (string) */}
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
                // ✅ FIXED: Safe lookup using categories.find()
                const categoryName =
                  categories.find((cat) => cat.id === config.category_id)
                    ?.name || "Unknown";

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border border-[var(--color-muted)]/30 rounded-xl bg-[var(--color-surface)]/50"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm font-medium rounded-xl">
                      <Tag size={14} />
                      {categoryName} {/* ✅ Now works: "English" */}
                    </div>

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
                  <span>{quiz.duration}</span>
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
                    {category.name}
                  </span>
                ))}
              </div>

              {/* Clean Start Quiz Button */}
              {/* <button className="w-full h-14 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl active:scale-90 transition-all flex items-center justify-center gap-3">
                <span className="flex items-center gap-3">
                  Start Quiz
                  <Play className="h-5 w-5" />
                </span>
              </button> */}
            </div>

            {/* Subtle card glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};
