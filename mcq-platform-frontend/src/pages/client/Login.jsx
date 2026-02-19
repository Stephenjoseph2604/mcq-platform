// components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (message.type === 'error') {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Please fill all fields!' });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      
      if (response.data.success) {
        // Store token and user data in localStorage
        localStorage.setItem('mcqtoken', response.data.data.token);
        localStorage.setItem('mcquser', JSON.stringify(response.data.data.user));
        
        setMessage({ 
          type: 'success', 
          text: 'Login successful! Redirecting...' 
        });
        
        // Redirect to dashboard/admin after 1.5s
        setTimeout(() => {
          window.location.href = '/'; // 
        }, 1500);
        
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Login failed!' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Login failed! Please check your credentials.';
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
        <div className="w-full max-w-sm bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl">
          
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
              <Mail className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Welcome Back</h1>
            <p className="text-[var(--color-text-muted)] text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <label className="block mb-2 text-xs font-medium text-[var(--color-text-muted)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text)] text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 hover:border-[var(--color-secondary)]/70 disabled:opacity-50"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block mb-2 text-xs font-medium text-[var(--color-text-muted)]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text)] text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 hover:border-[var(--color-secondary)]/70 disabled:opacity-50"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-[var(--color-muted)]/30">
            <p className="text-[var(--color-text-muted)] text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-[var(--color-primary)] font-medium hover:text-[var(--color-secondary)] hover:underline underline-offset-2 transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
