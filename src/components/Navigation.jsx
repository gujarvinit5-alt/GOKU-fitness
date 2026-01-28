import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  CalendarCheck, 
  ClipboardList, 
  BarChart3, 
  FileText, 
  LogOut,
  Building2,
  Receipt,
  MessageSquare
} from 'lucide-react';
import GymLogo from './GymLogo';

const Navigation = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'plans', label: 'Membership Plans', icon: ClipboardList },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'inquiries', label: 'Inquiries', icon: FileText },
    { id: 'sms', label: 'SMS Notifications', icon: MessageSquare },
    { id: 'financial', label: 'Financial Reports', icon: BarChart3 },
    { id: 'reports', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Gym Profile', icon: Building2 },
  ];

  return (
    <div className="h-full flex flex-col bg-[#1A1A1A] border-r border-[#333] text-slate-300 w-72 flex-shrink-0 shadow-2xl z-20">
      <div className="p-8 border-b border-[#333] bg-gradient-to-r from-[#1A1A1A] to-[#252525]">
        <GymLogo />
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85D2E] text-white font-semibold shadow-lg shadow-orange-900/40 translate-x-1' 
                  : 'hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#FF6B35]'}`} />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-[#333] bg-[#151515]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all duration-200 group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navigation;