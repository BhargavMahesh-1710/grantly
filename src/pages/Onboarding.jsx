import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  LogIn, 
  UserPlus, 
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'company' ? 'company' : 'student';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';

  const { 
    studentLogin, 
    studentRegister, 
    studentDemoSignIn, 
    isStudentAuthenticated,
    companyLogin,
    companyRegister,
    companyDemoSignIn,
    isCompanyAuthenticated,
    switchRole
  } = useApp();

  // Active Role: 'student' | 'company'
  const [activeRole, setActiveRole] = useState(initialRole);
  // Active Mode: 'signin' | 'register'
  const [mode, setMode] = useState(initialMode);

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Student Registration State
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    email: '',
    educationLevel: 'Undergraduate',
    fieldOfStudy: 'Computer Science',
    institution: '',
    state: 'California',
    gpa: 3.8,
    householdIncome: 'Under $65,000'
  });

  // Company Registration State
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    industry: 'Technology & Software',
    website: 'https://',
    location: '',
    size: '100-500 employees',
    contactPerson: '',
    contactEmail: ''
  });

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email or username');
      return;
    }
    setErrorMsg('');

    if (activeRole === 'company') {
      companyLogin(email.trim(), password);
      switchRole('company');
      navigate('/company/dashboard');
    } else {
      studentLogin(email.trim(), password);
      switchRole('student');
      navigate('/dashboard');
    }
  };

  const handleStudentRegister = (e) => {
    e.preventDefault();
    if (!studentForm.fullName.trim() || !studentForm.email.trim()) {
      setErrorMsg('Full name and student email are required');
      return;
    }
    setErrorMsg('');
    studentRegister(studentForm);
    switchRole('student');
    navigate('/dashboard');
  };

  const handleCompanyRegister = (e) => {
    e.preventDefault();
    if (!companyForm.companyName.trim() || !companyForm.contactEmail.trim()) {
      setErrorMsg('Company name and recruiting email are required');
      return;
    }
    setErrorMsg('');
    companyRegister(companyForm);
    switchRole('company');
    navigate('/company/dashboard');
  };

  const handleDemoStudent = () => {
    studentDemoSignIn();
    switchRole('student');
    navigate('/dashboard');
  };

  const handleDemoCompany = () => {
    companyDemoSignIn();
    switchRole('company');
    navigate('/company/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>GRANTLY 2.0 Dual Portal Access</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight">
          Welcome to GRANTLY
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Select your portal to sign in or create an account. Discover scholarships, explore industry internships, or hire student talent.
        </p>

        {(isStudentAuthenticated || isCompanyAuthenticated) && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center justify-between max-w-md mx-auto">
            <span>You are currently signed in.</span>
            <Link
              to={isCompanyAuthenticated ? "/company/dashboard" : "/dashboard"}
              className="font-bold underline text-emerald-700 hover:text-emerald-900"
            >
              Go to Dashboard &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* 1. Role Selector Tab: Student Portal vs Company Portal */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            setActiveRole('student');
            setErrorMsg('');
          }}
          className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
            activeRole === 'student'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className={`w-5 h-5 ${activeRole === 'student' ? 'text-white' : 'text-blue-600'}`} />
          <span className="text-xs font-bold uppercase tracking-wider">Student Portal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveRole('company');
            setErrorMsg('');
          }}
          className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
            activeRole === 'company'
              ? 'bg-[#14213D] text-white border-[#14213D] shadow-md shadow-slate-900/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className={`w-5 h-5 ${activeRole === 'company' ? 'text-blue-400' : 'text-purple-600'}`} />
          <span className="text-xs font-bold uppercase tracking-wider">Company Portal</span>
        </button>
      </div>

      {/* 2. Mode Switcher: Sign In vs Register */}
      <div className="flex p-1 bg-slate-200/80 rounded-2xl max-w-xs mx-auto border border-slate-300/80">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setErrorMsg('');
          }}
          className={`w-1/2 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMsg('');
          }}
          className={`w-1/2 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register</span>
        </button>
      </div>

      {/* 3. Form Content */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {/* --- Mode: SIGN IN (Student or Company) --- */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              {activeRole === 'student' ? (
                <GraduationCap className="w-5 h-5 text-blue-600" />
              ) : (
                <Building2 className="w-5 h-5 text-blue-600" />
              )}
              <h2 className="text-base font-extrabold text-[#14213D]">
                Sign in to {activeRole === 'student' ? 'Student Account' : 'Employer Portal'}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {activeRole === 'student' ? 'Student Email or Username' : 'Company Recruiting Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeRole === 'student' ? 'student@university.edu' : 'recruiting@company.com'}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
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
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to {activeRole === 'student' ? 'Student Account' : 'Company Portal'}</span>
            </button>

            {/* Demo Fast-Track Button */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2">— OR FAST-TRACK DEMO —</span>
              {activeRole === 'student' ? (
                <button
                  type="button"
                  onClick={handleDemoStudent}
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Sign In as Demo Student (Alex Rivera)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDemoCompany}
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-slate-800 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Sign In as Demo Employer (CloudScale Tech)</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* --- Mode: REGISTER STUDENT --- */}
        {mode === 'register' && activeRole === 'student' && (
          <form onSubmit={handleStudentRegister} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-extrabold text-[#14213D]">Create Student Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Student Email</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="student@university.edu"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Education Level</label>
                <select
                  value={studentForm.educationLevel}
                  onChange={(e) => setStudentForm({ ...studentForm, educationLevel: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="High School Senior">High School Senior</option>
                  <option value="Graduate">Graduate</option>
                  <option value="PhD Candidate">PhD Candidate</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Major / Field</label>
                <input
                  type="text"
                  value={studentForm.fieldOfStudy}
                  onChange={(e) => setStudentForm({ ...studentForm, fieldOfStudy: e.target.value })}
                  placeholder="Computer Science"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">GPA (0.0 - 4.0)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={studentForm.gpa}
                  onChange={(e) => setStudentForm({ ...studentForm, gpa: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Student Registration</span>
            </button>
          </form>
        )}

        {/* --- Mode: REGISTER COMPANY --- */}
        {mode === 'register' && activeRole === 'company' && (
          <form onSubmit={handleCompanyRegister} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-extrabold text-[#14213D]">Register Your Organization</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyForm.companyName}
                  onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                  placeholder="e.g. Stripe, Palantir, Acme Corp"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Primary Industry</label>
                <input
                  type="text"
                  required
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                  placeholder="Enterprise Software, HealthTech"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Recruiting Email</label>
                <input
                  type="email"
                  required
                  value={companyForm.contactEmail}
                  onChange={(e) => setCompanyForm({ ...companyForm, contactEmail: e.target.value })}
                  placeholder="careers@company.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Headquarters / Location</label>
                <input
                  type="text"
                  value={companyForm.location}
                  onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                  placeholder="San Francisco, CA or Remote"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#14213D] hover:bg-slate-800 shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Register Company & Enter Portal</span>
            </button>
          </form>
        )}

      </div>

      {/* Explore without signing in */}
      <div className="text-center pt-2">
        <Link
          to="/home"
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
        >
          <span>Explore Public Opportunities as Guest</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
