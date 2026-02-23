import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Users, Lock, Shield, ArrowRight, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI, departmentAPI } from '../../services/api'; // Import both APIs

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department_id: '',
    password: '',
    confirm_password: '',
    otp: ''
  });

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const response = await departmentAPI.getAll();
        if (response.data.success) {
          setDepartments(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        setMessage({ 
          type: 'error', 
          text: 'Failed to load departments. Please refresh and try again.' 
        });
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.type === 'error') {
      setMessage({ type: '', text: '' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    if (!formData.department_id) {
      setMessage({ type: 'error', text: 'Please select a department!' });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.sendOTP(formData.email);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'OTP sent successfully to your email!' });
        setStep(2);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to send OTP' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Something went wrong!';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (formData.otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter valid 6-digit OTP!' });
      return;
    }

    setLoading(true);
    try {
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        department_id: parseInt(formData.department_id),
        password: formData.password,
        otp: formData.otp
      };
      console.log(registerData);
      
      const response = await authAPI.verifyOTPRegister(registerData);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Registration failed!' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'OTP verification failed!';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-[var(--color-surface)]">
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, var(--color-muted) 1px, transparent 0),
            radial-gradient(circle at 25px 25px, var(--color-muted) 1px, transparent 0)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-2xl bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl">
          
          {/* Message Banner */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl border-l-4 flex items-center gap-3 shadow-md ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-400 text-green-800' 
                : 'bg-red-50 border-red-400 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              {step === 1 ? 'Create Account' : 'Verify OTP'}
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm">
              {step === 1 ? 'Join us today' : 'Enter 6-digit code sent to your email'}
            </p>
          </div>

          {/* Form - Step 1: Registration */}
          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70"
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
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Mobile */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70"
                      placeholder="Enter mobile number"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Department Dropdown - LOADING + API DATA */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                    Department
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      disabled={loading || loadingDepartments}
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">
                        {loadingDepartments ? 'Loading departments...' : 'Select department'}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70"
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
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all hover:border-[var(--color-secondary)]/70"
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
                className="w-full h-12 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          ) : (
            // OTP Form - SAME AS BEFORE
            <form onSubmit={handleVerifyOTP} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                  Enter 6-digit OTP
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-secondary)] pointer-events-none" />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-full h-16 pl-16 pr-4 text-center text-xl font-bold tracking-widest border-2 border-[var(--color-muted)]/50 rounded-xl bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30 transition-all"
                    placeholder="000000"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Verify & Register
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-[var(--color-muted)]/30">
            <p className="text-[var(--color-text-muted)] text-sm">
              {step === 1 ? 'Already have an account?' : 'Return to login?'}{' '}
              <Link 
                to="/login" 
                className="text-[var(--color-primary)] font-medium hover:text-[var(--color-secondary)] hover:underline underline-offset-2 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
