import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Compass, 
  Map, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Target, 
  Zap, 
  GraduationCap,
  Building2,
  Clock,
  Search,
  Check,
  FolderGit2
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { CourseCard } from '@/components/courses/CourseCard';
import { RoadmapCard } from '@/components/roadmaps/RoadmapCard';
import { fetchOpportunities } from '@/services/opportunities.service';
import { fetchCourses } from '@/services/courses.service';
import { fetchRoadmaps } from '@/services/roadmaps.service';
import { Opportunity, Course, Roadmap } from '@/types';

export const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeRoadmapTab, setActiveRoadmapTab] = useState<'sde' | 'aiml' | 'data'>('sde');

  useEffect(() => {
    fetchOpportunities().then(list => setOpportunities(list.slice(0, 3)));
    fetchCourses().then(list => setCourses(list.slice(0, 3)));
    fetchRoadmaps().then(list => setRoadmaps(list.slice(0, 3)));

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        gsap.from('.gsap-hero-badge', { opacity: 0, y: -15, duration: 0.6, ease: 'power2.out' });
        gsap.from('.gsap-hero-title', { opacity: 0, y: 25, duration: 0.8, delay: 0.1, ease: 'power3.out' });
        gsap.from('.gsap-hero-subtitle', { opacity: 0, y: 20, duration: 0.7, delay: 0.25, ease: 'power2.out' });
        gsap.from('.gsap-hero-search', { opacity: 0, y: 20, duration: 0.7, delay: 0.35, ease: 'power2.out' });
        gsap.from('.gsap-hero-preview', { opacity: 0, scale: 0.96, duration: 0.8, delay: 0.45, ease: 'power2.out' });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/opportunities');
    }
  };

  const faqs = [
    {
      q: 'How are opportunities on Road 2 Brain verified?',
      a: 'Every listing on Road 2 Brain is checked manually by our team against official company career portals, government tender notifications, or authorized program websites. We explicitly record the source URL, verification timestamp, and verifying admin note.',
    },
    {
      q: 'Is Road 2 Brain free for engineering students?',
      a: 'Yes. Road 2 Brain is 100% free for students to browse verified internships, explore roadmaps, track learning milestones, and bookmark opportunities to their personal dashboard.',
    },
    {
      q: 'Do you guarantee an internship or placement after completing a roadmap?',
      a: 'No. We are transparent and honest: no platform can guarantee employment. What our roadmaps do provide is a structured, engineering-first sequence of skills, project ideas, and interview preparation that substantially maximizes your competence and placement readiness.',
    },
    {
      q: 'Are the curated courses hosted directly on Road 2 Brain?',
      a: 'No. We never redistribute or re-host copyrighted third-party course materials. Instead, we link directly to official providers such as Harvard CS50, DeepLearning.AI, freeCodeCamp, MIT, and AWS Skill Builder, verifying current pricing and certificate eligibility.',
    },
    {
      q: 'Which branch and academic years are supported?',
      a: 'While our core roadmaps are tailored for B.Tech CSE, IT, AI/DS, and ECE students, all technical opportunities (including open hackathons, scholarships, and beginner courses) are tagged by academic year (1st to 4th year) and discipline.',
    },
  ];

  return (
    <div ref={heroRef} className="space-y-20 sm:space-y-28 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION WITH BACKGROUND GRID */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)] -z-10 pointer-events-none opacity-60" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-brand-blue/15 via-brand-teal/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="gsap-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 text-brand-blue text-xs font-bold mb-6 shadow-sm shadow-blue-500/5 hover:border-brand-blue/40 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-800">Learn. Build. Grow.</span>
            <span className="text-slate-300">•</span>
            <span className="text-brand-blue">Student Career Startup</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Headline */}
          <h1 className="gsap-hero-title text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-[1.12] mb-6">
            Stop searching dozens of websites for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-blue-600 to-brand-teal">
              tech opportunities
            </span>{' '}
            and career clarity.
          </h1>

          {/* Subheading */}
          <p className="gsap-hero-subtitle text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
            Discover verified internships, fresher hiring drives, and national hackathons. Follow year-wise engineering roadmaps and track your progress in a clean personal workspace.
          </p>

          {/* Hero Quick Search Input */}
          <form onSubmit={handleHeroSearchSubmit} className="gsap-hero-search max-w-xl mx-auto mb-8">
            <div className="relative flex items-center bg-white rounded-2xl shadow-elevated border border-slate-200/90 p-1.5 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/15 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search Google SDE, Amazon WOW, Hackathons, DSA..."
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <Button type="submit" variant="primary" size="md" className="shrink-0 rounded-xl px-5">
                Explore
              </Button>
            </div>
          </form>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/opportunities" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full shadow-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse All 30+ Verified Drives
              </Button>
            </Link>
            <Link to="/roadmaps" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full font-bold" leftIcon={<Map className="w-4 h-4 text-brand-violet" />}>
                Explore 4-Year Roadmaps
              </Button>
            </Link>
          </div>
        </div>

        {/* Interactive Floating Product Showcase Mockup */}
        <div className="gsap-hero-preview mt-16 max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-2xl shadow-brand-navy/10 relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-slate-400 font-semibold ml-2 text-[11px]">road2brain.web.app/student-dashboard</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-teal font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Student Network
              </div>
            </div>

            {/* Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {/* Mini Card 1: Verified Opportunity */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-brand-blue border border-blue-200">
                    INTERNSHIP
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  Software Engineering Intern
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5 mb-2.5">Google • Bengaluru / Hyd</p>
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 bg-emerald-50/60 p-2 rounded-lg">
                  <span>₹1,10,000 - ₹1,30,000/mo</span>
                  <span className="text-slate-400">Dec 15</span>
                </div>
              </div>

              {/* Mini Card 2: Roadmap Progress */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-50 text-brand-violet border border-violet-200">
                    ROADMAP PROGRESS
                  </span>
                  <span className="text-xs font-black text-brand-violet">70% Done</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  Software Development (SDE)
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5 mb-2.5">Active Track • 2nd Year</p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-gradient-to-r from-brand-violet to-brand-blue h-full w-[70%]" />
                </div>
                <span className="text-[11px] text-slate-500 block truncate">Next: Trees & Graphs Algorithms</span>
              </div>

              {/* Mini Card 3: Free Curated Course */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-brand-teal border border-teal-200">
                    CURATED COURSE
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    100% Free
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  Harvard CS50x Computer Science
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5 mb-2.5">Harvard University / edX</p>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 bg-slate-100/70 p-2 rounded-lg">
                  <span>~120 Hours</span>
                  <span className="text-brand-teal">Verified Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transparent Proof Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto pt-8 border-t border-slate-200/70 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-brand-navy">30+</div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Manually Verified Drives</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-brand-blue">100%</div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Direct Official Links</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-brand-teal">3 Tracks</div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">4-Year Engineering Guides</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-brand-violet">₹0</div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Free For All Students</p>
          </div>
        </div>
      </section>

      {/* 2. FEATURED OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" /> Latest Active Drives
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              Featured Verified Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              High-value engineering internships, student programs, and tech competitions closing soon.
            </p>
          </div>

          <Link to="/opportunities">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All 30+ Opportunities
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE ROADMAP EXPLORER ON HOMEPAGE */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-violet uppercase tracking-wider mb-1">
                <Map className="w-4 h-4" /> Structured Curriculum
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                4-Year Career Roadmaps
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Step-by-step guidance designed specifically for B.Tech CSE/IT students.
              </p>
            </div>

            <Link to="/roadmaps">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse All Roadmaps
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmaps.map((rm) => (
              <RoadmapCard key={rm.id} roadmap={rm} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. CURATED COURSES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" /> Essential Technical Skills
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              Curated Free & Affordable Courses
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              World-class coursework from Harvard, DeepLearning.AI, MIT, and freeCodeCamp with verified certificates.
            </p>
          </div>

          <Link to="/courses">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Course Directory
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 5. HOW ROAD 2 BRAIN WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Simple 3-Step Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
            How Road 2 Brain Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Built to eliminate the chaotic noise of WhatsApp groups, unverified Telegram channels, and scattered job portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover text-center relative transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy text-white text-base font-extrabold flex items-center justify-center mx-auto mb-4 shadow-md shadow-brand-navy/15">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Discover Verified Roles</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Filter opportunities by your current academic year, eligible engineering branch, and verified stipends.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover text-center relative transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white text-base font-extrabold flex items-center justify-center mx-auto mb-4 shadow-md shadow-brand-blue/20">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Follow Career Roadmaps</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Adopt a structured engineering path (SDE, AI/ML, Data Analyst). Never wonder what to learn next.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover text-center relative transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal text-white text-base font-extrabold flex items-center justify-center mx-auto mb-4 shadow-md shadow-brand-teal/20">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Track & Save in Dashboard</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Save key deadlines, monitor milestone completions, and receive alerts before applications close.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Clear, truthful answers with zero hype or artificial statistics.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-800 hover:text-brand-blue"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-90 text-brand-blue' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-elevated border border-slate-800">
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take charge of your engineering career?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Join B.Tech students who use Road 2 Brain daily to discover verified hiring drives and follow structured roadmaps.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full bg-brand-blue hover:bg-blue-600 font-bold shadow-lg shadow-blue-500/25">
                  Create Free Student Account
                </Button>
              </Link>
              <Link to="/opportunities" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 font-bold">
                  Browse Opportunities First
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
