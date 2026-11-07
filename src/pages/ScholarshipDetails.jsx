import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Building, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink, 
  FileCheck2, 
  Share2, 
  Clock, 
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, getDaysRemaining } from '../utils/formatters';
import { evaluateEligibility } from '../utils/eligibility';
import StatusModal from '../components/StatusModal';

export default function ScholarshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    scholarships, 
    profile, 
    isSaved, 
    toggleSave, 
    applications, 
    toggleApplicationDoc,
    showToast 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const scholarship = scholarships.find(s => s.id === id);

  if (!scholarship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Scholarship Not Found</h2>
        <p className="text-slate-500">The requested opportunity may have been archived or removed.</p>
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Discovery</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(scholarship.id);
  const urgency = getDaysRemaining(scholarship.deadline);
  const eligibility = evaluateEligibility(scholarship, profile);
  const currentApp = applications.find(a => a.scholarshipId === scholarship.id);
  const checkedDocs = currentApp?.checkedDocs || [];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast("Link copied to clipboard!", "info");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation & Back Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            title="Share opportunity"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => toggleSave(scholarship.id)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
              saved
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-blue-600' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${eligibility.badgeClass}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {eligibility.matchScore}% Match • {eligibility.label}
            </span>

            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              urgency.isUrgent ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'bg-slate-100 text-slate-600'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {urgency.label} ({formatDate(scholarship.deadline)})
            </span>
          </div>

          {currentApp && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Pipeline Stage: <span className="capitalize">{currentApp.status.replace('_', ' ')}</span>
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14233B] tracking-tight">
            {scholarship.title}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400" />
            <span>Presented by <strong className="text-slate-800">{scholarship.provider}</strong></span>
          </p>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Award Value</span>
            <span className="text-2xl font-black text-blue-700 tracking-tight">
              {formatCurrency(scholarship.awardAmount)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Level</span>
            <span className="text-sm font-bold text-slate-800 block truncate">
              {scholarship.studyLevels.join(', ')}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Min. Academic GPA</span>
            <span className="text-sm font-bold text-slate-800 block">
              {scholarship.minGpa ? `${scholarship.minGpa.toFixed(1)} Cumulative` : 'None required'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Residency</span>
            <span className="text-sm font-bold text-slate-800 block truncate">
              {scholarship.states.join(', ')}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>{currentApp ? "Update Tracker & Notes" : "Add to Application Tracker"}</span>
          </button>

          <a
            href={scholarship.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              showToast("Opening simulated provider portal...", "info");
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <span>External Application Portal</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>

      </div>

      {/* Two Column Layout: Eligibility Matrix & Document Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Details & Requirements */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 space-y-4 shadow-2xs">
            <h3 className="text-lg font-bold text-[#14233B]">
              Scholarship Overview & Mission
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {scholarship.description}
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Program Tags</h4>
              <div className="flex flex-wrap gap-2">
                {scholarship.tags.map((t, idx) => (
                  <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Eligibility Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#14233B]">
                  Eligibility Analyzer
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated comparison against your current student profile.
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${eligibility.badgeClass}`}>
                {eligibility.matchScore}% Confidence
              </span>
            </div>

            <div className="divide-y divide-slate-100 pt-2">
              {eligibility.breakdown.map((item, idx) => (
                <div key={idx} className="py-3 flex items-start gap-3">
                  {item.status === 'met' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  {item.status === 'warning' && (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  {item.status === 'unmet' && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 text-xs">
                    <p className="font-bold text-slate-800">{item.criteria}</p>
                    <p className="text-slate-600 mt-0.5">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-100 text-xs text-blue-900 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> Final eligibility determinations are made solely by {scholarship.provider}. Ensure you verify all criteria before submitting your final package.
              </span>
            </div>
          </div>

        </div>

        {/* Right Col: Interactive Document Checklist & Next Steps */}
        <div className="space-y-6">
          
          {/* Document Checklist Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#14233B] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                Required Documents
              </h3>
              <span className="text-xs font-bold text-blue-600">
                {checkedDocs.length} / {scholarship.requiredDocuments.length} ready
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Tick items as you prepare them. Your checklist progress automatically saves to your application tracker.
            </p>

            <div className="space-y-2.5 pt-2">
              {scholarship.requiredDocuments.map((doc, idx) => {
                const isChecked = checkedDocs.includes(doc);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleApplicationDoc(scholarship.id, doc)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className={isChecked ? 'line-through text-slate-500' : 'font-medium'}>
                      {doc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Checklist Completion meter */}
            <div className="pt-2">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(checkedDocs.length / scholarship.requiredDocuments.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Current Notes Widget */}
          {currentApp && (
            <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  Your Personal Note
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
              <p className="text-xs text-slate-700 italic">
                "{currentApp.notes || 'No notes added yet.'}"
              </p>
              <p className="text-[10px] text-slate-400 pt-1">
                Last updated: {new Date(currentApp.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Tracker Status Modal */}
      <StatusModal
        scholarship={scholarship}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}
