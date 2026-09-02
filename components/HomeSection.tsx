import React from 'react';
import { ShieldCheck, GraduationCap, Star, ArrowRight, CheckCircle2, Trophy } from 'lucide-react';
import riyaImg from './riya.png';
import adityaImg from './aditya.png';
import snehaImg from './sneha.png';

interface HomeSectionProps {
  onStart: () => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ onStart }) => {
  return (
    <div className="a4-page animate-fade-in !p-0 overflow-hidden bg-white">
      <div className="relative h-[300px] md:h-[450px] overflow-hidden">
        <img 
          src="https://content3.jdmagicbox.com/comp/nalanda/a3/9999p6112.6112.190522134250.f1a3/catalogue/k-k-university-pvt-university-nepura-nalanda-universities-0x1t3s9czh.jpg" 
          alt="KKU Campus" 
          className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-[3s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#003366] via-[#003366]/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="max-w-4xl">
            <h1 className="times-new-roman text-3xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
              Cultivating Knowledge,<br/>Inspiring Innovation
            </h1>
            <p className="text-blue-100 text-sm md:text-lg font-bold uppercase tracking-[0.3em] drop-shadow-md">
              Official Quality Assurance Portal
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-14 space-y-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#003366]/5 rounded-full border border-[#003366]/10 mb-8">
            <CheckCircle2 size={16} className="text-[#003366]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#003366]">Institutional Integrity Shield</span>
          </div>
          
          <div className="max-w-4xl mx-auto border-2 border-[#003366] p-10 md:p-14 rounded-[40px] bg-white shadow-2xl relative">
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#003366]/20 rounded-tl-xl"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#003366]/20 rounded-br-xl"></div>
            
            <div className="space-y-6">
              <h2 className="times-new-roman font-bold text-[#003366] leading-tight" style={{ fontSize: '24pt' }}>
                "Empowering Your Voice to Shape a Brighter and More Innovative Academic Tomorrow"
              </h2>
              
              <div className="h-1.5 w-32 bg-[#003366] mx-auto rounded-full"></div>
              
              <p className="text-[#003366] text-xl leading-relaxed font-semibold">
                Welcome to the official institutional feedback gateway. K.K. University is committed to global excellence. 
                This secure platform allows students, parents, alumni, and employees to contribute to the strategic 
                growth and academic evolution of our institution.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Trophy size={32} className="text-[#003366]" />
            </div>
            <h3 className="times-new-roman text-3xl font-bold text-[#003366] mb-2">Pillars of Pride</h3>
            <p className="text-xs font-black text-[#003366] uppercase tracking-[0.2em]">Our Academic Excellence Benchmarks</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: 'Aditya Kumar', title: 'B.Ed Topper', session: '2021-23', img: adityaImg },
              { name: 'Riya Kumari', title: 'B.Tech Topper', session: '2021-25', img: riyaImg },
              { name: 'Sneha Singh', title: 'B.Pharma Topper', session: '2022-25', img: snehaImg }
            ].map((student, idx) => (
              <div key={idx} className="text-center group bg-slate-50 p-8 rounded-3xl border border-[#003366]/5 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative w-44 h-44 mx-auto mb-6">
                  <div className="absolute inset-0 bg-[#003366] rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                  <div className="relative w-full h-full rounded-2xl border-2 border-white overflow-hidden shadow-lg bg-slate-200">
                    <img src={student.img} alt={student.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"/>
                  </div>
                </div>
                <h4 className="text-xl font-black text-[#003366] mb-1 uppercase tracking-tight">{student.name}</h4>
                <p className="text-sm font-black text-blue-800 mb-1">{student.title}</p>
                <div className="bg-white/80 py-1 px-3 rounded-full inline-block border border-[#003366]/10 mb-3">
                  <p className="text-[10px] font-bold text-[#003366] uppercase tracking-widest">Session {student.session}</p>
                </div>
                <div className="flex justify-center gap-1 text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-10 border-2 border-[#003366]/10 rounded-3xl bg-white shadow-sm hover:border-[#003366]/30 hover:shadow-md transition-all group">
            <div className="w-16 h-16 bg-[#003366]/5 text-[#003366] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#003366] group-hover:text-white transition-all duration-300">
              <ShieldCheck size={36} />
            </div>
            <h3 className="text-2xl font-black text-[#003366] mb-4">Privacy & Confidentiality</h3>
            <p className="text-[#003366] font-medium leading-relaxed">
              Your feedback is protected by industry-standard encryption. We ensure anonymity and confidentiality 
              throughout the processing of your valuable insights.
            </p>
          </div>
          
          <div className="p-10 border-2 border-[#003366]/10 rounded-3xl bg-white shadow-sm hover:border-[#003366]/30 hover:shadow-md transition-all group">
            <div className="w-16 h-16 bg-[#003366]/5 text-[#003366] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#003366] group-hover:text-white transition-all duration-300">
              <GraduationCap size={36} />
            </div>
            <h3 className="text-2xl font-black text-[#003366] mb-4">Continuous Improvement</h3>
            <p className="text-[#003366] font-medium leading-relaxed">
              Data collected informs our IQAC (Internal Quality Assurance Cell), directly leading to the enhancement 
              of laboratory facilities, library resources, and curriculum delivery methods.
            </p>
          </div>
        </div>

        <div className="text-center py-16 px-10 bg-[#003366] rounded-[40px] text-white relative overflow-hidden shadow-2xl group">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="times-new-roman text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>"Your Voice, Our Mission"</h3>
            <p className="text-blue-100 mb-10 font-bold text-lg">Shape the future of K.K. University by providing your honest feedback. Click below to begin your session.</p>
            <button 
              onClick={onStart}
              className="px-12 py-5 bg-white text-[#003366] font-black text-lg md:text-xl rounded-2xl shadow-xl hover:bg-blue-50 transform hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto group-hover:shadow-white/20"
            >
              INITIATE FEEDBACK SESSION <ArrowRight size={24} />
            </button>
          </div>
        </div>

        <div className="pt-12 border-t border-[#003366]/10 text-center">
          <p className="text-xs font-bold text-[#003366]/60 uppercase tracking-widest leading-loose">
            © 2024 K.K. University Quality Assurance Portal<br/>
            Engineered for Academic Excellence • Secured Internal Communications
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;