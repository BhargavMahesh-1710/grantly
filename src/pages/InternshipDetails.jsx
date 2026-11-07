import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  Bookmark, 
  ExternalLink, 
  CheckCircle2, 
  Share2, 
  ArrowLeft, 
  Send,
  AlertCircle,
  Mail,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    internships, 
    toggleSaveInternship, 
    isInternshipSaved, 
    applyToOpportunity, 
    studentApplications,
    isStudentAuthenticated,
    studentProfile,
    showToast
  } = useApp();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const internship = internships.find(item => item.id === id);

  if (!internship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#14213D]">Internship Opportunity Not Found</h2>
        <p className="text-sm text-slate-500">The requested internship listing might have expired or been removed.</p>
        <Link
          to="/internships"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Internships
        </Link>
      </div>
    );
  }

  const saved = isInternshipSaved(internship.id);
  const trackedApp = studentApplications.find(a => a.opportunityId === internship.id);

  const handleApply = (e) => {
    e.preventDefault();
    if (!isStudentAuthenticated) {
      showToast('Please sign in as a student to apply.', 'info');
      navigate('/student/login');
      return;
    }
    applyToOpportunity(internship, 'internship', coverNote);
    setApplyModalOpen(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Internship link copied to clipboard!');
    }
  };

  // Other related opportunities
  const relatedInternships = internships
    .filter(i => i.id !== internship.id && (i.workMode === internship.workMode || i.company === internship.company))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          to="/internships"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all internships
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Internship
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                internship.workMode === 'Remote' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                internship.workMode === 'Hybrid' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {internship.workMode}
              </span>
              {trackedApp && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Applied ({trackedApp.status.toUpperCase()})
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14213D] tracking-tight">
              {internship.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <Building2 className="w-4 h-4 text-blue-600" />
                {internship.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {internship.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {internship.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                {internship.vacancies} {internship.vacancies === 1 ? 'opening' : 'openings'}
              </span>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors"
              title="Share Opportunity"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleSaveInternship(internship.id)}
              className={`p-3 rounded-2xl border transition-all ${
                saved
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title={saved ? "Saved" : "Save opportunity"}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
            </button>

            <button
              onClick={() => setApplyModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {trackedApp ? 'Update Application' : 'Apply Now'}
            </button>
          </div>
        </div>

        {/* Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Stipend / Salary</span>
            <span className="text-base sm:text-lg font-black text-blue-700 mt-0.5 block">{internship.stipend}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Deadline</span>
            <span className="text-base sm:text-lg font-bold text-slate-800 mt-0.5 block">{internship.deadline}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Start Date</span>
            <span className="text-base sm:text-lg font-bold text-slate-800 mt-0.5 block">{internship.startDate || 'Immediate'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Work Mode</span>
            <span className="text-base sm:text-lg font-bold text-slate-800 mt-0.5 block">{internship.workMode}</span>
          </div>
        </div>

      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Description, Responsibilities, Skills */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Description */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#14213D]">Role Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {internship.responsibilities && internship.responsibilities.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#14213D]">Key Responsibilities</h2>
              <ul className="space-y-2.5">
                {internship.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills & Tech Stack */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#14213D]">Required Skills & Competencies</h2>
            <div className="flex flex-wrap gap-2">
              {(internship.requiredSkills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-800 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Eligible Courses & Branches */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#14213D]">Eligible Degrees & Academic Background</h2>
            <div className="flex flex-wrap gap-2">
              {(internship.eligibleCourses || ['Computer Science', 'Information Technology', 'Software Engineering', 'Related STEM Majors']).map((course, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Employer Overview, Instructions, External Portal */}
        <div className="space-y-6">
          
          {/* Apply CTA Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-[#14213D]">Ready to Apply?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your application directly through GRANTLY to track status updates and appear in the hiring manager's review queue.
            </p>

            <button
              onClick={() => setApplyModalOpen(true)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {trackedApp ? 'Update My Application' : 'Submit Application'}
            </button>

            {internship.applicationUrl && (
              <a
                href={internship.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>External Employer Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
          </div>

          {/* Recruiter & Contact Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#14213D]">Organization Contact</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{internship.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`mailto:${internship.contactEmail || 'careers@' + internship.company.toLowerCase().replace(/\s+/g, '') + '.com'}`} className="text-blue-600 hover:underline">
                  {internship.contactEmail || 'careers@' + internship.company.toLowerCase().replace(/\s+/g, '') + '.com'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{internship.location}</span>
              </div>
            </div>
          </div>

          {/* Similar Opportunities */}
          {relatedInternships.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#14213D]">Similar Internships</h3>
              <div className="space-y-3">
                {relatedInternships.map(item => (
                  <Link
                    key={item.id}
                    to={`/internships/${item.id}`}
                    className="block p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/60 transition-colors group"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 block line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                      <span>{item.company}</span>
                      <strong className="text-blue-600">{item.stipend}</strong>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Interactive Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#14213D]">Apply for Internship</h3>
                <p className="text-xs text-slate-500">{internship.title} · {internship.company}</p>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              {/* Profile summary */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Applicant Information:</span>
                <p>{studentProfile?.fullName || 'Guest Student'} ({studentProfile?.email || 'email@student.edu'})</p>
                <p className="text-blue-700">{studentProfile?.fieldOfStudy || 'Computer Science'} · GPA: {studentProfile?.gpa || '3.8'}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Share a brief introduction, relevant project links (GitHub, portfolio), and why you're a great fit for this position..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agreed"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="agreed" className="text-xs text-slate-600 leading-normal">
                  I confirm that my academic profile and contact details are accurate and authorize {internship.company} to review my application.
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!agreedTerms}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  Confirm & Submit
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
