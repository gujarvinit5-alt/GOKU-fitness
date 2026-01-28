import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 px-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="font-bold text-[#1A1A1A]">GOKU FITNESS</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#FF6B35] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#FF6B35] transition-colors">Terms of Service</a>
          <span className="text-slate-400">Made by Vinit</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;