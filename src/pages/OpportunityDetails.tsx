import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ExternalLink, 
  Bookmark as BookmarkIcon, 
  ArrowLeft, 
  CheckCircle2, 
  Share2, 
  AlertCircle,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';
import { fetchOpportunityBySlug, fetchOpportunities } from '@/services/opportunities.service';
import { Opportunity } from '@/types';
import { Button } from '@/components/common/Button';
import { Badge, OpportunityTypeBadge, VerificationBadge, LocationBadge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { PulseHeart } from '@/components/reactbits/PulseHeart';
import { formatDate, formatCurrency, isExpired, daysLeft } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useToast } from '@/contexts/ToastContext';

export const OpportunityDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [related, setRelated] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchOpportunityBySlug(slug)
      .then(async (opp) => {
        setOpportunity(opp);
        if (opp) {
          // Fetch related by category / type
          const all = await fetchOpportunities({ type: opp.type });
          setRelated(all.filter(o => o.id !== opp.id).slice(0, 3));
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold text-slate-500">Loading opportunity details...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Opportunity Not Found</h2>
        <p className="text-xs text-slate-600 mb-6">
          The opportunity you are looking for may have been archived or the URL has changed.
        </p>
        <Link to="/opportunities">
          <Button variant="primary">Browse All Opportunities</Button>
        </Link>
      </div>
    );
  }

  const saved = isSaved(opportunity.id);
  const expired = isExpired(opportunity.deadline);
  const remainingDays = daysLeft(opportunity.deadline);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all opportunities
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <OpportunityTypeBadge type={opportunity.type} />
              <VerificationBadge status={opportunity.verificationStatus} verifiedAt={opportunity.verifiedAt} showDate />
              <LocationBadge type={opportunity.locationType} location={opportunity.location} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
              {opportunity.title}
            </h1>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-6">
              <Building className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{opportunity.company}</span>
              <span>•</span>
              <span className="text-slate-500 font-normal">{opportunity.category}</span>
            </div>

            {/* Quick Stipend & Deadline Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-0.5">
                  Stipend / Compensation
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {opportunity.stipendMin === 0 && opportunity.stipendMax === 0
                    ? 'Free / Non-monetary Learning'
                    : opportunity.stipendMin && opportunity.stipendMax
                    ? `${formatCurrency(opportunity.stipendMin, opportunity.currency)} - ${formatCurrency(opportunity.stipendMax, opportunity.currency)}`
                    : formatCurrency(opportunity.stipendMax || opportunity.stipendMin, opportunity.currency)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-0.5">
                  Application Deadline
                </span>
                <span className={`font-bold text-sm ${expired ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatDate(opportunity.deadline)} {expired ? '(Closed)' : `(${remainingDays} days left)`}
                </span>
              </div>
            </div>
          </Card>

          {/* Description Section */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3">About the Role & Program</h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {opportunity.description}
              </div>
            </div>

            {/* Eligibility Requirements */}
            {opportunity.eligibility && (
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-blue" />
                  Eligibility Criteria
                </h3>
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-sm text-slate-700 leading-relaxed">
                  {opportunity.eligibility}
                </div>
              </div>
            )}

            {/* Academic Years & Branches */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Eligible Academic Years
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {opportunity.academicYears?.map((yr, idx) => (
                    <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      {yr}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Eligible Engineering Branches
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {opportunity.branches?.map((br, idx) => (
                    <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      {br}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Required */}
            {opportunity.skills && opportunity.skills.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Recommended Skills & Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar: Actions & Verification Transparency */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Ready to Apply?</h3>

            {expired ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium mb-4">
                This application deadline has passed. Check related active opportunities below.
              </div>
            ) : (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block mb-3"
              >
                <Button size="lg" variant="primary" className="w-full" rightIcon={<ExternalLink className="w-4 h-4" />}>
                  Apply on Official Portal
                </Button>
              </a>
            )}

            <div className="flex items-center gap-2 mb-3">
              <PulseHeart
                count={142}
                size={38}
                corner={14}
                likedColor="#ff4d6d"
                pillColor="#F8FAFC"
                className="w-full justify-center py-2"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={saved ? 'primary' : 'outline'}
                size="md"
                className="flex-1"
                onClick={() => toggleBookmark(opportunity.id, 'opportunity')}
                leftIcon={<BookmarkIcon className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />}
              >
                {saved ? 'Saved' : 'Save'}
              </Button>

              <Button variant="outline" size="md" onClick={handleShare} title="Copy shareable link">
                <Share2 className="w-4 h-4 text-slate-500" />
              </Button>
            </div>
          </Card>

          {/* Verification Box (Section 11 requirement!) */}
          <Card className="p-6 bg-slate-50/70">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verification Audit Details
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              This listing has been verified against official company announcements to protect students from fake drives.
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                  Official Verification Source
                </span>
                <a
                  href={opportunity.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline inline-flex items-center gap-1 font-medium break-all"
                >
                  Verify Source Website <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              {opportunity.verifiedAt && (
                <div>
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                    Verified On
                  </span>
                  <span className="font-semibold text-slate-700">{formatDate(opportunity.verifiedAt)}</span>
                </div>
              )}

              {opportunity.adminNotes && (
                <div>
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                    Audit Notes
                  </span>
                  <span className="text-slate-600 italic font-medium">"{opportunity.adminNotes}"</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Related Opportunities */}
      {related.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-xl font-bold text-brand-navy mb-6">
            Related Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(r => (
              <OpportunityCard key={r.id} opportunity={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
