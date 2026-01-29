import React, { useState, useRef, useEffect } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { 
  User, Bell, Search, ChevronDown, Moon, Sun, Settings, LogOut, Upload, 
  Shield, AlertCircle, FileClock, X, CreditCard, Phone, Eye, Mail, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

// Added 'onViewMember' to props
const MainLayout = ({ children, activeTab, onTabChange, onViewMember, gymProfile, data }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ members: [], payments: [] });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  // Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [adminPhoto, setAdminPhoto] = useState(localStorage.getItem('adminPhoto') || null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // --- 1. SEARCH LOGIC ---
  useEffect(() => {
    if (!searchQuery.trim() || !data) {
      setSearchResults({ members: [], payments: [] });
      setShowSearchDropdown(false);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const foundMembers = data.members?.filter(m => 
      m.name.toLowerCase().includes(lowerQuery) || 
      m.phone.includes(lowerQuery) ||
      m.email.toLowerCase().includes(lowerQuery)
    ).slice(0, 3) || [];

    const foundPayments = data.payments?.filter(p => {
       const member = data.members?.find(m => m.id === p.memberId);
       return member?.name.toLowerCase().includes(lowerQuery);
    }).slice(0, 3) || [];

    setSearchResults({ members: foundMembers, payments: foundPayments });
    setShowSearchDropdown(true);
  }, [searchQuery, data]);

  const notifications = (() => {
    if (!data) return [];
    const alerts = [];
    data.payments?.forEach(p => {
      if (p.status === 'pending') {
        const memberName = data.members?.find(m => m.id === p.memberId)?.name || 'Unknown Member';
        alerts.push({ id: `pay-${p.id}`, title: 'Payment Pending', desc: `${memberName} owes $${p.amount}`, type: 'alert', icon: AlertCircle });
      }
    });
    data.members?.forEach(m => {
      if (m.status === 'active') {
        const plan = data.plans?.find(p => p.id === m.planId);
        if (plan) {
          const endDate = new Date(new Date(m.joinDate).setMonth(new Date(m.joinDate).getMonth() + plan.duration));
          const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
          if (daysLeft >= 0 && daysLeft <= 7) alerts.push({ id: `exp-${m.id}`, title: 'Membership Expiring', desc: `${m.name}'s plan ends in ${daysLeft} days.`, type: 'warning', icon: FileClock });
        }
      }
    });
    return alerts;
  })();

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

  // --- 4. CLICK HANDLER (UPDATED) ---
  const handleSearchResultClick = (type, id) => {
    if (type === 'members') {
      // Call the special function passed from App.jsx
      if (onViewMember) onViewMember(id);
      else onTabChange('members');
    } else {
      onTabChange('billing');
    }
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-[#F8F9FA] dark:bg-slate-900 overflow-hidden font-sans text-[#1A1A1A] transition-colors duration-300">
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A1A1A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0 transition-colors">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-white capitalize tracking-tight flex items-center gap-2">
              <span className="w-2 h-8 bg-[#FF6B35] rounded-full inline-block"></span>
              {activeTab.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group z-50">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF6B35]" />
                 <input type="text" placeholder="Quick Search (Member, Phone)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => { if(searchQuery) setShowSearchDropdown(true); }} className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-full text-sm border-none focus:ring-2 focus:ring-[#FF6B35] w-72 transition-all outline-none" />
                 {searchQuery && <button onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>}
              </div>

              <AnimatePresence>
                {showSearchDropdown && (searchQuery.trim().length > 0) && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-12 left-0 w-80 bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                      {searchResults.members.length === 0 && searchResults.payments.length === 0 ? (
                         <div className="p-4 text-center text-slate-400 text-sm">No results found.</div>
                      ) : (
                         <div className="max-h-[400px] overflow-y-auto">
                            {searchResults.members.length > 0 && (
                               <div className="p-2">
                                  <p className="px-2 py-1 text-xs font-bold text-slate-400 uppercase">Members</p>
                                  {searchResults.members.map(m => (
                                     <div key={m.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg group/item transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold dark:text-white">{m.name.charAt(0)}</div>
                                        <div className="flex-1 min-w-0">
                                           <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{m.name}</p>
                                           <p className="text-xs text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> {m.phone}</p>
                                        </div>
                                        {/* EYE ICON TRIGGER */}
                                        <button onClick={() => handleSearchResultClick('members', m.id)} className="p-2 text-slate-400 hover:text-[#FF6B35] hover:bg-orange-50 dark:hover:bg-slate-700 rounded-full transition-all" title="View Profile">
                                           <Eye className="w-4 h-4" />
                                        </button>
                                     </div>
                                  ))}
                               </div>
                            )}
                            {searchResults.payments.length > 0 && (
                               <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                                  <p className="px-2 py-1 text-xs font-bold text-slate-400 uppercase">Payments</p>
                                  {searchResults.payments.map(p => (
                                     <div key={p.id} onClick={() => handleSearchResultClick('billing', p.id)} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer group/item">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><CreditCard className="w-4 h-4" /></div>
                                        <div className="flex-1 min-w-0">
                                           <p className="text-sm font-semibold text-slate-800 dark:text-white">${p.amount}</p>
                                           <p className="text-xs text-slate-400 capitalize">{p.status}</p>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            )}
                         </div>
                      )}
                   </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); setShowSearchDropdown(false); }} className="relative p-2.5 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-[#FF6B35]">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FF6B35] rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>}
              </button>
              {showNotifications && (
                <div className="absolute top-14 right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                   <div className="p-3 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                      <span className="font-bold dark:text-white flex items-center gap-2 text-sm"><Bell className="w-4 h-4" /> Notifications</span>
                      <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>
                   </div>
                   <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
                      {notifications.length === 0 ? <div className="text-center text-slate-400 text-xs py-6 flex flex-col items-center"><CheckCircle2 className="w-8 h-8 mb-2 text-slate-200" />All caught up!</div> : notifications.map((n) => (
                            <div key={n.id} className={`p-3 rounded-lg flex gap-3 ${n.type === 'alert' ? 'bg-red-50 dark:bg-red-900/10' : 'bg-orange-50 dark:bg-orange-900/10'}`}>
                               <n.icon className={`w-4 h-4 shrink-0 ${n.type === 'alert' ? 'text-red-500' : 'text-orange-500'}`} />
                               <div><p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{n.title}</p><p className="text-[10px] text-slate-500 dark:text-slate-400">{n.desc}</p></div>
                            </div>
                         ))}
                   </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <div onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowSearchDropdown(false); }} className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700 cursor-pointer group select-none">
                <div className="text-right hidden sm:block group-hover:opacity-80 transition-opacity">
                  <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">{gymProfile?.name || 'GOKU Gym'}</p>
                  <p className="text-xs text-[#FF6B35] font-semibold">Admin Access</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A1A1A] to-[#333] flex items-center justify-center border-2 border-[#FF6B35] shadow-lg overflow-hidden relative">
                  {adminPhoto ? <img src={adminPhoto} alt="Admin" className="w-full h-full object-cover" /> : gymProfile?.logo ? <img src={gymProfile.logo} alt="Logo" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-white" />}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-[#FF6B35] transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </div>

              {showProfileMenu && (
                <div className="absolute top-14 right-0 w-64 bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                   <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 mb-2">
                      <div className="relative group/photo cursor-pointer w-12 h-12" onClick={() => fileInputRef.current.click()}>
                         <div className="w-full h-full rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                            {adminPhoto ? <img src={adminPhoto} alt="Admin" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-lg text-slate-400">A</div>}
                         </div>
                         <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity"><Upload className="w-4 h-4 text-white" /></div>
                         <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                      </div>
                      <div><p className="font-bold text-sm dark:text-white">Update Photo</p><p className="text-[10px] text-slate-400">Click image to change</p></div>
                   </div>
                   <div className="space-y-1">
                      <button onClick={() => { onTabChange('profile'); setShowProfileMenu(false); }} className="w-full flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"><Settings className="w-4 h-4 mr-3" /> Account Settings</button>
                      <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">{darkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />} {darkMode ? 'Light Mode' : 'Dark Mode'}</button>
                   </div>
                   <div className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Support</p>
                      <div className="space-y-1.5">
                         <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"><Mail className="w-3 h-3 text-[#FF6B35]" /> <span className="truncate">vinitgujar13@gmail.com</span></div>
                         <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"><Phone className="w-3 h-3 text-[#FF6B35]" /> <span>7666808559</span></div>
                      </div>
                   </div>
                   <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                   <button className="w-full flex items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-medium"><LogOut className="w-4 h-4 mr-3" /> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent relative z-0" onClick={() => { setShowNotifications(false); setShowProfileMenu(false); setShowSearchDropdown(false); }}>
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="max-w-7xl mx-auto pb-10">
            {children}
          </motion.div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;