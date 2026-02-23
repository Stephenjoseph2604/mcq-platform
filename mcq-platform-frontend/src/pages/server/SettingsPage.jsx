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
        fetchCategories()
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
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-4 shadow-xl flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <AdminHeader
        title={"Admin Settings"}
        des={"Manage categories, departments, and admin accounts"}
      />

      {/* Categories & Departments (responsive grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  ">
        {/* Categories */}
        <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-4 shadow-xl flex flex-col">
          <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)] mb-3 sm:mb-4">
            Categories
          </h2>

          {/* Add Category */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              disabled={saving}
              className="flex-1 px-3 py-2 border border-[var(--color-muted)]/30 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategory.trim() || saving}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-all duration-200 flex items-center gap-1.5 self-start disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              {saving ? "Adding..." : "Add"}
            </button>
          </div>

          {/* Category List (scrollable) */}
          <div className="flex-1 min-h-0 max-h-64 overflow-y-auto space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[var(--color-muted)]/30 rounded-lg gap-2"
              >
                {editCategoryId === cat.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
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
                      className="flex-1 px-2 py-1 border border-[var(--color-muted)]/30 rounded text-sm"
                    />
                    <button
                      onClick={handleSaveCategory}
                      disabled={!editCategoryName.trim() || saving}
                      className="text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-[var(--color-text)] flex-1">
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(cat.id)}
                        disabled={saving}
                        className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={saving}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {categories.length === 0 && !loading && (
              <div className="text-center py-8 text-[var(--color-text-muted)]">
                No categories found. Add one above!
              </div>
            )}
          </div>
        </div>

        {/* Departments */}
        <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col">
          <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)] mb-3 sm:mb-4">
            Departments
          </h2>

          {/* Add Department */}
          <div className="flex flex-col gap-2 mb-3 sm:mb-4">
            <input
              type="text"
              value={newDeptCode}
              onChange={(e) => setNewDeptCode(e.target.value)}
              placeholder="Code (CSE, MECH...)"
              className="flex-1 px-3 py-2 border border-[var(--color-muted)]/30 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
            />
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="Full name"
              className="flex-1 px-3 py-2 border border-[var(--color-muted)]/30 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/40 outline-none text-sm"
            />
            <button
              onClick={handleAddDepartment}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-all duration-200 flex items-center gap-1.5 self-start"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Department List (scrollable) */}
          <div className="flex-1 min-h-0 max-h-64 overflow-y-auto space-y-2">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-[var(--color-muted)]/30 rounded-lg gap-2"
              >
                {editDeptId === dept.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
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
                      className="flex-1 px-2 py-1 border border-[var(--color-muted)]/30 rounded text-sm"
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
                      className="flex-1 px-2 py-1 border border-[var(--color-muted)]/30 rounded text-sm"
                      placeholder="Name"
                    />
                    <button
                      onClick={handleSaveDepartment}
                      className="ml-2 text-green-600 hover:text-green-700"
                    >
                      <CheckCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-[var(--color-text)] flex-1">
                      {dept.code} – <br className="lg:hidden  " /> {dept.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditDepartment(dept.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admins & Requests */}
      <div className="space-y-4">
        {/* Admin buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-all duration-200"
            title="Add Admin"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setShowRequests((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 rounded-lg hover:bg-[var(--color-secondary)]/20 transition-all duration-200 text-sm"
          >
            <Eye size={16} />
            {showRequests ? "Hide Requests" : "See Requests"}
          </button>
        </div>

        {/* Admin Requests Table (if visible) */}
        {showRequests && (
          <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-4 sm:p-6 shadow-xl">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] mb-3 sm:mb-4">
              Admin Requests
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-muted)]/30">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left hidden md:inline-block">
                      Requested At
                    </th>
                    <th className="py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-[var(--color-muted)]/20"
                    >
                      <td className="py-2">{req.name}</td>
                      <td className="py-2">{req.email}</td>
                      <td className="py-2  hidden md:inline-block">
                        {req.created_at}
                      </td>
                      <td className="py-2 text-center space-x-2">
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="text-green-600 hover:text-green-700"
                          title="Accept"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Table */}
        <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-4 sm:p-6 shadow-xl">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] mb-3 sm:mb-4">
            Admins
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--color-muted)]/30">
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Role</th>
                  <th className="py-2 text-left  hidden md:inline-block">
                    Created At
                  </th>
                  <th className="py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-[var(--color-muted)]/20"
                  >
                    <td className="py-2 ">{admin.name}</td>
                    <td className="py-2">{admin.email}</td>
                    <td className="py-2">{admin.role}</td>
                    <td className="py-2  hidden md:inline-block">
                      {admin.created_at}
                    </td>
                    <td className="py-2 text-center">
                      <button
                        onClick={() => handleToggleAdminStatus(admin.id)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          admin.active
                            ? "bg-green-400/20 text-green-700"
                            : "bg-red-400/20 text-red-700"
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
