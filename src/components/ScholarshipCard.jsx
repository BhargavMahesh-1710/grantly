import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Calendar, Building, Sparkles, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, getDaysRemaining } from '../utils/formatters';
import { evaluateEligibility } from '../utils/eligibility';

export default function ScholarshipCard({ scholarship, viewMode = 'grid' }) {
  const { toggleSave, isSaved, profile, applications } = useApp();
  const saved = isSaved(scholarship.id);
  const urgency = getDaysRemaining(scholarship.deadline);
  const eligibility = evaluateEligibility(scholarship, profile);

  // Check if tracked
  const trackedApp = applications.find(a => a.scholarshipId === scholarship.id);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group">
        
        {/* Left column info */}
        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${eligibility.badgeClass}`}>
              <Sparkles className="w-3 h-3" />
              {eligibility.matchScore}% {eligibility.label}
            </span>

            {trackedApp && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <CheckCircle2 className="w-3 h-3" />
                Tracked: {trackedApp.status.replace('_', ' ')}
              </span>
            )}

            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
              urgency.isUrgent ? 'bg-rose-50 text-rose-700 font-semibold' : 'bg-slate-100 text-slate-600'
            }`}>
              <Clock className="w-3 h-3" />
              {urgency.label} ({formatDate(scholarship.deadline)})
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#14233B] group-hover:text-blue-600 transition-colors">
            <Link to={`/scholarships/${scholarship.id}`}>
              {scholarship.title}
            </Link>
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>{scholarship.provider}</span>
            <span>•</span>
            <span>{scholarship.studyLevels.join(', ')}</span>
            <span>•</span>
            <span>{scholarship.fields[0]}</span>
          </p>

          <p className="text-sm text-slate-600 line-clamp-1">
            {scholarship.description}
          </p>
        </div>

        {/* Right column: Award & Actions */}
        <div className="flex items-center md:flex-col md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Award Value</span>
            <span className="text-2xl font-black text-blue-700 tracking-tight">
              {formatCurrency(scholarship.awardAmount)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSave(scholarship.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                saved
                  ? 'bg-blue-50 border-blue-200 text-blue-600 fill-blue-600'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title={saved ? "Remove from saved" : "Save scholarship"}
              aria-label="Bookmark scholarship"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
            </button>

            <Link
              to={`/scholarships/${scholarship.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    );
  }

  // Grid view (Default)
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between p-5 group relative">
      
      {/* Top row: Match Pill & Bookmark action */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${eligibility.badgeClass}`}>
            <Sparkles className="w-3 h-3" />
            {eligibility.matchScore}% Match • {eligibility.label}
          </span>

          <button
            onClick={() => toggleSave(scholarship.id)}
            className={`p-2 rounded-xl border transition-colors ${
              saved
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
            title={saved ? "Saved" : "Save scholarship"}
            aria-label="Bookmark scholarship"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Title & Provider */}
        <div className="space-y-1 mb-3">
          <h3 className="text-base font-bold text-[#14233B] group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            <Link to={`/scholarships/${scholarship.id}`}>
              {scholarship.title}
            </Link>
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{scholarship.provider}</span>
          </p>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {scholarship.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {tag}
            </span>
          ))}
          {scholarship.tags.length > 3 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400">
              +{scholarship.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Metadata & CTA */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Award</span>
            <span className="text-xl font-black text-blue-700 tracking-tight">
              {formatCurrency(scholarship.awardAmount)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Deadline</span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
              urgency.isUrgent ? 'text-rose-600' : 'text-slate-700'
            }`}>
              <Calendar className="w-3 h-3" />
              {urgency.label}
            </span>
          </div>
        </div>

        {trackedApp && (
          <div className="w-full text-center py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-semibold text-indigo-700">
            Pipeline: <span className="capitalize">{trackedApp.status.replace('_', ' ')}</span>
          </div>
        )}

        <Link
          to={`/scholarships/${scholarship.id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white transition-all group-hover:bg-blue-600 group-hover:text-white"
        >
          <span>View Details & Checklist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
