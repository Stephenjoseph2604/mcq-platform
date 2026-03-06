// SettingsPage.jsx
import { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  UserPlus,
} from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { categoriesAPI, departmentAPI } from "../../services/api";
import Loader from "../../components/Loader";

const initialAdmins = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "ADMIN",
    created_at: "2025-01-10 09:30:00",
    active: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "SUPER_ADMIN",
    created_at: "2025-01-12 14:20:00",
    active: false,
  },
];

const initialRequests = [
  {
    id: 1,
    name: "Alice Brown",
    email: "alice@example.com",
    created_at: "2025-01-15 11:45:00",
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob@example.com",
    created_at: "2025-01-16 16:10:00",
  },
];

export const SettingsPage = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [requests, setRequests] = useState(initialRequests);
  const [showRequests, setShowRequests] = useState(false);

  // Category CRUD
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      if (response.data?.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      setSaving(true);
      const response = await categoriesAPI.create(newCategory.trim());
      if (response.data?.success) {
        fetchCategories();
        setNewCategory("");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = (id) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setEditCategoryId(id);
      setEditCategoryName(category.name);
    }
  };

  const handleSaveCategory = async () => {
    if (!editCategoryName.trim()) return;

    try {
      setSaving(true);
      const response = await categoriesAPI.update(
        editCategoryId,
        editCategoryName.trim(),
      );

      if (response.data?.success) {
        fetchCategories();
        setEditCategoryId(null);
        setEditCategoryName("");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setSaving(true);
      await categoriesAPI.delete(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setSaving(false);
    }
  };

  const [departments, setDepartments] = useState([]);
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptName, setNewDeptName] = useState("");
  const [editDeptId, setEditDeptId] = useState(null);
  const [editDeptCode, setEditDeptCode] = useState("");
  const [editDeptName, setEditDeptName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAll();
      if (response.data?.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDeptCode.trim() || !newDeptName.trim()) return;

    try {
      setSaving(true);
      const response = await departmentAPI.create(
        newDeptCode.trim(),
        newDeptName.trim(),
      );
      if (response.data?.success) {
        fetchDepartments();
      }
    } catch (error) {
      console.error("Error adding department:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditDepartment = (id) => {
    const dept = departments.find((dept) => dept.id === id);
    if (dept) {
      setEditDeptId(id);
      setEditDeptCode(dept.code);
      setEditDeptName(dept.name);
    }
  };

  const handleSaveDepartment = async () => {
    if (!editDeptCode.trim() || !editDeptName.trim()) return;

    try {
      setSaving(true);
      const response = await departmentAPI.update(
        editDeptId,
        editDeptCode.trim(),
        editDeptName.trim(),
      );
      if (response.data?.success) {
        fetchDepartments();
        setEditDeptId(null);
        setEditDeptCode("");
        setEditDeptName("");
      }
    } catch (error) {
      console.error("Error updating department:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      setSaving(true);
      await departmentAPI.delete(id);
      setDepartments(departments.filter((dept) => dept.id !== id));
    } catch (error) {
      console.error("Error deleting department:", error);
    } finally {
      setSaving(false);
    }
  };

  // Admin CRUD / toggle active
  const handleToggleAdminStatus = (id) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    );
  };

  // Admin Requests: Accept / Reject
  const handleAcceptRequest = (id) => {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    const newAdmin = {
      id: Math.max(...admins.map((a) => a.id), 0) + 1,
      name: req.name,
      email: req.email,
      role: "ADMIN",
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      active: true,
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRejectRequest = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) {
    return <Loader message="Loading" />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <AdminHeader
        title={"Admin Settings"}
        des={"Manage categories, departments, and admin accounts"}
      />

      {/* Categories & Departments - Stacked on mobile */}
      <div className="space-y-4 sm:space-y-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
        {/* Categories */}
        <div className="bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl shadow-2xl backdrop-blur-sm flex flex-col h-[480px] sm:h-[520px]">
          {/* Header - Compact for mobile */}
          <div className="p-3 sm:p-4 border-b border-[var(--color-muted)]/20 flex-shrink-0 h-[130px] sm:h-[140px]">
            <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2.5 sm:mb-3">
              Categories
            </h2>
            {/* Compact input + button */}
            <div className="flex items-center gap-1.5 sm:gap-2 h-[34px] sm:h-[38px]">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                disabled={saving}
                className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-[var(--color-muted)]/20 rounded-xl focus:ring-1 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-xs sm:text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 shadow-sm hover:shadow-md transition-all h-full"
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategory.trim() || saving}
                className="w-16 sm:w-20 h-[30px] sm:h-[34px] bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--color-primary)]/20 flex-shrink-0"
              >
                <Plus size={12} className="sm:[size=14]" />
                {saving ? "..." : "Add"}
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-secondary)]/40 scrollbar-track-[var(--color-card)]">
            <div className="py-2.5 sm:py-3 px-1.5 sm:px-2 space-y-2.5 sm:space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between px-3.5 sm:px-4 py-3.5 border border-[var(--color-muted)]/15 rounded-xl hover:border-[var(--color-secondary)]/20 hover:bg-[var(--color-card)]/30 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
                >
                  {editCategoryId === cat.id ? (
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 flex-1 w-full">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveCategory();
                          if (e.key === "Escape") {
                            setEditCategoryId(null);
                            setEditCategoryName("");
                          }
                        }}
                        className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-[var(--color-muted)]/20 rounded-xl focus:ring-1 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-xs sm:text-sm text-[var(--color-text)] shadow-sm hover:shadow-md transition-all"
                      />
                      <button
                        onClick={handleSaveCategory}
                        disabled={!editCategoryName.trim() || saving}
                        className="w-9 sm:w-10 h-9 sm:h-10 bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/40 hover:scale-105 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                      >
                        <CheckCircle size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-[var(--color-text)] flex-1 font-medium text-xs sm:text-sm truncate">
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-1 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleEditCategory(cat.id)}
                          disabled={saving}
                          className="p-1.5 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/20 hover:scale-105 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                          <Edit size={13} className="sm:[size=14]" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          disabled={saving}
                          className="p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20 hover:scale-105 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                          <Trash2 size={13} className="sm:[size=14]" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {categories.length === 0 && !loading && (
                <div className="text-center py-10 text-[var(--color-text-muted)] text-xs sm:text-sm">
                  No categories found. Add one above!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl shadow-2xl backdrop-blur-sm flex flex-col h-[480px] sm:h-[520px]">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-[var(--color-muted)]/20 flex-shrink-0 h-[130px] sm:h-[140px]">
            <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2.5 sm:mb-3">
              Departments
            </h2>
            {/* Compact 2-input layout */}
            <div className="space-y-1.5 h-[64px] sm:h-[68px]">
              <input
                type="text"
                value={newDeptCode}
                onChange={(e) => setNewDeptCode(e.target.value)}
                placeholder="Code (CSE, MECH...)"
                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-[var(--color-muted)]/20 rounded-xl focus:ring-1 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-xs sm:text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 shadow-sm hover:shadow-md transition-all h-[26px] sm:h-[28px]"
              />
              <div className="flex items-center gap-1.5 sm:gap-2 h-[30px] sm:h-[34px]">
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="Full name"
                  className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-[var(--color-muted)]/20 rounded-xl focus:ring-1 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-xs sm:text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 shadow-sm hover:shadow-md transition-all h-full"
                />
                <button
                  onClick={handleAddDepartment}
                  disabled={saving}
                  className="w-16 sm:w-20 h-[30px] sm:h-[34px] bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--color-primary)]/20 flex-shrink-0"
                >
                  <Plus size={12} className="sm:[size=14]" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-secondary)]/40 scrollbar-track-[var(--color-card)]">
            <div className="py-2.5 sm:py-3 px-1.5 sm:px-2 space-y-2.5 sm:space-y-3">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between px-3.5 sm:px-4 py-3.5 border border-[var(--color-muted)]/15 rounded-xl hover:border-[var(--color-secondary)]/20 hover:bg-[var(--color-card)]/30 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
                >
                  {editDeptId === dept.id ? (
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 flex-1 w-full">
                      <input
                        type="text"
                        value={editDeptCode}
                        onChange={(e) => setEditDeptCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveDepartment();
                          if (e.key === "Escape") {
                            setEditDeptId(null);
                            setEditDeptCode("");
                            setEditDeptName("");
                          }
                        }}
                        className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-[var(--color-muted)]/20 rounded-xl focus:ring-1 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-xs sm:text-sm text-[var(--color-text)] shadow-sm hover:shadow-md transition-all"
                        placeholder="Code"
                      />
                      <input
                        type="text"
                        value={editDeptName}
                        onChange={(e) => setEditDeptName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveDepartment();
                          if (e.key === "Escape") {
                            setEditDeptId(null);
                            setEditDeptCode("");
                            setEditDeptName("");
                          }
                        }}
                        className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-[var(--color-muted)]/20 rounded-xl focus:ring-1 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)]/40 outline-none bg-[var(--color-card)]/70 backdrop-blur-sm text-xs sm:text-sm text-[var(--color-text)] shadow-sm hover:shadow-md transition-all"
                        placeholder="Name"
                      />
                      <button
                        onClick={handleSaveDepartment}
                        disabled={saving}
                        className="w-9 sm:w-10 h-9 sm:h-10 bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/40 hover:scale-105 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                      >
                        <CheckCircle size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-[var(--color-text)] flex-1 font-medium text-xs sm:text-sm truncate">
                        {dept.code} – {dept.name}
                      </span>
                      <div className="flex items-center gap-1 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleEditDepartment(dept.id)}
                          disabled={saving}
                          className="p-1.5 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/20 hover:scale-105 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                          <Edit size={13} className="sm:[size=14]" />
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
                          disabled={saving}
                          className="p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20 hover:scale-105 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                          <Trash2 size={13} className="sm:[size=14]" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {departments.length === 0 && !loading && (
                <div className="text-center py-10 text-[var(--color-text-muted)] text-xs sm:text-sm">
                  No departments found. Add one above!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Section - Full width always */}
      <div className="space-y-4 sm:space-y-5">
        {/* Admin buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center mb-3 ">
          <button
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:from-[var(--color-primary)]/90 hover:to-[var(--color-secondary)]/90 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 border border-[var(--color-primary)]/20 flex-shrink-0"
            title="Add Admin"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setShowRequests((prev) => !prev)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 h-10 sm:h-11 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 rounded-xl hover:bg-[var(--color-secondary)]/20 hover:shadow-md shadow-sm backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm font-medium flex-1 sm:flex-none"
          >
            <Eye size={14} />
            {showRequests ? "Hide Requests" : "See Requests"}
          </button>
        </div>

        {/* Admin Requests Table (if visible) */}
        {showRequests && (
          <div className="bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm max-h-[280px] overflow-auto">
            <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-3 sm:mb-4">
              Admin Requests
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-muted)]/20">
                    <th className="py-2.5 sm:py-3 text-left font-semibold text-[var(--color-text)] tracking-wide w-24 sm:w-auto">
                      Name
                    </th>
                    <th className="py-2.5 sm:py-3 text-left font-semibold text-[var(--color-text)] tracking-wide">
                      Email
                    </th>
                    <th className="py-2.5 sm:py-3 text-left font-semibold text-[var(--color-text)] tracking-wide hidden md:inline-block">
                      Requested At
                    </th>
                    <th className="py-2.5 sm:py-3 text-center font-semibold text-[var(--color-text)] tracking-wide w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-[var(--color-muted)]/10 hover:bg-[var(--color-card)]/30 transition-all duration-200"
                    >
                      <td className="py-2.5 sm:py-3 font-medium text-[var(--color-text)] truncate max-w-[120px]">
                        {req.name}
                      </td>
                      <td className="py-2.5 sm:py-3 text-[var(--color-text)] truncate">
                        {req.email}
                      </td>
                      <td className="py-2.5 sm:py-3 hidden md:inline-block text-[var(--color-text-muted)]">
                        {req.created_at}
                      </td>
                      <td className="py-2.5 sm:py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="p-1.5 sm:p-2 bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/40 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                            title="Accept"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="p-1.5 sm:p-2 bg-[var(--color-danger)]/20 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/40 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Table */}
        <div className="bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-sm max-h-[280px] sm:max-h-none overflow-auto">
          <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2.5 sm:mb-3">
            Admins
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--color-muted)]/20">
                  <th className="py-2 sm:py-3 text-left font-semibold text-[var(--color-text)] tracking-wide w-20 sm:w-auto">
                    Name
                  </th>
                  <th className="py-2 sm:py-3 text-left font-semibold text-[var(--color-text)] tracking-wide">
                    Email
                  </th>
                  <th className="py-2 sm:py-3 text-left font-semibold text-[var(--color-text)] tracking-wide w-20 sm:w-auto">
                    Role
                  </th>
                  <th className="py-2 sm:py-3 text-left font-semibold text-[var(--color-text)] tracking-wide hidden md:inline-block">
                    Created At
                  </th>
                  <th className="py-2 sm:py-3 text-center font-semibold text-[var(--color-text)] tracking-wide w-24">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-[var(--color-muted)]/10 hover:bg-[var(--color-card)]/30 transition-all duration-200"
                  >
                    <td className="py-2 sm:py-3 font-medium text-[var(--color-text)] truncate max-w-[100px]">
                      {admin.name}
                    </td>
                    <td className="py-2 sm:py-3 text-[var(--color-text)] truncate">
                      {admin.email}
                    </td>
                    <td className="py-2 sm:py-3 font-medium text-[var(--color-secondary)] truncate w-20">
                      {admin.role}
                    </td>
                    <td className="py-2 sm:py-3 hidden md:inline-block text-[var(--color-text-muted)]">
                      {admin.created_at}
                    </td>
                    <td className="py-2 sm:py-3 text-center">
                      <button
                        onClick={() => handleToggleAdminStatus(admin.id)}
                        className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 whitespace-nowrap ${
                          admin.active
                            ? "bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/40 hover:shadow-md border border-[var(--color-success)]/30"
                            : "bg-[var(--color-danger)]/20 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/40 hover:shadow-md border border-[var(--color-danger)]/30"
                        }`}
                      >
                        {admin.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
