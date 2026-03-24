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
import AdminHeader from "../../../../components/AdminHeader";
import { categoriesAPI, quizAPI } from "../../../../services/api";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import CreateQuizForm from "./components/Createquizform";
import QuizGrid from "./components/QuizGrid";

// const categories = ["English", "Aptitude", "Logical", "Technical"];

export const AdminQuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [saving, setSaving] = useState(false);
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
    finally {
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

const handleDeleteQuiz = async (quizId) => {
  try {
    const response = await quizAPI.deleteQuiz(quizId);
    const remaining= quizzes.filter(q=> q.id!=quizId)
    setQuizzes(remaining)
    alert(response.data.data.message || 'Successfully deleted')
  } catch (error) {
    alert('Action failed')
  }

}
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
    finally {
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
        <CreateQuizForm
          showCreateForm={showCreateForm}
          editQuiz={editQuiz}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          saving={saving}
          handleCreateQuiz={handleCreateQuiz}
          handleSaveEditQuiz={handleSaveEditQuiz}
          setShowCreateForm={setShowCreateForm}
          setEditQuiz={setEditQuiz}
        />
      )}

      {/* Quizzes Grid */}

      <QuizGrid
        quizzes={quizzes}
        handleEditQuiz={handleEditQuiz}
        handleDeleteQuiz={handleDeleteQuiz} // replace with your function
      />
    </div>
  );
};



