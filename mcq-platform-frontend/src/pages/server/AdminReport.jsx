import { useState } from "react";
import { Eye, Clock, Users, Award, BarChart3, Tag } from "lucide-react";

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
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [view, setView] = useState("quizzes"); // "quizzes" | "submissions" | "student"

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diff = (endTime - startTime) / 1000 / 60; // minutes
    return `${Math.floor(diff)} min ${Math.round((diff % 1) * 60)} sec`;
  };
const calcStrokeDashoffset = (percentage) => {
  const circumference = 2 * Math.PI * 42; // r=42
  return circumference * (1 - percentage / 100);
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
          {sampleQuizzes.map((quiz) => (
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

                  {/* Quiz Code - Clean & Prominent */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border border-[var(--color-primary)]/20 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />
                    <div>
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
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {quiz.categories.slice(0, 3).map((cat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-medium rounded-lg"
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
                {selectedQuiz.title}
              </h2>
              <p className="text-[var(--color-text-muted)]">
                {sampleSubmissions[selectedQuiz.id]?.totalStudents || 0}{" "}
                students submitted
              </p>
            </div>
            <button
              onClick={() => setView("quizzes")}
              className="px-6 py-2 bg-[var(--color-muted)]/20 text-[var(--color-text)] border border-[var(--color-muted)]/30 rounded-xl hover:bg-[var(--color-muted)]/30 transition-all"
            >
              ← Back to Quizzes
            </button>
          </div>

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
                {sampleSubmissions[selectedQuiz.id]?.students?.map(
                  (student, index) => (
                    <tr
                      key={student.studentId}
                      className="border-b border-[var(--color-muted)]/20 hover:bg-[var(--color-surface)]/50"
                    >
                      <td className="py-4 font-medium">{index + 1}</td>
                      <td className="py-4">{student.studentName}</td>
                      <td className="py-4 hidden sm:table-cell">
                        {student.department}
                      </td>
                      <td className="py-4 text-right">
                        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-semibold">
                          {student.percentage}%
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudent({
                              quizId: selectedQuiz.id,
                              studentId: student.studentId,
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
                  ),
                ) || (
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
        </div>
      )}

      {/* Student Details */}
      {view === "student" && selectedStudent && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView("submissions")}
                className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                ← Back
              </button>
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">
                  Student Report
                </h2>
                <p className="text-[var(--color-text-muted)]">
                  {
                    sampleStudentDetails[
                      `${selectedStudent.quizId}-${selectedStudent.studentId}`
                    ]?.student?.name
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quiz Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Student Report
                </h3>

                {/* Student Info - NEW */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[var(--color-text)]">
                        {
                          sampleStudentDetails[
                            `${selectedStudent.quizId}-${selectedStudent.studentId}`
                          ]?.student?.name
                        }
                      </h4>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {
                          sampleStudentDetails[
                            `${selectedStudent.quizId}-${selectedStudent.studentId}`
                          ]?.student?.department
                        }
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
                      {
                        sampleStudentDetails[
                          `${selectedStudent.quizId}-${selectedStudent.studentId}`
                        ]?.quiz?.title
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)] block">
                      Duration
                    </span>
                    <p className="text-sm">
                      {formatDuration(
                        sampleStudentDetails[
                          `${selectedStudent.quizId}-${selectedStudent.studentId}`
                        ]?.quiz?.startTime,
                        sampleStudentDetails[
                          `${selectedStudent.quizId}-${selectedStudent.studentId}`
                        ]?.quiz?.endTime,
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)] block">
                      Total Score
                    </span>
                    <p className="text-2xl font-bold text-[var(--color-primary)]">
                      {
                        sampleStudentDetails[
                          `${selectedStudent.quizId}-${selectedStudent.studentId}`
                        ]?.quiz?.totalScore
                      }
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-muted)]/30 text-center">
                    <span className="text-3xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                      {
                        sampleStudentDetails[
                          `${selectedStudent.quizId}-${selectedStudent.studentId}`
                        ]?.quiz?.overallPercentage
                      }
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
                  {sampleStudentDetails[
                    `${selectedStudent.quizId}-${selectedStudent.studentId}`
                  ]?.categories?.map((category, index) => (
                    <div
                      key={category.categoryId}
                      className="flex items-center justify-between p-4 border border-[var(--color-muted)]/20 rounded-xl hover:bg-[var(--color-surface)]/50"
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
                            {category.correctAnswers}/{category.totalQuestions}{" "}
                            correct
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                          {category.percentage}%
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
