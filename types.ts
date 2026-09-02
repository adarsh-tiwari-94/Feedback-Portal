
export enum StakeholderType {
  STUDENT = 'Student',
  PARENT = 'Parent',
  ALUMNI = 'Alumni',
  EMPLOYEE = 'Employee',
  TEACHER = 'Teacher',
  ADMIN = 'Admin'
}

export interface BasicInfo {
  domain: string;
  program: string;
  specialization: string;
  enrollmentNo?: string;
  employeeId?: string;
  name: string;
  parentName?: string;
  email: string;
  yearOfPassing?: string;
}

export interface Teacher {
  id: string;
  name: string;
  domain: string;
  program: string;
  specialization: string;
}

export interface FeedbackData {
  id: string;
  stakeholderType: StakeholderType;
  timestamp: string;
  basicInfo: BasicInfo;
  syllabusFeedback: Record<string, number | string>;
  teacherRatings?: Array<{ name: string; ratings: Record<string, number> }>;
  departmentFeedback: Record<string, number>;
  instituteFeedback: Record<string, number>;
}

export interface DomainMapping {
  [key: string]: {
    programs: string[];
    specializations: Record<string, string[]>;
  };
}
