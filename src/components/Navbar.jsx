import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  Search, 
  Bookmark, 
  LayoutDashboard, 
  Kanban, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  LogOut,
  Building2,
  PlusCircle,
  FileText,
  Users,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    role,
    switchRole,
    studentProfile,
    isStudentAuthenticated,
    studentSignOut,
    companyProfile,
    isCompanyAuthenticated,
    companySignOut,
    savedScholarshipIds,
    savedInternshipIds,
    applicants
  } = useApp();

  const totalSavedCount = savedScholarshipIds.length + savedInternshipIds.length;

  const studentLinks = [
    { name: 'Scholarships', path: '/scholarships', icon: GraduationCap },
    { name: 'Internships', path: '/internships', icon: Briefcase },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tracker', path: '/tracker', icon: Kanban },
    { name: 'Saved', path: '/saved', icon: Bookmark, badge: totalSavedCount > 0 ? totalSavedCount : null },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  const companyLinks = [
    { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
    { name: 'Post Internship', path: '/company/upload-internship', icon: PlusCircle },
    { name: 'Post Scholarship', path: '/company/upload-scholarship', icon: PlusCircle },
    { name: 'Manage Postings', path: '/company/manage-opportunities', icon: FileText },
    { name: 'Applicants', path: '/company/applicants', icon: Users, badge: applicants.length > 0 ? applicants.length : null },
    { name: 'Company Profile', path: '/company/profile', icon: Building2 }
  ];

  const currentLinks = role === 'company' ? companyLinks : studentLinks;

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSignOut = () => {
    if (role === 'company') {
      companySignOut();
      navigate('/company/login');
    } else {
      studentSignOut();
      navigate('/student/login');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand Logo & Portal Tag */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#14213D] flex items-center gap-1.5">
                  GRANTLY
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Dual Portal
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
                  Scholarships & Internships
                </span>
              </div>
            </Link>

            {/* Portal Role Switcher Pill */}
            <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold ml-2">
              <button
                type="button"
                onClick={() => {
                  switchRole('student');
                  navigate('/dashboard');
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  role === 'student'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole('company');
                  navigate('/company/dashboard');
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  role === 'company'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Company / Employer</span>
              </button>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {currentLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    active
                      ? 'text-blue-700 bg-blue-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white min-w-[16px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-2.5">
            {role === 'student' ? (
              isStudentAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {studentProfile?.fullName ? studentProfile.fullName.split(' ').map(n => n[0]).join('') : 'S'}
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-bold text-slate-800 leading-tight truncate max-w-[90px]">{studentProfile.fullName}</p>
                      <p className="text-[10px] text-slate-500">Student</p>
                    </div>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200/80"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/student/login"
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/student/register"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )
            ) : (
              /* Company Right Header */
              isCompanyAuthenticated ? (
                <>
                  <Link
                    to="/company/upload-internship"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Role</span>
                  </Link>

                  <Link
                    to="/company/profile"
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {companyProfile?.logoInitials || 'CP'}
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-bold text-slate-800 leading-tight truncate max-w-[100px]">{companyProfile.companyName}</p>
                      <p className="text-[10px] text-slate-500">Employer</p>
                    </div>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200/80"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/company/login"
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                  >
                    Company Sign In
                  </Link>
                  <Link
                    to="/company/register"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                  >
                    Register Company
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          
          {/* Mobile Role Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                switchRole('student');
                navigate('/dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-1/2 py-2 rounded-lg flex items-center justify-center gap-1.5 ${
                role === 'student' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                switchRole('company');
                navigate('/company/dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-1/2 py-2 rounded-lg flex items-center justify-center gap-1.5 ${
                role === 'company' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company Portal</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 pt-1">
            {currentLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'text-blue-700 bg-blue-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {role === 'student' ? (
              isStudentAuthenticated ? (
                <button
                  onClick={handleSignOut}
                  className="w-full text-center py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Sign Out of Student Account ({studentProfile.fullName})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/student/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/student/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
                  >
                    Student Register
                  </Link>
                </div>
              )
            ) : (
              isCompanyAuthenticated ? (
                <button
                  onClick={handleSignOut}
                  className="w-full text-center py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Sign Out of Company Account ({companyProfile.companyName})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/company/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                  >
                    Company Login
                  </Link>
                  <Link
                    to="/company/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
                  >
                    Company Register
                  </Link>
                </div>
              )
            )}
          </div>

        </div>
      )}
    </header>
  );
}
