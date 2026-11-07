import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Clock, DollarSign, Building2, ArrowRight, CheckCircle2, Sparkles, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InternshipCard({ internship, viewMode = 'grid' }) {
  const { toggleSaveInternship, isInternshipSaved, studentApplications } = useApp();
  const saved = isInternshipSaved(internship.id);

  // Check if tracked in student application pipeline
  const trackedApp = studentApplications.find(a => a.opportunityId === internship.id);

  const workModeBadge = {
    'Remote': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Hybrid': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'On-site': 'bg-amber-50 text-amber-700 border-amber-200'
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group">
        
        {/* Left column info */}
        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${workModeBadge[internship.workMode] || 'bg-slate-100 text-slate-700'}`}>
              {internship.workMode}
            </span>

            {trackedApp && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 className="w-3 h-3" />
                Applied
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
              <Clock className="w-3 h-3" />
              {internship.duration}
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
              <MapPin className="w-3 h-3" />
              {internship.location}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#14233B] group-hover:text-blue-600 transition-colors">
            <Link to={`/internships/${internship.id}`}>
              {internship.title}
            </Link>
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">{internship.company}</span>
            <span>•</span>
            <span>{internship.vacancies} open roles</span>
            <span>•</span>
            <span>Deadline: {new Date(internship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </p>

          <p className="text-sm text-slate-600 line-clamp-1">
            {internship.description}
          </p>

          {/* Skills pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {internship.requiredSkills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right column: Stipend & CTA */}
        <div className="flex items-center md:flex-col md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Compensation</span>
            <span className="text-xl font-black text-blue-700 tracking-tight">
              {internship.stipend}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveInternship(internship.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                saved
                  ? 'bg-blue-50 border-blue-200 text-blue-600 fill-blue-600'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
              }`}
              title={saved ? "Saved" : "Save internship"}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
            </button>

            <Link
              to={`/internships/${internship.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-sm transition-all"
            >
              <span>View & Apply</span>
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
      
      {/* Top row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${workModeBadge[internship.workMode] || 'bg-slate-100 text-slate-700'}`}>
            {internship.workMode}
          </span>

          <button
            onClick={() => toggleSaveInternship(internship.id)}
            className={`p-2 rounded-xl border transition-colors ${
              saved
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
            title={saved ? "Saved" : "Save internship"}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Title & Company */}
        <div className="space-y-1 mb-2.5">
          <h3 className="text-base font-bold text-[#14233B] group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            <Link to={`/internships/${internship.id}`}>
              {internship.title}
            </Link>
          </h3>
          <p className="text-xs text-slate-600 flex items-center gap-1.5 font-semibold">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{internship.company}</span>
          </p>
        </div>

        {/* Location & Duration Strip */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{internship.location}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{internship.duration}</span>
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">
          {internship.description}
        </p>

        {/* Skills pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {internship.requiredSkills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {skill}
            </span>
          ))}
          {internship.requiredSkills.length > 3 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400">
              +{internship.requiredSkills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Metadata & CTA */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Stipend</span>
            <span className="text-base font-black text-blue-700 tracking-tight">
              {internship.stipend}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Deadline</span>
            <span className="text-xs font-semibold text-slate-700">
              {new Date(internship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {trackedApp && (
          <div className="w-full text-center py-1 rounded-lg bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tracked: {trackedApp.status}</span>
          </div>
        )}

        <Link
          to={`/internships/${internship.id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white transition-all group-hover:bg-blue-600 group-hover:text-white"
        >
          <span>View Details & Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
