export const DEFAULT_STUDENT_PROFILE = {
  fullName: "Alex Rivera",
  email: "alex.rivera@university.edu",
  educationLevel: "Undergraduate",
  fieldOfStudy: "Computer Science",
  institution: "State University of Technology",
  state: "California",
  gpa: 3.65,
  householdIncome: "Under $65,000",
  firstGeneration: true,
  isInternational: false,
  bio: "Third-year Computer Science student passionate about human-centered AI, equitable tech education, and sustainable open-source software.",
  notificationPreferences: {
    deadlineAlerts: true,
    matchingAlerts: true,
    weeklyDigest: false
  }
};

export const INITIAL_TRACKER_ITEMS = [
  {
    scholarshipId: "sch-01",
    status: "in_progress",
    notes: "Drafted statement of purpose; waiting for Professor Miller's recommendation letter.",
    updatedAt: "2026-11-05T14:30:00.000Z",
    checkedDocs: ["Official Academic Transcript", "Statement of Purpose (750 words)"]
  },
  {
    scholarshipId: "sch-02",
    status: "applied",
    notes: "Application submitted via online portal. Confirmation code #HZ-9921.",
    updatedAt: "2026-11-04T09:15:00.000Z",
    checkedDocs: ["Unofficial High School or College Transcript", "Personal Journey Essay (500 words)", "FAFSA Student Aid Index (SAI) Documentation", "One Letter of Recommendation"]
  },
  {
    scholarshipId: "sch-06",
    status: "shortlisted",
    notes: "Invited to virtual finalist interview on December 2nd!",
    updatedAt: "2026-11-06T18:00:00.000Z",
    checkedDocs: ["Transcript", "Essay: Driving Inclusivity in Computing (500 words)", "GitHub/Project Links or Hackathon Submissions", "One Faculty or Mentor Recommendation"]
  }
];

export const INITIAL_SAVED_IDS = ["sch-01", "sch-02", "sch-05", "sch-06"];
