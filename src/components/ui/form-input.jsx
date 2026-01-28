import React from 'react';
import { cn } from '@/lib/utils';

export const FormInput = ({ 
  label, 
  error, 
  type = 'text', 
  className, 
  required,
  ...props 
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-[#2C3E50]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'w-full px-4 py-2.5 bg-white border rounded-lg text-slate-900 placeholder-slate-400 shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export const FormTextarea = ({ 
  label, 
  error, 
  className, 
  required,
  ...props 
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-[#2C3E50]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-3 bg-white border rounded-lg text-slate-900 placeholder-slate-400 shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent',
          'transition-all duration-200 resize-none',
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export const FormSelect = ({ 
  label, 
  error, 
  options = [], 
  className, 
  required,
  ...props 
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-[#2C3E50]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'w-full px-4 py-2.5 bg-white border rounded-lg text-slate-900 shadow-sm appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent',
            'transition-all duration-200',
            error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300',
            className
          )}
          {...props}
        >
          <option value="">Select...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};