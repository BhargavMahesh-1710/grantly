import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, 
  Plus, 
  X, 
  Eye, 
  Save, 
  Sparkles, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WORK_MODES, INTERNSHIP_DURATIONS } from '../data/internships';

export default function UploadInternship() {
  const navigate = useNavigate();
  const { addOpportunity, companyProfile } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    company: companyProfile?.companyName || 'CloudScale Technologies',
    description: '',
    requiredSkills: ['React', 'TypeScript', 'Node.js'],
    eligibleCourses: ['B.Tech', 'B.S.', 'M.S.'],
    eligibleBranches: ['Computer Science', 'Information Technology'],
    vacancies: 3,
    duration: '3 Months',
    stipend: '$35 / hour',
    isPaid: true,
    workMode: 'Remote',
    location: companyProfile?.location || 'San Francisco, CA & Remote',
    deadline: '2026-12-15',
    startDate: '2027-05-15',
    applicationUrl: 'https://company-example.com/careers/apply',
    contactEmail: companyProfile?.contactEmail || 'talent@company-example.com',
    contactPhone: companyProfile?.contactPhone || '+1 (555) 019-2834',
    tags: ['Paid Internship', 'Mentorship']
  });

  const [skillInput, setSkillInput] = useState('');
  const [courseInput, setCourseInput] = useState('');
  const [branchInput, setBranchInput] = useState('');
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (s) => {
    setFormData({ ...formData, requiredSkills: formData.requiredSkills.filter(i => i !== s) });
  };

  const addCourse = () => {
    if (courseInput.trim() && !formData.eligibleCourses.includes(courseInput.trim())) {
      setFormData({ ...formData, eligibleCourses: [...formData.eligibleCourses, courseInput.trim()] });
      setCourseInput('');
    }
  };

  const removeCourse = (c) => {
    setFormData({ ...formData, eligibleCourses: formData.eligibleCourses.filter(i => i !== c) });
  };

  const addBranch = () => {
    if (branchInput.trim() && !formData.eligibleBranches.includes(branchInput.trim())) {
      setFormData({ ...formData, eligibleBranches: [...formData.eligibleBranches, branchInput.trim()] });
      setBranchInput('');
    }
  };

  const removeBranch = (b) => {
    setFormData({ ...formData, eligibleBranches: formData.eligibleBranches.filter(i => i !== b) });
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Internship title is required";
    if (!formData.company.trim()) errs.company = "Company name is required";
    if (!formData.description.trim()) errs.description = "Job description is required";
    if (!formData.stipend.trim()) errs.stipend = "Stipend / compensation is required";
    if (formData.requiredSkills.length === 0) errs.requiredSkills = "Add at least one required skill";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = (status = 'published') => {
    if (!validate()) return;
    addOpportunity({ ...formData, status }, 'internship');
    navigate('/company/manage-opportunities');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Employer Publishing System
          </span>
          <h1 className="text-3xl font-black text-[#14213D] tracking-tight">Post an Internship Opportunity</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect your open student roles directly with qualified undergraduate and graduate candidates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (validate()) setPreviewOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handlePublish('draft')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Main Publishing Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Role & Company Details */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-[#14213D] flex items-center gap-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Role Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Internship Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI & Machine Learning Research Intern"
                className={`w-full text-sm p-3 rounded-xl border ${
                  errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. CloudScale Technologies"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Role Description & Key Responsibilities *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline what the student will work on, day-to-day projects, tech stacks, and team culture..."
              className={`w-full text-sm p-3 rounded-xl border ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Compensation & Work Mode */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-extrabold text-[#14213D] flex items-center gap-2 pb-2 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Work Arrangement & Compensation</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Work Mode
              </label>
              <select
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {WORK_MODES.filter(m => m !== 'All Modes').map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Stipend / Salary *
              </label>
              <input
                type="text"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                placeholder="e.g. $40 / hour or $5,000 / mo"
                className={`w-full text-sm p-3 rounded-xl border ${
                  errors.stipend ? 'border-rose-400' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {INTERNSHIP_DURATIONS.filter(d => d !== 'All Durations').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Number of Vacancies
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.vacancies}
                onChange={(e) => setFormData({ ...formData, vacancies: parseInt(e.target.value) || 1 })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Required Skills & Eligible Courses */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-extrabold text-[#14233D] flex items-center gap-2 pb-2 border-b border-slate-100">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Eligibility & Skill Requirements</span>
          </h2>

          {/* Required Skills Tag Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Required Technical Skills *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Type skill (e.g. Python, React, SQL) and press Add"
                className="flex-1 text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700"
              >
                Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.requiredSkills.map((s, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  <span>{s}</span>
                  <button type="button" onClick={() => removeSkill(s)}><X className="w-3 h-3 text-blue-600" /></button>
                </span>
              ))}
            </div>
            {errors.requiredSkills && <p className="text-xs text-rose-600 mt-1">{errors.requiredSkills}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Eligible Courses */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Eligible Degrees
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={courseInput}
                  onChange={(e) => setCourseInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCourse(); } }}
                  placeholder="e.g. B.Tech, M.S."
                  className="flex-1 text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
                <button type="button" onClick={addCourse} className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.eligibleCourses.map((c, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-700">
                    <span>{c}</span>
                    <button type="button" onClick={() => removeCourse(c)}><X className="w-3 h-3 text-slate-500" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Eligible Branches */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Eligible Branches / Majors
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={branchInput}
                  onChange={(e) => setBranchInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBranch(); } }}
                  placeholder="e.g. Computer Science"
                  className="flex-1 text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
                <button type="button" onClick={addBranch} className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.eligibleBranches.map((b, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-700">
                    <span>{b}</span>
                    <button type="button" onClick={() => removeBranch(b)}><X className="w-3 h-3 text-slate-500" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application URL & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              External Application URL
            </label>
            <input
              type="url"
              value={formData.applicationUrl}
              onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
              placeholder="https://company-example.com/apply"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Hiring Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handlePublish('draft')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Save as Draft
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                if (validate()) setPreviewOpen(true);
              }}
              className="w-1/2 sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => handlePublish('published')}
              className="w-1/2 sm:w-auto px-7 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
            >
              Publish Internship
            </button>
          </div>
        </div>

      </div>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Opportunity Preview</span>
                <h3 className="text-xl font-black text-[#14213D]">{formData.title}</h3>
                <p className="text-xs text-slate-500 font-semibold">{formData.company} • {formData.location}</p>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 font-bold block">Mode:</span>
                <strong className="text-slate-800">{formData.workMode}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Stipend:</span>
                <strong className="text-blue-700">{formData.stipend}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Duration:</span>
                <strong className="text-slate-800">{formData.duration}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Vacancies:</span>
                <strong className="text-slate-800">{formData.vacancies} open</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">About the Role</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{formData.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {formData.requiredSkills.map((s, idx) => (
                  <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewOpen(false);
                  handlePublish('published');
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
              >
                Looks Good — Publish Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
