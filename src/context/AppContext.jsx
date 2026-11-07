import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_SCHOLARSHIPS } from '../data/scholarships';
import { SAMPLE_INTERNSHIPS } from '../data/internships';
import { DEFAULT_COMPANY_PROFILE, INITIAL_APPLICANTS } from '../data/mockCompany';
import { DEFAULT_STUDENT_PROFILE, INITIAL_TRACKER_ITEMS, INITIAL_SAVED_IDS } from '../data/mockProfile';

const AppContext = createContext();

const STORAGE_KEYS = {
  ROLE: 'grantly_active_role_v3',
  STUDENT_PROFILE: 'grantly_student_profile_v3',
  STUDENT_AUTH: 'grantly_student_auth_v3',
  COMPANY_PROFILE: 'grantly_company_profile_v3',
  COMPANY_AUTH: 'grantly_company_auth_v3',
  SCHOLARSHIPS: 'grantly_scholarships_data_v3',
  INTERNSHIPS: 'grantly_internships_data_v3',
  SAVED_SCHOLARSHIPS: 'grantly_saved_scholarships_v3',
  SAVED_INTERNSHIPS: 'grantly_saved_internships_v3',
  STUDENT_APPLICATIONS: 'grantly_student_applications_v3',
  COMPANY_APPLICANTS: 'grantly_company_applicants_v3'
};

export function AppProvider({ children }) {
  // 1. Role State ('student' | 'company')
  const [role, setRole] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROLE);
      return stored === 'company' ? 'company' : 'student';
    } catch {
      return 'student';
    }
  });

  // 2. Student Authentication & Profile
  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const auth = localStorage.getItem(STORAGE_KEYS.STUDENT_AUTH);
      if (auth === 'signed_in') {
        const stored = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
        return stored ? JSON.parse(stored) : DEFAULT_STUDENT_PROFILE;
      }
      return null;
    } catch {
      return null;
    }
  });

  const isStudentAuthenticated = Boolean(studentProfile && studentProfile.fullName);

  // 3. Company Authentication & Profile
  const [companyProfile, setCompanyProfile] = useState(() => {
    try {
      const auth = localStorage.getItem(STORAGE_KEYS.COMPANY_AUTH);
      if (auth === 'signed_in') {
        const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_PROFILE);
        return stored ? JSON.parse(stored) : DEFAULT_COMPANY_PROFILE;
      }
      return null;
    } catch {
      return null;
    }
  });

  const isCompanyAuthenticated = Boolean(companyProfile && companyProfile.companyName);

  // 4. Opportunities Data (Scholarships & Internships)
  const [scholarships, setScholarships] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS);
      return stored ? JSON.parse(stored) : SAMPLE_SCHOLARSHIPS;
    } catch {
      return SAMPLE_SCHOLARSHIPS;
    }
  });

  const [internships, setInternships] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INTERNSHIPS);
      return stored ? JSON.parse(stored) : SAMPLE_INTERNSHIPS;
    } catch {
      return SAMPLE_INTERNSHIPS;
    }
  });

  // 5. Student Saved Items
  const [savedScholarshipIds, setSavedScholarshipIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedInternshipIds, setSavedInternshipIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_INTERNSHIPS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 6. Student Applications (Unified pipeline for Scholarships and Internships)
  const [studentApplications, setStudentApplications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDENT_APPLICATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 7. Company Applicants Data
  const [applicants, setApplicants] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_APPLICANTS);
      return stored ? JSON.parse(stored) : INITIAL_APPLICANTS;
    } catch {
      return INITIAL_APPLICANTS;
    }
  });

  // 8. Toast Notification State
  const [toast, setToast] = useState(null);

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    if (studentProfile) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(studentProfile));
      localStorage.setItem(STORAGE_KEYS.STUDENT_AUTH, 'signed_in');
    } else {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_PROFILE);
      localStorage.setItem(STORAGE_KEYS.STUDENT_AUTH, 'signed_out');
    }
  }, [studentProfile]);

  useEffect(() => {
    if (companyProfile) {
      localStorage.setItem(STORAGE_KEYS.COMPANY_PROFILE, JSON.stringify(companyProfile));
      localStorage.setItem(STORAGE_KEYS.COMPANY_AUTH, 'signed_in');
    } else {
      localStorage.removeItem(STORAGE_KEYS.COMPANY_PROFILE);
      localStorage.setItem(STORAGE_KEYS.COMPANY_AUTH, 'signed_out');
    }
  }, [companyProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS, JSON.stringify(savedScholarshipIds));
  }, [savedScholarshipIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_INTERNSHIPS, JSON.stringify(savedInternshipIds));
  }, [savedInternshipIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT_APPLICATIONS, JSON.stringify(studentApplications));
  }, [studentApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANY_APPLICANTS, JSON.stringify(applicants));
  }, [applicants]);

  // --- Toast Helper ---
  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- Role Switcher ---
  const switchRole = (newRole) => {
    setRole(newRole);
    showToast(`Switched to ${newRole === 'company' ? 'Company / Employer' : 'Student'} Portal`, 'info');
  };

  // --- Student Auth Handlers ---
  const studentLogin = (emailOrName, _password = '') => {
    const defaultData = {
      ...DEFAULT_STUDENT_PROFILE,
      fullName: emailOrName.includes('@') ? emailOrName.split('@')[0] : emailOrName,
      email: emailOrName.includes('@') ? emailOrName : `${emailOrName.toLowerCase().replace(/\s+/g, '')}@student.edu`
    };
    setStudentProfile(defaultData);
    showToast(`Welcome back, ${defaultData.fullName}!`, 'success');
  };

  const studentRegister = (profileData) => {
    setStudentProfile(profileData);
    showToast(`Student profile created! Welcome, ${profileData.fullName}!`, 'success');
  };

  const studentSignOut = () => {
    setStudentProfile(null);
    showToast('Signed out of Student Portal', 'info');
  };

  const updateStudentProfile = (updates) => {
    setStudentProfile(prev => ({ ...(prev || DEFAULT_STUDENT_PROFILE), ...updates }));
    showToast('Student profile updated successfully!');
  };

  // Demo student fast-track
  const studentDemoSignIn = () => {
    setStudentProfile(DEFAULT_STUDENT_PROFILE);
    setSavedScholarshipIds(INITIAL_SAVED_IDS);
    setSavedInternshipIds(["int-01", "int-02"]);
    setStudentApplications([
      ...INITIAL_TRACKER_ITEMS,
      {
        id: "app-int-01",
        opportunityId: "int-01",
        type: "internship",
        status: "applied",
        notes: "Submitted engineering portfolio & GitHub repo.",
        updatedAt: new Date().toISOString(),
        checkedDocs: ["Resume / CV", "Technical Portfolio", "Transcript"]
      }
    ]);
    showToast('Signed in as Demo Student (Alex Rivera)!', 'success');
  };

  // --- Company Auth Handlers ---
  const companyLogin = (emailOrName, _password = '') => {
    const compData = {
      ...DEFAULT_COMPANY_PROFILE,
      companyName: emailOrName.includes('@') ? emailOrName.split('@')[0] : emailOrName,
      contactEmail: emailOrName.includes('@') ? emailOrName : 'recruiting@company-example.com'
    };
    setCompanyProfile(compData);
    setRole('company');
    showToast(`Signed in to ${compData.companyName} portal!`, 'success');
  };

  const companyRegister = (compData) => {
    setCompanyProfile(compData);
    setRole('company');
    showToast(`Company registered! Welcome, ${compData.companyName}!`, 'success');
  };

  const companySignOut = () => {
    setCompanyProfile(null);
    showToast('Signed out of Company Portal', 'info');
  };

  const updateCompanyProfile = (updates) => {
    setCompanyProfile(prev => ({ ...(prev || DEFAULT_COMPANY_PROFILE), ...updates }));
    showToast('Company profile updated successfully!');
  };

  const companyDemoSignIn = () => {
    setCompanyProfile(DEFAULT_COMPANY_PROFILE);
    setRole('company');
    showToast('Signed in as Demo Employer (CloudScale Technologies)!', 'success');
  };

  // --- Company Opportunity Management Handlers ---
  const addOpportunity = (opp, type = 'internship') => {
    const newId = `${type === 'internship' ? 'int' : 'sch'}-${Date.now().toString().slice(-4)}`;
    const createdItem = {
      ...opp,
      id: newId,
      company: companyProfile?.companyName || opp.company || opp.provider || 'Featured Organization',
      provider: companyProfile?.companyName || opp.company || opp.provider || 'Featured Organization',
      createdAt: new Date().toISOString(),
      applicationsCount: 0
    };

    if (type === 'internship') {
      setInternships(prev => [createdItem, ...prev]);
      showToast(opp.status === 'draft' ? 'Internship saved as draft!' : 'Internship published live!', 'success');
    } else {
      setScholarships(prev => [createdItem, ...prev]);
      showToast(opp.status === 'draft' ? 'Scholarship saved as draft!' : 'Scholarship published live!', 'success');
    }
    return createdItem;
  };

  const updateOpportunity = (id, updates, type = 'internship') => {
    if (type === 'internship') {
      setInternships(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      showToast('Internship updated successfully!');
    } else {
      setScholarships(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      showToast('Scholarship updated successfully!');
    }
  };

  const deleteOpportunity = (id, type = 'internship') => {
    if (type === 'internship') {
      setInternships(prev => prev.filter(item => item.id !== id));
      showToast('Internship removed', 'info');
    } else {
      setScholarships(prev => prev.filter(item => item.id !== id));
      showToast('Scholarship removed', 'info');
    }
  };

  // --- Company Applicant Pipeline Management Handlers ---
  const updateApplicantStatus = (appId, newStatus, newNotes = null) => {
    setApplicants(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: newStatus,
          notes: newNotes !== null ? newNotes : a.notes
        };
      }
      return a;
    }));
    showToast(`Applicant status changed to ${newStatus.toUpperCase()}`);
  };

  // --- Student Bookmarks & Tracking ---
  const toggleSaveScholarship = (id) => {
    if (!isStudentAuthenticated) {
      showToast('Please sign in as a student to bookmark opportunities.', 'info');
      return;
    }
    setSavedScholarshipIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    showToast(savedScholarshipIds.includes(id) ? 'Removed scholarship from bookmarks' : 'Scholarship bookmarked!');
  };

  const toggleSaveInternship = (id) => {
    if (!isStudentAuthenticated) {
      showToast('Please sign in as a student to bookmark opportunities.', 'info');
      return;
    }
    setSavedInternshipIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    showToast(savedInternshipIds.includes(id) ? 'Removed internship from bookmarks' : 'Internship bookmarked!');
  };

  const isScholarshipSaved = (id) => savedScholarshipIds.includes(id);
  const isInternshipSaved = (id) => savedInternshipIds.includes(id);

  // Apply to Opportunity & Track
  const applyToOpportunity = (opportunity, type = 'internship', notes = '') => {
    if (!isStudentAuthenticated) {
      showToast('Please sign in as a student to apply.', 'info');
      return;
    }

    const existingIndex = studentApplications.findIndex(a => a.opportunityId === opportunity.id);
    const timestamp = new Date().toISOString();

    if (existingIndex >= 0) {
      setStudentApplications(prev => {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], status: 'applied', notes, updatedAt: timestamp };
        return copy;
      });
      showToast('Application marked as Applied!');
    } else {
      const newApp = {
        id: `app-${Date.now().toString().slice(-4)}`,
        opportunityId: opportunity.id,
        type,
        status: 'applied',
        notes,
        updatedAt: timestamp,
        checkedDocs: []
      };
      setStudentApplications(prev => [newApp, ...prev]);

      // Automatically register candidate in Company applicant pipeline!
      const companyCandidate = {
        id: `cand-${Date.now().toString().slice(-4)}`,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        opportunityType: type,
        studentName: studentProfile.fullName,
        studentEmail: studentProfile.email,
        educationLevel: studentProfile.educationLevel,
        major: studentProfile.fieldOfStudy,
        institution: studentProfile.institution || 'State University',
        gpa: studentProfile.gpa || 3.5,
        appliedAt: timestamp,
        status: 'review',
        resumeUrl: 'https://example.com/resumes/student-resume.pdf',
        notes: notes || 'Submitted directly via GRANTLY student portal.'
      };
      setApplicants(prev => [companyCandidate, ...prev]);

      // Increment opportunity applicant count
      if (type === 'internship') {
        setInternships(prev => prev.map(i => i.id === opportunity.id ? { ...i, applicationsCount: (i.applicationsCount || 0) + 1 } : i));
      }

      showToast('Application submitted & added to your tracker!', 'success');
    }
  };

  const updateStudentApplication = (opportunityId, updates) => {
    setStudentApplications(prev => {
      const idx = prev.findIndex(a => a.opportunityId === opportunityId);
      const timestamp = new Date().toISOString();
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updates, updatedAt: timestamp };
        return copy;
      }
      return [{
        id: `app-${Date.now().toString().slice(-4)}`,
        opportunityId,
        type: updates.type || 'scholarship',
        status: updates.status || 'interested',
        notes: updates.notes || '',
        checkedDocs: updates.checkedDocs || [],
        updatedAt: timestamp,
        ...updates
      }, ...prev];
    });
    showToast('Application tracker updated');
  };

  const removeStudentApplication = (opportunityId) => {
    setStudentApplications(prev => prev.filter(a => a.opportunityId !== opportunityId));
    showToast('Removed from tracker', 'info');
  };

  const toggleApplicationDoc = (opportunityId, docName) => {
    setStudentApplications(prev => {
      const existing = prev.find(a => a.opportunityId === opportunityId);
      const currentDocs = existing?.checkedDocs || [];
      const updatedDocs = currentDocs.includes(docName)
        ? currentDocs.filter(d => d !== docName)
        : [...currentDocs, docName];

      if (existing) {
        return prev.map(a => 
          a.opportunityId === opportunityId 
            ? { ...a, checkedDocs: updatedDocs, updatedAt: new Date().toISOString() }
            : a
        );
      } else {
        return [{
          id: `app-${Date.now().toString().slice(-4)}`,
          opportunityId,
          type: 'scholarship',
          status: 'in_progress',
          notes: '',
          checkedDocs: updatedDocs,
          updatedAt: new Date().toISOString()
        }, ...prev];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        // Role & Portals
        role,
        switchRole,

        // Student Auth & Profile
        studentProfile,
        isStudentAuthenticated,
        studentLogin,
        studentRegister,
        studentSignOut,
        updateStudentProfile,
        studentDemoSignIn,

        // Backward compatibility profile
        profile: studentProfile,
        isAuthenticated: isStudentAuthenticated,
        signOut: studentSignOut,

        // Company Auth & Profile
        companyProfile,
        isCompanyAuthenticated,
        companyLogin,
        companyRegister,
        companySignOut,
        updateCompanyProfile,
        companyDemoSignIn,

        // Opportunities Data
        scholarships,
        internships,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,

        // Company Applicant Pipeline
        applicants,
        updateApplicantStatus,

        // Student Bookmarks
        savedScholarshipIds,
        savedInternshipIds,
        toggleSaveScholarship,
        toggleSaveInternship,
        isScholarshipSaved,
        isInternshipSaved,
        savedIds: savedScholarshipIds, // backward compat
        toggleSave: toggleSaveScholarship, // backward compat
        isSaved: isScholarshipSaved, // backward compat

        // Student Applications & Tracker
        studentApplications,
        applications: studentApplications, // backward compat
        applyToOpportunity,
        updateStudentApplication,
        updateApplication: updateStudentApplication, // backward compat
        removeStudentApplication,
        removeApplication: removeStudentApplication, // backward compat
        toggleApplicationDoc,

        // Toast Feedback
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
