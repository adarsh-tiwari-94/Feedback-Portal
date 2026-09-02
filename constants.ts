
import { DomainMapping } from './types';

export const PRIMARY_BLUE = '#003366';

export const DOMAIN_DATA: DomainMapping = {
  'Teachers Training': {
    programs: ['D.El.Ed', 'B.Ed', 'B.A.B.Ed', 'B.Sc.B.Ed', 'B.Com.B.Ed', 'M.Ed', 'Ph.D.'],
    specializations: { default: ['Pedagogy', 'Educational Technology', 'Educational Psychology', 'Curriculum Design', 'School Administration'] }
  },
  'Engineering': {
    programs: ['ITI', 'Diploma', 'BCA', 'MCA', 'B.Tech', 'M.Tech', 'Ph.D.'],
    specializations: { 
      'B.Tech': ['Civil Engineering', 'Mechanical Engineering', 'Computer Science', 'Electrical Engineering', 'Electronics & Communication', 'Data Engineering', 'Artificial Intelligence', 'Cyber Security', 'Robotics', 'Environmental Engineering'],
      'M.Tech': ['Structural Engineering', 'Thermal Engineering', 'CSE', 'Digital Communication', 'Power Systems'],
      'default': ['Information Technology', 'Software Engineering', 'Automobile Engineering']
    }
  },
  'Pharmacy': {
    programs: ['D.Pharma', 'B.Pharma', 'M.Pharma', 'Ph.D.'],
    specializations: { default: ['Pharmaceutics', 'Pharmacology', 'Pharmaceutical Chemistry', 'Pharmacognosy', 'Quality Assurance', 'Hospital Pharmacy'] }
  },
  'Agriculture': {
    programs: ['B.Sc. (Agriculture)', 'M.Sc. (Agriculture)', 'Ph.D.'],
    specializations: { default: ['Agronomy', 'Horticulture', 'Soil Science', 'Agricultural Economics', 'Plant Pathology', 'Entomology'] }
  },
  'Applied Sciences': {
    programs: ['B.Sc.', 'M.Sc.', 'Ph.D.'],
    specializations: { default: ['Physics', 'Chemistry', 'Mathematics', 'Zoology', 'Botany', 'Microbiology', 'Biotechnology', 'Environmental Science'] }
  },
  'Art & Culture': {
    programs: ['B.A.', 'B.A. (Honours)', 'M.A.', 'Ph.D.'],
    specializations: { default: ['History', 'Geography', 'Economics', 'Political Science', 'Sociology', 'English', 'Hindi', 'Philosophy'] }
  },
  'Information & Library Sciences': {
    programs: ['B.Lib', 'M.Lib', 'Ph.D.'],
    specializations: { default: ['Library Management', 'Archival Science', 'Information Literacy', 'Digital Libraries'] }
  },
  'Legal Sciences': {
    programs: ['B.Com LLB', 'LLB', 'LLM', 'Ph.D.'],
    specializations: { default: ['Constitutional Law', 'Criminal Law', 'Business Law', 'Human Rights', 'Corporate Law', 'Family Law'] }
  },
  'Commerce & Management': {
    programs: ['B.Com', 'BBA', 'MBA', 'M.Com', 'Ph.D.'],
    specializations: { default: ['Finance', 'Marketing', 'Human Resources', 'Supply Chain', 'International Business', 'Digital Marketing'] }
  },
  'Nursing': {
    programs: ['ANM', 'GNM', 'B.Sc. Nursing'],
    specializations: { default: ['General Nursing', 'Midwifery', 'Community Health', 'Surgical Nursing'] }
  },
  'Administration': {
    programs: ['Registrar Office', 'CEO Office', 'Finance Office', 'VC Office', 'Pro-VC Office', 'HR Office', 'Grievance Cell', 'Anti-Ragging Cell', 'Anti-Discrimination Cell', 'Women\'s Protection Cell', 'SC-ST-OBC Cell', 'Divyang Help Cell'],
    specializations: { default: ['Institutional Governance', 'Student Welfare', 'Asset Management', 'Campus Security'] }
  },
  'Placement Cell': {
    programs: ['Placement Services', 'Career Counseling'],
    specializations: { default: ['Career Guidance', 'Industrial Relations', 'Skill Development'] }
  }
};

export interface TeacherRecord {
  dept: string;
  name: string;
  desig: string;
  domain: string;
}

export const MASTER_TEACHERS_LIST: TeacherRecord[] = [
  { dept: 'CIVIL ENGINEERING', name: 'NARENDRA KUMAR SINGH', desig: 'Dean Academic', domain: 'Engineering' },
  { dept: 'CIVIL ENGINEERING', name: 'AMIT KUMAR', desig: 'Asst Professor', domain: 'Engineering' },
  { dept: 'PHARMACY', name: 'SHARAT CHANDRA GOUD', desig: 'Professor', domain: 'Pharmacy' },
  { dept: 'EDUCATION', name: 'SANAD KUMAR DUBEY', desig: 'PRINCIPAL', domain: 'Teachers Training' }
];

export const SYLLABUS_QUESTIONS = [
  "The programs are suitable for Placements and Higher Education",
  "The Course elevating the competency to compete the domestic & international Market in Employment",
  "The programme elevates the creative learning by doing or experimental learning.",
  "The programme also offers communicative skills to enrich the language perception",
  "The programme is developing interpersonal relationships and human values to become a good citizen in the society."
];

export const PARENT_QUESTIONS = [
  "The programs are suitable for my ward's Placements and Higher Education",
  "The Course is elevating my ward's competency to compete in the job market.",
  "The programme elevates creative learning by doing or experimental learning for my ward.",
  "The programme offers communicative skills to enrich my ward's language perception.",
  "The programme develops human values in my ward to become a good citizen."
];

export const EMPLOYER_QUESTIONS = [
  "The effectiveness of the curriculum in developing skill oriented human resources relevance to the industrial needs",
  "The curriculum has been designed to make students industry ready by imparting analytical and soft skills in addition to technical competencies",
  "The inclination of the curriculum to adopt new methods and technology.",
  "The curriculum enriches the innovative thinking, creativeness and problem solving"
];

export const ALUMNI_QUESTIONS = [
  "The content of the curriculum helped in developing core competencies and employable skills.",
  "The curriculum focused on bridging the gap between industry and academia.",
  "The curriculum was designed for the holistic development of personality.",
  "The curriculum provided a platform for practical learning through hands-on experience.",
  "The curriculum promoted research orientation and creative thinking.",
  "The programmes were designed with student-centric learning methodology.",
  "The course included value-added chapters related to current developments in science and technology."
];

export const ALUMNI_SATISFACTION = [
  "Do you feel that the skills imparted during the course helps in catering the needs of the industry",
  "Do you feel proud to be associated with K.K. University as an alumnus?",
  "Are you satisfied with the development activities organized by the department/school",
  "Are you satisfied with the teaching and learning ambience provided by the university?"
];

export const TEACHER_SYLLABUS_QUESTIONS = [
  "Syllabus is appropriate and accomplishes the course",
  "Syllabus designed to impart the employable skills and it is need based",
  "The objectives of the syllabi of the program are clear and helpful",
  "Course content is followed by corresponding reference books/materials",
  "The course/syllabus has good balance between theory and Lab",
  "Course/syllabus of this subject elevated knowledge and perspective.",
  "The program includes adequate recent techniques and trends in emerging areas.",
  "The books prescribed/listed as reference materials are updated and relevant"
];

export const SATISFACTION_QUESTIONS = [
  "Are you satisfied with the way student discipline is maintained in the Institute/ Department",
  "Does the faculty of school/ Department regularly evaluate your performance?",
  "Are you satisfied with the quality of teaching offered by the Department?"
];

export const TEACHER_QUESTIONS = [
  "Punctuality and regularity in class",
  "Depth of subject knowledge",
  "Clarity and effectiveness of communication",
  "Ability to engage students and encourage participation",
  "Fairness in evaluation and grading",
  "Support outside class (doubt clearing, mentoring)",
  "Overall teaching effectiveness"
];

export const DEPARTMENT_QUESTIONS = [
  "Quality of departmental infrastructure/facilities",
  "Support from department staff",
  "Opportunities for projects/research",
  "Departmental events/seminars",
  "Overall departmental satisfaction"
];

export const INSTITUTE_QUESTIONS = [
  "Campus infrastructure and cleanliness",
  "Library and digital resources",
  "Administrative support and responsiveness",
  "Hostel/mess facilities (if applicable)",
  "Placement and career guidance",
  "Anti-ragging and grievance mechanisms",
  "Overall satisfaction with the university"
];
