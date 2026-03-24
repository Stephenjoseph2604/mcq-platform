// ReportQuizSubmissions.jsx
import { Download, ArrowLeft, Search, ChevronUp, ChevronDown, Eye, Trash2 } from 'lucide-react';
import Loader from '../../../../../components/Loader';

const ReportQuizSubmissions = ({
  quizReport,
  selectedQuiz,
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  departmentFilter,
  setDepartmentFilter,
  reportLoading,
  downloadReport,
  setView,
  setSelectedStudent,
  handleDeleteSubmission,
  deletingSubmissionId,
  getFilteredSubmissions,
}) => {
  if (!selectedQuiz) return null;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0 mb-5 sm:mb-6">
        {/* Left Section */}
        <div className="w-full lg:w-auto">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            {quizReport?.quiz?.title || selectedQuiz?.title || "Quiz Report"}
          </h2>
          <p className="text-[var(--color-text-muted)] mt-1 text-sm">
            {quizReport?.totalSubmissions || 0} students submitted
          </p>
        </div>

        {/* Right Section - Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto lg:gap-3">
          {/* Download Button */}
          <button
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-2.5 bg-[var(--color-success)] hover:bg-[var(--color-success-dark)] text-white font-semibold border border-[var(--color-success)]/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-w-[44px] sm:min-w-0 active:scale-95"
            onClick={downloadReport}
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline text-sm">Download</span>
          </button>

          {/* Back Button */}
          <button
            onClick={() => setView("quizzes")}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-2.5 bg-[var(--color-muted)]/20 hover:bg-[var(--color-muted)]/40 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] border border-[var(--color-muted)]/30 hover:border-[var(--color-secondary)]/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 min-w-[44px] sm:min-w-0 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline text-sm">Back to Quizzes</span>
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        {/* Search */}
        <div className="flex-2">
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 tracking-wide uppercase">
            Search Students
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]/70" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[var(--color-card)]/70 border border-[var(--color-muted)]/20 rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 focus:border-[var(--color-secondary)]/40 focus:ring-2 focus:ring-[var(--color-secondary)]/30 focus:outline-none transition-all shadow-sm hover:shadow-md backdrop-blur-sm text-sm"
            />
          </div>
        </div>

        {/* Sort by Marks */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 tracking-wide uppercase">
            Sort by Marks
          </label>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="w-full flex items-center justify-between py-2.5 px-4 bg-[var(--color-card)]/70 border border-[var(--color-muted)]/20 rounded-xl text-[var(--color-text)] hover:border-[var(--color-secondary)]/30 hover:bg-[var(--color-secondary)]/5 focus:border-[var(--color-secondary)]/40 focus:ring-2 focus:ring-[var(--color-secondary)]/30 focus:outline-none transition-all shadow-sm hover:shadow-md backdrop-blur-sm group text-sm"
          >
            <span className="font-semibold">
              {sortOrder === "desc" ? "Z → A" : "A → Z"}
            </span>
            <div className="flex flex-col gap-px group-hover:scale-110 transition-transform">
              <ChevronUp
                className={`h-3.5 w-3.5 transition-colors ${
                  sortOrder === "desc"
                    ? "text-[var(--color-secondary)]"
                    : "text-[var(--color-text-muted)]/50"
                }`}
              />
              <ChevronDown
                className={`h-3.5 w-3.5 transition-colors ${
                  sortOrder === "asc"
                    ? "text-[var(--color-secondary)]"
                    : "text-[var(--color-text-muted)]/50"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Department Filter */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 tracking-wide uppercase">
            Department
          </label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full py-2.5 px-4 bg-[var(--color-card)]/70 border border-[var(--color-muted)]/20 rounded-xl text-[var(--color-text)] focus:border-[var(--color-secondary)]/40 focus:ring-2 focus:ring-[var(--color-secondary)]/30 focus:outline-none transition-all shadow-sm hover:shadow-md backdrop-blur-sm text-sm"
          >
            <option value="">All Departments</option>
            {[
              ...new Set(quizReport?.submissions?.map((s) => s.student.department) || []),
            ]
              .sort()
              .map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
          </select>
        </div>
      </div>

      {reportLoading ? (
        <div className="flex items-center justify-center py-16 sm:py-20">
          <Loader message="Report Loading" />
        </div>
      ) : (
        <div className="bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-muted)]/20">
                <th className="py-3 sm:py-4 text-left font-bold text-[var(--color-text)] tracking-wide">
                  S.No
                </th>
                <th className="py-3 sm:py-4 text-left font-bold text-[var(--color-text)] tracking-wide">
                  Student Name
                </th>
                <th className="py-3 sm:py-4 text-left font-bold text-[var(--color-text)] tracking-wide hidden sm:table-cell">
                  Department
                </th>
                <th className="py-3 sm:py-4 text-right font-bold text-[var(--color-text)] tracking-wide">
                  Percentage
                </th>
                <th className="py-3 sm:py-4 text-center font-bold text-[var(--color-text)] tracking-wide w-12 sm:w-16">
                  View
                </th>
                <th className="py-3 sm:py-4 text-center font-bold text-[var(--color-text)] tracking-wide w-10 hidden md:table-cell">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredSubmissions = getFilteredSubmissions();
                return filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission, index) => (
                    <tr
                      key={submission.student.id}
                      className="border-b border-[var(--color-muted)]/10 hover:bg-[var(--color-card)]/50 transition-all duration-200"
                    >
                      <td className="py-3 sm:py-4 font-semibold text-[var(--color-text)]">
                        {index + 1}
                      </td>
                      <td className="py-3 sm:py-4 font-semibold text-[var(--color-text)]">
                        {submission.student.name}
                      </td>
                      <td className="py-3 sm:py-4 hidden sm:table-cell text-[var(--color-text-muted)]">
                        {submission.student.department}
                      </td>
                      <td className="py-3 sm:py-4 text-right">
                        <span className="bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-dark)] bg-clip-text text-transparent font-bold text-sm">
                          {submission.attempt.percentage?.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 text-center">
                        <button
                          onClick={() =>{
                            setSelectedStudent({
                              quizId: selectedQuiz.id,
                              studentId: submission.student.id,
                              studentName: submission.student.name,
                            })
                            setView('student')
                        }
                          }
                          className="p-2 hover:bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/20 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                      <td className="py-3 sm:py-4 text-center hidden md:table-cell">
                        <button
                          onClick={() =>
                            handleDeleteSubmission(
                              selectedQuiz.id,
                              submission.student.id,
                              submission.student.name
                            )
                          }
                          disabled={deletingSubmissionId === submission.student.id}
                          className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                          title="Delete Submission"
                        >
                          {deletingSubmissionId === submission.student.id ? (
                            <svg
                              className="w-4 h-4 animate-spin mx-auto"
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
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 sm:py-20 text-center text-[var(--color-text-muted)]"
                    >
                      No submissions match the selected filters
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportQuizSubmissions;
