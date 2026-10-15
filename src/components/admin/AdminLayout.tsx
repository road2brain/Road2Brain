import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  BookOpen, 
  Map, 
  Users, 
  ArrowLeft, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useAuth } from '@/contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const { profile } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { to: '/admin/opportunities', label: 'Opportunities & Queue', icon: <Compass className="w-4 h-4" /> },
    { to: '/admin/courses', label: 'Course Directory', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/admin/roadmaps', label: 'Career Roadmaps', icon: <Map className="w-4 h-4" /> },
    { to: '/admin/users', label: 'User Accounts', icon: <Users className="w-4 h-4" /> },
    { to: '/admin/issues', label: 'Student Queries & Issues', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <BrandLogo />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              ADMIN
            </span>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl text-xs">
            <p className="font-bold text-slate-800 truncate">{profile?.displayName || 'Admin'}</p>
            <p className="text-[11px] text-slate-500 truncate">{profile?.email}</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authorized Admin
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-blue px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
