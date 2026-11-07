import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  LayoutGrid, 
  List, 
  RotateCcw,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STUDY_LEVELS, POPULAR_FIELDS } from '../data/scholarships';
import { evaluateEligibility } from '../utils/eligibility';
import { getDaysRemaining } from '../utils/formatters';
import ScholarshipCard from '../components/ScholarshipCard';

export default function Discover() {
  const { scholarships, profile } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const urlQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedField, setSelectedField] = useState('All');
  const [minAmount, setMinAmount] = useState(0);
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [onlyLikelyMatch, setOnlyLikelyMatch] = useState(false);
  const [sortBy, setSortBy] = useState('match');
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Handle Search Input
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLevel('All');
    setSelectedField('All');
    setMinAmount(0);
    setOnlyUrgent(false);
    setOnlyLikelyMatch(false);
    setSortBy('match');
    setSearchParams({});
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedLevel !== 'All') count++;
    if (selectedField !== 'All') count++;
    if (minAmount > 0) count++;
    if (onlyUrgent) count++;
    if (onlyLikelyMatch) count++;
    return count;
  }, [searchQuery, selectedLevel, selectedField, minAmount, onlyUrgent, onlyLikelyMatch]);

  // Filter and Sort Data
  const filteredScholarships = useMemo(() => {
    return scholarships
      .map(item => ({
        ...item,
        eligibility: evaluateEligibility(item, profile),
        urgency: getDaysRemaining(item.deadline)
      }))
      .filter(item => {
        // Keyword Search (title, provider, tags, description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesProvider = item.provider.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
          const matchesFields = item.fields.some(f => f.toLowerCase().includes(q));

          if (!matchesTitle && !matchesProvider && !matchesDesc && !matchesTags && !matchesFields) {
            return false;
          }
        }

        // Degree Level
        if (selectedLevel !== 'All') {
          const hasLevel = item.studyLevels.includes(selectedLevel);
          if (!hasLevel) return false;
        }

        // Field of Study
        if (selectedField !== 'All') {
          const hasField = item.fields.includes('All Fields') || item.fields.includes(selectedField);
          if (!hasField) return false;
        }

        // Minimum Award Amount
        if (minAmount > 0 && item.awardAmount < minAmount) {
          return false;
        }

        // Urgent Only (due in 21 days or less)
        if (onlyUrgent && item.urgency.days > 21) {
          return false;
        }

        // Likely Match Only (>= 75%)
        if (onlyLikelyMatch && item.eligibility.matchScore < 75) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.eligibility.matchScore - a.eligibility.matchScore;
        }
        if (sortBy === 'amount_desc') {
          return b.awardAmount - a.awardAmount;
        }
        if (sortBy === 'deadline_asc') {
          return a.urgency.days - b.urgency.days;
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [scholarships, profile, searchQuery, selectedLevel, selectedField, minAmount, onlyUrgent, onlyLikelyMatch, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Browse & Match
          </span>
          <h1 className="text-3xl font-black text-[#14233B] tracking-tight">
            Scholarship Discovery
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {profile ? (
              <>Personalized against your profile: <strong className="text-slate-800">{profile.educationLevel}</strong> in <strong className="text-slate-800">{profile.fieldOfStudy}</strong>.</>
            ) : (
              <>Browsing all available scholarships. <Link to="/onboarding" className="text-blue-600 font-bold underline">Create a student profile</Link> to get instant personalized match scores.</>
            )}
          </p>
        </div>

        {/* View toggle & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 shadow-2xs"
          >
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 flex items-center gap-2.5 px-3 py-1 bg-slate-50 rounded-xl border border-slate-200 w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search keywords, grant name, sponsor or eligibility..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none py-1.5"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-auto"
          >
            <option value="match">Match Score (Highest first)</option>
            <option value="amount_desc">Award Amount (High to Low)</option>
            <option value="deadline_asc">Deadline (Most Urgent)</option>
            <option value="title_asc">Title (Alphabetical A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Results) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-2xs sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-extrabold text-sm text-[#14233B] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Refine Options
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ({activeFilterCount})</span>
                </button>
              )}
            </div>

            {/* Quick Match Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Quick Filters
              </label>
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={onlyLikelyMatch}
                  onChange={(e) => setOnlyLikelyMatch(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  High Match Only (75%+)
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={onlyUrgent}
                  onChange={(e) => setOnlyUrgent(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  Closing Soon (&le; 21 days)
                </span>
              </label>
            </div>

            {/* Study Level Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Study Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
              >
                <option value="All">All Study Levels</option>
                {STUDY_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Field of Study Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Discipline / Field
              </label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
              >
                <option value="All">All Disciplines</option>
                {POPULAR_FIELDS.map((fld) => (
                  <option key={fld} value={fld}>{fld}</option>
                ))}
              </select>
            </div>

            {/* Minimum Award Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold uppercase tracking-wider text-slate-600">
                  Minimum Award
                </label>
                <span className="font-extrabold text-blue-600">
                  {minAmount === 0 ? 'Any' : `$${minAmount.toLocaleString()}+`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40000"
                step="5000"
                value={minAmount}
                onChange={(e) => setMinAmount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>$0</span>
                <span>$20k</span>
                <span>$40k+</span>
              </div>
            </div>

          </div>
        </div>

        {/* Results Column */}
        <div className="md:col-span-3 space-y-4">
          
          {/* Active Filter Chips & Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
            <span className="text-xs font-bold text-slate-600">
              Showing <span className="text-blue-600 font-black">{filteredScholarships.length}</span> opportunities
            </span>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedLevel !== 'All' && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    Level: {selectedLevel}
                    <button onClick={() => setSelectedLevel('All')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedField !== 'All' && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    Field: {selectedField}
                    <button onClick={() => setSelectedField('All')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {minAmount > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    &ge; ${minAmount.toLocaleString()}
                    <button onClick={() => setMinAmount(0)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {onlyUrgent && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    Closing Soon
                    <button onClick={() => setOnlyUrgent(false)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {onlyLikelyMatch && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    Likely Match
                    <button onClick={() => setOnlyLikelyMatch(false)}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Cards Display */}
          {filteredScholarships.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5"
                : "space-y-4"
            }>
              {filteredScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#14233B]">
                No matching scholarships found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try widening your search terms, reducing the minimum award filter, or clearing active category filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter Slideover Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-extrabold text-base text-[#14233B]">Filter Opportunities</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyLikelyMatch}
                  onChange={(e) => setOnlyLikelyMatch(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Only Likely Matches (75%+)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyUrgent}
                  onChange={(e) => setOnlyUrgent(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Closing Soon (&le; 21 days)</span>
              </label>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Study Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="All">All Study Levels</option>
                  {STUDY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Field of Study</label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="All">All Disciplines</option>
                  {POPULAR_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600"
              >
                Apply Filters ({filteredScholarships.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
