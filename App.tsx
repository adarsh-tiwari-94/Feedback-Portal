import React, { useState, useEffect } from 'react';
import { StakeholderType } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FeedbackWizard from './components/FeedbackWizard';
import AdminPanel from './components/AdminPanel';
import HomeSection from './components/HomeSection';
import { storageService } from './services/storage';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<StakeholderType | 'Home'>('Home');
  const [logo, setLogo] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedLogo = storageService.getLogo();
    setLogo(savedLogo);
  }, []);

  const handleSectionChange = (section: StakeholderType | 'Home') => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoChange = (newLogo: string) => {
    setLogo(newLogo);
    storageService.saveLogo(newLogo);
  };

  const headerHeightClass = "pt-[100px] md:pt-[148px]";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header 
        logo={logo} 
        onLogoUpload={handleLogoChange} 
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <div className={`flex flex-1 ${headerHeightClass}`}>
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-[45] md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className={`
          w-72 flex-shrink-0 bg-[#001a33] fixed z-50 shadow-2xl border-r border-blue-900/40
          sidebar-transition h-full
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          top-[100px] md:top-[148px]
        `}>
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </div>

        <main className="flex-1 md:ml-72 min-h-full transition-all duration-300">
          <div className="p-0 sm:p-4 md:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto">
              {activeSection === 'Home' ? (
                <HomeSection onStart={() => handleSectionChange(StakeholderType.STUDENT)} />
              ) : activeSection === StakeholderType.ADMIN ? (
                <AdminPanel onLogoUpdate={handleLogoChange} />
              ) : (
                <FeedbackWizard 
                  key={activeSection}
                  stakeholderType={activeSection as StakeholderType} 
                  onComplete={() => handleSectionChange('Home')}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      
      <footer className="md:hidden py-4 text-center text-[#003366]/40 text-[10px] font-black uppercase tracking-widest bg-white border-t border-slate-100">
        K.K. University Quality Assurance
      </footer>
    </div>
  );
};

export default App;