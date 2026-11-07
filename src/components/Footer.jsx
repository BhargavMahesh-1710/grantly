import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

const CURRENT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#14233B]">
                GRANTLY
              </span>
            </div>
            <p className="text-slate-600 text-sm max-w-md leading-relaxed">
              Transforming the fragmented scholarship application journey into an intuitive, high-confidence student experience. Discover matching aid, track requirements, and organize applications effortlessly.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Frontend Arena • Track 1 Hackathon Prototype</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/discover" className="hover:text-blue-600 transition-colors">
                  Scholarship Discovery
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="hover:text-blue-600 transition-colors">
                  Application Kanban Tracker
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-blue-600 transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-600 transition-colors">
                  Student Profile & Match Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparency & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Prototype Notice
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              GRANTLY v1 is a frontend simulation. Scholarship records represent realistic demonstration opportunities. All eligibility scores and application pipelines operate securely via browser LocalStorage.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for student success</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {CURRENT_YEAR} GRANTLY Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Design System: Premium SaaS Light</span>
            <span>•</span>
            <span className="text-slate-400">React + Vite + Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
