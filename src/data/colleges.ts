export interface College {
  name: string;
  departments: string[];
}

export const colleges: College[] = [
  {
    name: "College of Science",
    departments: [
      "Computer Science",
      "Information Technology",
      "Data Science and Analytics",
      "Mathematics",
      "Statistics",
      "Physics",
      "Chemistry",
      "Biological Sciences",
      "Environmental Science"
    ]
  },
  {
    name: "College of Engineering",
    departments: [
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical/Electronic Engineering",
      "Chemical Engineering",
      "Materials Engineering",
      "Geological Engineering",
      "Agricultural and Biosystems Engineering",
      "Geomatic Engineering",
      "Petroleum Engineering"
    ]
  },
  {
    name: "College of Humanities and Social Sciences",
    departments: [
      "English",
      "Modern Languages",
      "Religious Studies",
      "History and Political Studies",
      "Geography and Rural Development",
      "Sociology and Social Work",
      "Economics"
    ]
  },
  {
    name: "College of Art and Built Environment",
    departments: [
      "Architecture",
      "Building Technology",
      "Land Economy",
      "Planning",
      "Publishing Studies"
    ]
  },
  {
    name: "College of Agriculture and Natural Resources",
    departments: [
      "Crop and Soil Sciences",
      "Horticulture",
      "Agricultural Economics, Agribusiness and Extension",
      "Animal Science",
      "Food Science and Technology",
      "Renewable Natural Resources"
    ]
  },
  {
    name: "College of Health Sciences",
    departments: [
      "Community Health",
      "Clinical Microbiology",
      "Medical Laboratory Technology",
      "Optometry",
      "Nursing",
      "Physician Assistantship"
    ]
  },
  {
    name: "Kwame Nkrumah University of Science and Technology School of Business",
    departments: [
      "Accounting",
      "Marketing and Corporate Strategy",
      "Managerial Science",
      "Supply Chain and Information Systems"
    ]
  }
];

export const getDepartmentsByCollege = (collegeName: string): string[] => {
  const college = colleges.find(c => c.name === collegeName);
  return college ? college.departments : [];
};