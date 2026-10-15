import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Stepper, Step } from '@/components/reactbits/Stepper';
import { 
  Compass, 
  Map, 
  LayoutDashboard, 
  Sparkles, 
  CheckCircle2, 
  Rocket, 
  Lightbulb, 
  GraduationCap 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SiteTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SiteTourModal: React.FC<SiteTourModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleFinish = () => {
    localStorage.setItem('road2brain_tour_completed', 'true');
    onClose();
    navigate('/opportunities');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Platform Tour — Road 2 Brain" maxWidth="xl">
      <div className="py-2">
        <Stepper
          initialStep={1}
          onFinalStepCompleted={handleFinish}
          backButtonText="Back"
          nextButtonText="Next Feature"
          finishButtonText="Explore Platform"
          className="border-0 shadow-none p-0 sm:p-2"
        >
          {/* Step 1: Welcome */}
          <Step title="Welcome">
            <div className="space-y-4 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Engineering Career Ecosystem</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 justify-center sm:justify-start">
                <span>Welcome to Road 2 Brain</span>
                <Rocket className="w-5 h-5 text-brand-blue shrink-0" />
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Road 2 Brain solves the chaos of WhatsApp groups and unverified job boards. We provide B.Tech CSE, IT, and tech students with directly verified internships, structured 4-year career milestones, and curated coursework.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-brand-navy block mb-1">100% Verified</span>
                  <span className="text-slate-500">Every listing checked against official portals.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-brand-navy block mb-1">Zero Cost</span>
                  <span className="text-slate-500">Completely free for engineering students.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-bold text-brand-navy block mb-1">Structured Paths</span>
                  <span className="text-slate-500">Year 1 to Year 4 engineering roadmap tracks.</span>
                </div>
              </div>
            </div>
          </Step>

          {/* Step 2: Opportunities */}
          <Step title="Opportunities">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Verified Opportunity Directory
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Internships, Fresher Drives, Hackathons & Scholarships</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Filter by academic year (1st to 4th Year), location mode (Remote, Hybrid, On-site), and track application deadlines in real-time. Each listing records the verified source URL and auditor review notes.
              </p>
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-brand-blue font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Direct official links only — No affiliate redirects or expired spam.
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Live countdown indicators for deadlines within 7 and 14 days.
                </div>
              </div>
            </div>
          </Step>

          {/* Step 3: Roadmaps */}
          <Step title="Roadmaps">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-brand-teal flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Structured 4-Year Engineering Tracks
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">SDE, Machine Learning/AI, and Data Analytics</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Clear milestones mapping your college years: 1st Year (Foundations & DSA), 2nd Year (Core Dev & Systems), 3rd Year (Advanced Specialization & Internships), and 4th Year (Campus Placements & Portfolio).
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Persistent Progress:</strong> Check off completed milestones as you learn, and your progress automatically syncs to your personal dashboard.
                </div>
              </div>
            </div>
          </Step>

          {/* Step 4: Dashboard */}
          <Step title="Dashboard">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Student Career Control Center
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Your personalized hub</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Access your bookmarked opportunities, monitor upcoming deadlines closing soon, and get deterministic matches tailored to your branch (CSE, IT, AI/DS, ECE) and skills.
              </p>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>You are ready to launch your career preparation!</span>
              </div>
            </div>
          </Step>
        </Stepper>
      </div>
    </Modal>
  );
};
