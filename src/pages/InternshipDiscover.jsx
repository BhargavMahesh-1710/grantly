import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Briefcase, 
  Grid, 
  List, 
  RotateCcw, 
  X, 
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import InternshipCard from '../components/InternshipCard';

export default function InternshipDiscover() {
  const { internships } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All'); // 'All' | 'Remote' | 'Hybrid' | 'On-site'
  const [selectedCompensation, setSelectedCompensation] = useState('All'); // 'All' | 'Paid' | 'Unpaid'
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' | 'stipend' | 'newest' | 'alphabetical'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract all unique skills across all internships
  const allSkills = useMemo(() => {
    const set = new Set();
    internships.forEach(item => {
      (item.requiredSkills || []).forEach(s => set.add(s));
    });
    return Array.from(set).sort();
  }, [internships]);

  // Filter & Sort internships
  const filteredInternships = useMemo(() => {
    return internships.filter(item => {
      // Exclude draft or closed items from public discovery
      if (item.status === 'draft' || item.status === 'closed') return false;

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = (item.title || '').toLowerCase().includes(q);
        const inCompany = (item.company || '').toLowerCase().includes(q);
        const inDesc = (item.description || '').toLowerCase().includes(q);
        const inLocation = (item.location || '').toLowerCase().includes(q);
        const inSkills = (item.requiredSkills || []).some(s => s.toLowerCase().includes(q));
        if (!inTitle && !inCompany && !inDesc && !inLocation && !inSkills) {
          return false;
        }
      }

      // Work Mode Filter
      if (selectedWorkMode !== 'All' && item.workMode !== selectedWorkMode) {
        return false;
      }

      // Compensation Filter
      if (selectedCompensation === 'Paid') {
        const stipend = (item.stipend || '').toLowerCase();
        if (stipend.includes('unpaid') || stipend === '$0') return false;
      } else if (selectedCompensation === 'Unpaid') {
        const stipend = (item.stipend || '').toLowerCase();
        if (!stipend.includes('unpaid')) return false;
      }

      // Skill Filter
      if (selectedSkill !== 'All') {
        if (!(item.requiredSkills || []).includes(selectedSkill)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'newest') {
        return (b.id || '').localeCompare(a.id || '');
      }
      if (sortBy === 'alphabetical') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'stipend') {
        const getVal = (str) => {
          const match = (str || '').match(/\$([0-9,]+)/);
          return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
        };
        return getVal(b.stipend) - getVal(a.stipend);
      }
      return 0;
    });
  }, [internships, searchQuery, selectedWorkMode, selectedCompensation, selectedSkill, sortBy]);

  const activeFilterCount = (selectedWorkMode !== 'All' ? 1 : 0) +
    (selectedCompensation !== 'All' ? 1 : 0) +
    (selectedSkill !== 'All' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedWorkMode('All');
    setSelectedCompensation('All');
    setSelectedSkill('All');
    setSortBy('deadline');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-[#14213D] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs border border-white/20">
            <Briefcase className="w-3.5 h-3.5 text-blue-300" />
            Verified Industry Internships
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Discover Paid Internships & Apprenticeships
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Fast-track your career with high-impact internships at leading enterprise technology firms, startups, and research labs.
          </p>
        </div>
      </div>

      {/* Main Search & Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by role title, company, skills (e.g. Python, React), or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:outline-hidden text-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controls: Sort, View Toggle, Mobile Filter Trigger */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4 text-slate-500" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="deadline">Closing Soonest</option>
              <option value="stipend">Highest Stipend</option>
              <option value="newest">Recently Added</option>
              <option value="alphabetical">Title (A-Z)</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Content Layout: Filter Sidebar + Internship Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Filters */}
        <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-[#14213D] flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filter Roles
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Work Mode */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Work Mode
              </label>
              <div className="space-y-1.5">
                {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
                  <label
                    key={mode}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      selectedWorkMode === mode
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{mode === 'All' ? 'All Modes' : mode}</span>
                    <input
                      type="radio"
                      name="workMode"
                      value={mode}
                      checked={selectedWorkMode === mode}
                      onChange={(e) => setSelectedWorkMode(e.target.value)}
                      className="hidden"
                    />
                    {selectedWorkMode === mode && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </label>
                ))}
              </div>
            </div>

            {/* Compensation Filter */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Compensation
              </label>
              <div className="space-y-1.5">
                {['All', 'Paid', 'Unpaid'].map((comp) => (
                  <label
                    key={comp}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      selectedCompensation === comp
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{comp === 'All' ? 'All Roles' : `${comp} Only`}</span>
                    <input
                      type="radio"
                      name="compensation"
                      value={comp}
                      checked={selectedCompensation === comp}
                      onChange={(e) => setSelectedCompensation(e.target.value)}
                      className="hidden"
                    />
                    {selectedCompensation === comp && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </label>
                ))}
              </div>
            </div>

            {/* Skill Selector */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Skill / Tech
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
              >
                <option value="All">All Technical Skills</option>
                {allSkills.map((sk) => (
                  <option key={sk} value={sk}>{sk}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Right Area: Results Counter & Cards Grid/List */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Results Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900 font-bold">{filteredInternships.length}</strong> available opportunities
            </span>
            {activeFilterCount > 0 && (
              <span className="text-blue-600 font-medium">
                {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'} applied
              </span>
            )}
          </div>

          {/* Empty State */}
          {filteredInternships.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-xs">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No matching internships found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Try loosening your filters or searching with broader keywords like "engineer", "cloud", or "design".
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "space-y-4"}>
              {filteredInternships.map((internship) => (
                <InternshipCard 
                  key={internship.id} 
                  internship={internship} 
                  viewMode={viewMode} 
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
