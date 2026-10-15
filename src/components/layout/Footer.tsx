import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/common/BrandLogo';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-brand-navy text-slate-300 border-t border-slate-800 overflow-hidden">
      {/* Official Road 2 Brain Logo Background Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <img
          src="/logo.png"
          alt=""
          className="w-[480px] sm:w-[700px] lg:w-[850px] max-w-none object-contain opacity-[0.07] filter invert brightness-200 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-transparent to-brand-navy/80 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo theme="dark" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Road 2 Brain is a student career development platform for engineering students in India. We verify tech internships, curate high-impact courses, and provide structured 4-year roadmaps so students never have to search unverified chat groups.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-teal font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Manually Verified Opportunities & Direct Official Links</span>
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/opportunities?type=internship" className="hover:text-white transition-colors">
                  Tech Internships
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=fresher_job" className="hover:text-white transition-colors">
                  Fresher Campus Jobs
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=hackathon" className="hover:text-white transition-colors">
                  National Hackathons
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=scholarship" className="hover:text-white transition-colors">
                  Student Scholarships
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=student_program" className="hover:text-white transition-colors">
                  Ambassador Programs
                </Link>
              </li>
            </ul>
          </div>

          {/* Roadmaps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Career Roadmaps</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/roadmaps/software-development-engineer" className="hover:text-white transition-colors">
                  Software Development (SDE)
                </Link>
              </li>
              <li>
                <Link to="/roadmaps/ai-ml-engineer" className="hover:text-white transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/roadmaps/data-analyst-scientist" className="hover:text-white transition-colors">
                  Data Analyst / Scientist
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Curated Free Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Organization & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">About & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Road 2 Brain
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Road 2 Brain. All rights reserved. Built for engineering students in India.</p>
          <div className="flex items-center gap-1.5">
            <span>Learn. Build. Grow.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for tech students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
