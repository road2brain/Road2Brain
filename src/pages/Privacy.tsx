import React from 'react';
import { Card } from '@/components/common/Card';
import { ShieldCheck } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-navy">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 (Pre-launch Template)</p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Overview</h2>
          <p>
            Road 2 Brain ("we", "our", or "platform") respects the privacy of students and users who access our services. This Privacy Policy outlines what information we collect, how it is used, and how your data is protected.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Information We Collect</h2>
          <p className="mb-2">We collect only information necessary to provide our core product experience:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
            <li><strong>Account Information:</strong> Name, college email address, and authentication credentials.</li>
            <li><strong>Student Academic Profile:</strong> College name (optional), engineering branch, graduation year, current academic year, skills, and target career track.</li>
            <li><strong>User Activity:</strong> Saved opportunity bookmarks and roadmap milestone progress records.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. How Information is Used</h2>
          <p>
            Your academic profile is used solely to provide deterministic opportunity recommendations, keep your bookmarks accessible across devices, and accurately calculate your career milestone progress. We do not sell student personal data to third parties.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Third-Party Links & External Portals</h2>
          <p>
            Road 2 Brain contains links to external corporate career boards, hackathon platforms, and course providers. When clicking external application links, you are directed to third-party domains governed by their own independent privacy practices.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">5. Data Retention & Deletion</h2>
          <p>
            Students may update their academic details at any time in their profile settings or request account deletion by contacting our support team.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          This document is a pre-launch policy for review prior to formal platform incorporation.
        </div>
      </Card>
    </div>
  );
};
