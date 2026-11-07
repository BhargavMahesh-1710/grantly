/**
 * Evaluates scholarship eligibility based on student profile.
 * Generates an overall match score (0-100%) and itemized breakdown.
 */
export function evaluateEligibility(scholarship, profile) {
  if (!profile) {
    return {
      matchScore: 50,
      label: "Profile Needed",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
      breakdown: []
    };
  }

  let totalPoints = 0;
  let earnedPoints = 0;
  const breakdown = [];

  // 1. Education Level (Weight: 30)
  totalPoints += 30;
  const levelMatch = scholarship.studyLevels.some(lvl => 
    lvl.toLowerCase() === profile.educationLevel?.toLowerCase() ||
    (profile.educationLevel === "High School Senior" && lvl.includes("High School")) ||
    (profile.educationLevel === "Undergraduate" && lvl.includes("Undergraduate")) ||
    (profile.educationLevel === "Graduate" && lvl.includes("Graduate"))
  );
  if (levelMatch) {
    earnedPoints += 30;
    breakdown.push({
      criteria: "Degree Level",
      status: "met",
      details: `Your status (${profile.educationLevel}) is eligible.`
    });
  } else {
    breakdown.push({
      criteria: "Degree Level",
      status: "unmet",
      details: `Requires: ${scholarship.studyLevels.join(", ")} (You: ${profile.educationLevel || "Not set"}).`
    });
  }

  // 2. Field of Study (Weight: 30)
  totalPoints += 30;
  const isAllFields = scholarship.fields.includes("All Fields");
  const fieldMatch = isAllFields || scholarship.fields.some(f => 
    profile.fieldOfStudy && (
      f.toLowerCase().includes(profile.fieldOfStudy.toLowerCase()) ||
      profile.fieldOfStudy.toLowerCase().includes(f.toLowerCase())
    )
  );
  if (fieldMatch) {
    earnedPoints += 30;
    breakdown.push({
      criteria: "Field of Study",
      status: "met",
      details: isAllFields ? "Open to all disciplines." : `Matches ${profile.fieldOfStudy}.`
    });
  } else {
    breakdown.push({
      criteria: "Field of Study",
      status: "warning",
      details: `Preferred fields: ${scholarship.fields.join(", ")} (Your major: ${profile.fieldOfStudy}).`
    });
  }

  // 3. Minimum GPA (Weight: 25)
  totalPoints += 25;
  if (!scholarship.minGpa) {
    earnedPoints += 25;
    breakdown.push({
      criteria: "Minimum GPA",
      status: "met",
      details: "No minimum GPA required."
    });
  } else if (profile.gpa && profile.gpa >= scholarship.minGpa) {
    earnedPoints += 25;
    breakdown.push({
      criteria: "Minimum GPA",
      status: "met",
      details: `Your ${profile.gpa.toFixed(2)} GPA meets or exceeds ${scholarship.minGpa.toFixed(1)}.`
    });
  } else {
    earnedPoints += 5; // partial credit
    breakdown.push({
      criteria: "Minimum GPA",
      status: "unmet",
      details: `Requires minimum ${scholarship.minGpa.toFixed(1)} GPA (Your GPA: ${profile.gpa ? profile.gpa.toFixed(2) : "Not listed"}).`
    });
  }

  // 4. Geographic / State Residency (Weight: 15)
  totalPoints += 15;
  const isNational = scholarship.states.includes("All States");
  const stateMatch = isNational || scholarship.states.includes(profile.state);
  if (stateMatch) {
    earnedPoints += 15;
    breakdown.push({
      criteria: "Residency",
      status: "met",
      details: isNational ? "Available nationwide." : `Open to ${profile.state} residents.`
    });
  } else {
    breakdown.push({
      criteria: "Residency",
      status: "warning",
      details: `Designated for residents of: ${scholarship.states.join(", ")}.`
    });
  }

  const matchScore = Math.round((earnedPoints / totalPoints) * 100);

  let label = "Check Details";
  let badgeClass = "bg-amber-50 text-amber-700 border-amber-200";

  if (matchScore >= 85) {
    label = "Likely Match";
    badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (matchScore >= 65) {
    label = "Potential Match";
    badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return {
    matchScore,
    label,
    badgeClass,
    breakdown
  };
}
