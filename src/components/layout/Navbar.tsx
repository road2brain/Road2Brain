import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Compass, 
  BookOpen, 
  Map, 
  LayoutDashboard, 
  ShieldAlert, 
  User, 
  LogOut, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, profile, isAdmin, logout, demoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      showToast('Signed out successfully.', 'info');
      navigate('/');
    } catch {
      showToast('Error signing out.', 'error');
    }
  };

  const navLinks = [
    { to: '/opportunities', label: 'Opportunities', icon: <Compass className="w-4 h-4" /> },
    { to: '/courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/roadmaps', label: 'Career Roadmaps', icon: <Map className="w-4 h-4" /> },
    { to: '/about', label: 'About', icon: null },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <BrandLogo />
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-brand-blue bg-blue-50/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4 text-brand-blue" />}>
                    Dashboard
                  </Button>
                </Link>

                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm" leftIcon={<ShieldAlert className="w-4 h-4 text-amber-400" />}>
                      Admin Panel
                    </Button>
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue font-bold flex items-center justify-center text-xs">
                      {profile?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                      {profile?.displayName || 'Student'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{profile?.displayName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-brand-blue'}`}>
                            {isAdmin ? 'ADMIN' : `${profile?.currentYear || 'Student'}`}
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Edit Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Student Dashboard
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* 1-Click Demo switchers for easy evaluation */}
                <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
                  <span className="px-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Demo:</span>
                  <button
                    onClick={() => demoLogin('student')}
                    className="px-2 py-1 rounded-lg hover:bg-white hover:text-brand-blue hover:shadow-xs transition-all text-[11px]"
                    title="Sign in as demo student"
                  >
                    Student
                  </button>
                  <button
                    onClick={() => demoLogin('admin')}
                    className="px-2 py-1 rounded-lg hover:bg-white hover:text-amber-700 hover:shadow-xs transition-all text-[11px]"
                    title="Sign in as demo admin"
                  >
                    Admin
                  </button>
                </div>

                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5 text-white/80" />}>
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="p-3 bg-slate-50 rounded-xl mb-1">
                  <p className="text-xs font-bold text-slate-800">{profile?.displayName}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                </div>

                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                    Student Dashboard
                  </Button>
                </Link>

                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full" leftIcon={<ShieldAlert className="w-4 h-4 text-amber-400" />}>
                      Admin Panel
                    </Button>
                  </Link>
                )}

                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full" leftIcon={<User className="w-4 h-4" />}>
                    Profile Settings
                  </Button>
                </Link>

                <Button variant="ghost" className="w-full text-rose-600 justify-start" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => { demoLogin('student'); setMobileMenuOpen(false); }}>
                    Demo Student
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs text-amber-700" onClick={() => { demoLogin('admin'); setMobileMenuOpen(false); }}>
                    Demo Admin
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
