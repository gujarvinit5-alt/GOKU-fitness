import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, User, LogOut, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { getMembershipStatus } from '@/utils/GymUtils';

const Header = ({ data, toggleSidebar }) => {
  const { members, plans, payments, gymProfile, updateGymProfile } = data;
  
  // States
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adminForm, setAdminForm] = useState(gymProfile);

  // --- 1. Dark Mode Logic ---
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // --- 2. Notification Logic (Expiring & Pending) ---
  const notifications = [
    ...members.map(m => {
      const { status, daysLeft } = getMembershipStatus(m, plans);
      if (status === 'Ending Soon') return { type: 'expiry', text: `${m.name}'s plan ends in ${daysLeft} days`, id: m.id };
      if (status === 'Expired') return { type: 'expired', text: `${m.name}'s plan is Expired!`, id: m.id };
      return null;
    }).filter(Boolean),
    ...payments.filter(p => p.status === 'pending').map(p => {
       const m = members.find(mem => mem.id === p.memberId);
       return { type: 'payment', text: `Payment pending: ${m?.name} ($${p.amount})`, id: p.id };
    })
  ];

  // --- 3. Search Logic ---
  useEffect(() => {
    if (!searchQuery) { setSearchResults([]); return; }
    const results = members.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.phone.includes(searchQuery)
    ).slice(0, 5); // Limit to 5 results
    setSearchResults(results);
  }, [searchQuery, members]);

  // --- 4. Admin Profile Save ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateGymProfile(adminForm);
    setIsSettingsOpen(false);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30 transition-colors">
      
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
           <Menu className="w-5 h-5 dark:text-white" />
        </Button>
        <div className="relative w-full max-w-md hidden md:block group">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF6B35]" />
           <input 
             className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-[#FF6B35] dark:text-white transition-all"
             placeholder="Global Search (Members, Phone)..."
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
           />
           {/* Search Dropdown */}
           {searchResults.length > 0 && (
             <div className="absolute top-12 left-0 w-full bg-white dark:bg-slate-800 shadow-xl rounded-lg border dark:border-slate-700 p-2 flex flex-col gap-1">
                {searchResults.map(m => (
                  <div key={m.id} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer flex justify-between items-center">
                    <span className="font-medium dark:text-white">{m.name}</span>
                    <span className={`text-[10px] px-1.5 rounded ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="text-slate-600 dark:text-slate-300">
           {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)} className="relative text-slate-600 dark:text-slate-300">
             <Bell className="w-5 h-5" />
             {notifications.length > 0 && (
               <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900"></span>
             )}
          </Button>
          
          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl rounded-xl border dark:border-slate-800 p-0 overflow-hidden z-50">
               <div className="p-3 border-b dark:border-slate-800 font-bold dark:text-white">Notifications ({notifications.length})</div>
               <div className="max-h-80 overflow-y-auto">
                 {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-sm">All caught up!</div>
                 ) : (
                    notifications.map((n, i) => (
                      <div key={i} className={`p-3 text-sm border-b dark:border-slate-800 ${n.type === 'expired' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-slate-900'}`}>
                         <p className="dark:text-slate-200">{n.text}</p>
                      </div>
                    ))
                 )}
               </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="relative">
           <div 
             className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
             onClick={() => setShowProfileMenu(!showProfileMenu)}
           >
              <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold">
                 A
              </div>
              <div className="hidden md:block text-right">
                 <p className="text-sm font-bold leading-none dark:text-white">{gymProfile.name}</p>
                 <p className="text-[10px] text-slate-500 font-bold text-right text-[#FF6B35]">Admin</p>
              </div>
           </div>

           {showProfileMenu && (
             <div className="absolute top-14 right-0 w-56 bg-white dark:bg-slate-900 shadow-xl rounded-xl border dark:border-slate-800 p-2 z-50 flex flex-col gap-1">
                <Button variant="ghost" className="justify-start dark:text-slate-300" onClick={() => setIsSettingsOpen(true)}>
                   <Settings className="w-4 h-4 mr-2" /> Settings
                </Button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                <Button variant="ghost" className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                   <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
             </div>
           )}
        </div>
      </div>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Gym Profile Settings">
         <form onSubmit={handleSaveProfile} className="space-y-4">
            <FormInput label="Gym Name" value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} />
            <FormInput label="Email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} />
            <FormInput label="Phone" value={adminForm.phone} onChange={e => setAdminForm({...adminForm, phone: e.target.value})} />
            <div className="flex justify-end gap-2 mt-4">
               <Button type="button" variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
               <Button type="submit" className="bg-[#FF6B35] text-white">Save Changes</Button>
            </div>
         </form>
      </Modal>
    </header>
  );
};

export default Header;