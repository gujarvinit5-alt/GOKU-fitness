import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Calendar, CreditCard, PieChart, MessageSquare, 
  FileText, TrendingUp, Receipt, Search, Bell, Moon, Sun, Menu, LogOut, Settings 
} from 'lucide-react';

const MainLayout = ({ children, activeTab, onTabChange, gymProfile, data }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'plans', label: 'Membership Plans', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'inquiries', label: 'Inquiries', icon: FileText },
    { id: 'sms', label: 'SMS Notifications', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: TrendingUp }, // Points to your new Reports page
    { id: 'profile', label: 'Gym Profile', icon: Settings },
  ];

  // --- Dark Mode Logic ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-[#1A1A1A] text-white transition-all duration-300 flex flex-col z-20 shrink-0 shadow-xl`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-4 border-b border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B35] to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-900/50">
             <span className="font-bold text-white">GF</span>
          </div>
          {isSidebarOpen && (
            <span className="ml-3 font-bold text-lg tracking-wide animate-in fade-in duration-300">
              GOKU <span className="text-[#FF6B35]">FITNESS</span>
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-900/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                {isSidebarOpen && (
                  <span className="ml-3 font-medium text-sm animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                )}
                {/* Tooltip for collapsed mode */}
                {!isSidebarOpen && (
                  <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center px-3 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
             <LogOut className="w-5 h-5" />
             {isSidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* --- INTERACTIVE HEADER --- */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 shrink-0 transition-colors z-10">
           
           {/* Left: Sidebar Toggle & Page Title */}
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2 -ml-2 text-slate-500 hover:text-[#FF6B35] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                 <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize hidden md:block">
                 {activeTab.replace('-', ' ')}
              </h1>
           </div>

           {/* Center: Search Bar */}
           <div className="flex-1 max-w-md mx-4 hidden md:block relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF6B35] transition-colors" />
              <input 
                 className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-[#FF6B35] dark:text-white transition-all outline-none placeholder:text-slate-400"
                 placeholder="Quick Search (Members, Payments)..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>

           {/* Right: Actions */}
           <div className="flex items-center gap-2 md:gap-4">
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Toggle Dark Mode"
              >
                 {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notification Bell */}
              <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
              </button>

              {/* Profile Section */}
              <div className="flex items-center gap-3 ml-2 border-l pl-4 border-slate-200 dark:border-slate-700">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">
                      {gymProfile?.name || 'Admin'}
                    </p>
                    <p className="text-[10px] text-[#FF6B35] font-bold uppercase tracking-wider mt-0.5">
                      Admin Access
                    </p>
                 </div>
                 <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold cursor-pointer hover:bg-[#FF6B35] ring-2 ring-offset-2 ring-transparent hover:ring-[#FF6B35] transition-all">
                    {gymProfile?.name?.charAt(0) || 'A'}
                 </div>
              </div>
           </div>
        </header>

        {/* --- PAGE CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative scroll-smooth">
           {children}
        </main>

      </div>
    </div>
  );
};

export default MainLayout;