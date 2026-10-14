import React from 'react';
import { Card } from '@/components/common/Card';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-navy">Terms of Service</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 (Pre-launch Template)</p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Road 2 Brain platform, you agree to be bound by these Terms of Service. If you do not agree, please discontinue using the service.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Educational & Directory Purpose</h2>
          <p>
            Road 2 Brain provides informational directories of internships, jobs, scholarships, hackathons, and learning roadmaps. We do not act as an employer or recruitment agency. Following learning roadmaps does not guarantee employment or academic admission.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. Integrity of Listings</h2>
          <p>
            While our team manually checks official source announcements before verifying opportunities, hiring terms, deadlines, and requirements are determined exclusively by the respective organizing companies and are subject to change without notice.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. User Conduct</h2>
          <p>
            Users agree not to attempt unauthorized access to administrative functions, reverse engineer or interfere with platform security, scrape listings without permission, or submit fraudulent or malicious content.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          This document is a pre-launch legal template for review before launch.
        </div>
      </Card>
    </div>
  );
};
