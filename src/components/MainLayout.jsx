import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Calendar, CreditCard, PieChart, MessageSquare, 
  FileText, TrendingUp, Receipt, Search, Bell, Moon, Sun, Menu, LogOut, Settings, X 
} from 'lucide-react';

const MainLayout = ({ children, activeTab, onTabChange, gymProfile, data }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toggle States for Dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // --- Generate Notifications Logic ---
  const getNotifications = () => {
    if (!data) return [];
    const alerts = [];
    // Check for Pending Payments
    data.payments?.forEach(p => {
      if (p.status === 'pending') {
        const memberName = data.members?.find(m => m.id === p.memberId)?.name || 'Unknown';
        alerts.push({ id: p.id, title: 'Payment Pending', desc: `${memberName} owes $${p.amount}` });
      }
    });
    return alerts.slice(0, 5);
  };
  const notifications = getNotifications();

  // --- RESTORED SIDEBAR MENU ITEMS ---
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'plans', label: 'Membership Plans', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'inquiries', label: 'Inquiries', icon: FileText },
    { id: 'sms', label: 'SMS Notifications', icon: MessageSquare },
    { id: 'financial', label: 'Financial Reports', icon: TrendingUp }, // RESTORED
    { id: 'analytics', label: 'Analytics', icon: PieChart },         // RESTORED
    { id: 'profile', label: 'Gym Profile', icon: Settings },
  ];

  // Dark Mode Logic
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1A1A1A] text-white transition-all duration-300 flex flex-col z-20 shrink-0 shadow-xl`}>
        
        {/* RESTORED LOGO STYLE */}
        <div className="h-16 flex items-center px-4 border-b border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B35] to-orange-600 flex items-center justify-center shrink-0">
             <span className="font-bold text-white">GF</span>
          </div>
          {isSidebarOpen && (
            <span className="ml-3 font-bold text-xl tracking-wide">
              GOKU <span className="text-[#FF6B35]">FITNESS</span>
            </span>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive ? 'bg-[#FF6B35] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                
                {!isSidebarOpen && (
                  <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center px-3 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
             <LogOut className="w-5 h-5" />
             {isSidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* --- HEADER --- */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
           
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-500 hover:text-[#FF6B35] rounded-lg transition-colors">
                 <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize hidden md:block">
                 {activeTab.replace('-', ' ')}
              </h1>
           </div>

           <div className="flex-1 max-w-md mx-4 hidden md:block relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF6B35]" />
              <input 
                 className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-[#FF6B35] dark:text-white outline-none"
                 placeholder="Quick Search..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>

           <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                 {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                   <Bell className="w-5 h-5" />
                   {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>}
                </button>
                {showNotifications && (
                  <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl rounded-xl border dark:border-slate-800 overflow-hidden z-50">
                     <div className="p-3 border-b dark:border-slate-800 flex justify-between items-center">
                        <span className="font-bold dark:text-white">Notifications</span>
                        <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4" /></button>
                     </div>
                     <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                        {notifications.length === 0 ? <p className="text-center text-slate-400 text-sm py-4">No new notifications</p> : notifications.map((n, i) => (
                           <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                              <p className="font-semibold text-slate-800 dark:text-white">{n.title}</p>
                              <p className="text-slate-500 dark:text-slate-400">{n.desc}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                 <div onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }} className="flex items-center gap-3 ml-2 border-l pl-4 border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div className="text-right hidden md:block select-none">
                       <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{gymProfile?.name || 'Admin'}</p>
                       <p className="text-[10px] text-[#FF6B35] font-bold uppercase mt-0.5">Admin Access</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold hover:bg-[#FF6B35] transition-colors">
                       {gymProfile?.name?.charAt(0) || 'A'}
                    </div>
                 </div>
                 {showProfileMenu && (
                    <div className="absolute top-12 right-0 w-56 bg-white dark:bg-slate-900 shadow-xl rounded-xl border dark:border-slate-800 p-2 z-50">
                       <button onClick={() => { onTabChange('profile'); setShowProfileMenu(false); }} className="w-full flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                          <Settings className="w-4 h-4 mr-2" /> Edit Profile
                       </button>
                       <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                       <button className="w-full flex items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
                          <LogOut className="w-4 h-4 mr-2" /> Logout
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative scroll-smooth" onClick={() => { setShowNotifications(false); setShowProfileMenu(false); }}>
           {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;