import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Plus, 
  X, 
  Eye, 
  Save, 
  Sparkles, 
  DollarSign, 
  FileCheck2, 
  Users,
  Building2,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STUDY_LEVELS, POPULAR_FIELDS } from '../data/scholarships';

export default function UploadScholarship() {
  const navigate = useNavigate();
  const { addOpportunity, companyProfile } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    provider: companyProfile?.companyName || 'Apex Future Foundation',
    company: companyProfile?.companyName || 'Apex Future Foundation',
    description: '',
    awardAmount: 15000,
    deadline: '2026-12-30',
    studyLevels: ['Undergraduate', 'Graduate'],
    fields: ['Computer Science', 'Engineering'],
    states: ['All States'],
    minGpa: 3.5,
    incomeCriteria: 'Under $80,000',
    academicCriteria: 'Enrolled full-time in an accredited college degree program; cumulative GPA >= 3.5.',
    requiredDocuments: [
      'Official Academic Transcript',
      'Personal Statement of Purpose (500 words)',
      'One Academic Letter of Recommendation'
    ],
    applicationUrl: 'https://foundation-example.org/apply',
    contactEmail: companyProfile?.contactEmail || 'scholarships@foundation-example.org',
    tags: ['Merit-Based', 'Company Sponsored']
  });

  const [docInput, setDocInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const addDoc = () => {
    if (docInput.trim() && !formData.requiredDocuments.includes(docInput.trim())) {
      setFormData({ ...formData, requiredDocuments: [...formData.requiredDocuments, docInput.trim()] });
      setDocInput('');
    }
  };

  const removeDoc = (d) => {
    setFormData({ ...formData, requiredDocuments: formData.requiredDocuments.filter(i => i !== d) });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (t) => {
    setFormData({ ...formData, tags: formData.tags.filter(i => i !== t) });
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Scholarship title is required";
    if (!formData.provider.trim()) errs.provider = "Organization / Company name is required";
    if (!formData.description.trim()) errs.description = "Scholarship description is required";
    if (!formData.awardAmount || formData.awardAmount <= 0) errs.awardAmount = "Valid award amount is required";
    if (formData.requiredDocuments.length === 0) errs.requiredDocuments = "Add at least one required document";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = (status = 'published') => {
    if (!validate()) return;
    addOpportunity({ ...formData, status }, 'scholarship');
    navigate('/company/manage-opportunities');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Corporate & Foundation Grants
          </span>
          <h1 className="text-3xl font-black text-[#14213D] tracking-tight">Publish a Scholarship</h1>
          <p className="text-sm text-slate-500 mt-1">
            Fund future leaders, support underrepresented students, and sponsor academic excellence.
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

      {/* Main Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-[#14213D] flex items-center gap-2 pb-2 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Grant Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Scholarship Program Name *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Apex Next-Gen STEM Innovators Grant"
                className={`w-full text-sm p-3 rounded-xl border ${
                  errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Sponsoring Company / Foundation Name *
              </label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value, company: e.target.value })}
                placeholder="e.g. Apex Future Foundation"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Scholarship Description & Purpose *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the mission of this funding award, target candidate profiles, and how recipients are selected..."
              className={`w-full text-sm p-3 rounded-xl border ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Award Amount (USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="500"
                  min="500"
                  value={formData.awardAmount}
                  onChange={(e) => setFormData({ ...formData, awardAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full text-sm pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Minimum Cumulative GPA
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                value={formData.minGpa}
                onChange={(e) => setFormData({ ...formData, minGpa: parseFloat(e.target.value) || 0 })}
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

        {/* Eligibility & Criteria */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-extrabold text-[#14213D] flex items-center gap-2 pb-2 border-b border-slate-100">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Eligibility Requirements</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Eligible Degree Level
              </label>
              <select
                value={formData.studyLevels[0]}
                onChange={(e) => setFormData({ ...formData, studyLevels: [e.target.value] })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                {STUDY_LEVELS.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Household Income Criteria
              </label>
              <select
                value={formData.incomeCriteria}
                onChange={(e) => setFormData({ ...formData, incomeCriteria: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="Any">Any / No Income Limit</option>
                <option value="Under $65,000">Under $65,000</option>
                <option value="Under $80,000">Under $80,000</option>
                <option value="Under $100,000">Under $100,000</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Detailed Academic Eligibility Summary
            </label>
            <input
              type="text"
              value={formData.academicCriteria}
              onChange={(e) => setFormData({ ...formData, academicCriteria: e.target.value })}
              placeholder="e.g. Enrolled full-time in accredited STEM program; min 3.5 cumulative GPA."
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Required Documents */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-extrabold text-[#14213D] flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Required Documents Checklist *</span>
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDoc(); } }}
              placeholder="Type document name (e.g. Academic Transcript, FAFSA Report, Portfolio)"
              className="flex-1 text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none"
            />
            <button
              type="button"
              onClick={addDoc}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700"
            >
              Add Document
            </button>
          </div>

          <div className="space-y-2">
            {formData.requiredDocuments.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                <span>{doc}</span>
                <button type="button" onClick={() => removeDoc(doc)} className="text-slate-400 hover:text-rose-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {errors.requiredDocuments && <p className="text-xs text-rose-600">{errors.requiredDocuments}</p>}
        </div>

        {/* Links & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              External Application Portal URL
            </label>
            <input
              type="url"
              value={formData.applicationUrl}
              onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Sponsor Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
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
              Publish Scholarship
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Grant Preview</span>
                <h3 className="text-xl font-black text-[#14213D]">{formData.title}</h3>
                <p className="text-xs text-slate-500 font-semibold">{formData.provider}</p>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 font-bold block">Award Value:</span>
                <strong className="text-xl font-black text-blue-700">${formData.awardAmount.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Min GPA:</span>
                <strong className="text-slate-800">{formData.minGpa}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Deadline:</span>
                <strong className="text-slate-800">{formData.deadline}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">About the Grant</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{formData.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Required Documents</h4>
              <div className="space-y-1">
                {formData.requiredDocuments.map((d, idx) => (
                  <div key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>{d}</span>
                  </div>
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
