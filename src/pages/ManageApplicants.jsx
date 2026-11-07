import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  Mail, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Award, 
  Briefcase,
  ChevronRight,
  MessageSquare,
  Building2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ManageApplicants() {
  const [searchParams] = useSearchParams();
  const initialOppFilter = searchParams.get('oppId') || 'all';

  const { 
    applicants, 
    updateApplicantStatus, 
    companyProfile, 
    isCompanyAuthenticated,
    internships,
    scholarships
  } = useApp();

  const [oppFilter, setOppFilter] = useState(initialOppFilter);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectCandidate, setInspectCandidate] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');

  if (!isCompanyAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#14213D] mb-3">Company Sign In Required</h1>
        <p className="text-slate-600 text-base max-w-lg mx-auto mb-8">
          Please sign in to your company portal to evaluate applicants and manage your candidate pipeline.
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

  // Combined opportunities list for the filter dropdown
  const allPostings = [
    ...internships.map(i => ({ id: i.id, title: i.title, type: 'Internship' })),
    ...scholarships.map(s => ({ id: s.id, title: s.title, type: 'Scholarship' }))
  ];

  // Filtering candidates
  const filteredApplicants = applicants.filter(app => {
    if (oppFilter !== 'all' && app.opportunityId !== oppFilter) {
      return false;
    }
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (app.studentName || '').toLowerCase().includes(q);
      const matchEmail = (app.studentEmail || '').toLowerCase().includes(q);
      const matchMajor = (app.major || '').toLowerCase().includes(q);
      const matchTitle = (app.opportunityTitle || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchMajor && !matchTitle) return false;
    }
    return true;
  });

  const counts = {
    all: applicants.length,
    review: applicants.filter(a => a.status === 'review').length,
    interview: applicants.filter(a => a.status === 'interview').length,
    shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
    offered: applicants.filter(a => a.status === 'offered').length,
    rejected: applicants.filter(a => a.status === 'rejected').length
  };

  const handleOpenCandidateModal = (cand) => {
    setInspectCandidate(cand);
    setInternalNotes(cand.notes || '');
  };

  const handleSaveCandidateNotes = () => {
    if (!inspectCandidate) return;
    updateApplicantStatus(inspectCandidate.id, inspectCandidate.status, internalNotes);
    setInspectCandidate(prev => prev ? { ...prev, notes: internalNotes } : null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Talent Acquisition</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">{companyProfile?.companyName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">Applicant Management</h1>
          <p className="text-slate-600 text-sm mt-1">
            Review student candidates, schedule interviews, and advance applications through your evaluation pipeline.
          </p>
        </div>

        <Link
          to="/company/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold bg-white transition-all self-start sm:self-auto"
        >
          Return to Dashboard
        </Link>
      </div>

      {/* Filter Pipeline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'all', label: 'All Candidates', count: counts.all, color: 'border-slate-200 text-slate-700 bg-white' },
          { id: 'review', label: 'Under Review', count: counts.review, color: 'border-blue-200 text-blue-700 bg-blue-50/50' },
          { id: 'interview', label: 'Interviewing', count: counts.interview, color: 'border-purple-200 text-purple-700 bg-purple-50/50' },
          { id: 'shortlisted', label: 'Shortlisted', count: counts.shortlisted, color: 'border-amber-200 text-amber-700 bg-amber-50/50' },
          { id: 'offered', label: 'Offer Extended', count: counts.offered, color: 'border-emerald-200 text-emerald-700 bg-emerald-50/50' },
          { id: 'rejected', label: 'Archived', count: counts.rejected, color: 'border-slate-200 text-slate-500 bg-slate-50' }
        ].map((stage) => (
          <button
            key={stage.id}
            onClick={() => setStatusFilter(stage.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              statusFilter === stage.id
                ? 'ring-2 ring-blue-600 shadow-sm'
                : 'hover:border-slate-300'
            } ${stage.color}`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">{stage.label}</div>
            <div className="text-2xl font-extrabold mt-1">{stage.count}</div>
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Opportunity Selector Dropdown */}
        <div className="flex items-center gap-2 min-w-[280px]">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={oppFilter}
            onChange={(e) => setOppFilter(e.target.value)}
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-hidden focus:border-blue-500"
          >
            <option value="all">Filter by Opportunity: All Postings</option>
            {allPostings.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.type}] {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, major, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:outline-hidden transition-all text-slate-800"
          />
        </div>

      </div>

      {/* Candidates List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredApplicants.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No applicants match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              Adjust your status filter or opportunity dropdown to view other candidate submissions.
            </p>
            <button
              onClick={() => { setOppFilter('all'); setStatusFilter('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/70">
            {filteredApplicants.map((candidate) => {
              const statusBadges = {
                review: 'bg-blue-50 text-blue-700 border-blue-200',
                interview: 'bg-purple-50 text-purple-700 border-purple-200',
                shortlisted: 'bg-amber-50 text-amber-700 border-amber-200',
                offered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                rejected: 'bg-slate-100 text-slate-600 border-slate-200'
              };

              return (
                <div key={candidate.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/40 transition-colors">
                  
                  {/* Left: Candidate Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusBadges[candidate.status] || 'bg-slate-100'}`}>
                        {candidate.status ? candidate.status.toUpperCase() : 'REVIEW'}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium">Applied {candidate.appliedAt ? new Date(candidate.appliedAt).toLocaleDateString() : 'Recently'}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#14213D]">{candidate.studentName}</h3>
                        <a
                          href={`mailto:${candidate.studentEmail}`}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          title="Email candidate"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-500">{candidate.studentEmail}</p>
                    </div>

                    {/* Opportunity applied for */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      {candidate.opportunityType === 'scholarship' ? (
                        <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                      <span>Applied for: <strong className="text-[#14213D]">{candidate.opportunityTitle}</strong></span>
                    </div>

                    {/* Academic details pill row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-medium">
                        {candidate.major} ({candidate.educationLevel || 'Undergraduate'})
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-medium">
                        {candidate.institution}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        GPA: {candidate.gpa}
                      </span>
                    </div>

                    {/* Candidate note snippet */}
                    {candidate.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 max-w-2xl">
                        "{candidate.notes}"
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
                    
                    {/* View Resume modal button */}
                    <button
                      onClick={() => handleOpenCandidateModal(candidate)}
                      className="px-4 py-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-xs font-semibold text-slate-700 bg-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      View Dossier
                    </button>

                    {/* Pipeline Stage Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pipeline Stage</label>
                      <select
                        value={candidate.status || 'review'}
                        onChange={(e) => updateApplicantStatus(candidate.id, e.target.value)}
                        className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
                      >
                        <option value="review">1. Under Review</option>
                        <option value="interview">2. Interview Scheduled</option>
                        <option value="shortlisted">3. Shortlisted</option>
                        <option value="offered">4. Offer Extended</option>
                        <option value="rejected">5. Archived / Rejected</option>
                      </select>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Dossier & Notes Modal */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-extrabold text-[#14213D]">{inspectCandidate.studentName}</h3>
                <p className="text-xs text-slate-500">{inspectCandidate.studentEmail} • {inspectCandidate.institution}</p>
              </div>
              <button 
                onClick={() => setInspectCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Position Applied</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{inspectCandidate.opportunityTitle}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Major / Level</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{inspectCandidate.major}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Grade Point Average</span>
                <p className="text-xs font-bold text-blue-600 mt-0.5">{inspectCandidate.gpa} / 4.0</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Application Documents</h4>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Verified Resume & Academic Transcript</span>
                    <span className="text-[11px] text-slate-400">PDF document · Uploaded at submission</span>
                  </div>
                </div>
                <a
                  href="https://example.com/mock-resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open PDF
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Recruiter & Interviewer Notes
              </label>
              <textarea
                rows={4}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add evaluation remarks, technical interview scores, or next steps..."
                className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <select
                  value={inspectCandidate.status || 'review'}
                  onChange={(e) => {
                    updateApplicantStatus(inspectCandidate.id, e.target.value, internalNotes);
                    setInspectCandidate({ ...inspectCandidate, status: e.target.value });
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-800"
                >
                  <option value="review">Under Review</option>
                  <option value="interview">Interview</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="offered">Offer Extended</option>
                  <option value="rejected">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectCandidate(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveCandidateNotes}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-md shadow-blue-500/20"
                >
                  Save Notes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
