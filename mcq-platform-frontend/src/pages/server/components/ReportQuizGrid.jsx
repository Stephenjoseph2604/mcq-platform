// ReportQuizGrid.jsx
import { Users, Tag } from 'lucide-react';

const ReportQuizGrid = ({ 
  quizzes = [], 
  view, 
  setSelectedQuiz, 
  setView,
  onQuizClick 
}) => {
  // Use onQuizClick prop if provided, otherwise use internal handlers
  const handleQuizClick = (quiz) => {
    if (onQuizClick) {
      onQuizClick(quiz);
    } else if (setSelectedQuiz && setView) {
      setSelectedQuiz(quiz);
      setView("submissions");
    }
  };

  if (view !== "quizzes") return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          onClick={() => handleQuizClick(quiz)}
          className="group bg-[var(--color-card)]/50 relative border border-[var(--color-muted)]/20 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-secondary)]/30 cursor-pointer"
        >
          {/* Luxury Purple Blobs */}
          <div className="h-14 sm:h-16 w-14 sm:w-16 blur-xl bg-[var(--color-secondary)]/25 absolute -top-5 sm:-top-6 -right-5 sm:-right-6" />
          <div className="h-10 w-10 blur-lg bg-[var(--color-primary)]/20 absolute top-2 right-2" />

          <div className="space-y-4 sm:space-y-6 relative z-10">
            {/* Header */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-all duration-300 leading-tight">
                  {quiz.title}
                </h3>
                <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-secondary)]" />
                </div>
              </div>

              {/* Quiz Code & Stats */}
              <div className="flex flex-col gap-3">
                {/* Quiz Code */}
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[var(--color-primary)]/5 border border-[var(--color-secondary)]/15 rounded-xl backdrop-blur-sm">
                  <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-medium text-[var(--color-text-muted)]/80 uppercase tracking-wide">
                      Quiz Code
                    </span>
                    <span className="block text-base sm:text-lg font-black tracking-wider text-[var(--color-secondary)] truncate">
                      {quiz.quiz_code}
                    </span>
                  </div>
                  <div className="w-px h-7 bg-[var(--color-muted)]/30" />
                  <div className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {quiz.totalStudents}
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/15 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-lg">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-[var(--color-text-muted)]/80 uppercase tracking-wide">
                      Duration
                    </span>
                    <span className="block text-base sm:text-lg font-semibold text-[var(--color-secondary)]">
                      {quiz.duration} min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {quiz.categories.slice(0, 3).map((cat, i) => (
                <span
                  key={i}
                  className="px-2.5 sm:px-3 py-1.5 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-xs font-medium rounded-lg flex items-center gap-1 shadow-sm hover:shadow-md transition-all flex-shrink-0"
                >
                  <Tag className="h-3 w-3" />
                  {cat}
                </span>
              ))}
              {quiz.categories.length > 3 && (
                <span className="px-2.5 sm:px-3 py-1.5 bg-[var(--color-muted)]/20 text-[var(--color-text-muted)] text-xs rounded-lg font-medium border border-[var(--color-muted)]/30 shadow-sm">
                  +{quiz.categories.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Luxury Purple Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/8 via-[var(--color-secondary)]/4 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl blur pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default ReportQuizGrid;
