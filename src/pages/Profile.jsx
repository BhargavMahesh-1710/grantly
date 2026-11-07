import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  MapPin, 
  Bell, 
  Save, 
  RotateCcw,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STUDY_LEVELS, POPULAR_FIELDS } from '../data/scholarships';

export default function Profile() {
  const navigate = useNavigate();
  const { 
    profile, 
    isAuthenticated, 
    updateProfile, 
    signOut, 
    resetToDefaults,
    signInAsDemo 
  } = useApp();

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    educationLevel: profile?.educationLevel || 'Undergraduate',
    fieldOfStudy: profile?.fieldOfStudy || 'Computer Science',
    institution: profile?.institution || '',
    state: profile?.state || 'California',
    gpa: profile?.gpa ?? 3.5,
    householdIncome: profile?.householdIncome || 'Under $65,000',
    firstGeneration: profile?.firstGeneration || false,
    bio: profile?.bio || '',
    notificationPreferences: {
      deadlineAlerts: profile?.notificationPreferences?.deadlineAlerts ?? true,
      matchingAlerts: profile?.notificationPreferences?.matchingAlerts ?? true,
      weeklyDigest: profile?.notificationPreferences?.weeklyDigest ?? false
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        educationLevel: profile.educationLevel || 'Undergraduate',
        fieldOfStudy: profile.fieldOfStudy || 'Computer Science',
        institution: profile.institution || '',
        state: profile.state || 'California',
        gpa: profile.gpa ?? 3.5,
        householdIncome: profile.householdIncome || 'Under $65,000',
        firstGeneration: profile.firstGeneration || false,
        bio: profile.bio || '',
        notificationPreferences: {
          deadlineAlerts: profile.notificationPreferences?.deadlineAlerts ?? true,
          matchingAlerts: profile.notificationPreferences?.matchingAlerts ?? true,
          weeklyDigest: profile.notificationPreferences?.weeklyDigest ?? false
        }
      });
    }
  }, [profile]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    if (formData.gpa < 0 || formData.gpa > 4.0) errs.gpa = "GPA must be between 0.0 and 4.0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    updateProfile(formData);
  };

  const handleSignOut = () => {
    if (window.confirm("Sign out of your current profile?")) {
      signOut();
      navigate('/onboarding');
    }
  };

  // If signed out, display clear call to action
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#14233B]">No Active Profile Found</h2>
          <p className="text-sm text-slate-600">
            You are currently browsing as a guest. Set up your personal student profile to enable custom eligibility scoring, bookmarking, and deadline tracking.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/onboarding"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            Create New Profile
          </Link>
          <button
            type="button"
            onClick={signInAsDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
          >
            Explore with Demo Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Student Settings
          </span>
          <h1 className="text-3xl font-black text-[#14233B] tracking-tight">
            Profile & Match Criteria
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Update your profile parameters to recalculate instant eligibility matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Restore sample student profile and initial demo state?")) {
                resetToDefaults();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Personal Details Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-base text-[#14233B]">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full text-sm p-3 rounded-xl border ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="e.g. Alex Rivera"
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
                className={`w-full text-sm p-3 rounded-xl border ${
                  errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="e.g. student@university.edu"
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Short Bio / Statement of Purpose
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Highlight your academic focus, community initiatives, or career vision..."
            />
          </div>
        </div>

        {/* Academic Profile Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="font-extrabold text-base text-[#14233B]">Academic Credentials</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Current Education Level
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
                Primary Field / Major
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
                College / Institution Name
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. State University of Technology"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Cumulative GPA (4.0 scale)
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
        </div>

        {/* Demographics & Eligibility Criteria */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-base text-[#14233B]">Residency & Financial Demographics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                State of Legal Residence
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. California"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Household Income Bracket
              </label>
              <select
                value={formData.householdIncome}
                onChange={(e) => setFormData({ ...formData, householdIncome: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Under $40,000">Under $40,000</option>
                <option value="Under $65,000">Under $65,000</option>
                <option value="Under $90,000">Under $90,000</option>
                <option value="Over $100,000">Over $100,000</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={formData.firstGeneration}
                onChange={(e) => setFormData({ ...formData, firstGeneration: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">First-Generation College Student</span>
                <span className="text-slate-500">Neither parent completed a 4-year undergraduate degree. Unlocks targeted grant programs.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Mock Notification Simulation Settings */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-base text-[#14233B]">Notification Simulation</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
              <span>Deadline urgency reminders (&le; 7 days left)</span>
              <input
                type="checkbox"
                checked={formData.notificationPreferences.deadlineAlerts}
                onChange={(e) => setFormData({
                  ...formData,
                  notificationPreferences: {
                    ...formData.notificationPreferences,
                    deadlineAlerts: e.target.checked
                  }
                })}
                className="rounded text-blue-600 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
              <span>High Match Alerts (new grants with 85%+ score)</span>
              <input
                type="checkbox"
                checked={formData.notificationPreferences.matchingAlerts}
                onChange={(e) => setFormData({
                  ...formData,
                  notificationPreferences: {
                    ...formData.notificationPreferences,
                    matchingAlerts: e.target.checked
                  }
                })}
                className="rounded text-blue-600 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Form Submit Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out of this profile</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Recalculate Matches</span>
          </button>
        </div>

      </form>

    </div>
  );
}
