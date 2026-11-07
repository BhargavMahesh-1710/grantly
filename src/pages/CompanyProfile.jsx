import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Save, 
  LogOut, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CompanyProfile() {
  const { 
    companyProfile, 
    updateCompanyProfile, 
    companySignOut, 
    isCompanyAuthenticated,
    internships,
    scholarships
  } = useApp();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: companyProfile?.companyName || '',
    industry: companyProfile?.industry || '',
    website: companyProfile?.website || '',
    location: companyProfile?.location || '',
    size: companyProfile?.size || '250-500 employees',
    description: companyProfile?.description || '',
    contactPerson: companyProfile?.contactPerson || '',
    contactEmail: companyProfile?.contactEmail || '',
    contactPhone: companyProfile?.contactPhone || '',
    targetMajors: companyProfile?.targetMajors || 'Computer Science, Software Engineering, Data Science'
  });

  if (!isCompanyAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#14213D] mb-3">Company Authentication Required</h1>
        <p className="text-slate-600 text-base max-w-lg mx-auto mb-8">
          Sign in or register your organization to view and manage your employer profile.
        </p>
        <Link
          to="/company/login"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-500/20"
        >
          Sign In to Company Portal
        </Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompanyProfile(formData);
  };

  const handleSignOut = () => {
    companySignOut();
    navigate('/company/login');
  };

  const companyName = formData.companyName || 'CloudScale Technologies';
  const myPostingsCount = internships.filter(i => !i.company || i.company.toLowerCase() === companyName.toLowerCase()).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Profile Summary */}
      <div className="bg-gradient-to-r from-[#14213D] via-[#1E293B] to-[#14213D] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg font-extrabold text-2xl sm:text-3xl uppercase tracking-wider shrink-0">
              {companyName.slice(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{companyName}</h1>
                <span className="p-1 rounded-full bg-blue-500/20 text-blue-400" title="Verified Employer">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <span>{formData.industry || 'Technology & Engineering'}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {formData.location || 'San Francisco, CA'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/company/dashboard"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors backdrop-blur-xs"
            >
              Company Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold border border-red-400/30 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Editable Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#14213D]">Company Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep your organization's recruiting profile up-to-date so students can learn about your culture.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Industry
                </label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g. Enterprise Software, HealthTech, Finance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Location / HQ
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company Size
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="1-20 employees">1-20 employees (Seed)</option>
                  <option value="20-100 employees">20-100 employees (Growth)</option>
                  <option value="100-500 employees">100-500 employees (Mid-sized)</option>
                  <option value="500-2000 employees">500-2000 employees (Scale-up)</option>
                  <option value="2000+ employees">2000+ employees (Enterprise)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                About the Company & Mission
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your company, core products, student internship culture, and mentorship programs..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Degrees & Majors
              </label>
              <input
                type="text"
                value={formData.targetMajors}
                onChange={(e) => setFormData({ ...formData, targetMajors: e.target.value })}
                placeholder="Comma separated majors, e.g. Computer Science, Mechanical Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[#14213D] mb-3">Recruitment Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Representative</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Sarah Jenkins (Head of Talent)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Recruiting Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="careers@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                Save Profile Changes
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Profile Cards & Verification */}
        <div className="space-y-6">
          
          {/* Trust & Verification badge card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Verified Employer</h3>
                <span className="text-[11px] text-slate-500">Tier 1 Partner Organization</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your listings display the verified employer badge, providing transparency and trust for student applicants.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-200/60 flex items-center justify-between">
              <span>Active Roles:</span>
              <strong className="text-blue-600">{myPostingsCount} positions</strong>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Recruitment Hub</h3>
            <div className="space-y-2">
              <Link
                to="/company/upload-internship"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 hover:border-blue-200 transition-colors group"
              >
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">Post an Internship</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </Link>
              <Link
                to="/company/upload-scholarship"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/70 hover:border-emerald-200 transition-colors group"
              >
                <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600">Sponsor a Scholarship</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </Link>
              <Link
                to="/company/applicants"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors group"
              >
                <span className="text-xs font-semibold text-slate-700">Review Candidate Pool</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
