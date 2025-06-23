import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, UserCheck, Code } from 'lucide-react';
import authService from '../../services/auth/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const redirectUser = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    developerType: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const navigate = (path:string) => {
    redirectUser(path)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!form.role) {
      alert('Please select a role');
      return;
    }

    if (form.role === 'DEVELOPER' && !form.developerType) {
      alert('Please select developer type');
      return;
    }

    setIsLoading(true);
    try {
      const registerRequest = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
        developerType: form.role === 'DEVELOPER' ? form.developerType : null
      };
      await authService.register(registerRequest);

      navigate('/tasks');
    } catch (error) {
      alert('Registration failed');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: 'DEVELOPER', label: 'Developer' },
    { value: 'MANAGER', label: 'Project Manager' },
  ];

  const developerTypes = [
    { value: 'FRONTEND', label: 'Frontend Developer' },
    { value: 'BACKEND', label: 'Backend Developer' },
    { value: 'TESTER', label: 'Tester' },
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Glass morphism card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-slate-200 block">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        id="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={e => setForm({ ...form, firstName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="John"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-slate-200 block">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        id="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={e => setForm({ ...form, lastName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-slate-200 block">
                  Role
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                      id="role"
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
                  >
                    <option value="" className="bg-slate-800">Select your role</option>
                    {roles.map(role => (
                        <option key={role.value} value={role.value} className="bg-slate-800">
                          {role.label}
                        </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Developer Type Selection - Only show if role is DEVELOPER */}
              {form.role === 'DEVELOPER' && (
                  <div className="space-y-2">
                    <label htmlFor="developerType" className="text-sm font-medium text-slate-200 block">
                      Developer Type
                    </label>
                    <div className="relative">
                      <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <select
                          id="developerType"
                          value={form.developerType}
                          onChange={e => setForm({ ...form, developerType: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
                      >
                        <option value="" className="bg-slate-800">Select developer type</option>
                        {developerTypes.map(type => (
                            <option key={type.value} value={type.value} className="bg-slate-800">
                              {type.label}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>
              )}

              {/* Password Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-200 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="Password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="Confirm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
              >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-8">
              <span className="text-slate-400">Already have an account? </span>
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-slate-400 text-sm">
            <p>© 2025 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </div>
  );
};

export default Register;