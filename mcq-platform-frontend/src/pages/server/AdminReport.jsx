import { useEffect, useState } from "react";
import {
  Eye,
  Clock,
  Users,
  Award,
  BarChart3,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { reportAPI } from "../../services/api";

const sampleQuizzes = [
  {
    id: 1,
    title: "MCQ Placement Test",
    quiz_code: "MCQ2026",
    totalStudents: 2,
    categories: ["English", "Aptitude", "Logical", "Technical"],
  },
  {
    id: 2,
    title: "Technical Interview Prep",
    quiz_code: "TECH2026",
    totalStudents: 5,
    categories: ["Technical", "Logical"],
  },
];

const sampleSubmissions = {
  1: {
    quiz: { id: 1, title: "MCQ Placement Test" },
    totalStudents: 2,
    students: [
      {
        studentId: 2,
        studentName: "Lokesh",
        department: "Computer Science",
        startTime: "2026-02-18T10:43:33.000Z",
        endTime: "2026-02-18T10:52:14.000Z",
        submitted: 1,
        totalScore: 17,
        percentage: 85,
      },
      {
        studentId: 1,
        studentName: "Stephenjoseph M",
        department: "Computer Science",
        startTime: "2026-02-18T09:31:39.000Z",
        endTime: "2026-02-18T10:13:28.000Z",
        submitted: 1,
        totalScore: 16,
        percentage: 80,
      },
    ],
  },
};

const sampleStudentDetails = {
  "1-2": {
    // quizId-studentId
    student: { id: 2, name: "Lokesh", department: "Computer Science" },
    quiz: {
      id: 1,
      title: "MCQ Placement Test",
      startTime: "2026-02-18T10:43:33.000Z",
      endTime: "2026-02-18T10:52:14.000Z",
      submitted: 1,
      totalScore: 17,
      overallPercentage: 85,
    },
    categories: [
      {
        categoryId: 1,
        categoryName: "English",
        totalQuestions: 5,
        correctAnswers: 4,
        percentage: 80,
      },
      {
        categoryId: 2,
        categoryName: "Aptitude",
        totalQuestions: 5,
        correctAnswers: 4,
        percentage: 80,
      },
      {
        categoryId: 3,
        categoryName: "Logical",
        totalQuestions: 5,
        correctAnswers: 3,
        percentage: 60,
      },
      {
        categoryId: 4,
        categoryName: "Technical",
        totalQuestions: 5,
        correctAnswers: 5,
        percentage: 100,
      },
    ],
  },
};

export const AdminReport = () => {
const [quizzes, setQuizzes] = useState([]);
const [quizReport, setQuizReport] = useState(null);
// ❌ REMOVE these 2 lines:
// const [studentReport, setStudentReport] = useState(null);
// const [studentLoading, setStudentLoading] = useState(false);
const [loading, setLoading] = useState(true);
const [reportLoading, setReportLoading] = useState(false);
const [selectedQuiz, setSelectedQuiz] = useState(null);
const [selectedStudent, setSelectedStudent] = useState(null);
const [view, setView] = useState("quizzes");

// ✅ KEEP these useEffects unchanged
useEffect(() => {
  fetchQuizzes();
}, []);

useEffect(() => {
  if (selectedQuiz?.id && view === "submissions") {
    fetchQuizReport(selectedQuiz.id);
  }
}, [selectedQuiz, view]);

  // Helper function to format duration
  const formatDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "N/A";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end - start;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getQuizzes();

      if (response.data?.success) {
        // Transform API response to match your component expectations
        const transformedQuizzes = response.data.data.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          quiz_code: quiz.quiz_code,
          duration: quiz.duration,
          totalStudents: quiz.totalSubmissions, // Using totalSubmissions from API
          categories: quiz.categories.map((cat) => cat.name), // Extract just category names
        }));

        setQuizzes(transformedQuizzes);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      // Fallback to empty array or show error state
    } finally {
      setLoading(false);
    }
  };

 const fetchQuizReport = async (quizId) => {
  try {
    setReportLoading(true);
    const response = await reportAPI.getQuizReport(quizId);
    if (response.data?.success) {
      setQuizReport(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching quiz report:", error);
    setQuizReport(null);
  } finally {
    setReportLoading(false);
  }
};

// Remove fetchStudentReport since getQuizReport provides all student data
// const fetchStudentReport = async (quizId, studentId) => { ... } // DELETED


  const fetchStudentReport = async (quizId, studentId) => {
    try {
      setStudentLoading(true);
      const response = await reportAPI.getStudentReport(quizId, studentId);
      if (response.data?.success) {
        setStudentReport(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching student report:", error);
      setStudentReport(null);
    } finally {
      setStudentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
            Admin Reports
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            View quiz analytics and student performance
          </p>
        </div>
      </div>

      {/* Quizzes Grid */}
      {view === "quizzes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => {
                setSelectedQuiz(quiz);
                setView("submissions");
              }}
              className="group bg-[var(--color-card)] relative border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-primary)]/30 cursor-pointer"
            >
              <div className="h-16 w-16 blur-lg bg-[var(--color-primary)] absolute -top-6 -right-6" />

              <div className="space-y-6 relative z-10">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {quiz.title}
                    </h3>
                    <Users className="h-6 w-6 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Quiz Code & Duration - Updated Layout */}
                  <div className="flex flex-col gap-3">
                    {/* Quiz Code */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border border-[var(--color-primary)]/20 rounded-xl backdrop-blur-sm">
                      <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />
                      <div className="flex-1">
                        <span className="block text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                          Quiz Code
                        </span>
                        <span className="block text-lg font-black tracking-wider text-[var(--color-primary)]">
                          {quiz.quiz_code}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-[var(--color-muted)]/50" />
                      <span className="text-sm text-[var(--color-text-muted)] font-medium">
                        {quiz.totalStudents} students
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[var(--color-secondary)]/5 to-[var(--color-primary)]/5 border border-[var(--color-secondary)]/20 rounded-xl backdrop-blur-sm">
                      <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-lg flex items-center justify-center">
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
                      <div>
                        <span className="block text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                          Duration
                        </span>
                        <span className="block text-lg font-semibold text-[var(--color-secondary)]">
                          {quiz.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {quiz.categories.slice(0, 3).map((cat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-medium rounded-lg flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3 inline -ml-1 mr-1 align-middle" />
                      {cat}
                    </span>
                  ))}
                  {quiz.categories.length > 3 && (
                    <span className="px-3 py-1 bg-[var(--color-muted)]/20 text-[var(--color-text-muted)] text-xs rounded-lg font-medium">
                      +{quiz.categories.length - 3} more
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submissions Table */}
      {view === "submissions" && selectedQuiz && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                {quizReport?.quiz?.title ||
                  selectedQuiz?.title ||
                  "Quiz Report"}
              </h2>
              <p className="text-[var(--color-text-muted)]">
                {quizReport?.totalSubmissions || 0} students submitted
              </p>
            </div>
            <button
              onClick={() => setView("quizzes")}
              className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--color-muted)]/20 text-[var(--color-text)] border border-[var(--color-muted)]/30 rounded-xl hover:bg-[var(--color-muted)]/30 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quizzes
            </button>
          </div>

          {reportLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
            </div>
          ) : (
            <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-muted)]/30">
                    <th className="py-4 text-left font-semibold text-[var(--color-text)]">
                      S.No
                    </th>
                    <th className="py-4 text-left font-semibold text-[var(--color-text)]">
                      Student Name
                    </th>
                    <th className="py-4 text-left font-semibold text-[var(--color-text)] hidden sm:table-cell">
                      Department
                    </th>
                    <th className="py-4 text-right font-semibold text-[var(--color-text)]">
                      Percentage
                    </th>
                    <th className="py-4 text-center font-semibold text-[var(--color-text)] w-16">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizReport?.submissions?.length > 0 ? (
                    quizReport.submissions.map((submission, index) => (
                      <tr
                        key={submission.student.id}
                        className="border-b border-[var(--color-muted)]/20 hover:bg-[var(--color-surface)]/50 transition-colors"
                      >
                        <td className="py-4 font-medium text-[var(--color-text)]">
                          {index + 1}
                        </td>
                        <td className="py-4 font-medium text-[var(--color-text)]">
                          {submission.student.name}
                        </td>
                        <td className="py-4 hidden sm:table-cell text-[var(--color-text-muted)]">
                          {submission.student.department}
                        </td>
                        <td className="py-4 text-right">
                          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-semibold">
                            {submission.attempt.percentage?.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedStudent({
                                quizId: selectedQuiz.id,
                                studentId: submission.student.id,
                                studentName: submission.student.name,
                              });
                              setView("student");
                            }}
                            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-xl transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-[var(--color-text-muted)]"
                      >
                        No submissions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Student Details */}
      {view === "student" && selectedStudent && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setView("submissions");
                }}
                className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-2 -m-2 rounded-xl hover:bg-[var(--color-surface)]/50"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">
                  Student Report
                </h2>
                <p className="text-[var(--color-text-muted)]">
                  {quizReport?.submissions?.find(
                    (s) => s.student.id === selectedStudent.studentId,
                  )?.student.name || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          {/* Remove studentLoading - use reportLoading instead */}
          {reportLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Get selected student data from quizReport */}
              {(() => {
                const selectedSubmission = quizReport?.submissions?.find(
                  (s) => s.student.id === selectedStudent.studentId,
                );
                return (
                  <>
                    {/* Quiz Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                          <Award className="h-5 w-5 text-yellow-500" />
                          Student Report
                        </h3>

                        {/* Student Info */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-[var(--color-text)]">
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
                            <span className="text-xs text-[var(--color-text-muted)] block">
                              Quiz Title
                            </span>
                            <p className="font-semibold">
                              {quizReport?.quiz?.title}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-[var(--color-text-muted)] block">
                              Duration
                            </span>
                            <p className="text-sm">
                              {formatDuration(
                                selectedSubmission?.attempt?.startTime,
                                selectedSubmission?.attempt?.endTime,
                              )}
                            </p>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border border-[var(--color-primary)]/20 rounded-xl backdrop-blur-sm">
                            <span className="text-xs text-[var(--color-text-muted)] block mb-2 uppercase tracking-wide">
                              Performance Summary
                            </span>

                            <div className="flex items-end gap-4">
                              {/* Total Questions */}
                              <div className="flex-1 text-center">
                                <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-0.5">
                                  {selectedSubmission?.categories?.reduce(
                                    (sum, cat) => sum + cat.totalQuestions,
                                    0,
                                  ) || 0}
                                </div>
                                <span className="text-xs text-[var(--color-text-muted)]">
                                  Questions
                                </span>
                                <div className="w-12 h-1.5 bg-[var(--color-muted)]/30 rounded-full mx-auto mt-1">
                                  <div
                                    className="bg-blue-400 h-1.5 rounded-full"
                                    style={{ width: "100%" }}
                                  />
                                </div>
                              </div>

                              {/* VS Icon */}
                              <div className="text-lg font-black text-[var(--color-primary)] pb-1">
                                VS
                              </div>

                              {/* Score Obtained */}
                              <div className="flex-1 text-center">
                                <div className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-0.5">
                                  {selectedSubmission?.attempt?.totalScore || 0}
                                </div>
                                <span className="text-xs text-[var(--color-text-muted)]">
                                  Score
                                </span>
                                <div className="w-12 h-1.5 bg-[var(--color-muted)]/30 rounded-full mx-auto mt-1">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full"
                                    style={{
                                      width: `${Math.min(((selectedSubmission?.attempt?.totalScore || 0) / Math.max(selectedSubmission?.categories?.reduce((sum, cat) => sum + cat.totalQuestions, 1) || 1)) * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-[var(--color-muted)]/30 text-center">
                            <span className="text-3xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                              {selectedSubmission?.attempt?.percentage?.toFixed(
                                1,
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Performance */}
                    <div className="lg:col-span-2">
                      <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Category Performance
                        </h3>
                        <div className="space-y-4">
                          {selectedSubmission?.categories?.map((category) => (
                            <div
                              key={category.categoryId}
                              className="flex items-center justify-between p-4 border border-[var(--color-muted)]/20 rounded-xl hover:bg-[var(--color-surface)]/50 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-xl flex items-center justify-center">
                                  <span className="text-sm font-semibold text-[var(--color-primary)]">
                                    {category.categoryName.slice(0, 3)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-[var(--color-text)]">
                                    {category.categoryName}
                                  </p>
                                  <p className="text-xs text-[var(--color-text-muted)]">
                                    {category.correctAnswers}/
                                    {category.totalQuestions} correct
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                  {category.percentage?.toFixed(1)}%
                                </div>
                                <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(category.percentage || 0, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )) || (
                            <div className="text-center py-12 text-[var(--color-text-muted)]">
                              No category data available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// {/* Submissions Table */}
// {view === "submissions" && selectedQuiz && (
//   <div className="space-y-6">
//     <div className="flex items-center justify-between">
//       <div>
//         <h2 className="text-2xl font-bold text-[var(--color-text)]">
//           {quizReport?.quiz?.title ||
//             selectedQuiz?.title ||
//             "Quiz Report"}
//         </h2>
//         <p className="text-[var(--color-text-muted)]">
//           {quizReport?.totalStudents || 0} students submitted
//         </p>
//       </div>
//       <button
//         onClick={() => setView("quizzes")}
//         className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--color-muted)]/20 text-[var(--color-text)] border border-[var(--color-muted)]/30 rounded-xl hover:bg-[var(--color-muted)]/30 transition-all"
//       >
//         <ArrowLeft className="h-4 w-4" />
//         Back to Quizzes
//       </button>
//     </div>

//     {reportLoading ? (
//       <div className="flex items-center justify-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
//       </div>
//     ) : (
//       <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-[var(--color-muted)]/30">
//               <th className="py-4 text-left font-semibold text-[var(--color-text)]">
//                 S.No
//               </th>
//               <th className="py-4 text-left font-semibold text-[var(--color-text)]">
//                 Student Name
//               </th>
//               <th className="py-4 text-left font-semibold text-[var(--color-text)] hidden sm:table-cell">
//                 Department
//               </th>
//               <th className="py-4 text-right font-semibold text-[var(--color-text)]">
//                 Percentage
//               </th>
//               <th className="py-4 text-center font-semibold text-[var(--color-text)] w-16">
//                 View
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {quizReport?.students?.length > 0 ? (
//               quizReport.students.map((student, index) => (
//                 <tr
//                   key={student.studentId}
//                   className="border-b border-[var(--color-muted)]/20 hover:bg-[var(--color-surface)]/50 transition-colors"
//                 >
//                   <td className="py-4 font-medium text-[var(--color-text)]">
//                     {index + 1}
//                   </td>
//                   <td className="py-4 font-medium text-[var(--color-text)]">
//                     {student.studentName}
//                   </td>
//                   <td className="py-4 hidden sm:table-cell text-[var(--color-text-muted)]">
//                     {student.department}
//                   </td>
//                   <td className="py-4 text-right">
//                     <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-semibold">
//                       {student.percentage?.toFixed(1)}%
//                     </span>
//                   </td>
//                   <td className="py-4 text-center">
//                     <button
//                       onClick={() => {
//                         setSelectedStudent({
//                           quizId: selectedQuiz.id,
//                           studentId: student.studentId,
//                           studentName: student.studentName,
//                         });
//                         setView("student");
//                       }}
//                       className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-xl transition-all"
//                       title="View Details"
//                     >
//                       <Eye size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="py-12 text-center text-[var(--color-text-muted)]"
//                 >
//                   No submissions yet
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     )}
//   </div>
// )}

// {/* Student Details */}
// {view === "student" && selectedStudent && (
//   <div className="space-y-6">
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => {
//             setView("submissions");
//             setStudentReport(null);
//           }}
//           className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-2 -m-2 rounded-xl hover:bg-[var(--color-surface)]/50"
//         >
//           <ArrowLeft className="h-5 w-5" />
//           Back
//         </button>
//         <div>
//           <h2 className="text-2xl font-bold text-[var(--color-text)]">
//             Student Report
//           </h2>
//           <p className="text-[var(--color-text-muted)]">
//             {studentReport?.student?.name || "Loading..."}
//           </p>
//         </div>
//       </div>
//     </div>

//     {studentLoading ? (
//       <div className="flex items-center justify-center py-24">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
//       </div>
//     ) : (
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Quiz Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl">
//             <h3 className="font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
//               <Award className="h-5 w-5 text-yellow-500" />
//               Student Report
//             </h3>

//             {/* Student Info */}
//             <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
//                   <Users className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-bold text-[var(--color-text)]">
//                     {studentReport?.student?.name}
//                   </h4>
//                   <p className="text-sm text-[var(--color-text-muted)]">
//                     {studentReport?.student?.department}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <span className="text-xs text-[var(--color-text-muted)] block">
//                   Quiz Title
//                 </span>
//                 <p className="font-semibold">
//                   {studentReport?.quiz?.title}
//                 </p>
//               </div>
//               <div>
//                 <span className="text-xs text-[var(--color-text-muted)] block">
//                   Duration
//                 </span>
//                 <p className="text-sm">
//                   {formatDuration(
//                     studentReport?.quiz?.startTime,
//                     studentReport?.quiz?.endTime,
//                   )}
//                 </p>
//               </div>
//               <div className="p-3 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border border-[var(--color-primary)]/20 rounded-xl backdrop-blur-sm">
//                 <span className="text-xs text-[var(--color-text-muted)] block mb-2 uppercase tracking-wide">
//                   Performance Summary
//                 </span>

//                 <div className="flex items-end gap-4">
//                   {/* Total Questions */}
//                   <div className="flex-1 text-center">
//                     <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-0.5">
//                       {studentReport?.categories?.reduce(
//                         (sum, cat) => sum + cat.totalQuestions,
//                         0,
//                       ) || 0}
//                     </div>
//                     <span className="text-xs text-[var(--color-text-muted)]">
//                       Questions
//                     </span>
//                     <div className="w-12 h-1.5 bg-[var(--color-muted)]/30 rounded-full mx-auto mt-1">
//                       <div
//                         className="bg-blue-400 h-1.5 rounded-full"
//                         style={{ width: "100%" }}
//                       />
//                     </div>
//                   </div>

//                   {/* VS Icon */}
//                   <div className="text-lg font-black text-[var(--color-primary)] pb-1">
//                     VS
//                   </div>

//                   {/* Score Obtained */}
//                   <div className="flex-1 text-center">
//                     <div className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-0.5">
//                       {studentReport?.quiz?.totalScore || 0}
//                     </div>
//                     <span className="text-xs text-[var(--color-text-muted)]">
//                       Score
//                     </span>
//                     <div className="w-12 h-1.5 bg-[var(--color-muted)]/30 rounded-full mx-auto mt-1">
//                       <div
//                         className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full"
//                         style={{
//                           width: `${Math.min(((studentReport?.quiz?.totalScore || 0) / Math.max(studentReport?.categories?.reduce((sum, cat) => sum + cat.totalQuestions, 1) || 1)) * 100, 100)}%`,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4 border-t border-[var(--color-muted)]/30 text-center">
//                 <span className="text-3xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
//                   {studentReport?.quiz?.overallPercentage?.toFixed(1)}%
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Category Performance */}
//         <div className="lg:col-span-2">
//           <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl">
//             <h3 className="font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
//               <BarChart3 className="h-5 w-5" />
//               Category Performance
//             </h3>
//             <div className="space-y-4">
//               {studentReport?.categories?.map((category) => (
//                 <div
//                   key={category.categoryId}
//                   className="flex items-center justify-between p-4 border border-[var(--color-muted)]/20 rounded-xl hover:bg-[var(--color-surface)]/50 transition-all"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-xl flex items-center justify-center">
//                       <span className="text-sm font-semibold text-[var(--color-primary)]">
//                         {category.categoryName.slice(0, 3)}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-[var(--color-text)]">
//                         {category.categoryName}
//                       </p>
//                       <p className="text-xs text-[var(--color-text-muted)]">
//                         {category.correctAnswers}/
//                         {category.totalQuestions} correct
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
//                       {category.percentage?.toFixed(1)}%
//                     </div>
//                     <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
//                       <div
//                         className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
//                         style={{
//                           width: `${Math.min(category.percentage || 0, 100)}%`,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )) || (
//                 <div className="text-center py-12 text-[var(--color-text-muted)]">
//                   No category data available
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// )}
