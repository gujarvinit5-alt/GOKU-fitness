import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue', delay = 0 }) => {
  const colorStyles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100', trend: 'text-blue-600' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-100', trend: 'text-emerald-600' },
    red: { bg: 'bg-rose-50', text: 'text-rose-600', iconBg: 'bg-rose-100', trend: 'text-rose-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-orange-100', trend: 'text-orange-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100', trend: 'text-purple-600' }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</span>
        <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center shadow-sm`}>
          <Icon className={`w-6 h-6 ${style.text}`} />
        </div>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-[#2C3E50]">{value}</span>
        {trend && (
          <div className={`flex items-center text-sm font-medium mb-1.5 ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-0.5" /> : <ArrowDown className="w-4 h-4 mr-0.5" />}
            {trendValue}
          </div>
        )}
      </div>
    </motion.div>
  );
};