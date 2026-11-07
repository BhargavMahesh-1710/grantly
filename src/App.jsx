import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Student Portal Pages
import Home from './pages/Home';
import Discover from './pages/Discover';
import InternshipDiscover from './pages/InternshipDiscover';
import ScholarshipDetails from './pages/ScholarshipDetails';
import InternshipDetails from './pages/InternshipDetails';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import Onboarding from './pages/Onboarding';

// Company Portal Pages
import CompanyDashboard from './pages/CompanyDashboard';
import UploadInternship from './pages/UploadInternship';
import UploadScholarship from './pages/UploadScholarship';
import ManageOpportunities from './pages/ManageOpportunities';
import ManageApplicants from './pages/ManageApplicants';
import CompanyProfile from './pages/CompanyProfile';
import CompanyLogin from './pages/CompanyLogin';
import CompanyRegister from './pages/CompanyRegister';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainRoutes() {
  const { isStudentAuthenticated, isCompanyAuthenticated } = useApp();

  return (
    <Routes>
      {/* 1. Landing Page: If unauthenticated, first landing shows the dual portal entry / Onboarding */}
      <Route 
        path="/" 
        element={
          isStudentAuthenticated || isCompanyAuthenticated 
            ? <Home /> 
            : <Onboarding />
        } 
      />
      <Route path="/home" element={<Home />} />

      {/* 2 & 3. Student Authentication */}
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />
      <Route path="/login" element={<Onboarding />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* 4 & 5. Company Authentication */}
      <Route path="/company/login" element={<CompanyLogin />} />
      <Route path="/company/register" element={<CompanyRegister />} />

      {/* 6. Student Dashboard */}
      <Route 
        path="/dashboard" 
        element={isStudentAuthenticated ? <Dashboard /> : <StudentLogin />} 
      />

      {/* 7. Company Dashboard */}
      <Route 
        path="/company/dashboard" 
        element={isCompanyAuthenticated ? <CompanyDashboard /> : <CompanyLogin />} 
      />

      {/* 8 & 9. Opportunity Discovery */}
      <Route path="/scholarships" element={<Discover />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/internships" element={<InternshipDiscover />} />

      {/* 10 & 11. Details Pages */}
      <Route path="/scholarships/:id" element={<ScholarshipDetails />} />
      <Route path="/internships/:id" element={<InternshipDetails />} />

      {/* 12 & 13. Company Upload Publishing Forms */}
      <Route 
        path="/company/upload-internship" 
        element={isCompanyAuthenticated ? <UploadInternship /> : <CompanyLogin />} 
      />
      <Route 
        path="/company/upload-scholarship" 
        element={isCompanyAuthenticated ? <UploadScholarship /> : <CompanyLogin />} 
      />

      {/* 14. Company Opportunity Management */}
      <Route 
        path="/company/manage-opportunities" 
        element={isCompanyAuthenticated ? <ManageOpportunities /> : <CompanyLogin />} 
      />

      {/* Company Applicant Management */}
      <Route 
        path="/company/applicants" 
        element={isCompanyAuthenticated ? <ManageApplicants /> : <CompanyLogin />} 
      />

      {/* 15. Student Application Pipeline Tracker */}
      <Route path="/tracker" element={<Tracker />} />

      {/* 16. Student Profile */}
      <Route 
        path="/profile" 
        element={isStudentAuthenticated ? <Profile /> : <StudentLogin />} 
      />

      {/* 17. Company Profile */}
      <Route 
        path="/company/profile" 
        element={isCompanyAuthenticated ? <CompanyProfile /> : <CompanyLogin />} 
      />

      {/* 18. Saved Opportunities */}
      <Route path="/saved" element={<Saved />} />

      {/* Catch-all */}
      <Route 
        path="*" 
        element={
          isStudentAuthenticated || isCompanyAuthenticated 
            ? <Home /> 
            : <Onboarding />
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#14213D]">
          <Navbar />
          
          <main className="flex-1">
            <MainRoutes />
          </main>

          <Footer />
          <Toast />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
