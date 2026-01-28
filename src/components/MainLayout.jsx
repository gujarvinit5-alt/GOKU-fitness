import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { User, Bell, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const MainLayout = ({ children, activeTab, onTabChange, gymProfile }) => {
  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans text-[#1A1A1A]">
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A1A1A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}
        />

        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#1A1A1A] capitalize tracking-tight flex items-center gap-2">
              <span className="w-2 h-8 bg-[#FF6B35] rounded-full inline-block"></span>
              {activeTab.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Quick Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm border-none focus:ring-2 focus:ring-[#FF6B35] w-64 transition-all"
              />
            </div>

            <button className="relative p-2.5 rounded-full bg-slate-50 hover:bg-orange-50 transition-colors text-slate-600 hover:text-[#FF6B35]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FF6B35] rounded-full ring-2 ring-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group">
              <div className="text-right hidden sm:block group-hover:opacity-80 transition-opacity">
                <p className="text-sm font-bold text-[#1A1A1A]">{gymProfile?.name || 'GOKU Gym'}</p>
                <p className="text-xs text-[#FF6B35] font-semibold">Admin Access</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A1A1A] to-[#333] flex items-center justify-center border-2 border-[#FF6B35] shadow-lg overflow-hidden">
                {gymProfile?.logo ? (
                   <img src={gymProfile.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#FF6B35]" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent relative z-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto pb-10"
          >
            {children}
          </motion.div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;