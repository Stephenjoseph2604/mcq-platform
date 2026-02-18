// components/QuizPage.jsx - Fixed blinking + Categories tags
import React from "react";
import { Link } from "react-router-dom";
import { Play, Clock, BookOpen, Tag } from "lucide-react";

const QuizPage = () => {
  // Sample quizzes data with categories
  const quizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      duration: "30 min",
      totalQuestions: 25,
      categories: ["Technical", "Logical"],
    },
    {
      id: 2,
      title: "React Advanced Concepts",
      duration: "45 min",
      totalQuestions: 35,
      categories: ["Technical", "English"],
    },
    {
      id: 3,
      title: "CSS Grid & Flexbox",
      duration: "20 min",
      totalQuestions: 20,
      categories: ["Technical"],
    },
    {
      id: 4,
      title: "Aptitude Test",
      duration: "40 min",
      totalQuestions: 30,
      categories: ["Aptitude", "Logical"],
    },
    {
      id: 5,
      title: "TypeScript Essentials",
      duration: "35 min",
      totalQuestions: 28,
      categories: ["Technical", "Logical"],
    },
    {
      id: 6,
      title: "English Proficiency",
      duration: "25 min",
      totalQuestions: 22,
      categories: ["English", "Aptitude"],
    },
  ];

  const handleStartQuiz = (quizId) => {
    console.log(`Start Quiz ID: ${quizId}`);
    // You will write your start quiz function here
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Fixed Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, var(--color-muted) 1px, transparent 0),
            radial-gradient(circle at 25px 25px, var(--color-muted) 1px, transparent 0)
          `,
          backgroundSize: "50px 50px",
        }}
      />

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

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group bg-[var(--color-card)]  relative border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-primary)]/30"
            >
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
                      {category}
                    </span>
                  ))}
                </div>

                {/* Clean Start Quiz Button */}
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="w-full h-14 bg-primary text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl  flex items-center justify-center gap-3 active:scale-90 transition-all"
                >
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
    </div>
  );
};

export default QuizPage;
