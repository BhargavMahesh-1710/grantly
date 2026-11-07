import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Search, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ManageOpportunities() {
  const { 
    internships, 
    scholarships, 
    updateOpportunity, 
    deleteOpportunity,
    companyProfile,
    isCompanyAuthenticated
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'internship' | 'scholarship' | 'published' | 'draft' | 'closed'
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  if (!isCompanyAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#14213D] mb-3">Company Sign In Required</h1>
        <p className="text-slate-600 text-base max-w-lg mx-auto mb-8">
          Please sign in to manage your company's published internships and scholarships.
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

  const companyName = companyProfile?.companyName || 'CloudScale Technologies';

  // Format all items into a unified listing
  const allOpportunities = [
    ...internships.map(i => ({
      ...i,
      type: 'internship',
      displayAmount: i.stipend || 'Competitive',
      displayMeta: `${i.workMode || 'Remote'} · ${i.location || 'Multiple'}`
    })),
    ...scholarships.map(s => ({
      ...s,
      type: 'scholarship',
      displayAmount: s.amount || 'Grant Support',
      displayMeta: s.academicLevel || 'Undergraduate / Graduate'
    }))
  ];

  // Filter by company (if specific), tab, and search
  const filtered = allOpportunities.filter(item => {
    // Tab filter
    if (activeTab === 'internship' && item.type !== 'internship') return false;
    if (activeTab === 'scholarship' && item.type !== 'scholarship') return false;
    if (activeTab === 'published' && item.status === 'draft') return false;
    if (activeTab === 'draft' && item.status !== 'draft') return false;
    if (activeTab === 'closed' && item.status !== 'closed') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  const handleDelete = (id, type) => {
    deleteOpportunity(id, type);
    setDeleteConfirmId(null);
  };

  const handleToggleStatus = (item) => {
    const nextStatus = item.status === 'draft' ? 'active' : item.status === 'closed' ? 'active' : 'closed';
    updateOpportunity(item.id, { status: nextStatus }, item.type);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateOpportunity(editingItem.id, editingItem, editingItem.type);
    setEditingItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Company Portal</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">{companyName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">Manage Opportunities</h1>
          <p className="text-slate-600 text-sm mt-1">
            Review, update, publish, or pause your active internships and sponsored scholarships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/company/upload-internship"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Post Internship
          </Link>
          <Link
            to="/company/upload-scholarship"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Post Scholarship
          </Link>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Opportunities', count: allOpportunities.length },
            { id: 'internship', label: 'Internships', count: allOpportunities.filter(i => i.type === 'internship').length },
            { id: 'scholarship', label: 'Scholarships', count: allOpportunities.filter(i => i.type === 'scholarship').length },
            { id: 'published', label: 'Published / Active', count: allOpportunities.filter(i => i.status !== 'draft' && i.status !== 'closed').length },
            { id: 'draft', label: 'Drafts', count: allOpportunities.filter(i => i.status === 'draft').length },
            { id: 'closed', label: 'Closed', count: allOpportunities.filter(i => i.status === 'closed').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-slate-200/70 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:outline-hidden transition-all text-slate-800"
          />
        </div>

      </div>

      {/* Opportunities List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No opportunities found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              We couldn't find any opportunities matching your current filter criteria.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset Filters
              </button>
              <Link
                to="/company/upload-internship"
                className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Upload an Opportunity
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/70">
            {filtered.map((item) => {
              const isInternship = item.type === 'internship';
              const publicLink = isInternship ? `/internships/${item.id}` : `/scholarships/${item.id}`;
              const isDraft = item.status === 'draft';
              const isClosed = item.status === 'closed';

              return (
                <div key={item.id} className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                  
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isInternship ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {isInternship ? 'Internship' : 'Scholarship Grant'}
                      </span>

                      {isDraft ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      ) : isClosed ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Closed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active / Published
                        </span>
                      )}

                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium">ID: {item.id}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#14213D] hover:text-blue-600 transition-colors">
                      <Link to={publicLink}>{item.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                      <span className="font-semibold text-slate-800">
                        {isInternship ? 'Stipend:' : 'Grant Value:'} {item.displayAmount}
                      </span>
                      <span>•</span>
                      <span>{item.displayMeta}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Deadline: {item.deadline || 'Rolling'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
                    
                    {/* Applicants link */}
                    <Link
                      to={`/company/applicants?oppId=${item.id}`}
                      className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="View candidate submissions"
                    >
                      <Users className="w-4 h-4" />
                      <span>{item.applicationsCount || 0} Applicants</span>
                    </Link>

                    {/* View public */}
                    <Link
                      to={publicLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-colors"
                      title="Preview public listing"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {/* Edit button */}
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 transition-colors"
                      title="Edit Opportunity"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Status Toggle (Publish / Close) */}
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        isDraft 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
                          : isClosed 
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                            : 'bg-white hover:bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isDraft ? 'Publish Live' : isClosed ? 'Reopen' : 'Pause / Close'}
                    </button>

                    {/* Delete button */}
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(item.id, item.type)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-2 rounded-xl border border-slate-200 hover:border-red-300 hover:text-red-600 text-slate-400 transition-colors"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#14213D]">Edit Opportunity</h3>
                <p className="text-xs text-slate-500">Updating {editingItem.title}</p>
              </div>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Opportunity Title</label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {editingItem.type === 'internship' ? 'Stipend / Salary' : 'Scholarship Amount'}
                  </label>
                  <input
                    type="text"
                    value={editingItem.type === 'internship' ? (editingItem.stipend || '') : (editingItem.amount || '')}
                    onChange={(e) => setEditingItem({ 
                      ...editingItem, 
                      ...(editingItem.type === 'internship' ? { stipend: e.target.value } : { amount: e.target.value })
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={editingItem.deadline || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {editingItem.type === 'internship' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Work Mode</label>
                    <select
                      value={editingItem.workMode || 'Remote'}
                      onChange={(e) => setEditingItem({ ...editingItem, workMode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                    <input
                      type="text"
                      value={editingItem.location || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Publication Status</label>
                <select
                  value={editingItem.status || 'active'}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="active">Active (Published)</option>
                  <option value="draft">Draft (Saved only)</option>
                  <option value="closed">Closed / Archived</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white shadow-md shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
