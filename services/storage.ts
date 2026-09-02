
import { FeedbackData, Teacher } from '../types';

const STORAGE_KEY = 'kku_feedback_data';
const TEACHERS_KEY = 'kku_teachers_data_v2';
const LOGO_KEY = 'kku_logo_data';

const DEFAULT_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:%23003366;stop-opacity:1" />
      <stop offset="100%" style="stop-color:%23001a33;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="98" fill="white" stroke="url(%23grad1)" stroke-width="4"/>
  <circle cx="100" cy="100" r="88" fill="url(%23grad1)" />
  <path d="M100 40 L160 75 L100 110 L40 75 Z" fill="white" />
  <path d="M40 75 L40 110 Q100 150 160 110 L160 75" fill="none" stroke="white" stroke-width="3" />
  <rect x="96" y="80" width="8" height="60" fill="white" rx="2" />
  <text x="50%" y="130" text-anchor="middle" fill="white" font-family="'Times New Roman', serif" font-weight="bold" font-size="28">KKU</text>
  <path d="M65 155 Q100 175 135 155" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/>
</svg>`;

export const storageService = {
  saveFeedback: (feedback: FeedbackData) => {
    const existing = storageService.getAllFeedback();
    const updated = [feedback, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getAllFeedback: (): FeedbackData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTeachers: (teachers: Teacher[]) => {
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
  },

  getTeachers: (): Teacher[] => {
    const data = localStorage.getItem(TEACHERS_KEY);
    return data ? JSON.parse(data) : [
      { id: 'FAC001', name: 'Dr. Aditya Kumar', domain: 'Engineering', program: 'B.Tech', specialization: 'Computer Science' },
      { id: 'FAC002', name: 'Dr. Sneha Singh', domain: 'Pharmacy', program: 'B.Pharma', specialization: 'Pharmacology' },
      { id: 'FAC003', name: 'Prof. Riya Kumari', domain: 'Engineering', program: 'B.Tech', specialization: 'Civil Engineering' },
      { id: 'FAC004', name: 'Dr. Binod Kumar', domain: 'Teachers Training', program: 'B.Ed', specialization: 'Pedagogy' }
    ];
  },

  saveLogo: (logo: string) => {
    localStorage.setItem(LOGO_KEY, logo);
  },

  getLogo: (): string => {
    return localStorage.getItem(LOGO_KEY) || DEFAULT_LOGO;
  }
};
