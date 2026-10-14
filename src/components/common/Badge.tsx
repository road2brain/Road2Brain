import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, Sparkles, MapPin, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OpportunityType, VerificationStatus, OpportunityStatus } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className, 
  variant = 'default',
  size = 'md'
}) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-brand-blue border-blue-200/60 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 font-medium',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/60 font-medium',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60 font-medium',
    info: 'bg-teal-50 text-teal-800 border-teal-200/60 font-medium',
    outline: 'bg-transparent text-slate-600 border-slate-300',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={cn('inline-flex items-center rounded-lg border font-medium leading-none select-none', styles[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

export const OpportunityTypeBadge: React.FC<{ type: OpportunityType; className?: string }> = ({ type, className }) => {
  switch (type) {
    case 'internship':
      return <Badge variant="primary" className={className}>Internship</Badge>;
    case 'fresher_job':
      return <Badge variant="info" className={className}>Fresher Job</Badge>;
    case 'hackathon':
      return <Badge variant="warning" className={className}><Sparkles className="w-3 h-3 text-amber-600" /> Hackathon</Badge>;
    case 'scholarship':
      return <Badge variant="success" className={className}>Scholarship</Badge>;
    case 'student_program':
      return <Badge variant="default" className={cn('bg-purple-50 text-purple-700 border-purple-200', className)}>Student Program</Badge>;
    default:
      return <Badge className={className}>{type}</Badge>;
  }
};

export const VerificationBadge: React.FC<{ 
  status: VerificationStatus; 
  verifiedAt?: string;
  showDate?: boolean;
  className?: string;
}> = ({ status, verifiedAt, showDate = false, className }) => {
  if (status === 'verified') {
    return (
      <Badge variant="success" className={cn('bg-emerald-50 text-emerald-700 border-emerald-200', className)}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Verified</span>
        {showDate && verifiedAt && (
          <span className="text-[10px] text-emerald-600/80 font-normal">
            ({new Date(verifiedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})
          </span>
        )}
      </Badge>
    );
  }

  if (status === 'pending_verification') {
    return (
      <Badge variant="warning" className={className}>
        <Clock className="w-3 h-3 text-amber-600" />
        <span>Pending Verification</span>
      </Badge>
    );
  }

  if (status === 'rejected') {
    return (
      <Badge variant="danger" className={className}>
        <AlertTriangle className="w-3 h-3 text-rose-600" />
        <span>Source Unverified</span>
      </Badge>
    );
  }

  return <Badge variant="default" className={className}>Draft</Badge>;
};

export const LocationBadge: React.FC<{ type: 'remote' | 'hybrid' | 'on-site'; location?: string }> = ({ type, location }) => {
  const label = type === 'remote' ? 'Remote' : type === 'hybrid' ? `Hybrid (${location || 'India'})` : location || 'On-site';
  return (
    <Badge variant="default" className="text-slate-600 bg-slate-50 border-slate-200">
      <MapPin className="w-3 h-3 text-slate-400" />
      <span>{label}</span>
    </Badge>
  );
};
