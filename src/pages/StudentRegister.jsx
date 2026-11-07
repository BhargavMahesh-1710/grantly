import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, UserPlus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STUDY_LEVELS, POPULAR_FIELDS } from '../data/scholarships';

export default function StudentRegister() {
  const navigate = useNavigate();
  const { studentRegister, studentDemoSignIn } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    educationLevel: 'Undergraduate',
    fieldOfStudy: 'Computer Science',
    institution: '',
    state: 'California',
    gpa: 3.5,
    householdIncome: 'Under $65,000',
    firstGeneration: false,
    bio: '',
    notificationPreferences: {
      deadlineAlerts: true,
      matchingAlerts: true,
      weeklyDigest: false
    }
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) errs.email = "Student email is required";
    if (formData.gpa < 0 || formData.gpa > 4.0) errs.gpa = "GPA must be between 0.0 and 4.0";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    studentRegister(formData);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center shadow-xs mb-3">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>New Student Onboarding</span>
        </div>
        <h1 className="text-3xl font-black text-[#14213D] tracking-tight">Create Student Account</h1>
        <p className="text-xs text-slate-500">
          Fill in your academic profile to unlock automated match scores and verified internship applications.
        </p>
      </div>

      {/* Registration Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Jordan Lee"
              className={`w-full text-sm p-3 rounded-xl border ${
                errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Student Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. student@college.edu"
              className={`w-full text-sm p-3 rounded-xl border ${
                errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Current Degree Level
            </label>
            <select
              value={formData.educationLevel}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {STUDY_LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Primary Major / Branch
            </label>
            <select
              value={formData.fieldOfStudy}
              onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {POPULAR_FIELDS.map(fld => (
                <option key={fld} value={fld}>{fld}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Institution / College Name
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g. State University of Technology"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Cumulative GPA (0.0 – 4.0)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4.0"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })}
              className={`w-full text-sm p-3 rounded-xl border ${
                errors.gpa ? 'border-rose-400' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            {errors.gpa && <p className="text-xs text-rose-600 mt-1">{errors.gpa}</p>}
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.firstGeneration}
              onChange={(e) => setFormData({ ...formData, firstGeneration: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span className="text-xs font-bold text-slate-800">
              I am a First-Generation College Student (eligible for targeted grants & fellowships)
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-4"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Student Account & Enter Portal</span>
        </button>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Already have an account? <Link to="/student/login" className="text-blue-600 font-bold hover:underline">Sign In</Link></span>
          <button
            type="button"
            onClick={() => {
              studentDemoSignIn();
              navigate('/dashboard');
            }}
            className="text-slate-600 hover:text-blue-600 font-semibold"
          >
            Use Demo Profile
          </button>
        </div>

      </form>

    </div>
  );
}
