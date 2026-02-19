import { useState } from "react";
import { 
  Trash2, 
  Phone, 
  CheckCircle, 
  Calendar,
  Search,
  ChevronDown,
  Filter,
  Edit3
} from "lucide-react";
import AdminHeader from "../../components/AdminHeader";

const sampleStudents = [
  {
    id: 1,
    name: "Stephenjoseph M",
    email: "sj9824384@gmail.com",
    mobile: "9087608722",
    department_id: 1,
    is_email_verified: 1,
    created_at: "2026-02-18T07:20:18.000Z"
  },
  {
    id: 2,
    name: "Lokesh",
    email: "lokeymrcat@gmail.com",
    mobile: "9087608722",
    department_id: 1,
    is_email_verified: 1,
    created_at: "2026-02-18T10:32:43.000Z"
  }
];

const departments = {
  1: "Computer Science",
  2: "Electronics", 
  3: "Mechanical"
};

export const StudentsManagement = () => {
  const [students, setStudents] = useState(sampleStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "All" || 
      departments[student.department_id] === departmentFilter;
    
    const matchesDate = !dateFilter || 
      formatDate(student.created_at).includes(dateFilter);

    return matchesSearch && matchesDepartment && matchesDate;
  });

  const handleDelete = (studentId) => {
    setStudentToDelete(studentId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      setStudents(prev => prev.filter(student => student.id !== studentToDelete));
    }
    setShowDeleteConfirm(false);
    setStudentToDelete(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminHeader title="Students Management" des={"Manage Students"}/>
        <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all whitespace-nowrap">
          + Add Student
        </button>
      </div>

      {/* Compact Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl bg-white/50 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
        </div>

        {/* Department Filter */}
        <div className="relative">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-4 py-2.5 pr-8 border border-gray-200 rounded-xl bg-white/50 focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all text-sm appearance-none"
          >
            <option>All</option>
            <option>Computer Science</option>
            <option>Electronics</option>
            <option>Mechanical</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <input
            type="text"
            placeholder="Date..."
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-2.5 pr-8 border border-gray-200 rounded-xl bg-white/50 focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all text-sm"
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Compact Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">
                  #
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">
                  Name
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs hidden lg:table-cell">
                  Email
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs hidden md:table-cell">
                  Mobile
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">
                  Dept
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs hidden sm:table-cell">
                  Verified
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">
                  Joined
                </th>
                <th className="px-4 py-4 text-right font-semibold text-gray-700 uppercase tracking-wide text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors h-12">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-900 text-sm">{index + 1}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 text-sm">
                      {student.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="text-xs font-mono text-gray-900 truncate max-w-[150px]" title={student.email}>
                      {student.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-xs font-mono text-gray-900">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {student.mobile}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-lg">
                      {departments[student.department_id] || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {student.is_email_verified ? (
                      <div className="flex items-center gap-1 text-xs font-medium text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Yes
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {formatDate(student.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compact Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-bold text-gray-900 mb-2">No students found</h3>
            <p className="text-sm text-gray-500 mb-4">Adjust your filters</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - SAME AS BEFORE */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Student?</h3>
              <p className="text-gray-600">This action cannot be undone. This will permanently delete the student account.</p>
            </div>
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold shadow-lg hover:shadow-xl"
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
