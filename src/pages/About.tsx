import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Compass, 
  Map, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  Trophy, 
  Briefcase, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Target, 
  Lightbulb, 
  Users, 
  Layers, 
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { BrandLogo } from '@/components/common/BrandLogo';
import { SpecularButton } from '@/components/reactbits/SpecularButton';
import { GlareHover } from '@/components/reactbits/GlareHover';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION WITH VIBRANT LOGO GRADIENTS */}
      <section className="relative pt-12 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Colorful ambient glow spheres matching the logo: Royal Blue, Cyan, Teal, Golden Amber */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-brand-navy">Learn. Build. Grow.</span>
            <span className="text-slate-300">•</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-teal to-amber-500 font-extrabold">
              Our Mission & Story
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-[1.12]">
            Empowering Engineering Students with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-amber-500">
              Verified Clarity
            </span>{' '}
            & Career Paths.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Road 2 Brain was created to eliminate the chaos of tech placements. We replace spam chat groups, broken links, and misleading bootcamps with a 100% verified student career platform.
          </p>

          {/* Quick Stats Pill Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold text-slate-700">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-brand-blue flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 100% Manually Verified
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Direct Official Portals
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> ₹0 Free Student Access
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 4-Year Engineering Tracks
            </span>
          </div>
        </div>
      </section>

      {/* 2. THE BRAND ANATOMY & THE STORY (USING LOGO PALETTE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue">
              <Target className="w-4 h-4 text-brand-blue" />
              <span>Why Road 2 Brain Exists</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy leading-tight">
              A single reliable compass for India's 1.5M+ technical students.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              <p>
                Every semester, engineering undergraduates in B.Tech Computer Science, Information Technology, AI/Data Science, and Electronics spend hundreds of wasted hours hunting through unverified Telegram channels, bloated WhatsApp forwards, and dubious LinkedIn hiring posts.
              </p>
              <p>
                Most of those listings lead to dead 404 links, paid training traps disguised as internships, or stale dates. Meanwhile, students rarely receive clear, sequential guidance on <em>what projects to build, what algorithms to master, and when to apply</em>.
              </p>
              <p className="font-semibold text-slate-900 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-teal-50/50 to-amber-50/80 border border-slate-200/80">
                Road 2 Brain bridges this gap: We manually audit corporate careers, national hackathons, and world-class free coursework, pairing them with step-by-step 4-year engineering roadmaps.
              </p>
            </div>
          </div>

          {/* Logo Symbolism Card with GlareHover */}
          <div className="lg:col-span-5">
            <GlareHover
              borderRadius="24px"
              variant="streak"
              glareOpacity={0.4}
              glareSize={30}
              glareAngle={-45}
              rimGlint
              className="w-full"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-elevated space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-slate-700 ml-1">Anatomy of the Brand Mark</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-brand-blue">
                    Official Identity
                  </span>
                </div>

                {/* Emblem Display */}
                <div className="flex justify-center py-2">
                  <img
                    src="/logo-emblem-clean.png"
                    alt="Road 2 Brain Official Emblem"
                    className="w-36 h-36 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Symbolic Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                    <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-950">The Curving Highway (Electric Blue)</h4>
                      <p className="text-slate-600 mt-0.5">The structured 4-year journey through engineering college towards industry readiness.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                    <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-950">The Rising Sun & Starburst (Golden Amber)</h4>
                      <p className="text-slate-600 mt-0.5">Clarity, discovery, and the breakthrough spark of learning practical computer science.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900 text-white p-2.5 rounded-xl">
                    <div className="w-5 h-5 rounded-md bg-white text-slate-900 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-white">The Mortarboard Cap & Tassel (Deep Navy)</h4>
                      <p className="text-slate-300 mt-0.5">Academic rigor, high-tier placements, and degree completion with career confidence.</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlareHover>
          </div>
        </div>
      </section>

      {/* 3. FOUR COLOR PILLARS OF ROAD 2 BRAIN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue">
            <Layers className="w-4 h-4 text-brand-blue" />
            <span>The Four Pillars of Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
            How We Protect & Accelerate Students
          </h2>
          <p className="text-sm text-slate-500">
            Every feature on Road 2 Brain is calibrated to respect students' time, ambition, and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Electric Blue */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-50/80 to-white border border-blue-200/90 shadow-card hover:shadow-card-hover hover:border-blue-400 transition-all space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 inline-block">
              100% Verified Sources
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Manual Verification Audit
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Every internship, campus drive, and scholarship is inspected directly on official company career servers. We record the verifier note, source timestamp, and direct URL.
            </p>
          </div>

          {/* Pillar 2: Turquoise Teal */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-teal-50/80 to-white border border-teal-200/90 shadow-card hover:shadow-card-hover hover:border-teal-400 transition-all space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 inline-block">
              Zero Intellectual Theft
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Curated Free Coursework
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              We never re-host or pirate copyrighted lectures. We curate direct, authenticated links to world-class free coursework from Harvard CS50, MIT, and freeCodeCamp.
            </p>
          </div>

          {/* Pillar 3: Golden Amber */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-50/80 to-white border border-amber-200/90 shadow-card hover:shadow-card-hover hover:border-amber-400 transition-all space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 inline-block">
              Hackathons & Grants
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Competitions with Real PPIs
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Flagship hackathons like Smart India Hackathon and Flipkart GRiD that grant actual pre-placement interviews and cash awards, filtered by eligible college years.
            </p>
          </div>

          {/* Pillar 4: Deep Navy */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-brand-navy text-white border border-slate-700 shadow-card hover:shadow-card-hover transition-all space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Map className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 inline-block">
              Year 1 to Year 4
            </span>
            <h3 className="text-lg font-bold text-white">
              Engineering Roadmaps
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Sequential career progression blueprints for Software Engineering (SDE), Artificial Intelligence (AI/ML), and Data Science, with milestone progress tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE DIFFERENCE: BEFORE VS WITH ROAD 2 BRAIN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-brand-navy to-slate-950 text-white border border-slate-800 shadow-elevated">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              The Reality Check
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              The Road 2 Brain Standard vs. Traditional Search
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                The Broken College Experience
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-normal">
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✕</span>
                  <span>Endless scrolling through noise-filled WhatsApp & Telegram spam groups.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✕</span>
                  <span>Expired links, 404 job requisitions, and hidden referral affiliate traps.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✕</span>
                  <span>Predatory ed-tech companies charging ₹50,000+ for basic YouTube concepts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">✕</span>
                  <span>Confusion about which academic semester to prepare for DSA, capstones, and gate drives.</span>
                </li>
              </ul>
            </div>

            {/* The Road 2 Brain Way */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/60 via-teal-950/40 to-slate-900 border border-teal-500/30 space-y-4">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                The Road 2 Brain Standard
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 font-normal">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>One clean, high-speed dashboard showing all active drives and deadlines.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct official company portals verified with date stamps and admin audit notes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>100% free high-quality coursework from Harvard, MIT, and freeCodeCamp.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>4-Year structured roadmaps with milestone tracking from 1st year to placement day.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STUDENT SUPPORT DESK & ISSUE RESOLUTION PROMISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-50 via-white to-amber-50 border border-slate-200/90 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-brand-blue text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Two-Way Community Accountability</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
              Have a Query or Found a Broken Link?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Students can raise issues, report expired portals, or ask career eligibility questions anytime. Our verification team responds directly with audit updates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link to="/raise-issue">
              <Button variant="primary" size="lg" className="rounded-xl shadow-elevated" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Raise a Query / Issue
              </Button>
            </Link>
            <Link to="/opportunities">
              <Button variant="outline" size="lg" className="rounded-xl">
                Explore Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. ETHICAL CODE & NON-AFFILIATION NOTICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Ethical Commitment & Notice of Non-Affiliation</span>
          </div>
          <p>
            Road 2 Brain is an independent career discovery and guidance platform. All corporate brand names, logos, and trademarks referenced (including Google, Apple, Microsoft, Amazon, NVIDIA, Meta, Cisco, Uber, Smart India Hackathon, and Harvard University) belong strictly to their respective owners. Their inclusion is purely for student directory, navigational, and educational purposes.
          </p>
          <p>
            We do not sell employment guarantees or solicit fees from students for job access. Every opportunity listed links directly to the authorized corporate career page or organizing body portal.
          </p>
        </div>
      </section>
    </div>
  );
};
