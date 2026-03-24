import { useEffect, useState } from "react";
import {
  Trash2,
  Phone,
  CheckCircle,
  Calendar,
  Search,
  ChevronDown,
  Filter,
  Edit3,
  Mail,
  MoreHorizontal,
  Building2,
  User,
  Hash,
  Users,
} from "lucide-react";
import AdminHeader from "../../../../components/AdminHeader";
import { departmentAPI, studentAPI } from "../../../../services/api";
import Loader from "../../../../components/Loader";

// const sampleStudents = [
//   {
//     id: 1,
//     name: "Stephenjoseph M",
//     email: "sj9824384@gmail.com",
//     mobile: "9087608722",
//     department_id: 1,
//     is_email_verified: 1,
//     created_at: "2026-02-18T07:20:18.000Z"
//   },
//   {
//     id: 2,
//     name: "Lokesh",
//     email: "lokeymrcat@gmail.com",
//     mobile: "9087608722",
//     department_id: 1,
//     is_email_verified: 1,
//     created_at: "2026-02-18T10:32:43.000Z"
//   }
// ];

// const departments = {
//   1: "Computer Science",
//   2: "Electronics",
//   3: "Mechanical"
// };

export const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]); // Changed to array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState(""); // Changed to empty string
  const [dateFilter, setDateFilter] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Fetch students and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch students
        const studentResponse = await studentAPI.getAll();
        if (studentResponse.data.success) {
          setStudents(studentResponse.data.data);
        }

        // Fetch departments as array
        const deptResponse = await departmentAPI.getAll();
        if (deptResponse.data.success) {
          setDepartments(deptResponse.data.data); // Store full array
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredStudents = students.filter((student) => {
    // Search filter (name OR email)
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Department filter (using department_id)
    const matchesDepartment =
      !departmentFilter ||
      student.department_id.toString() === departmentFilter;

    // Date filter
    const matchesDate =
      !dateFilter || formatDate(student.created_at).includes(dateFilter);

    return matchesSearch && matchesDepartment && matchesDate;
  });

  const handleDelete = (studentId) => {
    setStudentToDelete(studentId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        // Call delete API (you'll need to implement this in studentAPI)
        await studentAPI.delete(studentToDelete);
        setStudents((prev) =>
          prev.filter((student) => student.id !== studentToDelete),
        );
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
    setShowDeleteConfirm(false);
    setStudentToDelete(null);
  };

  if (loading) {
    return (
        <Loader message="Fetching Quiz..." />
    );
  }
  if (error) return <div className="p-4 text-red-500">{error}</div>;

return (
  <div className="p-4 sm:p-6 space-y-6 min-h-screen bg-[var(--color-bg)]">
    {/* Compact Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <AdminHeader title="Students Management" des={"Manage Students"} />
      <button className="px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-text)] font-medium rounded-xl transition-all whitespace-nowrap shadow-lg hover:shadow-xl">
        + Add Student
      </button>
    </div>

    {/* Compact Filters */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[var(--color-card)] backdrop-blur-sm border border-[var(--color-muted)]/30 rounded-2xl p-4 shadow-lg">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
        <input
          type="text"
          placeholder="Search name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 w-full border border-[var(--color-muted)]/50 rounded-xl bg-[var(--color-card)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all text-sm placeholder-[var(--color-text-muted)]"
        />
      </div>

      {/* Department Filter */}
      <div className="relative">
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full px-4 py-2.5 pr-8 border border-[var(--color-muted)]/50 rounded-xl bg-[var(--color-card)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all text-sm appearance-none"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
      </div>

      {/* Date Filter */}
      <div className="relative sm:col-span-1 lg:col-span-1">
        <input
          type="text"
          placeholder="Filter by date..."
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full px-4 py-2.5 pr-8 border border-[var(--color-muted)]/50 rounded-xl bg-[var(--color-card)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all text-sm placeholder-[var(--color-text-muted)]"
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
      </div>
    </div>

    {/* Ultra-Compact Table */}
    <div className="bg-[var(--color-card)] backdrop-blur-xl border border-[var(--color-muted)]/30 rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead className="bg-[var(--color-muted)]/10 sticky top-0">
            <tr>
              <th className="px-2 py-3 w-9 text-center">
                <Hash className="w-3.5 h-3.5 mx-auto text-[var(--color-text-muted)]" />
              </th>
              <th className="px-2.5 py-3 min-w-[100px]">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" />
                  <span className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide">
                    Name
                  </span>
                </div>
              </th>
              <th className="px-2 py-3 hidden lg:table-cell w-20">
                <div className="flex items-center gap-1 justify-start">
                  <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" />
                  <span className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide">
                    Email
                  </span>
                </div>
              </th>
              <th className="px-2 py-3 hidden lg:table-cell w-20">
                <Phone className="w-3.5 h-3.5 mx-auto text-[var(--color-text-muted)]" />
              </th>
              <th className="px-2 py-3 w-16 text-center">
                <Building2 className="w-3.5 h-3.5 mx-auto text-[var(--color-text-muted)]" />
              </th>
              <th className="px-2 py-3 hidden lg:table-cell w-12 text-center">
                <CheckCircle className="w-3.5 h-3.5 mx-auto text-[var(--color-text-muted)]" />
              </th>
              <th className="px-2 py-3 hidden lg:table-cell w-20">
                <Calendar className="w-3.5 h-3.5 ml-1 text-[var(--color-text-muted)]" />
              </th>
              <th className="px-2 py-3 w-18 text-right">
                <MoreHorizontal className="w-3.5 h-3.5 mr-1 text-[var(--color-text-muted)]" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-muted)]/20">
            {filteredStudents.map((student, index) => (
              <tr
                key={student.id}
                className="hover:bg-[var(--color-muted)]/10 transition-all h-14 border-b border-[var(--color-muted)]/10 last:border-b-0"
              >
                {/* S.No */}
                <td className="px-2 py-3 w-9 text-center">
                  <span className="font-mono font-semibold text-[var(--color-text)] text-xs">
                    {index + 1}
                  </span>
                </td>

                {/* Name */}
                <td className="px-2.5 py-3">
                  <div
                    className="font-semibold text-[var(--color-text)] text-sm line-clamp-1"
                    title={student.name}
                  >
                    {student.name}
                  </div>
                </td>

                {/* Email */}
                <td className="px-2 py-3 hidden lg:table-cell w-20">
                  <div
                    className="text-xs font-mono text-[var(--color-text)] truncate"
                    title={student.email}
                  >
                    {student.email}
                  </div>
                </td>

                {/* Mobile */}
                <td className="px-2 py-3 hidden lg:table-cell w-20">
                  <div className="text-xs font-mono text-[var(--color-text)] truncate flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5 text-[var(--color-text-muted)]" />
                    {student.mobile.slice(-10)}
                  </div>
                </td>

                {/* Department */}
                <td className="px-2 py-3 w-16 text-center">
                  <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold rounded-full border border-[var(--color-primary)]/30 whitespace-nowrap">
                    {departments.find((d) => d.id === student.department_id)
                      ?.code || "Unknown"}
                  </span>
                </td>

                {/* Verified */}
                <td className="px-2 py-3 hidden lg:table-cell w-12 text-center">
                  <div
                    className={`p-1.5 rounded-full ${
                      student.is_email_verified
                        ? "bg-[var(--color-success)]/20 border-[var(--color-success)]/30"
                        : "bg-[var(--color-danger)]/20 border-[var(--color-danger)]/30"
                    }`}
                  >
                    {student.is_email_verified ? (
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--color-success)]" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-[var(--color-danger)]" />
                    )}
                  </div>
                </td>

                {/* Joined */}
                <td className="px-2 py-3 hidden lg:table-cell w-20">
                  <div
                    className="text-xs font-medium text-[var(--color-text-muted)] truncate"
                    title={formatDate(student.created_at)}
                  >
                    {formatDate(student.created_at)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-2 py-3 w-18 text-right pr-1">
                  <div className="flex items-center justify-end gap-0.5 -space-x-0.5">
                    <button
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg w-7 h-7 transition-all"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="p-1.5 text-[var(--color-danger)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-lg w-7 h-7 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-16 px-4">
          <Users className="mx-auto h-16 w-16 text-[var(--color-text-muted)] mb-4" />
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
            No students found
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setDepartmentFilter("");
              setDateFilter("");
            }}
            className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-text)] text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>

    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-[var(--color-bg)]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--color-card)] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[var(--color-muted)]/30">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[var(--color-danger)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-[var(--color-danger)]/30">
              <Trash2 className="w-10 h-10 text-[var(--color-danger)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
              Delete Student?
            </h3>
            <p className="text-[var(--color-text-muted)]">
              This action cannot be undone. This will permanently delete the
              student account.
            </p>
          </div>
          <div className="flex gap-4 pt-6 border-t border-[var(--color-muted)]/30">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-6 py-3 bg-[var(--color-muted)]/20 hover:bg-[var(--color-muted)]/30 text-[var(--color-text-muted)] rounded-xl transition-all font-medium border border-[var(--color-muted)]/30"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-6 py-3 bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/90 text-[var(--color-text)] rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};
