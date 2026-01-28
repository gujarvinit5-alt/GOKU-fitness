import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Calendar, CreditCard, PieChart, MessageSquare, 
  FileText, TrendingUp, Receipt, Search, Bell, Moon, Sun, Menu, LogOut, Settings, X,
  User, FileClock, Upload, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MainLayout = ({ children, activeTab, onTabChange, gymProfile, data }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Admin Profile State (for image upload)
  const [adminPhoto, setAdminPhoto] = useState(localStorage.getItem('adminPhoto') || null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  
  // --- Generate Notifications Logic ---
  const getNotifications = () => {
    if (!data) return [];
    const alerts = [];
    
    // 1. Pending Payments
    data.payments?.forEach(p => {
      if (p.status === 'pending') {
        const memberName = data.members?.find(m => m.id === p.memberId)?.name || 'Unknown Member';
        alerts.push({ 
          id: `pay-${p.id}`, title: 'Payment Pending', 
          desc: `${memberName} owes $${p.amount}`, type: 'alert', icon: AlertCircle 
        });
      }
    });

    // 2. Expiring Memberships (Ends in 7 days)
    data.members?.forEach(m => {
      if (m.status === 'active') {
        const plan = data.plans?.find(p => p.id === m.planId);
        if (plan) {
          const joinDate = new Date(m.joinDate);
          const endDate = new Date(joinDate.setMonth(joinDate.getMonth() + plan.duration));
          const today = new Date();
          const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysLeft >= 0 && daysLeft <= 7) {
            alerts.push({ 
              id: `exp-${m.id}`, title: 'Membership Expiring', 
              desc: `${m.name}'s plan ends in ${daysLeft} days.`, type: 'warning', icon: FileClock
            });
          }
        }
      }
    });
    return alerts;
  };
  const notifications = getNotifications();

  // --- Handle Profile Photo Upload ---
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminPhoto(reader.result);
        localStorage.setItem('adminPhoto', reader.result);
        toast({ title: "Success", description: "Profile picture updated!" });
      };
      reader.readAsDataURL(file);
    }
  };

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
    { id: 'reports', label: 'Reports', icon: TrendingUp },
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
        
        {/* LOGO AREA - KEPT EXACTLY AS REQUESTED */}
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
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-30 relative">
           
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

              {/* --- NOTIFICATION BELL --- */}
              <div className="relative">
                <button onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                   <Bell className="w-5 h-5" />
                   {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>}
                </button>
                {showNotifications && (
                  <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl rounded-xl border dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                     <div className="p-3 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                        <span className="font-bold dark:text-white flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</span>
                        <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>
                     </div>
                     <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                        {notifications.length === 0 ? (
                           <div className="text-center text-slate-400 text-sm py-6 flex flex-col items-center">
                             <CheckCircle2 className="w-8 h-8 mb-2 text-slate-300" />
                             All caught up!
                           </div>
                        ) : (
                           notifications.map((n) => (
                              <div key={n.id} className={`p-3 rounded-lg flex gap-3 ${n.type === 'alert' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                                 <n.icon className={`w-5 h-5 shrink-0 ${n.type === 'alert' ? 'text-red-500' : 'text-orange-500'}`} />
                                 <div>
                                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{n.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{n.desc}</p>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
                )}
              </div>

              {/* --- PROFILE MENU --- */}
              <div className="relative">
                 <div onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }} className="flex items-center gap-3 ml-2 border-l pl-4 border-slate-200 dark:border-slate-700 cursor-pointer group">
                    <div className="text-right hidden md:block select-none">
                       <p className="text-sm font-bold text-slate-800 dark:text-white leading-none group-hover:text-[#FF6B35] transition-colors">{gymProfile?.name || 'Admin'}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Admin Access</p>
                    </div>
                    <div className="relative">
                       <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden group-hover:border-[#FF6B35] transition-all">
                          {adminPhoto ? <img src={adminPhoto} alt="Admin" className="w-full h-full object-cover" /> : (gymProfile?.name?.charAt(0) || 'A')}
                       </div>
                    </div>
                 </div>

                 {showProfileMenu && (
                    <div className="absolute top-14 right-0 w-64 bg-white dark:bg-slate-900 shadow-xl rounded-xl border dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                       {/* Profile Header with Upload */}
                       <div className="p-3 border-b dark:border-slate-800 flex items-center gap-3 mb-2">
                          <div className="relative group/photo cursor-pointer" onClick={() => fileInputRef.current.click()}>
                             <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                {adminPhoto ? <img src={adminPhoto} alt="Admin" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-lg text-slate-400">{gymProfile?.name?.charAt(0) || 'A'}</div>}
                             </div>
                             <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                                <Upload className="w-5 h-5 text-white" />
                             </div>
                             <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                          </div>
                          <div>
                             <p className="font-bold dark:text-white">{gymProfile?.name || 'Admin'}</p>
                             <p className="text-xs text-slate-400">{gymProfile?.email || 'admin@example.com'}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-1">
                          <button onClick={() => { onTabChange('profile'); setShowProfileMenu(false); }} className="w-full flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                             <User className="w-4 h-4 mr-3" /> Edit Profile
                          </button>
                          <button className="w-full flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                             <FileClock className="w-4 h-4 mr-3" /> Export History
                          </button>
                       </div>
                       <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                       <button className="w-full flex items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium">
                          <LogOut className="w-4 h-4 mr-3" /> Logout
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative scroll-smooth" onClick={() => { setShowNotifications(false); setShowProfileMenu(false); }}>
           {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;