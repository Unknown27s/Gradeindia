// ========================================
// University Grading Systems Data
// Covers all major Indian universities
// ========================================

const UNIVERSITIES = {
  generic_10: {
    name: "Standard 10-Point Scale",
    shortName: "10-Point",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B+", name: "Good", point: 7 },
      { letter: "B", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "P", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => cgpa * 10,
    percentageToCgpa: (pct) => pct / 10,
    formula: "Percentage = CGPA × 10"
  },

  vtu: {
    name: "VTU (Visvesvaraya Technological University)",
    shortName: "VTU",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B+", name: "Good", point: 7 },
      { letter: "B", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "P", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => (cgpa - 0.75) * 10,
    percentageToCgpa: (pct) => (pct / 10) + 0.75,
    formula: "Percentage = (CGPA − 0.75) × 10"
  },

  anna: {
    name: "Anna University",
    shortName: "Anna Univ",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B+", name: "Good", point: 7 },
      { letter: "B", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "RA", name: "Reappear", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => cgpa * 10,
    percentageToCgpa: (pct) => pct / 10,
    formula: "Percentage = CGPA × 10"
  },

  jntuh: {
    name: "JNTUH (Jawaharlal Nehru Technological University, Hyderabad)",
    shortName: "JNTUH",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B+", name: "Good", point: 7 },
      { letter: "B", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => (cgpa - 0.75) * 10,
    percentageToCgpa: (pct) => (pct / 10) + 0.75,
    formula: "Percentage = (CGPA − 0.75) × 10"
  },

  mumbai: {
    name: "Mumbai University",
    shortName: "Mumbai Univ",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B+", name: "Good", point: 7 },
      { letter: "B", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "D", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => cgpa * 9.5,
    percentageToCgpa: (pct) => pct / 9.5,
    formula: "Percentage = CGPA × 9.5"
  },

  sppu: {
    name: "SPPU (Savitribai Phule Pune University)",
    shortName: "SPPU",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B+", name: "Good", point: 7 },
      { letter: "B", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "D", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => (cgpa * 10) - 7.5,
    percentageToCgpa: (pct) => (pct + 7.5) / 10,
    formula: "Percentage = (CGPA × 10) − 7.5"
  },

  aktu: {
    name: "AKTU (APJ Abdul Kalam Technical University)",
    shortName: "AKTU",
    grades: [
      { letter: "A+", name: "Outstanding", point: 10 },
      { letter: "A", name: "Excellent", point: 9 },
      { letter: "B+", name: "Very Good", point: 8 },
      { letter: "B", name: "Good", point: 7 },
      { letter: "C+", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "D", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => cgpa * 10,
    percentageToCgpa: (pct) => pct / 10,
    formula: "Percentage = CGPA × 10"
  },

  makaut: {
    name: "MAKAUT (Maulana Abul Kalam Azad University of Technology)",
    shortName: "MAKAUT",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "E", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B", name: "Good", point: 7 },
      { letter: "C", name: "Average", point: 6 },
      { letter: "D", name: "Pass", point: 5 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => (cgpa - 0.75) * 10,
    percentageToCgpa: (pct) => (pct / 10) + 0.75,
    formula: "Percentage = (CGPA − 0.75) × 10"
  },

  gtu: {
    name: "GTU (Gujarat Technological University)",
    shortName: "GTU",
    grades: [
      { letter: "AA", name: "Outstanding", point: 10 },
      { letter: "AB", name: "Excellent", point: 9 },
      { letter: "BB", name: "Very Good", point: 8 },
      { letter: "BC", name: "Good", point: 7 },
      { letter: "CC", name: "Average", point: 6 },
      { letter: "CD", name: "Below Average", point: 5 },
      { letter: "DD", name: "Pass", point: 4 },
      { letter: "FF", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => cgpa * 10,
    percentageToCgpa: (pct) => pct / 10,
    formula: "Percentage = CGPA × 10"
  },

  ktu: {
    name: "KTU (APJ Abdul Kalam Technological University, Kerala)",
    shortName: "KTU",
    grades: [
      { letter: "S", name: "Superior", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8.5 },
      { letter: "B+", name: "Good", point: 8 },
      { letter: "B", name: "Above Average", point: 7 },
      { letter: "C+", name: "Average", point: 6 },
      { letter: "C", name: "Satisfactory", point: 5 },
      { letter: "P", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => cgpa * 10,
    percentageToCgpa: (pct) => pct / 10,
    formula: "Percentage = CGPA × 10"
  },

  calicut: {
    name: "Calicut University",
    shortName: "Calicut Univ",
    grades: [
      { letter: "A+", name: "Outstanding", point: 10 },
      { letter: "A", name: "Excellent", point: 9 },
      { letter: "B+", name: "Very Good", point: 8 },
      { letter: "B", name: "Good", point: 7 },
      { letter: "C+", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "D", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => cgpa * 10,
    percentageToCgpa: (pct) => pct / 10,
    formula: "Percentage = CGPA × 10"
  },

  rgpv: {
    name: "RGPV (Rajiv Gandhi Proudyogiki Vishwavidyalaya)",
    shortName: "RGPV",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B+", name: "Good", point: 7 },
      { letter: "B", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "D", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => (cgpa - 0.75) * 10,
    percentageToCgpa: (pct) => (pct / 10) + 0.75,
    formula: "Percentage = (CGPA − 0.75) × 10"
  },

  osmania: {
    name: "Osmania University",
    shortName: "Osmania",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B+", name: "Good", point: 7 },
      { letter: "B", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "D", name: "Below Average", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => (cgpa - 0.75) * 10,
    percentageToCgpa: (pct) => (pct / 10) + 0.75,
    formula: "Percentage = (CGPA − 0.75) × 10"
  },

  bput: {
    name: "BPUT (Biju Patnaik University of Technology)",
    shortName: "BPUT",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "E", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B", name: "Good", point: 7 },
      { letter: "C", name: "Fair", point: 6 },
      { letter: "D", name: "Below Average", point: 5 },
      { letter: "P", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => (cgpa - 0.75) * 10,
    percentageToCgpa: (pct) => (pct / 10) + 0.75,
    formula: "Percentage = (CGPA − 0.75) × 10"
  },

  cbcs_ugc: {
    name: "UGC CBCS (Choice Based Credit System)",
    shortName: "UGC CBCS",
    grades: [
      { letter: "O", name: "Outstanding", point: 10 },
      { letter: "A+", name: "Excellent", point: 9 },
      { letter: "A", name: "Very Good", point: 8 },
      { letter: "B+", name: "Good", point: 7 },
      { letter: "B", name: "Above Average", point: 6 },
      { letter: "C", name: "Average", point: 5 },
      { letter: "P", name: "Pass", point: 4 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => (cgpa - 0.75) * 10,
    percentageToCgpa: (pct) => (pct / 10) + 0.75,
    formula: "Percentage = (CGPA − 0.75) × 10 (UGC Guideline)"
  },

  generic_4: {
    name: "4-Point Grading Scale",
    shortName: "4-Point",
    grades: [
      { letter: "A / O", name: "Outstanding", point: 4.0 },
      { letter: "A-", name: "Excellent", point: 3.7 },
      { letter: "B+", name: "Very Good", point: 3.3 },
      { letter: "B", name: "Good", point: 3.0 },
      { letter: "B-", name: "Above Average", point: 2.7 },
      { letter: "C+", name: "Average", point: 2.3 },
      { letter: "C", name: "Below Average", point: 2.0 },
      { letter: "D", name: "Pass", point: 1.0 },
      { letter: "F", name: "Fail", point: 0 }
    ],
    cgpaToPercentage: (cgpa) => cgpa * 25,
    percentageToCgpa: (pct) => pct / 25,
    formula: "Percentage = CGPA × 25"
  }
};

// Get grade classification based on SGPA/CGPA
function getGradeClassification(gpa, maxPoint) {
  if (maxPoint <= 4) {
    if (gpa >= 3.7) return { class: "Outstanding", color: "#10b981" };
    if (gpa >= 3.3) return { class: "Excellent", color: "#2563eb" };
    if (gpa >= 3.0) return { class: "Very Good", color: "#7c3aed" };
    if (gpa >= 2.5) return { class: "Good", color: "#06b6d4" };
    if (gpa >= 2.0) return { class: "Average", color: "#f59e0b" };
    if (gpa >= 1.0) return { class: "Pass", color: "#ea580c" };
    return { class: "Fail", color: "#ef4444" };
  }
  // 10-point scale
  if (gpa >= 9.0) return { class: "Outstanding", color: "#10b981" };
  if (gpa >= 8.0) return { class: "Excellent", color: "#2563eb" };
  if (gpa >= 7.0) return { class: "Very Good", color: "#7c3aed" };
  if (gpa >= 6.0) return { class: "Good", color: "#06b6d4" };
  if (gpa >= 5.0) return { class: "Average", color: "#f59e0b" };
  if (gpa >= 4.0) return { class: "Pass", color: "#ea580c" };
  return { class: "Fail", color: "#ef4444" };
}

// Get max grade point for a university
function getMaxGradePoint(uniKey) {
  const uni = UNIVERSITIES[uniKey];
  return Math.max(...uni.grades.map(g => g.point));
}
