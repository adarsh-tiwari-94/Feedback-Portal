import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { FeedbackData, StakeholderType, Teacher } from '../types';
import { 
  FileSpreadsheet, 
  FileText, 
  Trash2, 
  LogOut, 
  Plus, 
  BarChart3,
  Users,
  Lock,
  Filter,
  Edit2,
  Save,
  X,
  Loader2,
  Download
} from 'lucide-react';
import { 
  INSTITUTE_QUESTIONS, 
  DEPARTMENT_QUESTIONS, 
  SYLLABUS_QUESTIONS, 
  TEACHER_QUESTIONS,
  PARENT_QUESTIONS,
  ALUMNI_QUESTIONS,
  ALUMNI_SATISFACTION,
  TEACHER_SYLLABUS_QUESTIONS,
  SATISFACTION_QUESTIONS,
  DOMAIN_DATA
} from '../constants';

interface AdminPanelProps {
  onLogoUpdate: (logo: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogoUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState<FeedbackData[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [activeTab, setActiveTab] = useState<'submissions' | 'teachers' | 'analytics'>('submissions');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingTeacher, setIsSavingTeacher] = useState(false);

  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherForm, setTeacherForm] = useState<Teacher>({
    id: '', name: '', domain: '', program: '', specialization: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setIsLoading(true);
        
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (feedbackData) {
          const mappedData: FeedbackData[] = feedbackData.map((item: any) => ({
            id: item.id,
            stakeholderType: item.stakeholder_type,
            timestamp: item.created_at,
            basicInfo: item.basic_info,
            syllabusFeedback: item.syllabus_feedback,
            teacherRatings: item.teacher_ratings,
            departmentFeedback: item.department_feedback,
            instituteFeedback: item.institute_feedback
          }));
          setData(mappedData);
        }

        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .select('*');
        
        if (teacherData) setTeachers(teacherData);
        
        setIsLoading(false);
      };

      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'feedbackportalkkuniversity@gmail.com' && password === 'mykku@2026') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const getCategorizedQuestions = (type: StakeholderType) => {
    const categories: Record<string, string[]> = {};
    if (type === StakeholderType.STUDENT) categories['Curriculum Feedback'] = [...SYLLABUS_QUESTIONS, ...SATISFACTION_QUESTIONS];
    else if (type === StakeholderType.PARENT) categories['Curriculum Feedback'] = PARENT_QUESTIONS;
    else if (type === StakeholderType.EMPLOYEE) categories['Curriculum Feedback'] = SYLLABUS_QUESTIONS;
    else if (type === StakeholderType.ALUMNI) categories['Curriculum Feedback'] = [...ALUMNI_QUESTIONS, ...ALUMNI_SATISFACTION];
    else if (type === StakeholderType.TEACHER) categories['Curriculum Feedback'] = TEACHER_SYLLABUS_QUESTIONS;
    
    if (type === StakeholderType.STUDENT) categories['Teacher Evaluation'] = TEACHER_QUESTIONS;
    
    categories['Department Feedback'] = DEPARTMENT_QUESTIONS;
    categories['Institute Feedback'] = INSTITUTE_QUESTIONS;
    
    return categories;
  };

  const calculateFrequencies = (stakeholder: StakeholderType, filteredData: FeedbackData[]) => {
    const summary: Record<string, Record<number, number>> = {};
    const teacherFrequencies: Record<string, Record<string, Record<number, number>>> = {};

    filteredData.forEach(d => {
      if (d.stakeholderType !== stakeholder) return;
      
      const allRatings: Record<string, any> = { 
        ...d.syllabusFeedback, 
        ...d.departmentFeedback, 
        ...d.instituteFeedback 
      };
      
      if (d.teacherRatings) {
        d.teacherRatings.forEach(tr => {
          if (!teacherFrequencies[tr.name]) teacherFrequencies[tr.name] = {};
          Object.entries(tr.ratings).forEach(([q, r]) => {
            if (!teacherFrequencies[tr.name][q]) teacherFrequencies[tr.name][q] = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
            teacherFrequencies[tr.name][q][r as number]++;
          });
        });
      }

      Object.entries(allRatings).forEach(([q, r]) => {
        if (typeof r === 'number') {
          if (!summary[q]) summary[q] = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
          if (r in summary[q]) {
            summary[q][r as number]++;
          }
        }
      });
    });

    return { summary, teacherFrequencies };
  };

  const calculateAvg = (r: Record<number, number>) => {
    const total = (r[5] || 0) + (r[4] || 0) + (r[3] || 0) + (r[2] || 0) + (r[1] || 0) + (r[0] || 0);
    if (total === 0) return "0.00";
    return (((r[5] || 0) * 5 + (r[4] || 0) * 4 + (r[3] || 0) * 3 + (r[2] || 0) * 2 + (r[1] || 0) * 1) / total).toFixed(2);
  };

  const exportComprehensiveExcel = () => {
    if (!selectedDomain) return alert("Please select a domain first.");
    const XLSX = (window as any).XLSX;
    const wb = XLSX.utils.book_new();
    const domainDataFiltered = data.filter(d => d.basicInfo.domain === selectedDomain);

    Object.values(StakeholderType).forEach(type => {
      if (type === StakeholderType.ADMIN) return;
      const stakeholderData = domainDataFiltered.filter(d => d.stakeholderType === type);
      if (stakeholderData.length === 0) return;

      const programs = [...new Set(stakeholderData.map(d => d.basicInfo.program))].join(', ');
      const { summary, teacherFrequencies } = calculateFrequencies(type, stakeholderData);
      const categories = getCategorizedQuestions(type);
      const excelRows: any[] = [];

      excelRows.push({ 'Question/Analysis': 'DOMAIN:', 'Excellent (5)': selectedDomain });
      excelRows.push({ 'Question/Analysis': 'PROGRAMS:', 'Excellent (5)': programs });
      excelRows.push({ 'Question/Analysis': 'TOTAL STAKEHOLDERS:', 'Excellent (5)': stakeholderData.length });
      excelRows.push({});

      Object.entries(categories).forEach(([catName, questions]) => {
        excelRows.push({ 'Question/Analysis': `--- ${catName.toUpperCase()} ---` });
        if (catName === 'Teacher Evaluation') {
          Object.entries(teacherFrequencies).forEach(([tName, tRatings]) => {
            excelRows.push({ 'Question/Analysis': `FACULTY: ${tName}` });
            questions.forEach(q => {
              const r = tRatings[q] || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
              const total = (r[5] || 0) + (r[4] || 0) + (r[3] || 0) + (r[2] || 0) + (r[1] || 0) + (r[0] || 0);
              excelRows.push({ 
                'Question/Analysis': q, 
                'Excellent (5)': r[5], 'Very Good (4)': r[4], 'Good (3)': r[3], 'Average (2)': r[2], 'Poor (1)': r[1], 'No(0)': r[0],
                'Total Count': total, 'Average Score': calculateAvg(r) 
              });
            });
            excelRows.push({});
          });
        } else {
          questions.forEach(q => {
            const r = summary[q] || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
            const total = (r[5] || 0) + (r[4] || 0) + (r[3] || 0) + (r[2] || 0) + (r[1] || 0) + (r[0] || 0);
            excelRows.push({ 
              'Question/Analysis': q, 
              'Excellent (5)': r[5], 'Very Good (4)': r[4], 'Good (3)': r[3], 'Average (2)': r[2], 'Poor (1)': r[1], 'No(0)': r[0],
              'Total Count': total, 'Average Score': calculateAvg(r) 
            });
          });
        }
        excelRows.push({});
      });

      const ws = XLSX.utils.json_to_sheet(excelRows);
      XLSX.utils.book_append_sheet(wb, ws, `${type}_Report`);
    });
    
    XLSX.writeFile(wb, `KKU_${selectedDomain}_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportWordReport = () => {
    if (!selectedDomain) return alert("Please select a domain first.");
    const domainDataFiltered = data.filter(d => d.basicInfo.domain === selectedDomain);
    
    let content = `<html><head><meta charset="utf-8"><style>body { font-family: 'Times New Roman', serif; color: #003366; padding: 20px; } table { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1.5pt solid #003366; } th { background-color: #003366; color: white; padding: 12px; border: 1pt solid #003366; font-size: 11pt; } td { padding: 10px; border: 1pt solid #003366; text-align: center; color: #003366; font-weight: bold; } .section-title { font-size: 24pt; font-weight: bold; border-bottom: 3pt solid #003366; margin-top: 40px; text-align: center; } .cat-title { font-size: 16pt; font-weight: bold; color: white; background: #003366; padding: 8px; margin-top: 20px; text-transform: uppercase; } .header-info { margin-bottom: 30px; border: 1pt solid #003366; padding: 15px; }</style></head><body><h1 style="text-align:center; font-size: 48pt;">K.K. University</h1><h2 style="text-align:center; font-size: 36pt;">Feedback Analysis Report</h2><hr/><div class="header-info"><p><strong>DOMAIN:</strong> ${selectedDomain}</p></div>${Object.values(StakeholderType).map(type => {
      if (type === StakeholderType.ADMIN) return '';
      const stakeholderData = domainDataFiltered.filter(d => d.stakeholderType === type);
      if (stakeholderData.length === 0) return '';
      const { summary, teacherFrequencies } = calculateFrequencies(type, stakeholderData);
      const categories = getCategorizedQuestions(type);
      const programs = [...new Set(stakeholderData.map(d => d.basicInfo.program))].join(', ');
      
      return `<div class="section-title">STAKEHOLDER: ${type.toUpperCase()}</div><p><strong>Programs:</strong> ${programs}</p><p><strong>Total Submissions:</strong> ${stakeholderData.length}</p>${Object.entries(categories).map(([catName, questions]) => {
        if (catName === 'Teacher Evaluation') {
          return Object.entries(teacherFrequencies).map(([tName, tRatings]) => `<div class="cat-title">Teacher Evaluation: ${tName}</div><table><thead><tr><th style="text-align:left; width: 40%;">Question</th><th>5</th><th>4</th><th>3</th><th>2</th><th>1</th><th>0</th><th>Avg</th></tr></thead><tbody>${questions.map(q => {
            const r = tRatings[q] || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
            return `<tr><td style="text-align:left;">${q}</td><td>${r[5]}</td><td>${r[4]}</td><td>${r[3]}</td><td>${r[2]}</td><td>${r[1]}</td><td>${r[0]}</td><td style="background:#f0f4f8;">${calculateAvg(r)}</td></tr>`;
          }).join('')}</tbody></table>`).join('');
        } else {
          return `<div class="cat-title">${catName}</div><table><thead><tr><th style="text-align:left; width: 40%;">Question</th><th>5</th><th>4</th><th>3</th><th>2</th><th>1</th><th>0</th><th>Avg</th></tr></thead><tbody>${questions.map(q => {
            const r = summary[q] || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
            return `<tr><td style="text-align:left;">${q}</td><td>${r[5]}</td><td>${r[4]}</td><td>${r[3]}</td><td>${r[2]}</td><td>${r[1]}</td><td>${r[0]}</td><td style="background:#f0f4f8;">${calculateAvg(r)}</td></tr>`;
          }).join('')}</tbody></table>`;
        }
      }).join('')}<div style="page-break-after:always"></div>`;
    }).join('')}</body></html>`;
    
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KKU_${selectedDomain}_Analysis_${new Date().toLocaleDateString().replace(/\//g, '-')}.doc`;
    link.click();
  };

  const exportIndividualWordReport = (submission: FeedbackData) => {
    const categories = getCategorizedQuestions(submission.stakeholderType);
    const allRatings: Record<string, any> = { 
      ...submission.syllabusFeedback, 
      ...submission.departmentFeedback, 
      ...submission.instituteFeedback 
    };

    const safeName = submission.stakeholderType === StakeholderType.PARENT 
      ? `Parent: ${submission.basicInfo.parentName} / Ward: ${submission.basicInfo.name}` 
      : submission.basicInfo.name;

    let teacherHtml = '';
    if (submission.stakeholderType === StakeholderType.STUDENT && submission.teacherRatings && submission.teacherRatings.length > 0) {
      submission.teacherRatings.forEach(tr => {
        let rows = categories['Teacher Evaluation'].map(q => {
          const rating = tr.ratings[q] !== undefined ? tr.ratings[q] : 'N/A';
          return `<tr><td style="text-align:left;">${q}</td><td class="response-cell">${rating}</td></tr>`;
        }).join('');

        teacherHtml += `<div class="cat-title">Teacher Evaluation: ${tr.name}</div>
                        <table><thead><tr><th style="text-align:left; width: 80%;">Question</th><th>Score</th></tr></thead>
                        <tbody>${rows}</tbody></table>`;
      });
    }

    let categoriesHtml = '';
    Object.entries(categories).forEach(([catName, questions]) => {
      if (catName !== 'Teacher Evaluation') {
        let rows = questions.map(q => {
          const rating = allRatings[q] !== undefined ? allRatings[q] : 'N/A';
          return `<tr><td style="text-align:left;">${q}</td><td class="response-cell">${rating}</td></tr>`;
        }).join('');
        
        categoriesHtml += `<div class="cat-title">${catName}</div>
                           <table><thead><tr><th style="text-align:left; width: 80%;">Question</th><th>Score</th></tr></thead>
                           <tbody>${rows}</tbody></table>`;
      }
    });

    let content = `<html><head><meta charset="utf-8"><style>
      body { font-family: 'Times New Roman', serif; color: #003366; padding: 20px; } 
      table { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1.5pt solid #003366; } 
      th { background-color: #003366; color: white; padding: 12px; border: 1pt solid #003366; font-size: 11pt; } 
      td { padding: 10px; border: 1pt solid #003366; color: #003366; font-weight: bold; } 
      .section-title { font-size: 24pt; font-weight: bold; border-bottom: 3pt solid #003366; margin-top: 40px; text-align: center; } 
      .cat-title { font-size: 16pt; font-weight: bold; color: white; background: #003366; padding: 8px; margin-top: 20px; text-transform: uppercase; } 
      .header-info { margin-bottom: 30px; border: 1pt solid #003366; padding: 15px; }
      .response-cell { text-align: center; background-color: #f0f4f8; font-size: 16pt; width: 60px; }
    </style></head><body>
      <h1 style="text-align:center; font-size: 48pt;">K.K. University</h1>
      <h2 style="text-align:center; font-size: 36pt;">Individual Feedback Report</h2>
      <hr/>
      <div class="header-info">
        <p><strong>Name / Ward Details:</strong> ${safeName}</p>
        <p><strong>Stakeholder Type:</strong> ${submission.stakeholderType.toUpperCase()}</p>
        <p><strong>Program:</strong> ${submission.basicInfo.program}</p>
        <p><strong>Domain:</strong> ${submission.basicInfo.domain}</p>
        <p><strong>Submitted:</strong> ${new Date(submission.timestamp).toLocaleString()}</p>
      </div>
      <div class="section-title">FEEDBACK RESPONSES</div>
      ${teacherHtml}
      ${categoriesHtml}
    </body></html>`;
    
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const safeFileName = submission.basicInfo.name.replace(/\s+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `KKU_${safeFileName}_${submission.stakeholderType}_Feedback_${dateStr}.doc`;
    
    link.click();
    URL.revokeObjectURL(url);
  }

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.domain || !teacherForm.program) {
      return alert("All fields are required.");
    }
    
    setIsSavingTeacher(true);

    if (editingTeacherId) {
      const { id, ...updatePayload } = teacherForm; 
      
      const { error } = await supabase
        .from('teachers')
        .update(updatePayload)
        .eq('id', editingTeacherId);
      
      if (error) alert("Error updating teacher");
      else {
        setTeachers(prev => prev.map(t => t.id === editingTeacherId ? teacherForm : t));
      }
    } else {
      const { id, ...newTeacherPayload } = teacherForm; 
      const { data: newT, error } = await supabase
        .from('teachers')
        .insert([newTeacherPayload])
        .select();
        
      if (error) alert("Error creating teacher: " + error.message);
      else if (newT) {
        setTeachers(prev => [...prev, newT[0] as Teacher]);
      }
    }
    
    setTeacherForm({ id: '', name: '', domain: '', program: '', specialization: '' });
    setEditingTeacherId(null);
    setIsSavingTeacher(false);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setTeacherForm(teacher);
    setEditingTeacherId(teacher.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTeacher = async (id: string) => {
    if(!confirm("Confirm deletion?")) return;
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (!error) {
      setTeachers(prev => prev.filter(t => t.id !== id));
    } else {
      alert("Error deleting: " + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="a4-page flex items-center justify-center min-h-[600px]">
        <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-[32px] border-2 border-[#003366]">
          <div className="text-center mb-10">
            <Lock size={40} className="text-[#003366] mx-auto mb-4" />
            <h2 className="text-3xl font-black text-[#003366] times-new-roman">Admin Gateway</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-[#003366] uppercase">Admin Email</label>
              <input type="email" className="w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none font-bold" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-[#003366] uppercase">Password</label>
              <input type="password" className="w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none font-bold" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="w-full py-5 bg-[#003366] text-white rounded-[20px] font-black shadow-xl">ENTER DASHBOARD</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="a4-page space-y-6">
      <div className="flex justify-between items-center border-b-2 border-[#003366] pb-6">
        <div><h2 className="text-4xl font-black text-[#003366] times-new-roman">Admin Dashboard</h2></div>
        <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-red-600 font-black px-4 py-2 border-2 border-red-100 rounded-xl"><LogOut size={20} /> Logout</button>
      </div>

      <div className="flex flex-wrap gap-2 border-b-2 border-[#003366]/10">
        <button onClick={() => setActiveTab('submissions')} className={`pb-3 px-6 font-black flex items-center gap-2 ${activeTab === 'submissions' ? 'border-b-4 border-[#003366] text-[#003366]' : 'text-slate-400'}`}><Users size={18} /> Submissions</button>
        <button onClick={() => setActiveTab('analytics')} className={`pb-3 px-6 font-black flex items-center gap-2 ${activeTab === 'analytics' ? 'border-b-4 border-[#003366] text-[#003366]' : 'text-slate-400'}`}><BarChart3 size={18} /> Analysis</button>
        <button onClick={() => setActiveTab('teachers')} className={`pb-3 px-6 font-black flex items-center gap-2 ${activeTab === 'teachers' ? 'border-b-4 border-[#003366] text-[#003366]' : 'text-slate-400'}`}><Plus size={18} /> Faculty Management</button>
      </div>

      {isLoading && <div className="p-8 text-center text-[#003366]"><Loader2 className="animate-spin inline mr-2"/> Loading Cloud Data...</div>}

      {activeTab === 'teachers' && (
        <div className="space-y-10 animate-fade-in">
          <div className="p-8 bg-blue-50/50 border-2 border-blue-100 rounded-[32px] shadow-sm">
            <h4 className="text-xl font-black text-[#003366] mb-6 flex items-center gap-2 uppercase tracking-tight">
              {editingTeacherId ? <Edit2 size={24} /> : <Plus size={24} />} 
              {editingTeacherId ? 'Edit Faculty Record' : 'Register New Faculty Member'}
            </h4>
            <form onSubmit={handleSaveTeacher} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#003366] uppercase tracking-widest ml-2">Full Legal Name</label>
                <input type="text" className="w-full p-4 bg-white border-2 border-[#003366]/10 rounded-2xl outline-none font-bold text-[#003366]" placeholder="Full Name" value={teacherForm.name} onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#003366] uppercase tracking-widest ml-2">Institutional Domain</label>
                <select className="w-full p-4 bg-white border-2 border-[#003366]/10 rounded-2xl outline-none font-bold text-[#003366]" value={teacherForm.domain} onChange={(e) => setTeacherForm({...teacherForm, domain: e.target.value, program: '', specialization: ''})}>
                  <option value="">-- Choose Domain --</option>
                  {Object.keys(DOMAIN_DATA).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#003366] uppercase tracking-widest ml-2">Primary Program</label>
                <select className="w-full p-4 bg-white border-2 border-[#003366]/10 rounded-2xl outline-none font-bold text-[#003366]" disabled={!teacherForm.domain} value={teacherForm.program} onChange={(e) => setTeacherForm({...teacherForm, program: e.target.value})}>
                  <option value="">-- Choose Program --</option>
                  {teacherForm.domain && DOMAIN_DATA[teacherForm.domain].programs.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#003366] uppercase tracking-widest ml-2">Area of Specialization</label>
                <input type="text" className="w-full p-4 bg-white border-2 border-[#003366]/10 rounded-2xl outline-none font-bold text-[#003366]" placeholder="Expertise Area" value={teacherForm.specialization} onChange={(e) => setTeacherForm({...teacherForm, specialization: e.target.value})} />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button type="submit" disabled={isSavingTeacher} className="flex-1 py-5 bg-[#003366] text-white rounded-2xl font-black shadow-xl hover:bg-[#002244] transition flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50">
                  {isSavingTeacher ? <Loader2 className="animate-spin" /> : (editingTeacherId ? <Save size={20} /> : <Plus size={20} />)} 
                  {editingTeacherId ? 'Save Faculty Changes' : 'Register Faculty Member'}
                </button>
                {editingTeacherId && (
                  <button type="button" onClick={() => { setEditingTeacherId(null); setTeacherForm({ id: '', name: '', domain: '', program: '', specialization: '' }); }} className="px-10 py-5 bg-slate-200 text-slate-700 rounded-2xl font-black hover:bg-slate-300 transition flex items-center gap-2 uppercase tracking-widest">
                    <X size={20} /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="overflow-x-auto border-2 border-[#003366]/20 rounded-3xl shadow-xl bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#003366] text-white">
                <tr>
                  <th className="p-5 text-left text-white font-black">ID (Auto)</th>
                  <th className="p-5 text-left text-white font-black">Name</th>
                  <th className="p-5 text-left text-white font-black">Domain</th>
                  <th className="p-5 text-left text-white font-black">Program</th>
                  <th className="p-5 text-center text-white font-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center font-black text-slate-300 italic">No faculty records found.</td></tr>
                ) : teachers.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition duration-150">
                    <td className="p-5 font-black text-[#003366] text-xs opacity-50">{t.id.substring(0,8)}...</td>
                    <td className="p-5 font-bold text-[#003366]">{t.name}</td>
                    <td className="p-5 font-bold text-blue-800">{t.domain}</td>
                    <td className="p-5 font-medium text-slate-600">{t.program}</td>
                    <td className="p-5 flex justify-center gap-2">
                      <button onClick={() => handleEditTeacher(t)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteTeacher(t.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-8 bg-blue-50/50 rounded-3xl border-2 border-blue-100 shadow-sm space-y-4">
            <h4 className="flex items-center gap-2 text-[#003366] font-black uppercase text-sm tracking-widest"><Filter size={20} /> Domain Analysis Filter</h4>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2 w-full">
                <select className="w-full bg-white border-2 border-[#003366]/10 rounded-2xl p-4 font-bold text-[#003366]" value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}>
                  <option value="">--- SELECT DOMAIN TO ANALYZE ---</option>
                  {Object.keys(DOMAIN_DATA).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={exportComprehensiveExcel} disabled={!selectedDomain} className="flex-1 md:flex-none py-4 px-8 bg-green-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 transform hover:-translate-y-1 transition"><FileSpreadsheet size={20} /> EXCEL</button>
                <button onClick={exportWordReport} disabled={!selectedDomain} className="flex-1 md:flex-none py-4 px-8 bg-blue-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 transform hover:-translate-y-1 transition"><FileText size={20} /> WORD</button>
              </div>
            </div>
          </div>
          {selectedDomain && (
            <div className="space-y-12 animate-fade-in">
              {Object.values(StakeholderType).map(type => {
                if (type === StakeholderType.ADMIN) return null;
                const domainDataFiltered = data.filter(d => d.basicInfo.domain === selectedDomain && d.stakeholderType === type);
                if (domainDataFiltered.length === 0) return null;
                const { summary, teacherFrequencies } = calculateFrequencies(type, domainDataFiltered);
                const categories = getCategorizedQuestions(type);
                
                return (
                  <div key={type} className="border-2 border-[#003366]/20 rounded-2xl overflow-hidden shadow-lg bg-white">
                    <div className="bg-[#003366] p-5 text-white font-black flex justify-between items-center"><span className="text-xl uppercase">{type.toUpperCase()} ANALYSIS</span><span className="bg-white/20 px-4 py-1 rounded-full text-xs">{domainDataFiltered.length} RESPONSES</span></div>
                    <div className="p-6 space-y-8">
                      {Object.entries(categories).map(([catName, questions]) => (
                        <div key={catName} className="space-y-4">
                          <h5 className="font-black text-white bg-[#003366] px-4 py-2 uppercase tracking-widest text-sm rounded shadow-sm">SECTION: {catName}</h5>
                          {catName === 'Teacher Evaluation' ? (
                            Object.entries(teacherFrequencies).map(([tName, tRatings]) => (
                              <div key={tName} className="space-y-2 mb-6 border-l-4 border-blue-100 pl-4">
                                <p className="font-black text-[#003366] text-xs uppercase underline">Evaluating: {tName}</p>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs border-collapse border-2 border-[#003366]/10">
                                    <thead>
                                      <tr className="bg-[#003366]">
                                        <th className="p-4 text-left text-white font-black">Question</th>
                                        <th className="p-4 text-center text-white">5</th>
                                        <th className="p-4 text-center text-white">4</th>
                                        <th className="p-4 text-center text-white">3</th>
                                        <th className="p-4 text-center text-white">2</th>
                                        <th className="p-4 text-center text-white">1</th>
                                        <th className="p-4 text-center text-white">No(0)</th>
                                        <th className="p-4 text-center bg-blue-800 text-white">AVG</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {questions.map(q => { 
                                        const r = tRatings[q] || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 }; 
                                        return (
                                          <tr key={q} className="border-b">
                                            <td className="p-4 font-bold text-[#003366]">{q}</td>
                                            <td className="p-4 text-center">{r[5]}</td>
                                            <td className="p-4 text-center">{r[4]}</td>
                                            <td className="p-4 text-center">{r[3]}</td>
                                            <td className="p-4 text-center">{r[2]}</td>
                                            <td className="p-4 text-center">{r[1]}</td>
                                            <td className="p-4 text-center">{r[0]}</td>
                                            <td className="p-4 text-center font-black bg-blue-50">{calculateAvg(r)}</td>
                                          </tr>
                                        ); 
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs border-collapse border-2 border-[#003366]/10">
                                <thead>
                                  <tr className="bg-[#003366]">
                                    <th className="p-4 text-left text-white font-black">Question</th>
                                    <th className="p-4 text-center text-white">5</th>
                                    <th className="p-4 text-center text-white">4</th>
                                    <th className="p-4 text-center text-white">3</th>
                                    <th className="p-4 text-center text-white">2</th>
                                    <th className="p-4 text-center text-white">1</th>
                                    <th className="p-4 text-center text-white">No(0)</th>
                                    <th className="p-4 text-center bg-blue-800 text-white">AVG</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {questions.map(q => { 
                                    const r = summary[q] || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 }; 
                                    return (
                                      <tr key={q} className="border-b">
                                        <td className="p-4 font-bold text-[#003366]">{q}</td>
                                        <td className="p-4 text-center">{r[5]}</td>
                                        <td className="p-4 text-center">{r[4]}</td>
                                        <td className="p-4 text-center">{r[3]}</td>
                                        <td className="p-4 text-center">{r[2]}</td>
                                        <td className="p-4 text-center">{r[1]}</td>
                                        <td className="p-4 text-center">{r[0]}</td>
                                        <td className="p-4 text-center font-black bg-blue-50">{calculateAvg(r)}</td>
                                      </tr>
                                    ); 
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="animate-fade-in space-y-6">
          <div className="flex gap-4">
            <select className="flex-1 bg-white border-2 border-[#003366]/10 rounded-2xl p-4 font-bold text-[#003366]" value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}>
              <option value="">--- ALL DOMAINS ---</option>
              {Object.keys(DOMAIN_DATA).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto border-2 border-[#003366]/20 rounded-2xl shadow-xl bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#003366] text-white">
                <tr>
                  <th className="p-5 text-left text-white">Timestamp</th>
                  <th className="p-5 text-left text-white">Stakeholder</th>
                  <th className="p-5 text-left text-white">Name / Ward Details</th>
                  <th className="p-5 text-left text-white">Domain</th>
                  <th className="p-5 text-center text-white">Individual Report</th>
                </tr>
              </thead>
              <tbody>
                {data.filter(d => !selectedDomain || d.basicInfo.domain === selectedDomain).length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center font-black text-slate-300">No records found.</td></tr>
                ) : data.filter(d => !selectedDomain || d.basicInfo.domain === selectedDomain).map(d => (
                  <tr key={d.id} className="border-b border-[#003366]/10 hover:bg-blue-50/50 transition">
                    <td className="p-5 font-bold">{new Date(d.timestamp).toLocaleString()}</td>
                    <td className="p-5 font-black">{d.stakeholderType}</td>
                    <td className="p-5 font-bold">
                      {d.stakeholderType === StakeholderType.PARENT ? (
                        <div>
                          <p className="text-[#003366]">Parent: {d.basicInfo.parentName}</p>
                          <p className="text-xs text-slate-400">Ward: {d.basicInfo.name}</p>
                        </div>
                      ) : d.basicInfo.name}
                    </td>
                    <td className="p-5 font-bold text-blue-800">{d.basicInfo.domain}</td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => exportIndividualWordReport(d)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"
                        title="Download Individual Feedback Report"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;