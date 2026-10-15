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
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Button } from '@/components/common/Button';
import { SiteTourModal } from '@/components/common/SiteTourModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const { currentUser, profile, isAdmin, logout } = useAuth();
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
    { 
      to: '/opportunities', 
      label: 'Opportunities', 
      icon: <Compass className="w-4 h-4" />,
      badge: 'Live'
    },
    { 
      to: '/courses', 
      label: 'Courses', 
      icon: <BookOpen className="w-4 h-4" /> 
    },
    { 
      to: '/roadmaps', 
      label: 'Career Roadmaps', 
      icon: <Map className="w-4 h-4" /> 
    },
    { 
      to: '/about', 
      label: 'About', 
      icon: null 
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-7">
              <BrandLogo />
              
              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1.5">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'text-brand-blue bg-blue-50/90 shadow-xs shadow-blue-500/10'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`
                    }
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 tracking-wider">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right Action Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Interactive Site Tour Trigger */}
              <button
                type="button"
                onClick={() => setTourModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 hover:border-brand-blue/40 bg-white hover:bg-blue-50/50 text-xs font-bold text-slate-700 hover:text-brand-blue transition-all duration-200 shadow-xs"
                title="Take an interactive platform tour"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-blue animate-pulse" />
                <span>Site Tour</span>
              </button>

              {/* Raise Issue / Support Button */}
              <Link
                to="/raise-issue"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 hover:border-brand-blue/40 bg-white hover:bg-blue-50/50 text-xs font-bold text-slate-700 hover:text-brand-blue transition-all duration-200 shadow-xs"
                title="Raise an issue or ask a query"
              >
                <HelpCircle className="w-3.5 h-3.5 text-brand-blue" />
                <span>Raise Issue</span>
              </Link>

              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" leftIcon={<LayoutDashboard className="w-4 h-4 text-brand-blue" />}>
                      Dashboard
                    </Button>
                  </Link>

                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="secondary" size="sm" leftIcon={<ShieldAlert className="w-4 h-4 text-amber-500" />}>
                        Admin
                      </Button>
                    </Link>
                  )}

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2.5 p-1.5 px-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 transition-colors shadow-xs"
                      aria-label="User menu"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-teal text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {profile?.displayName?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                        {profile?.displayName || 'Student'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-elevated py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{profile?.displayName}</p>
                          <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-brand-blue">
                            {profile?.role || 'student'}
                          </span>
                        </div>

                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Profile Settings
                        </Link>

                        <Link
                          to="/raise-issue"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <HelpCircle className="w-4 h-4 text-slate-400" />
                          Raise Query / Help Desk
                        </Link>

                        <div className="border-t border-slate-100 my-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-bold text-xs text-slate-700 hover:text-brand-blue">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm" className="font-bold text-xs shadow-sm shadow-blue-500/20">
                      Join Free
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setTourModalOpen(true)}
                className="p-1.5 rounded-lg border border-slate-200 text-brand-blue text-xs font-bold"
                title="Tour"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? 'text-brand-blue bg-blue-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <span className="flex items-center gap-2.5">
                    {link.icon}
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}

              <Link
                to="/raise-issue"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <HelpCircle className="w-4 h-4 text-brand-blue" />
                <span>Raise Issue / Query Desk</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Open Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full font-bold">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full font-bold">
                      Join Free
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Interactive Site Tour Modal */}
      <SiteTourModal isOpen={tourModalOpen} onClose={() => setTourModalOpen(false)} />
    </>
  );
};
