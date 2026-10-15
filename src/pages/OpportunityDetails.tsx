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
  GraduationCap,
  HelpCircle
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
import { getOpportunityBgImage } from '@/lib/opportunityMedia';

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
  const bgImage = getOpportunityBgImage(opportunity.type, opportunity.backgroundImage);
  const initialLikes = Math.floor(
    (opportunity.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 11) % 480 + 35
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Category Hero Banner with Background Image */}
      <div className="relative rounded-3xl overflow-hidden mb-8 min-h-[220px] sm:min-h-[280px] bg-slate-950 border border-slate-200/80 shadow-xl group">
        <img
          src={bgImage}
          alt={opportunity.title}
          className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.82]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/internship-student.jpg';
          }}
        />
        {/* Layered gradients to guarantee high contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

        {/* Top Controls: Back button + Share + Save */}
        <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between gap-2">
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold hover:bg-black/80 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to opportunities
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-900 border border-white/80 shadow-xs transition-colors"
              title="Share link"
              aria-label="Share opportunity link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleBookmark(opportunity.id, 'opportunity')}
              className={`p-2.5 rounded-xl backdrop-blur-md border shadow-xs transition-colors ${
                saved
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-white/95 text-slate-700 hover:text-slate-900 border-white/80'
              }`}
              title={saved ? 'Saved in your dashboard' : 'Save to dashboard'}
              aria-label={saved ? 'Remove bookmark' : 'Bookmark opportunity'}
            >
              <BookmarkIcon className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Banner Content */}
        <div className="relative z-10 px-5 sm:px-8 pb-6 pt-10 sm:pt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <OpportunityTypeBadge type={opportunity.type} />
              <VerificationBadge status={opportunity.verificationStatus} verifiedAt={opportunity.verifiedAt} showDate />
              <LocationBadge type={opportunity.locationType} location={opportunity.location} />
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
              {opportunity.title}
            </h1>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mt-2.5">
              <Building className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="text-white font-bold">{opportunity.company}</span>
              <span>•</span>
              <span className="text-cyan-200">{opportunity.category}</span>
            </div>
          </div>

          <div className="self-start sm:self-end bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-white/80 shrink-0">
            <PulseHeart
              count={initialLikes}
              size={32}
              corner={10}
              likedColor="#ff4d6d"
              idleColor="#94a3b8"
              pillColor="#FFFFFF"
              textColor="#1e293b"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stipend & Deadline Bar */}
          <Card className="p-6 sm:p-8">
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

          {/* Raise Issue / Support Desk Card */}
          <Card className="p-5 bg-white border border-slate-200/90 text-center space-y-2.5 shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-brand-blue" />
              <span>Have a Query or Found an Issue?</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Encountered a broken portal link, closed application, or have an eligibility question regarding this drive?
            </p>
            <Link
              to={`/raise-issue?oppTitle=${encodeURIComponent(opportunity.title)}&oppUrl=${encodeURIComponent(opportunity.applicationUrl)}`}
              className="inline-block w-full pt-1"
            >
              <Button variant="outline" size="sm" className="w-full text-xs font-bold">
                Raise Query to Admin Desk
              </Button>
            </Link>
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
