# K.K. University - Institutional Feedback Portal

A comprehensive, secure, and responsive feedback management system designed for K.K. University. This portal facilitates the collection, storage, and analysis of feedback from various institutional stakeholders to empower the Internal Quality Assurance Cell (IQAC) in driving academic excellence.

## 🌟 Key Features

### Multi-Stakeholder Feedback Interfaces
Dedicated, dynamic feedback wizards tailored for 5 distinct user groups:
*   **Students:** Curriculum assessment, faculty performance evaluation, department, and institutional feedback.
*   **Parents:** Ward's progress, institutional facilities, and curriculum assessment.
*   **Alumni:** Career progression, institutional impact, and satisfaction surveys.
*   **Employees/Employers:** Professional preparedness and curriculum relevance.
*   **Teachers:** Academic environment, syllabus review, and departmental feedback.

### Advanced Admin Dashboard
A secured, centralized hub for institutional administrators to manage data:
*   **Faculty Management:** Add, edit, and remove faculty members across different domains and programs.
*   **Domain Filtering:** Isolate feedback and analytics by specific academic domains (e.g., School of Engineering, School of Applied Science).
*   **Detailed Analytics:** Automatically calculates average scores (5-point Likert scale) and frequency distributions for all questions.

### Automated Reporting & Exports
*   **Comprehensive Excel Export:** Generates multi-sheet `.xlsx` workbooks containing aggregated data, individual counts, and average scores for entire domains.
*   **Aggregated Word Reports:** Generates beautifully formatted `.doc` files summarizing stakeholder feedback across selected domains.
*   **Individual Submissions:** Download specific, single-user feedback reports as `.doc` files for highly granular review.

### UI/UX Design
*   **A4 Page Simulation:** The UI mimics a physical A4 document for a formal, institutional feel.
*   **Fully Responsive:** Seamlessly transitions from a desktop sidebar layout to a mobile-friendly slide-out menu.
*   **Dynamic Visuals:** Custom university branding, tailored color schemes (`#003366` primary blue), and smooth transitions.

---

## 🛠️ Technology Stack

*   **Frontend Framework:** React 19 (TypeScript)
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Backend & Database:** Supabase (PostgreSQL)
*   **Document Generation:** `xlsx` (Excel), Native Blob conversion (Word)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need a [Supabase](https://supabase.com/) account to host the database.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/kku-feedback-portal.git](https://github.com/your-username/kku-feedback-portal.git)
   cd kku-feedback-portal