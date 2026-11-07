import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Kanban, 
  Table, 
  Clock, 
  Edit3,
  Briefcase,
  GraduationCap,
  Trash2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getDaysRemaining } from '../utils/formatters';

export default function Tracker() {
  const { 
    studentApplications, 
    scholarships, 
    internships, 
    updateStudentApplication, 
    removeStudentApplication, 
    isStudentAuthenticated 
  } = useApp();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'scholarship' | 'internship'
  const [editingItem, setEditingItem] = useState(null);

  if (!isStudentAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Kanban className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#14213D] mb-3">Student Application Tracker</h1>
        <p className="text-slate-600 text-base max-w-lg mx-auto mb-8">
          Sign in to your student account to manage your application pipeline, document checklists, and deadline reminders.
        </p>
        <Link
          to="/student/login"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-500/20"
        >
          Sign In as Student
        </Link>
      </div>
    );
  }

  // Enrich applications with full opportunity metadata
  const enrichedApps = studentApplications.map(app => {
    const oppId = app.opportunityId || app.scholarshipId;
    const isInternship = app.type === 'internship';
    
    let oppData = isInternship
      ? internships.find(i => i.id === oppId)
      : scholarships.find(s => s.id === oppId);

    // Fallback search across both
    if (!oppData) {
      oppData = scholarships.find(s => s.id === oppId) || internships.find(i => i.id === oppId);
    }

    return {
      ...app,
      opportunityId: oppId,
      resolvedType: isInternship || (oppData && oppData.stipend) ? 'internship' : 'scholarship',
      title: oppData?.title || 'Tracked Opportunity',
      provider: oppData?.company || oppData?.provider || oppData?.organization || 'Organization',
      amount: oppData?.stipend || oppData?.amount || (oppData?.awardAmount ? formatCurrency(oppData.awardAmount) : 'Competitive'),
      deadline: oppData?.deadline || 'Rolling',
      urgency: oppData?.deadline ? getDaysRemaining(oppData.deadline) : null,
      link: (isInternship || (oppData && oppData.stipend)) ? `/internships/${oppId}` : `/scholarships/${oppId}`,
      rawOpp: oppData
    };
  });

  // Filter applications by type
  const displayedApps = enrichedApps.filter(item => {
    if (typeFilter !== 'all' && item.resolvedType !== typeFilter) return false;
    return true;
  });

  const kanbanColumns = [
    { id: 'interested', title: 'Interested', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
    { id: 'in_progress', title: 'In Progress', color: 'border-amber-400 bg-amber-50/40 text-amber-800' },
    { id: 'applied', title: 'Applied', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-800' },
    { id: 'shortlisted', title: 'Shortlisted', color: 'border-purple-400 bg-purple-50/40 text-purple-800' },
    { id: 'awarded', title: 'Offered / Won', color: 'border-emerald-500 bg-emerald-50/60 text-emerald-800' },
    { id: 'rejected', title: 'Archived', color: 'border-slate-300 bg-slate-50 text-slate-700' }
  ];

  const handleUpdateStatus = (oppId, newStatus) => {
    updateStudentApplication(oppId, { status: newStatus });
    if (editingItem && editingItem.opportunityId === oppId) {
      setEditingItem({ ...editingItem, status: newStatus });
    }
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateStudentApplication(editingItem.opportunityId, {
      notes: editingItem.notes,
      status: editingItem.status
    });
    setEditingItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14213D] tracking-tight">
            Application Pipeline Tracker
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track and advance all your scholarship and internship submissions in one unified Kanban board.
          </p>
        </div>

        {/* View Toggle & Add Opportunity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/scholarships"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Find Grants</span>
            </Link>
            <Link
              to="/internships"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              <Briefcase className="w-4 h-4" />
              <span>Find Internships</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Filter:</span>
          {['all', 'scholarship', 'internship'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                typeFilter === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? `All (${enrichedApps.length})` : `${t}s (${enrichedApps.filter(a => a.resolvedType === t).length})`}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Tracking <strong className="text-slate-900 font-bold">{displayedApps.length}</strong> active opportunities
        </div>
      </div>

      {/* Empty State */}
      {displayedApps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-xs">
          <Kanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Your application tracker is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Discover scholarships or company internships and click "Apply" or "Track" to organize your deadlines here.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/scholarships"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Browse Scholarships
            </Link>
            <Link
              to="/internships"
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Browse Internships
            </Link>
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {kanbanColumns.map(column => {
            const colApps = displayedApps.filter(app => {
              if (column.id === 'awarded') return app.status === 'awarded' || app.status === 'offered';
              return app.status === column.id;
            });

            return (
              <div key={column.id} className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 space-y-3 min-h-[360px]">
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-between ${column.color}`}>
                  <span>{column.title}</span>
                  <span className="w-5 h-5 rounded-full bg-white/80 text-[11px] flex items-center justify-center font-extrabold shadow-2xs">
                    {colApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3">
                  {colApps.map(item => (
                    <div
                      key={item.opportunityId}
                      className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.resolvedType === 'internship' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {item.resolvedType}
                        </span>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                          title="Edit Status & Notes"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-bold text-[#14213D] line-clamp-2 group-hover:text-blue-600 transition-colors">
                        <Link to={item.link}>{item.title}</Link>
                      </h4>

                      <div className="text-[11px] text-slate-500 font-medium">
                        {item.provider}
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-blue-700 pt-1 border-t border-slate-100">
                        <span>{item.amount}</span>
                        {item.urgency && (
                          <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                            item.urgency.days <= 7 ? 'text-amber-600' : 'text-slate-400'
                          }`}>
                            <Clock className="w-3 h-3" /> {item.urgency.days}d
                          </span>
                        )}
                      </div>

                      {/* Quick stage advance */}
                      <div className="pt-1">
                        <select
                          value={item.status || 'interested'}
                          onChange={(e) => handleUpdateStatus(item.opportunityId, e.target.value)}
                          className="w-full text-[10px] py-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-600 focus:outline-hidden"
                        >
                          <option value="interested">Move: Interested</option>
                          <option value="in_progress">Move: In Progress</option>
                          <option value="applied">Move: Applied</option>
                          <option value="shortlisted">Move: Shortlisted</option>
                          <option value="awarded">Move: Offered / Won</option>
                          <option value="rejected">Move: Archived</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Opportunity</th>
                  <th className="px-6 py-3.5">Provider / Company</th>
                  <th className="px-6 py-3.5">Compensation / Value</th>
                  <th className="px-6 py-3.5">Deadline</th>
                  <th className="px-6 py-3.5">Pipeline Stage</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {displayedApps.map(item => (
                  <tr key={item.opportunityId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.resolvedType === 'internship' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {item.resolvedType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <Link to={item.link} className="hover:text-blue-600 transition-colors">
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{item.provider}</td>
                    <td className="px-6 py-4 font-bold text-blue-700">{item.amount}</td>
                    <td className="px-6 py-4 text-slate-500">{item.deadline}</td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status || 'interested'}
                        onChange={(e) => handleUpdateStatus(item.opportunityId, e.target.value)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 font-semibold text-slate-800 bg-white"
                      >
                        <option value="interested">Interested</option>
                        <option value="in_progress">In Progress</option>
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="awarded">Offered / Won</option>
                        <option value="rejected">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300"
                          title="Notes & Checklist"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeStudentApplication(item.opportunityId)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-300"
                          title="Remove from tracker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes & Status Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#14213D]">{editingItem.title}</h3>
                <p className="text-xs text-slate-500">{editingItem.provider}</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pipeline Stage
                </label>
                <select
                  value={editingItem.status || 'interested'}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300"
                >
                  <option value="interested">1. Interested</option>
                  <option value="in_progress">2. In Progress</option>
                  <option value="applied">3. Applied</option>
                  <option value="shortlisted">4. Shortlisted</option>
                  <option value="awarded">5. Offered / Won</option>
                  <option value="rejected">6. Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Personal Notes / Checklist
                </label>
                <textarea
                  rows={4}
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  placeholder="Drafting essay, reached out to alumni, interview on Friday..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    removeStudentApplication(editingItem.opportunityId);
                    setEditingItem(null);
                  }}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Delete from tracker
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
