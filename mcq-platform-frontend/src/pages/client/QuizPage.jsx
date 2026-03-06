import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  BookOpen,
  Tag,
  Play,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { quizAPI } from "../../services/api";
import { encryptId } from "../../utils/encryption";
import Loader from "../../components/Loader";
import DotGrid from "../../components/DotGrid";
import FloatingParticles from "../../components/FloatingParticles";

const QuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await quizAPI.getQuizzes();

        if (response.data.success) {
          setQuizzes(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch quizzes");
        }
      } catch (err) {
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [navigate]);

  const handleStartQuiz = (quizId) => {
    console.log(`Start Quiz ID: ${quizId}`);
    const encryptedQuizId = encryptId(quizId);
    navigate(`/quiz/${encryptedQuizId}`);
  };

 if (loading) {
  return (
      <Loader message="Fetching Quiz..." />
  );
}


  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Fixed Dot Grid Background */}
    
    <DotGrid/>
    <FloatingParticles/>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--color-text)] via-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-4">
            Available Quizzes
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Choose a quiz to test your knowledge and track your progress
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-[var(--color-card)]/80 border border-[var(--color-primary)]/30 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-[var(--color-primary)] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">
                  Error
                </h3>
                <p className="text-[var(--color-text-muted)]">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Quizzes */}
        {quizzes.length === 0 && !loading && !error && (
          <div className="text-center py-24">
            <BookOpen className="h-24 w-24 text-[var(--color-muted)] mx-auto mb-8 opacity-50" />
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
              No quizzes available
            </h2>
            <p className="text-xl text-[var(--color-text-muted)] max-w-md mx-auto">
              Check back later for new quizzes
            </p>
          </div>
        )}

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group bg-[var(--color-card)]/50 relative border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-primary)]/30"
            >
              {/* Decorative Blob */}
              <div className="h-15 w-15 blur-lg rounded-full bg-[var(--color-primary)]/30 absolute -top-5 -right-5" />

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
                  {quiz.categories.slice(0, 4).map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-medium rounded-lg hover:bg-[var(--color-primary)]/25 transition-colors duration-200 flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3 inline -ml-1 mr-1 align-middle flex-shrink-0" />
                      {category.name}
                    </span>
                  ))}
                </div>

                {/* Clean Start Quiz Button */}
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="w-full h-14 bg-gradient-to-r  from-[var(--color-primary)]/80 to-[var(--color-bg)]/20 text-text rounded-4xl font-semibold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 active:scale-90 transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    Start Quiz
                    <Play className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </button>
              </div>

              {/* Subtle card glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
