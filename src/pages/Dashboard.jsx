import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  Kanban, 
  ArrowRight, 
  DollarSign,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatCurrency, getDaysRemaining } from '../utils/formatters';
import { evaluateEligibility } from '../utils/eligibility';
import ScholarshipCard from '../components/ScholarshipCard';
import InternshipCard from '../components/InternshipCard';

export default function Dashboard() {
  const { 
    studentProfile, 
    scholarships, 
    internships, 
    savedScholarshipIds, 
    savedInternshipIds, 
    studentApplications, 
    isStudentAuthenticated 
  } = useApp();

  const [oppTab, setOppTab] = useState('all'); // 'all' | 'scholarships' | 'internships'

  // If not authenticated, prompt student login
  if (!isStudentAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#14213D] mb-3">Student Sign In Required</h1>
        <p className="text-slate-600 text-base max-w-lg mx-auto mb-8">
          Please sign in to your student profile or create an account to view your personalized matches, application tracker, and saved opportunities.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/student/login"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-500/20"
          >
            Sign In as Student
          </Link>
          <Link
            to="/student/register"
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    );
  }

  // Profile completion calculation
  const profileFields = [
    studentProfile?.fullName,
    studentProfile?.email,
    studentProfile?.educationLevel,
    studentProfile?.fieldOfStudy,
    studentProfile?.institution,
    studentProfile?.state,
    studentProfile?.gpa,
    studentProfile?.householdIncome
  ];
  const filledCount = profileFields.filter(Boolean).length;
  const profileCompletionPercent = Math.round((filledCount / profileFields.length) * 100);

  // Total potential grant aid from tracked scholarships
  const trackedScholarships = studentApplications
    .filter(a => a.type === 'scholarship' || !a.type)
    .map(app => {
      const s = scholarships.find(item => item.id === (app.opportunityId || app.scholarshipId));
      return { ...app, scholarship: s };
    }).filter(item => item.scholarship);

  const totalPotentialAid = trackedScholarships.reduce((acc, curr) => acc + (curr.scholarship?.awardAmount || 0), 0);
  const totalSavedCount = savedScholarshipIds.length + savedInternshipIds.length;
  const activeApplicationsCount = studentApplications.length;

  // Chart Data: Status breakdown across both scholarships & internships
  const statusCounts = {
    interested: studentApplications.filter(a => a.status === 'interested').length,
    in_progress: studentApplications.filter(a => a.status === 'in_progress').length,
    applied: studentApplications.filter(a => a.status === 'applied').length,
    shortlisted: studentApplications.filter(a => a.status === 'shortlisted').length,
    awarded: studentApplications.filter(a => a.status === 'awarded' || a.status === 'offered').length
  };

  const chartData = [
    { stage: 'Interested', count: statusCounts.interested },
    { stage: 'In Progress', count: statusCounts.in_progress },
    { stage: 'Applied', count: statusCounts.applied },
    { stage: 'Shortlisted', count: statusCounts.shortlisted },
    { stage: 'Offered / Won', count: statusCounts.awarded }
  ];

  // Recommended Scholarships based on profile
  const recommendedScholarships = scholarships
    .filter(s => s.status !== 'draft')
    .map(s => ({ ...s, eligibility: evaluateEligibility(s, studentProfile) }))
    .sort((a, b) => b.eligibility.matchScore - a.eligibility.matchScore)
    .slice(0, 3);

  // Recommended Internships
  const recommendedInternships = internships
    .filter(i => i.status !== 'draft')
    .slice(0, 3);

  // Combined upcoming deadlines (within 45 days)
  const upcomingDeadlines = [
    ...scholarships.filter(s => s.status !== 'draft').map(s => ({
      id: s.id,
      title: s.title,
      type: 'scholarship',
      deadline: s.deadline,
      amount: s.amount,
      link: `/scholarships/${s.id}`,
      urgency: getDaysRemaining(s.deadline)
    })),
    ...internships.filter(i => i.status !== 'draft').map(i => ({
      id: i.id,
      title: i.title,
      type: 'internship',
      deadline: i.deadline,
      amount: i.stipend,
      link: `/internships/${i.id}`,
      urgency: getDaysRemaining(i.deadline)
    }))
  ]
    .filter(item => item.urgency.days >= 0 && item.urgency.days <= 45)
    .sort((a, b) => a.urgency.days - b.urgency.days)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-[#14213D] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Student Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {studentProfile.fullName.split(' ')[0]}!
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Your personalized hub for university scholarships, tuition grants, and company internships.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-200">
            <span>Major: <strong className="text-white">{studentProfile.fieldOfStudy}</strong></span>
            <span>•</span>
            <span>Institution: <strong className="text-white">{studentProfile.institution}</strong></span>
            <span>•</span>
            <span>GPA: <strong className="text-white">{studentProfile.gpa}</strong></span>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4.5 sm:min-w-[260px] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-blue-200">Profile Completion</span>
            <span className="text-white font-bold">{profileCompletionPercent}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletionPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-blue-100 leading-tight">
            {profileCompletionPercent === 100 
              ? 'Complete profile unlocks high-confidence scholarship matches.' 
              : 'Add details to optimize auto-match accuracy.'}
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-blue-200 transition-colors pt-1"
          >
            Edit Student Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tracked Grant Potential</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#14213D]">{formatCurrency(totalPotentialAid)}</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across tracked scholarship applications</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Applications</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Kanban className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#14213D]">{activeApplicationsCount}</span>
            <span className="text-xs text-slate-500 font-medium">Positions & grants</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-medium">
            <Link to="/tracker" className="hover:underline">View application pipeline</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bookmarked</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#14213D]">{totalSavedCount}</span>
            <span className="text-xs text-slate-500 font-medium">Saved items</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-purple-600 font-medium">
            <Link to="/saved" className="hover:underline">Review saved opportunities</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Shortlisted / Offers</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#14213D]">{statusCounts.shortlisted + statusCounts.awarded}</span>
            <span className="text-xs text-slate-500 font-medium">Advanced stages</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-amber-600 font-medium">
            <span>Interviewing & final selections</span>
          </div>
        </div>

      </div>

      {/* 3. Pipeline Chart & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pipeline Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#14213D]">Application Pipeline Overview</h2>
              <p className="text-xs text-slate-500">Your opportunities distributed across tracking stages</p>
            </div>
            <Link
              to="/tracker"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Open Kanban <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: 'none', color: '#FFF', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Deadlines Widget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#14213D] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Deadlines Closing Soon
              </h2>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No urgent deadlines within the next 45 days.</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="block p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/70 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                        item.type === 'internship' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.type}
                      </span>
                      <span className="font-semibold text-amber-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.urgency.days === 0 ? 'Due Today' : `${item.urgency.days} days left`}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{item.amount}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              to="/scholarships"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center justify-center gap-1 w-full text-center"
            >
              Explore all active deadlines <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* 4. Recommended Opportunities Tabbed Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#14213D]">Recommended For You</h2>
            <p className="text-xs text-slate-500 mt-0.5">Matched specifically against your academic profile, major, and graduation year.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOppTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                oppTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setOppTab('scholarships')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                oppTab === 'scholarships' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Scholarships
            </button>
            <button
              onClick={() => setOppTab('internships')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                oppTab === 'internships' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Internships
            </button>
          </div>
        </div>

        {/* Scholarships Row */}
        {(oppTab === 'all' || oppTab === 'scholarships') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Featured Scholarships
              </h3>
              <Link to="/scholarships" className="text-xs text-blue-600 font-semibold hover:underline">
                View all scholarships →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedScholarships.map(s => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          </div>
        )}

        {/* Internships Row */}
        {(oppTab === 'all' || oppTab === 'internships') && (
          <div className="space-y-3 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Featured Internships
              </h3>
              <Link to="/internships" className="text-xs text-blue-600 font-semibold hover:underline">
                View all internships →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedInternships.map(i => (
                <InternshipCard key={i.id} internship={i} />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
