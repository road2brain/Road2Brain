import React from 'react';
import { ShieldCheck, Compass, Map, BookOpen, GraduationCap, Heart, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { BrandLogo } from '@/components/common/BrandLogo';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <BrandLogo className="justify-center mb-2" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
          About Road 2 Brain
        </h1>
        <p className="text-base text-brand-blue font-semibold">
          Learn. Build. Grow.
        </p>
      </div>

      {/* Startup Vision */}
      <Card className="p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Our Startup Vision</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Every year in India, millions of engineering students across B.Tech CSE, IT, and related technical disciplines struggle with information overload. Opportunities are scattered across hundreds of corporate career boards, Telegram channels, LinkedIn posts, and WhatsApp groups—many of which post expired listings, spam links, or dubious third-party forms.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed font-semibold text-brand-navy">
          The core principle of Road 2 Brain is simple: Students should not have to search dozens of websites to discover opportunities or figure out what to learn next.
        </p>
      </Card>

      {/* Core Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Manual Source Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every internship, hackathon, and scholarship listing on Road 2 Brain is checked directly against official company portals and university circulars. We link directly to official applications.
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-brand-violet flex items-center justify-center mb-3">
            <Map className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Year-Wise Engineering Roadmaps</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We provide structured 4-year timelines for Software Engineering (SDE), Machine Learning (AI/ML), and Data Analytics with milestone tracking and project ideas.
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Curated Free Coursework</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We respect creators' intellectual property. We curate links to free and affordable courses from Harvard, MIT, DeepLearning.AI, and freeCodeCamp, with verified price tags.
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero Fabricated Claims</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We do not manufacture fake placement guarantees, fake company endorsements, or inflated statistics. We focus purely on engineering excellence and verified data.
          </p>
        </Card>
      </div>

      {/* Non-Affiliation Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong>Notice of Non-Affiliation:</strong> Road 2 Brain is an independent career platform. Company names, trademarks, and logos mentioned (such as Google, Microsoft, Amazon, Flipkart, ISRO, Harvard, etc.) are the property of their respective owners and are used purely for identification and directory purposes.
      </div>
    </div>
  );
};
