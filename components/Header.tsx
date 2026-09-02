import React from 'react';
import { Menu, X } from 'lucide-react';
import logoImg from './logo.jpg';

interface HeaderProps {
  logo: string | null;
  onLogoUpload: (newLogo: string) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <>
      <header className="h-[100px] md:h-[140px] bg-white fixed top-0 left-0 right-0 z-[60] flex items-center px-4 md:px-8 shadow-md border-b border-slate-100">
        <div className="flex items-center w-full max-w-7xl mx-auto h-full relative">
          
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-[#003366] hover:bg-slate-100 rounded-lg transition-colors mr-2"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="w-[60px] h-[60px] md:w-[115px] md:h-[115px] rounded-full border-2 md:border-4 border-[#003366] overflow-hidden shadow-sm bg-white flex items-center justify-center transition transform">
              <img 
                src={logoImg} 
                alt="K.K. University Logo" 
                className="w-full h-full object-contain p-1" 
              />
            </div>
          </div>
          
          <div className="flex-1 text-center md:pr-[115px]">
            <h1 className="responsive-title" style={{ 
              fontFamily: 'Times New Roman, serif', 
              fontWeight: 'bold', 
              color: '#003366', 
              margin: '0',
              lineHeight: '1.1'
            }}>
              <span className="hidden md:inline text-[48pt]">K.K. University</span>
              <span className="md:hidden text-2xl font-black">K.K. University</span>
            </h1>
            <h2 className="responsive-subtitle" style={{ 
              fontFamily: 'Times New Roman, serif', 
              fontWeight: 'bold', 
              color: '#003366', 
              margin: '0',
              lineHeight: '1'
            }}>
              <span className="hidden md:inline text-[36pt]">Student Feedback Portal</span>
              <span className="md:hidden text-sm opacity-80 uppercase tracking-widest font-bold">Feedback Portal</span>
            </h2>
          </div>
        </div>
      </header>
      <div className="h-[100px] md:h-[140px]"></div>
    </>
  );
};

export default Header;