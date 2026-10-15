import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, type, showPasswordToggle = true, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);

    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={actualType}
            className={cn(
              'w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 disabled:bg-slate-50 disabled:text-slate-500',
              leftIcon && 'pl-10',
              (rightIcon || (isPassword && showPasswordToggle)) && 'pr-10',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
              className
            )}
            {...props}
          />
          {isPassword && showPasswordToggle ? (
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-700 focus:outline-none transition-colors p-1 rounded-md"
              aria-label={showPassword ? 'Hide text' : 'Reveal text'}
              title={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
