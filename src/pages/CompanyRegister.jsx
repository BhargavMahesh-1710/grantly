import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, PlusCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CompanyRegister() {
  const navigate = useNavigate();
  const { companyRegister, companyDemoSignIn } = useApp();

  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'Cloud Infrastructure & Software',
    contactEmail: '',
    website: '',
    location: '',
    size: '50 - 250 Employees',
    description: '',
    contactPhone: '',
    foundedYear: '2020',
    logoInitials: 'CO'
  });

  const [errors, setErrors] = useState({});

  const industries = [
    "Cloud Infrastructure & Software",
    "Artificial Intelligence & ML",
    "Healthcare & Biotechnology",
    "Fintech & Quantitative Finance",
    "Clean Energy & Climate Tech",
    "Robotics & Advanced Hardware",
    "Design & Creative Media",
    "Education & Social Impact"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.companyName.trim()) errs.companyName = "Company name is required";
    if (!formData.contactEmail.trim()) errs.contactEmail = "Corporate email is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const initials = formData.companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'CP';
    companyRegister({ ...formData, logoInitials: initials });
    navigate('/company/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-xs mb-3">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Employer Account Setup</span>
        </div>
        <h1 className="text-3xl font-black text-[#14213D] tracking-tight">Register Your Company</h1>
        <p className="text-xs text-slate-500">
          Connect directly with top university talent through sponsored scholarships and high-impact internships.
        </p>
      </div>

      {/* Registration Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Company / Organization Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Acme Technologies Inc."
              className={`w-full text-sm p-3 rounded-xl border ${
                errors.companyName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
            />
            {errors.companyName && <p className="text-xs text-rose-600 mt-1">{errors.companyName}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Corporate / Recruiting Email *
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="e.g. recruiting@acme-example.com"
              className={`w-full text-sm p-3 rounded-xl border ${
                errors.contactEmail ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
            />
            {errors.contactEmail && <p className="text-xs text-rose-600 mt-1">{errors.contactEmail}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Primary Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Company Website URL
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://company-example.com"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Headquarters / Primary Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. San Francisco, CA & Remote"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Company Size
            </label>
            <select
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="1 - 50 Employees">1 - 50 Employees</option>
              <option value="50 - 250 Employees">50 - 250 Employees</option>
              <option value="250 - 1000 Employees">250 - 1000 Employees</option>
              <option value="1000+ Employees">1000+ Employees</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Company Overview & Mission
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Briefly describe what your organization builds and the student talent you are looking to hire or mentor..."
            className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all mt-4"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Company & Launch Employer Portal</span>
        </button>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Already registered? <Link to="/company/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link></span>
          <button
            type="button"
            onClick={() => {
              companyDemoSignIn();
              navigate('/company/dashboard');
            }}
            className="text-slate-600 hover:text-indigo-600 font-semibold"
          >
            Use Demo Company
          </button>
        </div>

      </form>

    </div>
  );
}
