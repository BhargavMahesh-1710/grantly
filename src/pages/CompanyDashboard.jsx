import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  PlusCircle, 
  Briefcase, 
  GraduationCap, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ChevronRight,
  Sparkles,
  Eye,
  Calendar,
  MapPin,
  TrendingUp,
  Award
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';

export default function CompanyDashboard() {
  const { 
    companyProfile, 
    isCompanyAuthenticated, 
    internships, 
    scholarships, 
    applicants,
    updateApplicantStatus 
  } = useApp();

  // If not authenticated as company, show access prompt
  if (!isCompanyAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#14213D] mb-3">Company Portal Authentication Required</h1>
        <p className="text-slate-600 text-base max-w-lg mx-auto mb-8">
          Sign in with your organization account or register to post internships, publish scholarships, and review student talent.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/company/login"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-500/20"
          >
            Sign In to Company Portal
          </Link>
          <Link
            to="/company/register"
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 transition-all"
          >
            Register Your Organization
          </Link>
        </div>
      </div>
    );
  }

  // Filter opportunities posted by or relevant to this company
  const companyName = companyProfile?.companyName || 'CloudScale Technologies';
  
  const myInternships = internships.filter(i => 
    !i.company || i.company.toLowerCase() === companyName.toLowerCase() || i.company === 'CloudScale Technologies'
  );
  const myScholarships = scholarships.filter(s => 
    !s.organization || s.organization.toLowerCase() === companyName.toLowerCase() || s.organization === 'CloudScale Technologies' || s.provider === 'CloudScale Technologies'
  );

  const publishedInternshipsCount = myInternships.filter(i => i.status !== 'draft').length;
  const draftInternshipsCount = myInternships.filter(i => i.status === 'draft').length;
  const publishedScholarshipsCount = myScholarships.filter(s => s.status !== 'draft').length;
  const draftScholarshipsCount = myScholarships.filter(s => s.status === 'draft').length;

  const totalPublished = publishedInternshipsCount + publishedScholarshipsCount;
  const totalDrafts = draftInternshipsCount + draftScholarshipsCount;
  const totalApplications = applicants.length;

  // Applicant pipeline chart data
  const statusCounts = {
    review: applicants.filter(a => a.status === 'review').length,
    interview: applicants.filter(a => a.status === 'interview').length,
    shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
    offered: applicants.filter(a => a.status === 'offered').length,
    rejected: applicants.filter(a => a.status === 'rejected').length
  };

  const chartData = [
    { name: 'Under Review', count: statusCounts.review },
    { name: 'Interviewing', count: statusCounts.interview },
    { name: 'Shortlisted', count: statusCounts.shortlisted },
    { name: 'Offer Extended', count: statusCounts.offered },
    { name: 'Archived', count: statusCounts.rejected }
  ];

  const recentApplicants = applicants.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Welcome & Company Overview Hero */}
      <div className="bg-gradient-to-r from-[#14213D] via-[#1E293B] to-[#14213D] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Verified Employer Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {companyName}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Manage your workforce pipeline, publish competitive undergraduate and graduate internships, 
              and fund merit & need-based scholarship grants.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                {companyProfile?.industry || 'Enterprise Technology & Cloud'}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                {companyProfile?.location || 'San Francisco, CA'}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                {companyProfile?.size || '250-500 employees'}
              </span>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
            <Link
              to="/company/upload-internship"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Post New Internship
            </Link>
            <Link
              to="/company/upload-scholarship"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition-all text-sm backdrop-blur-xs"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Publish Scholarship Grant
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Roles</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#14213D]">{publishedInternshipsCount}</span>
            <span className="text-xs text-slate-500 font-medium">Internships live</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Open for applications</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Funded Grants</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#14213D]">{publishedScholarshipsCount}</span>
            <span className="text-xs text-slate-500 font-medium">Scholarships live</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepting candidate pool</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applicants</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#14213D]">{totalApplications}</span>
            <span className="text-xs text-slate-500 font-medium">Under consideration</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-medium">
            <Eye className="w-3.5 h-3.5" />
            <Link to="/company/applicants" className="hover:underline">Review candidate pool</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Draft Postings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#14213D]">{totalDrafts}</span>
            <span className="text-xs text-slate-500 font-medium">Unpublished drafts</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Link to="/company/manage-opportunities" className="hover:underline text-blue-600">Finish and publish</Link>
          </div>
        </div>

      </div>

      {/* 3. Applicant Pipeline Visual Breakdown + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pipeline Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#14213D]">Hiring & Evaluation Pipeline</h2>
              <p className="text-xs text-slate-500">Distribution of current applicants across evaluation stages</p>
            </div>
            <Link
              to="/company/applicants"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Manage all candidates <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '8px', 
                    border: 'none', 
                    color: '#FFF', 
                    fontSize: '12px' 
                  }}
                  cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Portal Shortcuts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#14213D] mb-1">Company Management</h2>
            <p className="text-xs text-slate-500 mb-4">Direct shortcuts to recruitment actions</p>

            <div className="space-y-2.5">
              <Link
                to="/company/upload-internship"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 hover:border-blue-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">Upload Internship</h4>
                    <p className="text-[11px] text-slate-500">Publish summer or semester roles</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </Link>

              <Link
                to="/company/upload-scholarship"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/70 hover:border-emerald-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600">Upload Scholarship</h4>
                    <p className="text-[11px] text-slate-500">Sponsor grant programs & bursaries</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </Link>

              <Link
                to="/company/manage-opportunities"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">Manage All Postings</h4>
                    <p className="text-[11px] text-slate-500">{totalPublished} live · {totalDrafts} drafts</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </Link>

              <Link
                to="/company/profile"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">Company Profile</h4>
                    <p className="text-[11px] text-slate-500">Edit branding, contact, and bio</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
              </Link>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900">
            <span className="font-semibold block mb-0.5">Need assistance?</span>
            Employers receive free automated candidate ranking and applicant document parsing on all active posts.
          </div>
        </div>

      </div>

      {/* 4. Recent Applicants Table with Quick Status Change */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#14213D]">Recent Applicants</h2>
            <p className="text-xs text-slate-500">Latest student submissions across your active postings</p>
          </div>
          <Link
            to="/company/applicants"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Users className="w-4 h-4" />
            View All ({applicants.length})
          </Link>
        </div>

        {recentApplicants.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No applicants yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Once students discover and apply to your posted opportunities, their profiles and resumes will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Applied For</th>
                  <th className="px-6 py-3.5">Education / GPA</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {recentApplicants.map((app) => {
                  const statusColors = {
                    review: 'bg-blue-50 text-blue-700 border-blue-200',
                    interview: 'bg-purple-50 text-purple-700 border-purple-200',
                    shortlisted: 'bg-amber-50 text-amber-700 border-amber-200',
                    offered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    rejected: 'bg-slate-100 text-slate-600 border-slate-200'
                  };

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{app.studentName}</div>
                        <div className="text-xs text-slate-400">{app.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 line-clamp-1">{app.opportunityTitle}</div>
                        <div className="text-xs text-blue-600 capitalize">{app.opportunityType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-700">{app.major}</div>
                        <div className="text-[11px] text-slate-400">GPA: {app.gpa} · {app.institution}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[app.status] || 'bg-slate-100 text-slate-700'}`}>
                          {app.status ? app.status.toUpperCase() : 'REVIEW'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={app.status || 'review'}
                          onChange={(e) => updateApplicantStatus(app.id, e.target.value)}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-700"
                        >
                          <option value="review">Review</option>
                          <option value="interview">Interview</option>
                          <option value="shortlisted">Shortlist</option>
                          <option value="offered">Offer</option>
                          <option value="rejected">Reject</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Active & Draft Opportunities Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#14213D]">Your Active Opportunities</h2>
            <p className="text-xs text-slate-500">Internship roles and scholarship grants currently receiving applications</p>
          </div>
          <Link
            to="/company/manage-opportunities"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
          >
            Manage Postings <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-200/70">
          {myInternships.slice(0, 3).map((internship) => (
            <div key={internship.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Internship
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {internship.workMode || 'Remote'}
                  </span>
                  {internship.status === 'draft' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Draft
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-[#14213D]">{internship.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{internship.stipend || 'Competitive'}</span>
                  <span>•</span>
                  <span>{internship.location || 'Multiple Locations'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Deadline: {internship.deadline}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <Link
                  to={`/internships/${internship.id}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-colors"
                >
                  View Public
                </Link>
                <Link
                  to="/company/manage-opportunities"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}

          {myScholarships.slice(0, 2).map((sch) => (
            <div key={sch.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Scholarship Grant
                  </span>
                  {sch.status === 'draft' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Draft
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-[#14213D]">{sch.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-emerald-600">{sch.amount}</span>
                  <span>•</span>
                  <span>{sch.academicLevel || 'All degrees'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Deadline: {sch.deadline}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <Link
                  to={`/scholarships/${sch.id}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-colors"
                >
                  View Public
                </Link>
                <Link
                  to="/company/manage-opportunities"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
