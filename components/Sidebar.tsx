import React from 'react';
import { StakeholderType } from '../types';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  Briefcase, 
  Settings, 
  Presentation,
  Home,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeSection: StakeholderType | 'Home';
  onSectionChange: (section: StakeholderType | 'Home') => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, onClose }) => {
  const navItems = [
    { type: 'Home' as const, label: 'Portal Home', icon: Home },
    { type: StakeholderType.STUDENT, label: 'Students Feedback', icon: Users },
    { type: StakeholderType.PARENT, label: 'Parent Feedback', icon: UserPlus },
    { type: StakeholderType.ALUMNI, label: 'Alumni Feedback', icon: GraduationCap },
    { type: StakeholderType.EMPLOYEE, label: 'Employee Feedback', icon: Briefcase },
    { type: StakeholderType.TEACHER, label: 'Teacher Feedback', icon: Presentation },
    { type: StakeholderType.ADMIN, label: 'Admin Dashboard', icon: Settings },
  ];

  const handleItemClick = (type: StakeholderType | 'Home') => {
    onSectionChange(type);
    if (onClose) onClose();
  };

  return (
    <nav className="flex flex-col h-full sidebar-scroll overflow-y-auto pt-6 pb-20 md:pb-6">
      <div className="px-6 mb-6 md:hidden">
        <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] opacity-50">Main Menu</h3>
      </div>
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.type;
        return (
          <button
            key={item.label}
            onClick={() => handleItemClick(item.type)}
            className={`
              w-full min-h-[56px] px-6 flex items-center gap-4 text-white text-left sidebar-btn mb-1
              ${isActive ? 'btn-active' : 'hover:bg-blue-800/50'}
            `}
          >
            <div className={`p-2 rounded-xl transition-all shadow-sm ${isActive ? 'bg-white text-[#003366] scale-110' : 'bg-blue-900/40 text-blue-200'}`}>
              <Icon size={18} />
            </div>
            <span className={`flex-1 font-bold text-sm tracking-wide ${isActive ? 'text-white' : 'text-blue-100'}`}>
              {item.label}
            </span>
            {isActive && <ChevronRight size={14} className="text-white opacity-50" />}
          </button>
        );
      })}
      
      <div className="mt-auto p-8 text-center border-t border-blue-900/30">
        <div className="text-[9px] text-blue-400 font-black uppercase tracking-[0.4em]">
          Institutional Gateway
        </div>
        <div className="mt-1 text-[8px] text-blue-500 font-bold opacity-40">
          SECURE ENCRYPTED SESSION
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;