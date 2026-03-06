import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Loader2,
  Users,
} from "lucide-react";
import { adminAPI } from "../../services/api";
import AdminHeader from "../../components/AdminHeader.jsx";
const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [messageTimeout, setMessageTimeout] = useState(null);

  // Roles from your data + common ones
  const roles = ["all", "SUPER_ADMIN", "ADMIN", "TRAINER", "PO", "SALES", "HR"];

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees when search/role changes
  useEffect(() => {
    const filtered = employees.filter((emp) => {
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "all" || emp.role === selectedRole;
      return matchesSearch && matchesRole;
    });
    setFilteredEmployees(filtered);
  }, [employees, searchTerm, selectedRole]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getEmployees();
      if (response.data.success) {
        setEmployees(response.data.data);
        setFilteredEmployees(response.data.data);
      }
    } catch (error) {
      showMessage("error", "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    if (messageTimeout) clearTimeout(messageTimeout);
    const timeout = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    setMessageTimeout(timeout);
  };
  // Updated getRoleBadgeStyle function (No Green/Red):
  const getRoleBadgeStyle = (role) => {
    const roleStyles = {
      SUPER_ADMIN: {
        gradient:
          "from-[var(--color-purple-stat)]/15 to-[var(--color-indigo-stat)]/15",
        text: "text-[var(--color-purple-stat)]",
        border: "border-[var(--color-purple-stat)]/25",
      },
      ADMIN: {
        gradient:
          "from-[var(--color-indigo-stat)]/15 to-[var(--color-purple-stat-light)]/15",
        text: "text-[var(--color-indigo-stat)]",
        border: "border-[var(--color-indigo-stat)]/25",
      },
      TRAINER: {
        gradient:
          "from-[var(--color-blue-stat)]/15 to-[var(--color-blue-stat-light)]/15",
        text: "text-[var(--color-blue-stat)]",
        border: "border-[var(--color-blue-stat)]/25",
      },
      PO: {
        gradient:
          "from-[var(--color-orange-stat)]/15 to-[var(--color-warning-light)]/15",
        text: "text-[var(--color-orange-stat)]",
        border: "border-[var(--color-orange-stat)]/25",
      },
      SALES: {
        gradient:
          "from-[var(--color-warning)]/15 to-[var(--color-warning-light)]/15",
        text: "text-[var(--color-warning)]",
        border: "border-[var(--color-warning)]/25",
      },
      HR: {
        gradient:
          "from-[var(--color-primary)]/15 to-[var(--color-secondary)]/15",
        text: "text-[var(--color-primary)]",
        border: "border-[var(--color-primary)]/25",
      },
      default: {
        gradient:
          "from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10",
        text: "text-[var(--color-primary)]",
        border: "border-[var(--color-primary)]/20",
      },
    };

    return roleStyles[role] || roleStyles.default;
  };

  // Replace the toggleActive function with this:
  const toggleActive = async (id, isActive) => {
    try {
      // Call correct endpoint based on current status
      const apiCall = isActive
        ? adminAPI.deactivateEmployee
        : adminAPI.activateEmployee;
      const response = await apiCall(id);

      if (response.data.success) {
        showMessage(
          "success",
          `Employee ${isActive ? "deactivated" : "activated"} successfully!`,
        );
        fetchEmployees(); // Refresh list
      }
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message ||
          `Failed to ${isActive ? "deactivate" : "activate"} employee`,
      );
    }
  };

  const handleDelete = async () => {
    try {
      const response = await adminAPI.deleteEmployee(deleteDialog.id);
      if (response.data.success) {
        showMessage("success", "Employee deleted successfully!");
        setDeleteDialog({ open: false, id: null, name: "" });
        fetchEmployees(); // Refresh list
      }
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Failed to delete employee",
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen  relative overflow-hidden ">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <AdminHeader title={"Employees"} des={"Manage your team members"} />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchEmployees}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/90 hover:bg-[var(--color-primary)] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Refresh
            </button>
          </div>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div
            className={`p-4 rounded-xl border-l-4 flex items-center gap-3 shadow-md animate-in slide-in-from-top-4 ${
              message.type === "success"
                ? "bg-[var(--color-success)]/10 border-[var(--color-success)]/40 text-[var(--color-success)]"
                : "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/40 text-[var(--color-danger)]"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="text"
                placeholder="Search employees by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 h-12 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-[var(--color-card)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70"
              />
            </div>

            {/* Role Filter */}
            <div className="relative flex-1 sm:flex-none min-w-[140px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-11 pr-4 py-3 h-12 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-[var(--color-card)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70 appearance-none cursor-pointer"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === "all" ? "All Roles" : role}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-[var(--color-text-muted)] font-medium self-center whitespace-nowrap">
              {filteredEmployees.length} employees
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--color-muted)]/20">
                  <th className="py-4 text-left font-semibold text-[var(--color-text)] tracking-wide w-28 sm:w-auto">
                    Name
                  </th>
                  <th className="py-4 text-left font-semibold text-[var(--color-text)] tracking-wide">
                    Email
                  </th>
                  <th className="py-4 text-left font-semibold text-[var(--color-text)] tracking-wide w-24 sm:w-auto">
                    Role
                  </th>
                  <th className="py-4 text-left font-semibold text-[var(--color-text)] tracking-wide hidden lg:inline-block">
                    Created
                  </th>
                  <th className="py-4 text-center font-semibold text-[var(--color-text)] tracking-wide w-32">
                    Status
                  </th>
                  <th className="py-4 text-center font-semibold text-[var(--color-text)] tracking-wide w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex items-center justify-center gap-3 text-[var(--color-text-muted)]">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Loading employees...</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="text-[var(--color-text-muted)] space-y-2">
                        <Users className="h-12 w-12 mx-auto opacity-50" />
                        <p className="text-lg font-medium">
                          No employees found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-b border-[var(--color-muted)]/10 hover:bg-[var(--color-card)]/30 transition-all duration-200"
                    >
                      <td className="py-4 font-bold text-[var(--color-text)] truncate max-w-[150px]">
                        {emp.name}
                      </td>
                      <td className="py-4 text-[var(--color-text)]/90 truncate">
                        {emp.email}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1.5 bg-gradient-to-r ${getRoleBadgeStyle(emp.role).gradient} ${getRoleBadgeStyle(emp.role).text} ${getRoleBadgeStyle(emp.role).border} border rounded-full text-xs font-semibold shadow-sm`}
                        >
                          {emp.role}
                        </span>
                      </td>
                      <td className="py-4 hidden lg:inline-block text-[var(--color-text-muted)] text-sm">
                        {formatDate(emp.created_at)}
                      </td>

                      <td className="py-4 text-center">
                        <button
                          onClick={() =>
                            toggleActive(emp.id, emp.is_active === 1)
                          } // ✅ Use === 1 for boolean check
                          className={`px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 whitespace-nowrap border hover:scale-[1.02] ${
                            emp.is_active === 1
                              ? "bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/40 hover:shadow-md border-[var(--color-success)]/30"
                              : "bg-[var(--color-danger)]/20 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/40 hover:shadow-md border-[var(--color-danger)]/30"
                          }`}
                        >
                          {emp.is_active === 1 ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              id: emp.id,
                              name: emp.name,
                            })
                          }
                          className="p-2.5 bg-[var(--color-danger)]/20 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/40 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Delete Employee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-[var(--color-card)]/95 border border-[var(--color-muted)]/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[var(--color-danger)]/10 border-2 border-[var(--color-danger)]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-[var(--color-danger)]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-2">
                Delete Employee?
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6">
                Are you sure you want to permanently delete{" "}
                <strong>{deleteDialog.name}</strong>? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteDialog({ open: false, id: null, name: "" })
                }
                className="flex-1 px-4 py-2.5 bg-[var(--color-card)]/50 text-[var(--color-text)] border border-[var(--color-muted)]/50 rounded-xl hover:bg-[var(--color-card)] hover:shadow-md transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-[var(--color-danger)] text-white rounded-xl hover:bg-[var(--color-danger)]/90 shadow-lg hover:shadow-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
