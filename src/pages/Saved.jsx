import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, Sparkles, GraduationCap, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ScholarshipCard from '../components/ScholarshipCard';
import InternshipCard from '../components/InternshipCard';

export default function Saved() {
  const { 
    savedScholarshipIds, 
    savedInternshipIds, 
    scholarships, 
    internships, 
    isStudentAuthenticated 
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'scholarships' | 'internships'

  const savedScholarships = scholarships.filter(s => savedScholarshipIds.includes(s.id));
  const savedInternships = internships.filter(i => savedInternshipIds.includes(i.id));
  const totalCount = savedScholarships.length + savedInternships.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Student Shortlist
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14213D] tracking-tight">
            Saved Opportunities
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review and organize your shortlisted scholarships and company internships.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/scholarships"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs"
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Browse Grants</span>
          </Link>
          <Link
            to="/internships"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Internships</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Saved ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'scholarships' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Scholarships ({savedScholarships.length})
          </button>
          <button
            onClick={() => setActiveTab('internships')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'internships' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Internships ({savedInternships.length})
          </button>
        </div>

        <Link to="/tracker" className="text-xs font-bold text-blue-600 hover:underline hidden sm:block">
          Open Application Pipeline →
        </Link>
      </div>

      {/* Content */}
      {totalCount === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#14213D]">
            {isStudentAuthenticated ? "No saved opportunities yet" : "Sign in to save opportunities"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isStudentAuthenticated
              ? "Click the bookmark ribbon icon on any scholarship or internship to save it to your shortlist for fast review."
              : "Sign in with your student account to bookmark opportunities and maintain your shortlist across sessions."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-3">
            <Link
              to="/scholarships"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Browse Scholarships
            </Link>
            <Link
              to="/internships"
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Browse Internships
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Scholarships Grid */}
          {(activeTab === 'all' || activeTab === 'scholarships') && savedScholarships.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  Saved Scholarships ({savedScholarships.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedScholarships.map(s => (
                  <ScholarshipCard key={s.id} scholarship={s} />
                ))}
              </div>
            </div>
          )}

          {/* Internships Grid */}
          {(activeTab === 'all' || activeTab === 'internships') && savedInternships.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Saved Internships ({savedInternships.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedInternships.map(i => (
                  <InternshipCard key={i.id} internship={i} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
