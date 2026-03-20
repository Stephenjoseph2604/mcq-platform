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
  User,
  Users,
} from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { categoriesAPI, quizAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import ErrorDisplay from "../../components/ErrorDisplay";

// const categories = ["English", "Aptitude", "Logical", "Technical"];

export const AdminQuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [saving,setSaving]=useState(false);
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
    config: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await categoriesAPI.getAll();
        if (response.data.success) {
          setCategories(response.data.data); // ✅ [{id: 1, name: "English"}, ...]
        }
      } catch (err) {
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
          setQuizzes(response.data.data || response.data.quizzes || []);
        } else {
          throw new Error(response.data.message || "Failed to fetch quizzes");
        }
      } catch (err) {
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
    return <Loader message="Fetchin Quiz..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorDisplay title={error} onRetry={() => window.location.reload()} />
    );
  }

  // Handle Create Quiz Form
  const handleCreateQuiz = async () => {
    setSaving(true)
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
      alert(
        `❌ Error: ${error.response?.data?.message || "Failed to create quiz"}`,
      );
    }
    finally{
      setSaving(false)
    }
  };

  // Handle Edit Quiz
  const handleEditQuiz = (quiz) => {
    setEditQuiz(quiz);
    setShowCreateForm(true);

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
    setSaving(true)
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
    finally{
      setSaving(false)
    }
  };

  // const formatDuration = (minutes) => `${minutes} min`;

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
          <button
            onClick={() => navigate("/admin/loadquestions")}
            className="px-6 py-2.5 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 rounded-xl font-semibold hover:bg-[var(--color-secondary)]/20 transition-all duration-200 flex items-center gap-2"
          >
            <BookOpen size={18} />
            Load Questions
          </button>
        </div>
      </div>

      {/* Create/Edit Quiz Form */}
      {showCreateForm && (
        <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/20 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
          {/* Compact Purple Glows */}
          <div className="absolute top-0 right-0 h-16 sm:h-20 w-16 sm:w-20 bg-[var(--color-secondary)]/15 rounded-bl-2xl blur-xl -translate-y-4 sm:-translate-y-6 translate-x-4 sm:translate-x-6 hidden sm:block" />
          <div className="absolute bottom-0 left-0 h-12 sm:h-16 w-12 sm:w-16 bg-[var(--color-primary)]/15 rounded-tr-2xl blur-lg translate-y-2 sm:translate-y-4 -translate-x-2 sm:-translate-x-4 hidden sm:block" />

          <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[var(--color-primary)] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg sm:shadow-xl">
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                  />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                {editQuiz ? "Edit Quiz" : "Create New Quiz"}
              </h2>
            </div>
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
              className="p-1 sm:p-1.5 hover:bg-[var(--color-primary)]/20 hover:scale-105 rounded-lg sm:rounded-xl transition-all duration-200 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)]"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[var(--color-text-muted)] mb-1.5 sm:mb-2 tracking-wide uppercase">
                Quiz Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-[var(--color-muted)]/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
                placeholder="Quiz title"
              />
            </div>
            {editQuiz ? null : (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[var(--color-text-muted)] mb-1.5 sm:mb-2 tracking-wide uppercase">
                  Quiz Code
                </label>
                <input
                  type="text"
                  value={formData.quiz_code}
                  onChange={(e) =>
                    setFormData({ ...formData, quiz_code: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-[var(--color-muted)]/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
                  placeholder="e.g. MCQ2026"
                />
              </div>
            )}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[var(--color-text-muted)] mb-1.5 sm:mb-2 tracking-wide uppercase">
                Duration
              </label>
              <div className="relative">
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
                  className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-[var(--color-muted)]/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/80 backdrop-blur-sm text-[var(--color-text)] transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
                />
                <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--color-secondary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[var(--color-muted)]/10">
            <label className="block text-sm sm:text-base font-bold text-[var(--color-text)] mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[var(--color-primary)]/20 border border-[var(--color-secondary)]/30 rounded-md sm:rounded-lg flex items-center justify-center">
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-secondary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              Categories
            </label>

            {/* Compact Category Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {categories.map((category) => {
                const isAdded = formData.config.some(
                  (c) => c.category_id === category.id,
                );
                return (
                  <button
                    key={category.id}
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
                            { category_id: category.id, question_count: 10 },
                          ],
                        });
                      }
                    }}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-1.5 shadow-md sm:shadow-lg hover:shadow-xl ${
                      isAdded
                        ? "bg-[var(--color-primary)] text-white hover:scale-105 border border-[var(--color-primary)]/50"
                        : "bg-[var(--color-card)]/70 text-[var(--color-text-muted)] border border-[var(--color-muted)]/20 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                    }`}
                  >
                    <Tag
                      size={11}
                      sm:size={12}
                      className={isAdded ? "text-white/80" : ""}
                    />
                    <span className="truncate max-w-16 sm:max-w-20">
                      {category.name}
                    </span>
                    {isAdded && (
                      <svg
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5 flex-shrink-0"
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

            {/* Compact Config Rows */}
            <div className="space-y-2 sm:space-y-3 max-h-28 sm:max-h-32 overflow-y-auto pr-1.5 sm:pr-2 -mr-1.5 sm:-mr-2 scrollbar-thin scrollbar-thumb-[var(--color-primary)]/50 scrollbar-track-[var(--color-card)]">
              {formData.config.map((config, index) => {
                const categoryName =
                  categories.find((cat) => cat.id === config.category_id)
                    ?.name || "Unknown";
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border border-[var(--color-muted)]/15 rounded-lg sm:rounded-xl bg-[var(--color-card)]/50 backdrop-blur-sm hover:border-[var(--color-primary)]/30 transition-all"
                  >
                    <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-1.5 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 text-[var(--color-primary)] text-xs sm:text-sm font-semibold rounded-md sm:rounded-lg flex-shrink-0">
                      <Tag size={11} sm:size={12} />
                      <span className="truncate max-w-12 sm:max-w-16">
                        {categoryName}
                      </span>
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
                      className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-[var(--color-muted)]/15 rounded-md sm:rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-xs sm:text-sm font-medium text-[var(--color-text)] shadow-sm transition-all"
                      placeholder="Q"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compact Primary Button */}
          <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[var(--color-muted)]/10">
            <button
              onClick={editQuiz ? handleSaveEditQuiz : handleCreateQuiz}
              className="flex-1 h-10 sm:h-11 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 border border-[var(--color-primary)]/30"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {editQuiz ? "Save" : "Create"}
              {saving && <div className="h-5/10 aspect-square border-3 rounded-full border-gray-400 border-t-white animate-spin"/>} 
            </button>
          </div>
        </div>
      )}

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="group bg-[var(--color-card)]/30 relative border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-secondary)]/40"
          >
            {/* Edit Icon Top Right */}
            <button
              onClick={() => handleEditQuiz(quiz)}
              className="absolute top-4 right-4 p-2 bg-[var(--color-card)]/90 hover:bg-[var(--color-muted)]/10 backdrop-blur-sm rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
              title="Edit Quiz"
            >
              <Edit3
                size={18}
                className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
              />
            </button>

            {/* Luxury Purple Blob */}
            <div className="h-16 w-16 blur-xl rounded-full bg-[var(--color-secondary)]/30 absolute -top-6 -right-6" />

            {/* Quiz Card Content */}
            <div className="space-y-6 relative z-10">
              {/* Title */}
              <h3 className="text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-all duration-300 leading-tight">
                {quiz.title}
              </h3>

              {/* Stats Row */}
              <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--color-secondary)]/70" />
                  <span>{quiz.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[var(--color-secondary)]/70" />
                  <span>{quiz.totalQuestions} questions</span>
                </div>
              </div>

              {/* Quiz Code Section */}
              <div className="flex items-center gap-4 p-4 bg-[var(--color-primary)]/3 border border-[var(--color-secondary)]/20 rounded-xl backdrop-blur-sm">
                <div className="w-2.5 h-2.5 bg-[var(--color-secondary)] rounded-full animate-pulse" />
                <div className="flex-1">
                  <span className="block text-xs font-medium text-[var(--color-text-muted)]/80 uppercase tracking-wide">
                    Quiz Code
                  </span>
                  <span className="block text-lg font-black tracking-wider text-[var(--color-secondary)]">
                    {quiz.quiz_code}
                  </span>
                </div>
                <div className="w-px h-8 bg-[var(--color-muted)]/30" />
                <div className="p-1.5 bg-[var(--color-secondary)]/10 rounded-lg">
                  <Users className="h-4 w-4 text-[var(--color-text-muted)]" />
                </div>
              </div>

              {/* Categories Tags */}
              <div className="flex flex-wrap gap-2">
                {quiz.categories.slice(0, 3).map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-xs font-medium rounded-lg hover:bg-[var(--color-secondary)]/20 hover:border-[var(--color-primary)]/40 transition-all duration-200 flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3 flex-shrink-0" />
                    {category.name}
                  </span>
                ))}
                {quiz.categories.length > 3 && (
                  <span className="px-3 py-1.5 bg-[var(--color-muted)]/20 text-[var(--color-text-muted)] text-xs rounded-lg font-medium border border-[var(--color-muted)]/30">
                    +{quiz.categories.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Luxury Purple Violet Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/8 via-[var(--color-secondary)]/4 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl blur pointer-events-none" />

            {/* Subtle border glow */}
            <div className="absolute inset-0 border-2 border-[var(--color-secondary)]/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};
