import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, LogIn, Mail, Lock, Eye, EyeOff, Sparkles, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CompanyLogin() {
  const navigate = useNavigate();
  const { companyLogin, companyDemoSignIn } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your work email or company name');
      return;
    }
    companyLogin(email.trim(), password);
    navigate('/company/dashboard');
  };

  const handleDemoLogin = () => {
    companyDemoSignIn();
    navigate('/company/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-xs mb-3">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Employer Portal</span>
        </div>
        <h1 className="text-3xl font-black text-[#14213D] tracking-tight">Company Sign In</h1>
        <p className="text-xs text-slate-500">
          Post scholarships, list internship roles, and manage student applications.
        </p>
      </div>

      {/* Main Login Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Work Email or Organization Name
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. talent@cloudscale-example.com"
              className="w-full text-sm pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>
          {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
            <span className="text-[11px] text-slate-400">Demo mode: any password</span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all mt-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Company Dashboard</span>
        </button>

        {/* Demo Company Fast Track */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Continue as Demo Employer (CloudScale Tech)</span>
        </button>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          Need to register your organization?{' '}
          <Link to="/company/register" className="text-indigo-600 font-bold hover:underline">
            Register Company
          </Link>
        </div>

      </form>

      {/* Switch to Student Portal */}
      <div className="text-center">
        <Link
          to="/student/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Are you a student? Switch to Student Sign In &rarr;</span>
        </Link>
      </div>

    </div>
  );
}
