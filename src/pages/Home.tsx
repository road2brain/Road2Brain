import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Compass, 
  Map, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Layers, 
  Target, 
  Zap, 
  GraduationCap,
  Building,
  Clock
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
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    // Load initial featured items
    fetchOpportunities().then(list => setOpportunities(list.slice(0, 3)));
    fetchCourses().then(list => setCourses(list.slice(0, 3)));
    fetchRoadmaps().then(list => setRoadmaps(list.slice(0, 3)));

    // Restrained GSAP hero reveal with cleanup
    const ctx = gsap.context(() => {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        gsap.from('.gsap-hero-badge', { opacity: 0, y: -15, duration: 0.6, ease: 'power2.out' });
        gsap.from('.gsap-hero-title', { opacity: 0, y: 25, duration: 0.8, delay: 0.15, ease: 'power3.out' });
        gsap.from('.gsap-hero-subtitle', { opacity: 0, y: 20, duration: 0.7, delay: 0.3, ease: 'power2.out' });
        gsap.from('.gsap-hero-cta', { opacity: 0, y: 20, duration: 0.7, delay: 0.45, ease: 'power2.out' });
        gsap.from('.gsap-feature-card', { 
          opacity: 0, 
          y: 20, 
          duration: 0.6, 
          stagger: 0.1, 
          delay: 0.5, 
          ease: 'power2.out' 
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

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
    <div ref={heroRef} className="space-y-20 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-blue/10 via-brand-teal/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="gsap-hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-brand-blue text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
            <span>The Student Career Development Platform • Learn. Build. Grow.</span>
          </div>

          {/* Heading */}
          <h1 className="gsap-hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.15] mb-6">
            Stop searching dozens of websites for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-blue-600 to-brand-teal">
              tech opportunities
            </span>{' '}
            and career clarity.
          </h1>

          {/* Subheading */}
          <p className="gsap-hero-subtitle text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Discover verified internships, hackathons, and scholarships. Follow year-wise engineering roadmaps, and track your milestones—all in one student-first workspace.
          </p>

          {/* CTAs */}
          <div className="gsap-hero-cta flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/opportunities" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Verified Opportunities
              </Button>
            </Link>
            <Link to="/roadmaps" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full" leftIcon={<Map className="w-4 h-4 text-brand-violet" />}>
                Explore Career Roadmaps
              </Button>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Manually Verified Sources
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-blue" />
              Zero Invented Endorsements
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-brand-teal" />
              Tailored for Indian B.Tech Students
            </span>
          </div>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
          <div className="gsap-feature-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Verified Opportunities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curated internships (GSoC, Amazon WOW, Google, DRDO), fresher jobs, national hackathons (SIH, Flipkart GRiD), and merit scholarships with real source links.
            </p>
          </div>

          <div className="gsap-feature-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-brand-violet flex items-center justify-center mb-4">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Year-Wise Career Roadmaps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineering roadmaps for SDE, AI/ML, and Data Analytics. Structured 4-year timelines with milestone tracking, project ideas, and interview prep.
            </p>
          </div>

          <div className="gsap-feature-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Curated Course Directory</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Save time with handpicked high-quality free and low-cost courses from Harvard CS50, DeepLearning.AI, freeCodeCamp, and MIT.
            </p>
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
              Active engineering internships, student programs, and tech competitions closing soon.
            </p>
          </div>

          <Link to="/opportunities">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Opportunities
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* 3. FEATURED ROADMAPS */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-violet uppercase tracking-wider mb-1">
                <Map className="w-4 h-4" /> 4-Year Career Tracks
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                Structured Engineering Roadmaps
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
              High-value curriculum from world-class institutions with verified certificates.
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card text-center relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy text-white text-base font-extrabold flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Discover Verified Roles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Filter opportunities by your current academic year, eligible engineering branch, and verified stipends.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card text-center relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white text-base font-extrabold flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Follow Career Roadmaps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Adopt a structured engineering path (SDE, AI/ML, Data Analyst). Never wonder what to learn next.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card text-center relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal text-white text-base font-extrabold flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Track & Save in Dashboard</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Save key deadlines, monitor milestone completions, and receive deterministic alerts before applications close.
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
        <div className="rounded-3xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-elevated border border-slate-800">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to take charge of your engineering career?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join thousands of B.Tech students who use Road 2 Brain daily to discover verified hiring drives and follow structured roadmaps.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full bg-brand-blue hover:bg-blue-600">
                  Create Free Student Account
                </Button>
              </Link>
              <Link to="/opportunities" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
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
