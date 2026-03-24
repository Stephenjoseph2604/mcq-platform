import { ArrowLeft, Award, Users, BarChart3, FileSearch } from "lucide-react";

const ReportStudentDetails = ({
  quizReport,
  selectedStudent,
  setView,
  reportLoading,
  formatDuration,
  // ✅ NEW prop — called with { quizId, studentId, studentName }
  onViewFullReport,
}) => {
  if (!selectedStudent) return null;

  const selectedSubmission = quizReport?.submissions?.find(
    (s) => s.student.id === selectedStudent.studentId,
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setView("submissions")}
            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-all duration-200 p-2 sm:-m-2 rounded-xl hover:bg-[var(--color-card)]/50 shadow-sm hover:shadow-md backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Student Report
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm">
              {selectedSubmission?.student?.name || "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {reportLoading ? (
        <div className="flex items-center justify-center py-20 sm:py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-secondary)] shadow-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Quiz Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm">
              <h3 className="font-bold text-[var(--color-text)] mb-5 sm:mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--color-secondary)]" />
                Student Report
              </h3>

              {/* Student Info */}
              <div className="mb-5 sm:mb-6 p-4 sm:p-5 bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/20 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-xl border border-[var(--color-secondary)]/30">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg sm:text-xl font-bold text-[var(--color-text)] truncate">
                      {selectedSubmission?.student?.name}
                    </h4>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {selectedSubmission?.student?.department}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[var(--color-text-muted)] block uppercase tracking-wide">
                    Quiz Title
                  </span>
                  <p className="font-semibold text-[var(--color-text)] text-sm sm:text-base">
                    {quizReport?.quiz?.title}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[var(--color-text-muted)] block uppercase tracking-wide">
                    Duration
                  </span>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {formatDuration(
                      selectedSubmission?.attempt?.startTime,
                      selectedSubmission?.attempt?.endTime,
                    )}
                  </p>
                </div>
                <div className="p-4 bg-[var(--color-primary)]/3 border border-[var(--color-secondary)]/15 rounded-xl backdrop-blur-sm">
                  <span className="text-xs text-[var(--color-text-muted)] block mb-3 uppercase tracking-wide font-semibold">
                    Performance Summary
                  </span>

                  <div className="flex items-end gap-3 sm:gap-4">
                    {/* Total Questions */}
                    <div className="flex-1 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-[var(--color-secondary)] mb-1">
                        {selectedSubmission?.categories?.reduce(
                          (sum, cat) => sum + cat.totalQuestions,
                          0,
                        ) || 0}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)] block">
                        Questions
                      </span>
                      <div className="w-12 h-1.5 bg-[var(--color-muted)]/20 rounded-full mx-auto mt-1">
                        <div
                          className="bg-[var(--color-secondary)] h-1.5 rounded-full shadow-sm"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>

                    {/* VS */}
                    <div className="text-lg sm:text-xl font-black text-[var(--color-secondary)] pb-1 hidden sm:block">
                      VS
                    </div>
                    <div className="w-6 h-6 bg-[var(--color-secondary)]/20 rounded-lg flex items-center justify-center sm:hidden">
                      <svg className="w-3 h-3 text-[var(--color-secondary)]" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>

                    {/* Score */}
                    <div className="flex-1 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-[var(--color-success)] mb-1">
                        {selectedSubmission?.attempt?.totalScore || 0}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)] block">
                        Score
                      </span>
                      <div className="w-12 h-1.5 bg-[var(--color-muted)]/20 rounded-full mx-auto mt-1">
                        <div
                          className="bg-[var(--color-success)] h-1.5 rounded-full shadow-sm"
                          style={{
                            width: `${Math.min(
                              ((selectedSubmission?.attempt?.totalScore || 0) /
                                Math.max(
                                  selectedSubmission?.categories?.reduce((s, c) => s + c.totalQuestions, 0) || 1,
                                  1,
                                )) * 100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ✅ Clickable percentage — triggers full detail view */}
                  <div className="pt-4 border-t border-[var(--color-muted)]/20 mt-4">
                    <button
                      onClick={() =>
                        onViewFullReport?.({
                          quizId: quizReport?.quiz?.id,
                          studentId: selectedStudent.studentId,
                          studentName: selectedSubmission?.student?.name,
                        })
                      }
                      className="group w-full flex flex-col items-center gap-1.5 rounded-xl p-2 hover:bg-[var(--color-secondary)]/8 transition-all duration-200"
                      title="Click to view full question-by-question breakdown"
                    >
                      <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-dark)] bg-clip-text text-transparent">
                        {selectedSubmission?.attempt?.percentage?.toFixed(1)}%
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-secondary)] transition-colors duration-200">
                        <FileSearch className="w-3.5 h-3.5" />
                        View full breakdown
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm">
              <h3 className="font-bold text-[var(--color-text)] mb-5 sm:mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--color-secondary)]" />
                Category Performance
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {selectedSubmission?.categories?.map((category) => (
                  <div
                    key={category.categoryId}
                    className="flex items-center justify-between p-4 sm:p-5 border border-[var(--color-muted)]/15 rounded-xl hover:border-[var(--color-secondary)]/20 hover:bg-[var(--color-card)]/30 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-xl flex items-center justify-center border border-[var(--color-secondary)]/20 shadow-sm">
                        <span className="text-xs sm:text-sm font-semibold text-[var(--color-secondary)]">
                          {category.categoryName.slice(0, 3)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--color-text)] text-sm sm:text-base truncate">
                          {category.categoryName}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {category.correctAnswers}/{category.totalQuestions} correct
                        </p>
                      </div>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-dark)] bg-clip-text text-transparent">
                        {category.percentage?.toFixed(1)}%
                      </div>
                      <div className="w-20 h-2 bg-[var(--color-muted)]/20 rounded-full mt-2">
                        <div
                          className="bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-dark)] h-2 rounded-full shadow-sm transition-all duration-300"
                          style={{ width: `${Math.min(category.percentage || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-12 sm:py-16 text-[var(--color-text-muted)]">
                    No category data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportStudentDetails;