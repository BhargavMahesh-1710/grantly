import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
    error: 'border-rose-200 bg-rose-50/95 text-rose-900',
    info: 'border-blue-200 bg-blue-50/95 text-blue-900'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in shadow-xl">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${borderColors[toast.type] || borderColors.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
}
