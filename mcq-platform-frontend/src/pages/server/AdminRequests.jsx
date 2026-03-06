import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Clock,
  AlertCircle,
} from "lucide-react";
import { adminAPI } from "../../services/api";
import AdminHeader from "../../components/AdminHeader";

const AdminRequests = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [messageTimeout, setMessageTimeout] = useState(null);

  // APIs you'll need to add to your api.js
  const fetchPendingRequests = () => adminAPI.getPendingAdminRequests?.();
  const fetchHistoryRequests = () => adminAPI.getAdminRequestHistory?.();
  const acceptRequest = (id) => adminAPI.acceptAdminRequest(id);
  const rejectRequest = (id) => adminAPI.rejectAdminRequest(id);
  const deleteRequest = (id) => adminAPI.deleteAdminRequest(id);

  // Fetch requests on mount and tab change
  useEffect(() => {
    fetchRequests();
  }, [showHistory]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const apiCall = showHistory ? fetchHistoryRequests : fetchPendingRequests;
      const response = await apiCall();
    
      
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      showMessage("error", "Failed to fetch requests");
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

  const handleAccept = async (id) => {
    try {
      const response = await acceptRequest(id);
      if (response.data.success) {
        showMessage("success", "Request accepted successfully!");
        setTimeout(fetchRequests, 1000);
      }
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to accept");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await rejectRequest(id);
      if (response.data.success) {
        showMessage("success", "Request rejected successfully!");
        setTimeout(fetchRequests, 1000);
      }
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to reject");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteRequest(id);
      if (response.data.success) {
        showMessage("success", "Request deleted successfully!");
        setTimeout(fetchRequests, 1000);
      }
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to delete");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "text-[var(--color-success)] bg-[var(--color-success)]/10";
      case "REJECTED": return "text-[var(--color-danger)] bg-[var(--color-danger)]/10";
      default: return "text-[var(--color-warning)] bg-[var(--color-warning)]/10";
    }
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
   
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
        <div className="space-y-4 sm:space-y-5">
          {/* Header & Toggle */}
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center mb-6">
           <AdminHeader title={'Admin Requests'} des={'Permit the users'}/>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 h-10 sm:h-11 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 rounded-xl hover:bg-[var(--color-secondary)]/20 hover:shadow-md shadow-sm backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm font-medium flex-1 sm:flex-none"
            >
              <Eye size={14} />
              {showHistory ? "Show Pending" : "View History"}
            </button>
          </div>

          {/* Message Banner */}
          {message.text && (
            <div
              className={`p-4 rounded-xl border-l-4 flex items-center gap-3 shadow-md ${
                message.type === "success"
                  ? "bg-[var(--color-success)]/10 border-[var(--color-success)]/40 text-[var(--color-success)]"
                  : "bg-[var(--color-danger)]/10 border-[var(--color-danger)]/40 text-[var(--color-danger)]"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Requests Table */}
          <div className={`bg-[var(--color-card)]/50 border border-[var(--color-muted)]/20 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm transition-all duration-300 ${
            loading ? "animate-pulse" : ""
          }`}>
            <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-4 sm:mb-6 flex items-center gap-2">
              {showHistory ? "Request History" : "Pending Requests"}
              {loading && <Clock className="h-4 w-4 animate-spin" />}
              {!loading && requests.length === 0 && (
                <span className="text-sm text-[var(--color-text-muted)] font-normal">
                  {showHistory ? "No history found" : "No pending requests"}
                </span>
              )}
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-[var(--color-card)]/30 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-muted)]/20">
                      <th className="py-3 text-left font-semibold text-[var(--color-text)] tracking-wide w-24 sm:w-auto">
                        Name
                      </th>
                      <th className="py-3 text-left font-semibold text-[var(--color-text)] tracking-wide">
                        Email
                      </th>
                      <th className="py-3 text-left font-semibold text-[var(--color-text)] tracking-wide w-20 sm:w-auto">
                        Role
                      </th>
                      <th className="py-3 text-left font-semibold text-[var(--color-text)] tracking-wide hidden md:inline-block">
                         At
                      </th>
                      {!showHistory && (
                        <th className="py-3 text-center font-semibold text-[var(--color-text)] tracking-wide w-32">
                          Actions
                        </th>
                      )}
                      {showHistory && (
                        <th className="py-3 text-center font-semibold text-[var(--color-text)] tracking-wide w-24">
                          Status
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr
                        key={req.id}
                        className="border-b border-[var(--color-muted)]/10 hover:bg-[var(--color-card)]/30 transition-all duration-200"
                      >
                        <td className="py-3 font-medium text-[var(--color-text)] truncate max-w-[120px]">
                          {req.name}
                        </td>
                        <td className="py-3 text-[var(--color-text)]/90 truncate">
                          {req.email}
                        </td>
                        <td className="py-3 font-medium text-[var(--color-secondary)] truncate w-20">
                          <span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-semibold">
                            {req.role}
                          </span>
                        </td>
                        <td className="py-4 hidden md:inline-block text-[var(--color-text-muted)] text-sm">
                          {formatDate(req.requested_at)}
                        </td>
                        
                        {!showHistory ? (
                          /* Pending Actions */
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleAccept(req.id)}
                                className="p-2 bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/40 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                                title="Accept Request"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                className="p-2 bg-[var(--color-danger)]/20 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/40 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                                title="Reject Request"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          </td>
                        ) : (
                          /* History Status & Delete */
                          <>
                            <td className={`py-3 text-center px-2`}>
                              <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm border ${getStatusColor(req.status)}`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <button
                                onClick={() => handleDelete(req.id)}
                                className="p-2 bg-[var(--color-danger)]/20 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/40 hover:scale-105 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                title="Delete Record"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;
