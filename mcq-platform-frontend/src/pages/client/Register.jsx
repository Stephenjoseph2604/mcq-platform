// components/Register.jsx - 2 column desktop, 1 column mobile + OTP flow
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Users, Lock, Shield, ArrowRight, Key } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department_id: '',
    password: '',
    confirm_password: '',
    otp: ''
  });
  
  // Dummy departments
  const departments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'HR' },
    { id: 5, name: 'Finance' },
    { id: 6, name: 'Sales' },
    { id: 7, name: 'Operations' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Register API call placeholder - write your API here');
    setStep(2);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const jsonData = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      department_id: parseInt(formData.department_id),
      password: formData.password,
      otp: formData.otp
    };
    console.log('Register JSON:', JSON.stringify(jsonData, null, 2));
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-[var(--color-surface)]">
      {/* Clean Visible Dot Grid Background */}
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
          
          {/* Clean Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              {step === 1 ? 'Create Account' : 'Verify OTP'}
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm">
              {step === 1 ? 'Join us today' : 'Enter 6-digit code sent to your email/mobile'}
            </p>
          </div>

          {/* Form - Step 1: Registration - 2 COL DESKTOP, 1 COL MOBILE */}
          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Name Input */}
                <div className="relative">
                  <label className="block mb-2 text-xs font-medium text-[var(--color-text-muted)]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text)] text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 hover:border-[var(--color-secondary)]/70"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

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
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text)] text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 hover:border-[var(--color-secondary)]/70"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Mobile + Department */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Mobile Input */}
                <div className="relative">
                  <label className="block mb-2 text-xs font-medium text-[var(--color-text-muted)]">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text)] text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 hover:border-[var(--color-secondary)]/70"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>

                {/* Department Dropdown */}
                <div className="relative">
                  <label className="block mb-2 text-xs font-medium text-[var(--color-text-muted)]">
                    Department
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text)] text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 hover:border-[var(--color-secondary)]/70 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Password + Confirm Password */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text)] text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 hover:border-[var(--color-secondary)]/70"
                      placeholder="Create password"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <label className="block mb-2 text-xs font-medium text-[var(--color-text-muted)]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-secondary)] pointer-events-none" />
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 border-2 border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text)] text-sm bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 hover:border-[var(--color-secondary)]/70"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full h-12 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <Shield className="h-4 w-4" />
                Register
              </button>
            </form>
          ) : (
            /* OTP Form - Step 2 (Full width) */
            <form onSubmit={handleVerifyOTP} className="space-y-8">
              <div className="relative">
                <label className="block mb-4 text-xs font-medium text-[var(--color-text-muted)]">
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
                    className="w-full h-16 pl-16 pr-4 text-center text-xl font-bold tracking-widest border-2 border-[var(--color-muted)]/50 rounded-xl text-[var(--color-text)] bg-white/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30 transition-all duration-200"
                    placeholder="000000"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowRight className="h-4 w-4" />
                Verify & Complete Registration
              </button>
            </form>
          )}

          {/* Clean Footer */}
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
