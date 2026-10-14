import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Opportunity, UserProfile } from '@/types';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { isExpired } from '@/lib/utils';

interface RecommendationsListProps {
  opportunities: Opportunity[];
  profile: UserProfile | null;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  opportunities,
  profile,
}) => {
  // Deterministic scoring rule based on student academic profile
  const scored = opportunities
    .filter(opp => opp.status === 'published' && opp.verificationStatus === 'verified' && !isExpired(opp.deadline))
    .map(opp => {
      let score = 0;

      // Match Academic Year (High weight)
      if (profile?.currentYear && opp.academicYears?.includes(profile.currentYear)) {
        score += 4;
      }

      // Match Branch (High weight)
      if (profile?.branch && (opp.branches?.includes(profile.branch) || opp.branches?.includes('All Disciplines') || opp.branches?.includes('All Engineering Branches'))) {
        score += 3;
      }

      // Match Student Skills
      if (profile?.skills && opp.skills) {
        const matchingSkills = opp.skills.filter(s => 
          profile.skills?.some(userSkill => userSkill.toLowerCase() === s.toLowerCase())
        );
        score += matchingSkills.length * 2;
      }

      // Match Interests / Career Track
      if (profile?.interests && opp.category) {
        const matchesInterest = profile.interests.some(interest => 
          opp.category.toLowerCase().includes(interest.toLowerCase()) || 
          opp.title.toLowerCase().includes(interest.toLowerCase())
        );
        if (matchesInterest) score += 2;
      }

      return { opp, score };
    })
    .sort((a, b) => b.score - a.score);

  const topRecommendations = scored.slice(0, 3).map(s => s.opp);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-blue" />
            Recommended For You
          </h2>
          <p className="text-xs text-slate-500">
            Tailored to your academic year ({profile?.currentYear || 'All'}), branch ({profile?.branch || 'CSE'}), and skills
          </p>
        </div>

        <Link to="/opportunities">
          <Button variant="ghost" size="sm" className="text-xs text-brand-blue font-semibold">
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {topRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRecommendations.map(opp => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          No matching active opportunities found right now. Check back soon!
        </div>
      )}
    </div>
  );
};
