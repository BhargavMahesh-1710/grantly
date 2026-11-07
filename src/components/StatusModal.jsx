import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Trash2 } from 'lucide-react';
import { APPLICATION_STATUSES } from '../data/scholarships';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function StatusModal({ scholarship, isOpen, onClose }) {
  const { applications, updateApplication, removeApplication } = useApp();
  
  const currentApp = scholarship ? applications.find(a => a.scholarshipId === scholarship.id) : null;
  const [selectedStatus, setSelectedStatus] = useState('interested');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (scholarship) {
      setSelectedStatus(currentApp?.status || 'interested');
      setNotes(currentApp?.notes || '');
    }
  }, [scholarship, currentApp?.status, currentApp?.notes]);

  if (!isOpen || !scholarship) return null;

  const handleSave = () => {
    updateApplication(scholarship.id, {
      status: selectedStatus,
      notes: notes
    });

    if (selectedStatus === 'awarded') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onClose();
  };

  const handleRemove = () => {
    if (window.confirm("Remove this application from your tracker?")) {
      removeApplication(scholarship.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
              Application Tracker
            </span>
            <h3 className="text-lg font-bold text-[#14233B] line-clamp-1">
              {scholarship.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Current Stage
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {APPLICATION_STATUSES.map((st) => {
              const isSelected = selectedStatus === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <span>{st.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Personal Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Personal Notes & Deadlines
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="e.g. Professor Smith agreed to submit recommendation letter by Friday. Portal confirmation code #1234."
            className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {currentApp ? (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Untrack</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/20"
            >
              Save Pipeline Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
