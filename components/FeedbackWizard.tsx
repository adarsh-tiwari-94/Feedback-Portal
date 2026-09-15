import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { StakeholderType, BasicInfo, Teacher } from '../types';
import { 
  DOMAIN_DATA, 
  SYLLABUS_QUESTIONS, 
  PARENT_QUESTIONS, 
  EMPLOYER_QUESTIONS,
  ALUMNI_QUESTIONS,
  ALUMNI_SATISFACTION,
  TEACHER_SYLLABUS_QUESTIONS,
  SATISFACTION_QUESTIONS, 
  TEACHER_QUESTIONS, 
  DEPARTMENT_QUESTIONS, 
  INSTITUTE_QUESTIONS 
} from '../constants';
import { CheckCircle, ArrowRight, ArrowLeft, User, Mail, GraduationCap, Building, Star, Users, Loader2 } from 'lucide-react';

interface FeedbackWizardProps {
  stakeholderType: StakeholderType;
  onComplete: () => void;
}

const FeedbackWizard: React.FC<FeedbackWizardProps> = ({ stakeholderType, onComplete }) => {
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    domain: '',
    program: '',
    specialization: '',
    name: '',
    parentName: '',
    email: '',
    enrollmentNo: '',
    employeeId: '',
    yearOfPassing: ''
  });
  
  const [syllabusFeedback, setSyllabusFeedback] = useState<Record<string, number | string>>({});
  const [teacherRatings, setTeacherRatings] = useState<Array<{ name: string; ratings: Record<string, number> }>>([]);
  const [deptFeedback, setDeptFeedback] = useState<Record<string, number>>({});
  const [instFeedback, setInstFeedback] = useState<Record<string, number>>({});
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [currentTeacherRatings, setCurrentTeacherRatings] = useState<Record<string, number>>({});
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  // Verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (basicInfo.domain) {
      const fetchTeachers = async () => {
        setIsLoadingTeachers(true);
        const { data, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('domain', basicInfo.domain);
        
        if (data) setFilteredTeachers(data);
        if (error) console.error('Error loading teachers:', error);
        setIsLoadingTeachers(false);
      };
      
      fetchTeachers();
    }
  }, [basicInfo.domain]);

  const totalSteps = stakeholderType === StakeholderType.STUDENT ? 5 : 4;

  const handleNext = async () => {
    if (isSectionComplete()) {
      if (
        step === 1 && 
        (stakeholderType === StakeholderType.STUDENT || stakeholderType === StakeholderType.ALUMNI || stakeholderType === StakeholderType.PARENT)
      ) {
        setIsVerifying(true);
        setValidationError(null);

        try {
          const { data: studentRecord, error } = await supabase
            .from('students')
            .select('*')
            .eq('enrollment_no', (basicInfo.enrollmentNo || '').trim())
            .single();

          if (error || !studentRecord) {
            setValidationError("Enrollment number not found in our database. Please check and try again.");
            setIsVerifying(false);
            return;
          }

          const inputName = basicInfo.name.trim().toLowerCase();
          const dbName = studentRecord.name.trim().toLowerCase();

          if (
            inputName !== dbName ||
            basicInfo.domain !== studentRecord.domain ||
            basicInfo.program !== studentRecord.program ||
            basicInfo.specialization !== studentRecord.specialization
          ) {
            setValidationError("The Domain, Program, Specialization, or Name does not match our records for this Enrollment Number.");
            setIsVerifying(false);
            return;
          }

          setValidationError(null);
        } catch (err) {
          setValidationError("An error occurred connecting to the database. Please try again.");
          setIsVerifying(false);
          return;
        }
        setIsVerifying(false);
      }

      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTeacherRating = () => {
    const teacher = filteredTeachers.find(t => t.id === selectedTeacherId);
    if (teacher && Object.keys(currentTeacherRatings).length === TEACHER_QUESTIONS.length) {
      setTeacherRatings(prev => [...prev, { name: `${teacher.name} (${teacher.id})`, ratings: { ...currentTeacherRatings } }]);
      setSelectedTeacherId('');
      setCurrentTeacherRatings({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getSyllabusQuestions = () => {
    switch (stakeholderType) {
      case StakeholderType.PARENT: return PARENT_QUESTIONS;
      case StakeholderType.EMPLOYEE: return EMPLOYER_QUESTIONS;
      case StakeholderType.ALUMNI: return [...ALUMNI_QUESTIONS, ...ALUMNI_SATISFACTION];
      case StakeholderType.TEACHER: return TEACHER_SYLLABUS_QUESTIONS;
      default: return SYLLABUS_QUESTIONS;
    }
  };

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isBasicInfoComplete = () => {
    const common = basicInfo.name.length > 2 && isEmailValid(basicInfo.email) && basicInfo.domain && basicInfo.program && basicInfo.specialization;
    if (stakeholderType === StakeholderType.PARENT) {
      return !!(common && basicInfo.parentName && basicInfo.parentName.length > 2 && basicInfo.enrollmentNo);
    }
    if (stakeholderType === StakeholderType.STUDENT || stakeholderType === StakeholderType.ALUMNI) {
      return !!(common && basicInfo.enrollmentNo);
    }
    return !!(common && basicInfo.employeeId);
  };

  const isSyllabusComplete = () => {
    const qList = getSyllabusQuestions();
    const hasAllRatings = qList.every(q => syllabusFeedback[q] !== undefined);
    if (stakeholderType === StakeholderType.STUDENT || stakeholderType === StakeholderType.ALUMNI) {
      const satisfactionQ = stakeholderType === StakeholderType.STUDENT ? SATISFACTION_QUESTIONS : ALUMNI_SATISFACTION;
      return hasAllRatings && satisfactionQ.every(q => syllabusFeedback[q] !== undefined);
    }
    return hasAllRatings;
  };

  const isTeacherComplete = () => teacherRatings.length >= 1;
  const isDeptComplete = () => DEPARTMENT_QUESTIONS.every(q => deptFeedback[q] !== undefined);
  const isInstComplete = () => INSTITUTE_QUESTIONS.every(q => instFeedback[q] !== undefined);

  const isSectionComplete = () => {
    if (step === 1) return isBasicInfoComplete();
    if (step === 2) return isSyllabusComplete();
    if (stakeholderType === StakeholderType.STUDENT) {
      if (step === 3) return isTeacherComplete();
      if (step === 4) return isDeptComplete();
      if (step === 5) return isInstComplete();
    } else {
      if (step === 3) return isDeptComplete();
      if (step === 4) return isInstComplete();
    }
    return false;
  };

  const handleSubmitAll = async () => {
    if (!isSectionComplete()) return;
    setIsSubmitting(true);

    const feedbackPayload = {
      stakeholder_type: stakeholderType,
      basic_info: basicInfo,
      syllabus_feedback: syllabusFeedback,
      teacher_ratings: stakeholderType === StakeholderType.STUDENT ? teacherRatings : null,
      department_feedback: deptFeedback,
      institute_feedback: instFeedback
    };

    const { error } = await supabase.from('feedback').insert([feedbackPayload]);

    if (error) {
      console.error('Submission error:', error);
      alert('Failed to submit feedback. Please check your connection.');
      setIsSubmitting(false);
    } else {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderSectionHeader = (subtitle: string) => (
    <div className="mb-6 md:mb-10 border-b-2 border-[#003366] pb-4 md:pb-6 text-center">
      <h2 className="responsive-title" style={{ fontFamily: 'Times New Roman, serif', fontSize: '24pt', fontWeight: 'bold', color: '#003366', margin: '0 0 5px 0' }}>
        K.K. University
      </h2>
      <h3 className="responsive-subtitle" style={{ fontFamily: 'Times New Roman, serif', fontSize: '18pt', fontWeight: 'bold', color: '#003366', margin: '0' }}>
        {subtitle}
      </h3>
    </div>
  );

  const renderLikertTable = (questions: string[], state: any, setState: any, titleSuffix: string) => (
    <div className="responsive-table-container shadow-sm bg-white border border-slate-200">
      <table className="w-full border-collapse text-xs md:text-sm">
        <thead>
          <tr className="bg-[#003366] text-white">
            <th className="p-2 md:p-4 text-left w-10 border-r border-white/10 font-black text-white">No.</th>
            <th className="p-2 md:p-4 text-left border-r border-white/10 font-black text-white">Question</th>
            {[5, 4, 3, 2, 1].map(r => (
              <th key={r} className="p-1 md:p-4 text-center w-12 md:w-20 border-r border-white/10 last:border-r-0">
                <span className="block font-black text-xs md:text-sm mb-1 text-white">{r}</span>
                <span className="block text-[7px] md:text-[9px] uppercase font-bold text-white leading-none tracking-tight">
                  {r === 5 ? 'Exc.' : r === 4 ? 'V.Good' : r === 3 ? 'Good' : r === 2 ? 'Avg.' : 'Poor'}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => (
            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-200 last:border-b-0`}>
              <td className="p-2 md:p-4 text-center font-bold border-r border-slate-100 text-[#003366]">{idx + 1}</td>
              <td className="p-2 md:p-4 border-r border-slate-100 font-medium text-[#003366] leading-snug">{q}</td>
              {[5, 4, 3, 2, 1].map(r => (
                <td key={r} className={`p-1 md:p-4 text-center border-r border-slate-100 last:border-r-0 transition-colors ${state[q] === r ? 'bg-blue-100/50' : ''}`}>
                  <div className="flex justify-center">
                    <input 
                      type="radio" 
                      name={`${titleSuffix}_${idx}`} 
                      value={r}
                      checked={state[q] === r}
                      onChange={() => setState({ ...state, [q]: r })}
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="a4-page flex flex-col items-center justify-center text-center animate-fade-in py-20">
        <div className="bg-green-50 p-6 md:p-10 rounded-full mb-8 shadow-inner">
          <CheckCircle size={80} className="text-green-600" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#003366] mb-4">Submission Complete!</h2>
        <p className="text-[#003366] mb-10 max-w-sm font-semibold text-lg leading-relaxed">Thank you. Your contribution is vital to the continuous evolution of K.K. University.</p>
        <button onClick={onComplete} className="w-full sm:w-auto px-10 py-5 bg-[#003366] text-white font-black rounded-2xl shadow-xl hover:bg-[#002244] transition-all transform hover:-translate-y-1">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="a4-page animate-fade-in shadow-xl">
      <div className="sticky top-0 bg-white z-[30] pt-2 pb-4 border-b-2 border-slate-100 mb-6">
        <div className="flex items-center justify-between text-[10px] md:text-[11px] font-black text-[#003366] uppercase tracking-widest mb-3">
          <span>{stakeholderType} PORTAL</span>
          <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-800">Step {step} / {totalSteps}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#003366] transition-all duration-700 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            {renderSectionHeader(`${stakeholderType} Identification`)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#003366] uppercase tracking-wider"><Building size={14} /> Domain</label>
                <select className="bg-white" value={basicInfo.domain} onChange={(e) => setBasicInfo({...basicInfo, domain: e.target.value, program: '', specialization: ''})}>
                  <option value="">Select Domain</option>
                  {Object.keys(DOMAIN_DATA).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#003366] uppercase tracking-wider"><GraduationCap size={14} /> Program</label>
                <select className="bg-white" disabled={!basicInfo.domain} value={basicInfo.program} onChange={(e) => setBasicInfo({...basicInfo, program: e.target.value, specialization: ''})}>
                  <option value="">Select Program</option>
                  {basicInfo.domain && DOMAIN_DATA[basicInfo.domain].programs.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#003366] uppercase tracking-wider"><CheckCircle size={14} /> Spec.</label>
                <select className="bg-white" disabled={!basicInfo.program} value={basicInfo.specialization} onChange={(e) => setBasicInfo({...basicInfo, specialization: e.target.value})}>
                  <option value="">Select Specialization</option>
                  {basicInfo.program && (DOMAIN_DATA[basicInfo.domain].specializations[basicInfo.program] || DOMAIN_DATA[basicInfo.domain].specializations['default']).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              {stakeholderType === StakeholderType.PARENT && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-[#003366] uppercase tracking-wider"><Users size={14} /> Parent Name</label>
                  <input type="text" placeholder="Full Name of Parent" className="bg-white" value={basicInfo.parentName || ''} onChange={(e) => setBasicInfo({...basicInfo, parentName: e.target.value})}/>
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#003366] uppercase tracking-wider"><User size={14} /> {stakeholderType === StakeholderType.PARENT ? "Ward's Enrollment No" : (stakeholderType === StakeholderType.STUDENT || stakeholderType === StakeholderType.ALUMNI ? 'Enrollment No' : 'Employee ID')}</label>
                <input type="text" placeholder="Identification Code" className="bg-white" value={stakeholderType === StakeholderType.STUDENT || stakeholderType === StakeholderType.ALUMNI || stakeholderType === StakeholderType.PARENT ? (basicInfo.enrollmentNo || '') : (basicInfo.employeeId || '')} onChange={(e) => setBasicInfo({...basicInfo, [stakeholderType === StakeholderType.STUDENT || stakeholderType === StakeholderType.ALUMNI || stakeholderType === StakeholderType.PARENT ? 'enrollmentNo' : 'employeeId']: e.target.value})}/>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#003366] uppercase tracking-wider"><User size={14} /> {stakeholderType === StakeholderType.PARENT ? "Ward's Full Legal Name" : 'Full Legal Name'}</label>
                <input type="text" placeholder="As per official records" className="bg-white" value={basicInfo.name} onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}/>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#003366] uppercase tracking-wider"><Mail size={14} /> Contact Email</label>
                <input type="email" placeholder="example@email.com" className="bg-white" value={basicInfo.email} onChange={(e) => setBasicInfo({...basicInfo, email: e.target.value})}/>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {renderSectionHeader('Curriculum Assessment')}
            {renderLikertTable(getSyllabusQuestions(), syllabusFeedback, setSyllabusFeedback, 'syllabus')}
            {(stakeholderType === StakeholderType.STUDENT || stakeholderType === StakeholderType.ALUMNI) && (
               <div className="responsive-table-container bg-white border border-slate-200">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="bg-[#003366] text-white">
                      <th className="p-3 text-left w-12 border-r border-white/10 font-black text-white">No.</th>
                      <th className="p-3 text-left border-r border-white/10 font-black text-white">Question</th>
                      <th className="p-3 text-center w-24 border-r border-white/10 font-black text-white">Yes</th>
                      <th className="p-3 text-center w-24 font-black text-white">No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stakeholderType === StakeholderType.STUDENT ? SATISFACTION_QUESTIONS : ALUMNI_SATISFACTION).map((q, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0">
                        <td className="p-4 text-center font-bold border-r border-slate-100 text-[#003366]">{idx + 1}</td>
                        <td className="p-4 border-r border-slate-100 font-bold text-[#003366]">{q}</td>
                        <td className="p-4 text-center border-r border-slate-100">
                          <input type="radio" name={`sat_${idx}`} checked={syllabusFeedback[q] === 5} onChange={() => setSyllabusFeedback({...syllabusFeedback, [q]: 5})} className="w-6 h-6" />
                        </td>
                        <td className="p-4 text-center">
                          <input type="radio" name={`sat_${idx}`} checked={syllabusFeedback[q] === 0} onChange={() => setSyllabusFeedback({...syllabusFeedback, [q]: 0})} className="w-6 h-6" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {stakeholderType === StakeholderType.STUDENT && step === 3 && (
          <div className="space-y-6">
            {renderSectionHeader('Faculty Performance Index')}
            <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-dashed border-blue-200 mb-6">
              <h4 className="font-black text-[#003366] mb-3 uppercase tracking-widest text-[10px]">Evaluation Queue:</h4>
              <div className="flex flex-wrap gap-2">
                {teacherRatings.length === 0 ? (
                  <span className="text-xs text-[#003366]/60 italic font-medium">No evaluations recorded yet. Please select faculty member below.</span>
                ) : teacherRatings.map(tr => (
                  <div key={tr.name} className="flex items-center gap-2 px-3 py-1.5 bg-[#003366] text-white text-[10px] font-black rounded-xl shadow-sm">
                    <Star size={10} fill="currentColor" /> {tr.name.split('(')[0]}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 border-2 border-slate-100 rounded-3xl bg-white space-y-6 shadow-sm">
              <label className="block text-[10px] font-black text-[#003366] uppercase tracking-[0.2em] mb-2">Identify Faculty Member to Evaluate</label>
              {isLoadingTeachers ? (
                <div className="flex items-center justify-center p-4 text-[#003366]"><Loader2 className="animate-spin mr-2"/> Loading Faculty...</div>
              ) : (
                <select className="w-full bg-slate-50 mb-6" value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)}>
                  <option value="">--- CHOOSE FACULTY ---</option>
                  {filteredTeachers.filter(t => !teacherRatings.find(tr => tr.name.includes(t.id))).map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.id} - {t.specialization})</option>
                  ))}
                </select>
              )}
              {selectedTeacherId && (
                <div className="animate-fade-in space-y-6">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[#003366] font-black text-xs uppercase tracking-widest text-center">Evaluating: {filteredTeachers.find(t => t.id === selectedTeacherId)?.name}</p>
                  </div>
                  {renderLikertTable(TEACHER_QUESTIONS, currentTeacherRatings, setCurrentTeacherRatings, 'teacher')}
                  <button onClick={handleAddTeacherRating} disabled={Object.keys(currentTeacherRatings).length < TEACHER_QUESTIONS.length} className="w-full py-5 bg-[#003366] text-white font-black rounded-2xl shadow-xl disabled:opacity-20 transition-all hover:bg-[#002244] transform active:scale-95">
                    CONFIRM & SAVE EVALUATION
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {((stakeholderType === StakeholderType.STUDENT && (step === 4 || step === 5)) || (stakeholderType !== StakeholderType.STUDENT && (step === 3 || step === 4))) && (
          <div className="space-y-6">
            {renderSectionHeader(
              ((stakeholderType === StakeholderType.STUDENT && step === 4) || (stakeholderType !== StakeholderType.STUDENT && step === 3)) 
              ? 'Department Assessment' 
              : 'Institutional Assessment'
            )}
            {renderLikertTable(
              ((stakeholderType === StakeholderType.STUDENT && step === 4) || (stakeholderType !== StakeholderType.STUDENT && step === 3)) 
              ? DEPARTMENT_QUESTIONS : INSTITUTE_QUESTIONS,
              ((stakeholderType === StakeholderType.STUDENT && step === 4) || (stakeholderType !== StakeholderType.STUDENT && step === 3)) 
              ? deptFeedback : instFeedback,
              ((stakeholderType === StakeholderType.STUDENT && step === 4) || (stakeholderType !== StakeholderType.STUDENT && step === 3)) 
              ? setDeptFeedback : setInstFeedback,
              'final'
            )}
          </div>
        )}
      </div>

      {/* 1. ADD THIS ERROR BANNER ABOVE THE BUTTONS */}
      {validationError && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 font-bold rounded-xl text-sm flex items-center justify-center text-center">
          {validationError}
        </div>
      )}

      {/* 2. UPDATE THE BUTTONS CONTAINER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t-2 border-slate-100">
        <button 
          onClick={handleBack} 
          disabled={step === 1 || isSubmitting || isVerifying} 
          className="w-full sm:w-auto px-10 py-4 border-2 border-[#003366] text-[#003366] font-black rounded-2xl hover:bg-slate-50 disabled:opacity-20 flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft size={20} /> PREVIOUS
        </button>
        
        {step === totalSteps ? (
          <button 
            onClick={handleSubmitAll} 
            disabled={!isSectionComplete() || isSubmitting} 
            className="w-full sm:w-auto px-12 py-5 bg-green-700 text-white font-black text-xl rounded-2xl shadow-2xl hover:bg-green-800 disabled:opacity-20 flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95"
          >
            {isSubmitting ? <><Loader2 className="animate-spin" /> SUBMITTING...</> : <>SUBMIT FINAL REPORT <CheckCircle size={24} /></>}
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            disabled={!isSectionComplete() || isVerifying} 
            className="w-full sm:w-auto px-12 py-4 bg-[#003366] text-white font-black rounded-2xl shadow-xl hover:bg-[#002244] disabled:opacity-20 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            {/* Show Verifying spinner if checking DB, otherwise show Next */}
            {isVerifying ? (
              <><Loader2 className="animate-spin" size={20} /> VERIFYING RECORD...</>
            ) : (
              <>NEXT SECTION <ArrowRight size={20} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedbackWizard;