import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, BookOpen, Map, UserCheck, Sparkles } from 'lucide-react';
import { Card } from '@/components/common/Card';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Explore Internships',
      desc: 'Discover verified summer & winter hiring drives',
      to: '/opportunities?type=internship',
      icon: <Compass className="w-5 h-5 text-brand-blue" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Browse Free Courses',
      desc: 'Curated courses with verified certificates',
      to: '/courses?priceType=free',
      icon: <BookOpen className="w-5 h-5 text-brand-teal" />,
      bg: 'bg-teal-50',
    },
    {
      title: 'Continue Roadmap',
      desc: 'Step-by-step 4-year engineering guidance',
      to: '/roadmaps',
      icon: <Map className="w-5 h-5 text-brand-violet" />,
      bg: 'bg-violet-50',
    },
    {
      title: 'Edit Career Profile',
      desc: 'Update your academic year, skills & interests',
      to: '/profile',
      icon: <UserCheck className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((act, idx) => (
        <Link key={idx} to={act.to} className="group">
          <Card className="p-4 hover:border-brand-blue/30 transition-all flex items-start gap-3.5">
            <div className={`w-10 h-10 rounded-xl ${act.bg} flex items-center justify-center shrink-0`}>
              {act.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                {act.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {act.desc}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
