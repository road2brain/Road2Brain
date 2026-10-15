import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Compass, 
  Map, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Sparkles,
  Search,
  Star,
  Users,
  CheckCircle2
} from 'lucide-react';
import { FaGoogle, FaApple, FaMicrosoft, FaAmazon, FaUber } from 'react-icons/fa6';
import { SiNvidia, SiMeta, SiCisco } from 'react-icons/si';

import { Button } from '@/components/common/Button';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { CourseCard } from '@/components/courses/CourseCard';
import { RoadmapCard } from '@/components/roadmaps/RoadmapCard';

// React Bits Components
import { SpecularButton } from '@/components/reactbits/SpecularButton';
import { LogoLoop, LogoItem } from '@/components/reactbits/LogoLoop';
import { PixelSwap } from '@/components/reactbits/PixelSwap';
import { GlareHover } from '@/components/reactbits/GlareHover';
import { PeekRating } from '@/components/reactbits/PeekRating';

import { fetchOpportunities } from '@/services/opportunities.service';
import { fetchCourses } from '@/services/courses.service';
import { fetchRoadmaps } from '@/services/roadmaps.service';
import { Opportunity, Course, Roadmap } from '@/types';

export const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [internships, setInternships] = useState<Opportunity[]>([]);
  const [hackathons, setHackathons] = useState<Opportunity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroSearch, setHeroSearch] = useState('');
  const [userRating, setUserRating] = useState(5);

  useEffect(() => {
    fetchOpportunities({ type: 'internship' }).then(list => setInternships(list.slice(0, 3)));
    fetchOpportunities({ type: 'hackathon' }).then(list => setHackathons(list.slice(0, 3)));
    fetchCourses().then(list => setCourses(list.slice(0, 3)));
    fetchRoadmaps().then(list => setRoadmaps(list.slice(0, 3)));

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
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

  // Top MNCs Logo List for React Bits LogoLoop
  const topCompanyLogos: LogoItem[] = [
    { node: <FaGoogle className="text-slate-700 hover:text-blue-600 transition-colors" />, title: "Google", href: "https://careers.google.com" },
    { node: <FaApple className="text-slate-700 hover:text-black transition-colors" />, title: "Apple", href: "https://www.apple.com/careers" },
    { node: <FaMicrosoft className="text-slate-700 hover:text-sky-600 transition-colors" />, title: "Microsoft", href: "https://careers.microsoft.com" },
    { node: <FaAmazon className="text-slate-700 hover:text-amber-600 transition-colors" />, title: "Amazon", href: "https://www.amazon.jobs" },
    { node: <SiNvidia className="text-slate-700 hover:text-emerald-600 transition-colors" />, title: "NVIDIA", href: "https://www.nvidia.com" },
    { node: <SiMeta className="text-slate-700 hover:text-blue-500 transition-colors" />, title: "Meta", href: "https://www.metacareers.com" },
    { node: <SiCisco className="text-slate-700 hover:text-teal-600 transition-colors" />, title: "Cisco", href: "https://jobs.cisco.com" },
    { node: <FaUber className="text-slate-700 hover:text-black transition-colors" />, title: "Uber", href: "https://www.uber.com/careers" },
  ];

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
    <div ref={heroRef} className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)] -z-10 pointer-events-none opacity-60" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-brand-blue/15 via-brand-teal/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto">
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
                Search
              </Button>
            </div>
          </form>

          {/* React Bits SpecularButton Hero CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SpecularButton
              size="lg"
              radius={18}
              tint="#ffffff"
              tintOpacity={0.06}
              textColor="#ffffff"
              lineColor="#ffffff"
              baseColor="#2563EB"
              intensity={1}
              idleIntensity={0.35}
              shineSize={120}
              thickness={1.2}
              glow={1}
              followMouse
              proximity={250}
              onClick={() => navigate('/opportunities')}
              className="w-full sm:w-auto shadow-elevated"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </SpecularButton>

            <Link to="/roadmaps" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full font-bold px-7 py-3.5 rounded-[18px] text-base" leftIcon={<Map className="w-4 h-4 text-brand-violet" />}>
                Explore 4-Year Roadmaps
              </Button>
            </Link>
          </div>
        </div>

        {/* Interactive Showcase Mockup with GlareHover */}
        <div className="gsap-hero-preview mt-14 max-w-5xl mx-auto">
          <GlareHover
            borderRadius="24px"
            variant="streak"
            glareOpacity={0.35}
            glareSize={25}
            glareAngle={-45}
            rimGlint
            className="w-full"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xl shadow-brand-navy/10 relative">
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
                {/* Mini Card 1 */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-brand-blue border border-blue-200">
                      INTERNSHIP
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    Google Software Engineering Intern 2027
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5 mb-2.5">Google India • Bengaluru / Hyderabad</p>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 bg-slate-100/70 p-2 rounded-lg">
                    <span>₹1,10,000/mo</span>
                    <span className="text-amber-600 font-bold">14 days left</span>
                  </div>
                </div>

                {/* Mini Card 2 */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-50 text-brand-violet border border-violet-200">
                      ENGINEERING ROADMAP
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

                {/* Mini Card 3 */}
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
          </GlareHover>
        </div>

        {/* Proof Bar */}
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

      {/* 2. TOP MNC LOGO MARQUEE (REACT BITS LOGOLOOP) */}
      <section className="py-7 border-y border-slate-200/70 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Opportunities From Top Global MNCs & Leading Tech Employers
          </p>
          <LogoLoop
            logos={topCompanyLogos}
            speed={35}
            direction="left"
            logoHeight={36}
            gap={64}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#F8FAFC"
            ariaLabel="Top MNC companies posting tech opportunities"
          />
        </div>
      </section>

      {/* 3. TECH INTERNSHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Animated Feature Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-blue-900/30 shadow-elevated bg-slate-950 text-white min-h-[280px] sm:min-h-[320px] flex items-center">
          {/* Animated Background Image: Student working on laptop */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src="/images/internship-student.jpg"
              alt="Tech student coding on laptop"
              className="w-full h-full object-cover object-center sm:object-right animate-ken-burns opacity-75 sm:opacity-85 filter brightness-95"
            />
            {/* Multi-stage directional gradient overlay for flawless readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent sm:w-3/4" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-blue-950/20 mix-blend-overlay" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Work at Global Tech MNCs & High-Growth Startups
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              100% manually verified summer internships and campus hiring drives with transparent stipends up to ₹1,20,000/month. No third-party spam or paid forms.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Direct Official Portals
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Disclosed Stipends
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> 2026-2028 Batches
              </span>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link to="/opportunities?type=internship">
                <Button variant="primary" size="md" className="rounded-xl shadow-lg shadow-blue-500/25" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore All Internships
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Real Internship Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {internships.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* 4. NATIONAL HACKATHONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Animated Feature Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-elevated bg-slate-950 text-white min-h-[280px] sm:min-h-[320px] flex items-center">
          {/* Animated Background Image: Student celebrating with trophy */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src="/images/hackathon-student.jpg"
              alt="Student celebrating hackathon victory with trophy"
              className="w-full h-full object-cover object-center sm:object-right animate-ken-burns opacity-75 sm:opacity-85 filter brightness-95"
            />
            {/* Multi-stage directional gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent sm:w-3/4" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Build Real Software, Win Cash Grants & Secure PPIs
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Compete in flagship challenges like Smart India Hackathon, Flipkart GRiD, and Microsoft Imagine Cup. Showcase prototypes, solve industry challenges, and earn direct interview fast-tracks.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> ₹1 Crore+ Total Prize Pools
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pre-Placement Interviews (PPI)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> 100% Free Team Entries
              </span>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link to="/opportunities?type=hackathon">
                <Button variant="primary" size="md" className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore All Hackathons
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Real Hackathon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {hackathons.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE PIXEL SWAP REVEAL CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PixelSwap
          firstContent={
            <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700 shadow-elevated">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Looking for off-campus referral openings & hackathons?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                  Click here to shuffle pixels and reveal upcoming high-stipend summer drives and student hackathon grants.
                </p>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-brand-blue hover:bg-blue-600 font-extrabold text-sm text-white shrink-0 shadow-lg shadow-blue-500/30 transition-transform active:scale-95 flex items-center gap-1.5">
                <span>Click to Reveal Perk</span>
                <Sparkles className="w-4 h-4 ml-0.5" />
              </div>
            </div>
          }
          secondContent={
            <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-500 shadow-elevated">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Google Summer of Code, Amazon WOW & Smart India Hackathon
                </h3>
                <p className="text-blue-200 text-xs sm:text-sm max-w-xl">
                  Fully verified official application deadlines, stipend bands, and direct submission portals ready for you.
                </p>
              </div>
              <Link
                to="/opportunities"
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-extrabold text-sm text-white shrink-0 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <span>Explore Listings Now</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
          }
          pixelSize={48}
          duration={850}
          trigger="click"
        />
      </section>

      {/* 6. 4-YEAR CAREER ROADMAPS */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
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

      {/* 7. CURATED TECHNICAL COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Animated Feature Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-teal-500/30 shadow-elevated bg-slate-950 text-white min-h-[280px] sm:min-h-[320px] flex items-center">
          {/* Animated Background Image: Student listening to teacher at digital board */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src="/images/course-student.jpg"
              alt="Student listening to teacher explaining computer science"
              className="w-full h-full object-cover object-center sm:object-right animate-ken-burns opacity-75 sm:opacity-85 filter brightness-95"
            />
            {/* Multi-stage directional gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent sm:w-3/4" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-teal-950/20 mix-blend-overlay" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Master Computer Science from World-Class Faculty
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              High-impact, verified courses from Harvard, MIT, Stanford, and freeCodeCamp. Learn Data Structures, Algorithms, System Design, and Modern AI without paying for overpriced bootcamps.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> 100% Free Access
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Certificate Paths
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Complete Video Lectures & Labs
              </span>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link to="/courses">
                <Button variant="primary" size="md" className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-600/25" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Full Course Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Real Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 7. STUDENT COMMUNITY RATING & TRUST (REACT BITS PEEKRATING) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>Student Community Evaluation</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mb-2">
            How do you rate Road 2 Brain?
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Hover over the stars to peek at the grade scale and tap to rate your platform experience.
          </p>

          <div className="flex justify-center mb-4">
            <PeekRating
              defaultValue={userRating}
              count={5}
              shape="star"
              labels={['Poor', 'Fair', 'Good', 'Great', 'Superb']}
              activeColor="#f5b400"
              idleColor="#cbd5e1"
              tipColor="#14213D"
              tipTextColor="#ffffff"
              size={36}
              lift={8}
              magnify={1.2}
              showTip
              allowClear
              onChange={val => setUserRating(val)}
            />
          </div>

          <p className="text-xs text-slate-400 font-medium">
            Over 2,400+ engineering students preparing for technical interviews and internships.
          </p>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
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

      {/* 9. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-elevated border border-slate-800">
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
