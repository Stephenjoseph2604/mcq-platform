import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  Key,
  AlertCircle,
  CheckCircle,
  Users2,
} from "lucide-react";
import { authAPI } from "../../services/api";
import DotGrid from "../../components/DotGrid";

const EmployeeRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "TRAINER", // Default role
    otp: "",
  });

  const roles = [ "TRAINER", "PO", "SALES", "HR"];

  // Clear message after 5 seconds
  React.useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.type === "error") {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.name || !formData.role) {
      setMessage({ type: "error", text: "Please fill name, email, and select role!" });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.adminSendOtp({ email: formData.email });

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "OTP sent successfully to your email!",
        });
        setStep(2);
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Failed to send OTP",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Network error! Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirm_password) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    if (formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters!",
      });
      return;
    }
    if (formData.otp.length !== 6) {
      setMessage({ type: "error", text: "Please enter valid 6-digit OTP!" });
      return;
    }
    if (!formData.role) {
      setMessage({ type: "error", text: "Please select a role!" });
      return;
    }

    setLoading(true);
    try {
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        otp: formData.otp,
      };

      const response = await authAPI.adminVerifyOtp(registerData);

      if (response.data.success) {
        setMessage({
          type: "success",
          text: `${formData.role} registration successful! Redirecting to login...`,
        });
        setTimeout(() => navigate("/admin/login"), 2000);
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Registration failed!",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Verification failed!";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-bg">
      <DotGrid />
      {/* Admin Badge */}
      <div className="absolute top-6 right-6 bg-[var(--color-primary)]/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg border border-white/20">
        EMPLOYEE REGISTER
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md bg-[var(--color-card)]/50 border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl">
          {/* Message Banner */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl border-l-4 flex items-center gap-3 shadow-md ${
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

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              {step === 1 ? "Employee Registration" : "Verify Role OTP"}
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm">
              {step === 1
                ? "Complete account setup with role selection"
                : "Enter 6-digit code sent to your email"}
            </p>
          </div>

          {/* Step 1: Registration Form */}
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-[var(--color-card)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70 disabled:opacity-50"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-[var(--color-card)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70 disabled:opacity-50"
                    placeholder="user@exam.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                  Role
                </label>
                <div className="relative">
                  <Users2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-[var(--color-card)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-[var(--color-card)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70 disabled:opacity-50"
                      placeholder="Create password"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-[var(--color-card)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70 disabled:opacity-50"
                      placeholder="Confirm password"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 btn-color disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-text)] rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[var(--color-text)]/30 border-t-[var(--color-text)] rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Send Role OTP
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                  Enter 6-digit Role OTP
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-secondary)] pointer-events-none" />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-full h-16 pl-16 pr-4 text-center text-xl font-bold tracking-widest border-2 border-[var(--color-muted)]/50 rounded-xl bg-[var(--color-card)] text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30 transition-all disabled:opacity-50"
                    placeholder="000000"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Role Display in OTP step */}
              <div className="p-4 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-xl text-center">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Registering as:</p>
                <p className="font-bold text-lg text-[var(--color-primary)] tracking-wide">
                  {formData.role}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 btn-color disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-text)] rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[var(--color-text)]/30 border-t-[var(--color-text)] rounded-full animate-spin" />
                    Verifying {formData.role}...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Register {formData.role} Account
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-[var(--color-muted)]/30">
            <p className="text-[var(--color-text-muted)] text-sm">
              Already have an account?{" "}
              <Link
                to="/admin/login"
                className="text-[var(--color-primary)] font-medium hover:text-[var(--color-secondary)] hover:underline underline-offset-2 transition-colors duration-200"
              >
                Go to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
