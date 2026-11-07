import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Kanban, 
  Award, 
  TrendingUp, 
  Briefcase,
  GraduationCap,
  Building2,
  Users,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ScholarshipCard from '../components/ScholarshipCard';
import InternshipCard from '../components/InternshipCard';

export default function Home() {
  const { scholarships, internships, switchRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('scholarships'); // 'scholarships' | 'internships'
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'internships') {
      navigate(searchQuery.trim() ? `/internships?search=${encodeURIComponent(searchQuery.trim())}` : '/internships');
    } else {
      navigate(searchQuery.trim() ? `/scholarships?search=${encodeURIComponent(searchQuery.trim())}` : '/scholarships');
    }
  };

  const featuredScholarships = scholarships.slice(0, 3);
  const featuredInternships = internships.slice(0, 3);

  const stats = [
    { label: 'Scholarship Funding', value: '$250,000+', icon: Award },
    { label: 'Active Internships', value: '100+ Roles', icon: Briefcase },
    { label: 'Partner Organizations', value: '45+ Companies', icon: Building2 },
    { label: 'Application Pipeline', value: 'Zero Spreadsheets', icon: Kanban }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-blue-50/70 via-slate-50 to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>GRANTLY Dual Portal 2.0 – Higher Education Grants & Career Internships</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#14213D] tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Empowering students with grants. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              Connecting employers with rising talent.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            GRANTLY unifies scholarship funding and paid industry internships in one modern platform. 
            Students find tailored opportunities, while companies discover and evaluate exceptional candidates.
          </p>

          {/* Dual Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/scholarships"
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Explore Scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/internships"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Browse Internships</span>
            </Link>

            <Link
              to="/company/login"
              onClick={() => switchRole('company')}
              className="px-6 py-3.5 rounded-2xl bg-[#14213D] hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>For Employers & Companies</span>
            </Link>
          </div>

          {/* Quick Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
            {/* Search Type Selector */}
            <div className="flex items-center gap-2 px-3 pt-1 pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Search In:</span>
              <button
                type="button"
                onClick={() => setActiveTab('scholarships')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'scholarships' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Scholarships & Grants
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('internships')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'internships' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Company Internships
              </button>
            </div>

            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-2 pt-2 px-2">
              <div className="flex-1 flex items-center gap-3 px-3 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'scholarships'
                      ? "Search scholarships by major, GPA, or grant name (e.g. STEM, First-Gen)..."
                      : "Search internships by role, company, or skills (e.g. Software, Cloud, Python)..."
                  }
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 2. Platform Value Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#14213D] block">{stat.value}</span>
                  <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Opportunities Showcase (Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Curated Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">
              Featured Scholarships & Internships
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'scholarships' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scholarships ({scholarships.length})
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'internships' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Internships ({internships.length})
            </button>
          </div>
        </div>

        {activeTab === 'scholarships' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredScholarships.map(s => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
            <div className="text-center pt-4">
              <Link
                to="/scholarships"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:border-blue-500 text-xs font-bold text-slate-800 hover:text-blue-600 bg-white shadow-2xs transition-all"
              >
                <span>View All {scholarships.length} Scholarships</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredInternships.map(i => (
                <InternshipCard key={i.id} internship={i} />
              ))}
            </div>
            <div className="text-center pt-4">
              <Link
                to="/internships"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:border-blue-500 text-xs font-bold text-slate-800 hover:text-blue-600 bg-white shadow-2xs transition-all"
              >
                <span>View All {internships.length} Internships</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. Two Portals Breakdown: Students vs Companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Two Tailored Experiences</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              One Unified Ecosystem for Academic & Career Growth
            </h2>
            <p className="text-slate-400 text-sm">
              Whether you are an aspiring student or a hiring organization, GRANTLY provides custom tools built for your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Student Experience */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">For Students</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlock scholarships matched to your exact academic profile and discover competitive industry internships.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant eligibility scoring & deadline reminders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Personal Kanban tracker to manage submissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-click application submission directly to employers</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/student/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  Enter Student Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Company Experience */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">For Companies & Sponsors</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Publish high-yield internship opportunities, sponsor targeted student grants, and review top candidates.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated forms for internship and scholarship uploads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Applicant management pipeline with stage transitions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified company branding and recruitment dashboard</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/company/login"
                  onClick={() => switchRole('company')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300"
                >
                  Enter Employer Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
