import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  Compass, 
  BookOpen, 
  Map, 
  Users, 
  AlertTriangle, 
  ArrowRight,
  PlusCircle,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { fetchOpportunities } from '@/services/opportunities.service';
import { fetchCourses } from '@/services/courses.service';
import { fetchRoadmaps } from '@/services/roadmaps.service';
import { fetchAllUsers } from '@/services/user.service';
import { fetchAllIssues } from '@/services/issues.service';
import { Opportunity, Course, Roadmap, UserProfile, IssueQuery } from '@/types';
import { isExpired, formatDate } from '@/lib/utils';
import { OpportunityTypeBadge, VerificationBadge } from '@/components/common/Badge';

export const AdminDashboard: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [issues, setIssues] = useState<IssueQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchOpportunities({ includeExpired: true, status: undefined }),
      fetchCourses({ status: undefined }),
      fetchRoadmaps(),
      fetchAllUsers(),
      fetchAllIssues(),
    ])
      .then(([opps, crs, rms, usrs, iss]) => {
        setOpportunities(opps);
        setCourses(crs);
        setRoadmaps(rms);
        setUsers(usrs);
        setIssues(iss);
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate real metrics (No fake numbers!)
  const publishedCount = opportunities.filter(o => o.status === 'published' && o.verificationStatus === 'verified' && !isExpired(o.deadline)).length;
  const pendingVerification = opportunities.filter(o => o.verificationStatus === 'pending_verification');
  const expiredCount = opportunities.filter(o => isExpired(o.deadline) || o.status === 'expired').length;
  const draftCount = opportunities.filter(o => o.status === 'draft').length;
  const openIssuesCount = issues.filter(i => i.status === 'open').length;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Administrative Management Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real platform metrics, content verification pipeline, and student account monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/opportunities">
            <Button size="sm" variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Manage Listings
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Published
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{publishedCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Verified & publicly discoverable</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Verification
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingVerification.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting official portal check</p>
        </Card>

        <Link to="/admin/issues" className="block">
          <Card className="p-5 hover:border-brand-blue transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Student Queries
              </span>
              <MessageSquare className="w-5 h-5 text-brand-blue" />
            </div>
            <div className="text-2xl font-black text-brand-blue">{openIssuesCount}</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              {openIssuesCount === 0 ? 'All queries answered' : `${openIssuesCount} need reply from admin`}
            </p>
          </Card>
        </Link>

        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Curated Courses
            </span>
            <BookOpen className="w-5 h-5 text-brand-teal" />
          </div>
          <div className="text-2xl font-black text-slate-900">{courses.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Across 7 technical domains</p>
        </Card>
      </div>

      {/* Student Queries Pending Review */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-blue" />
            <h2 className="text-base font-bold text-slate-900">
              Student Help Desk Queries ({openIssuesCount} open)
            </h2>
          </div>

          <Link to="/admin/issues">
            <Button variant="ghost" size="sm" className="text-xs text-brand-blue font-semibold">
              View All Queries <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {issues.filter(i => i.status === 'open').length > 0 ? (
          <div className="divide-y divide-slate-100">
            {issues.filter(i => i.status === 'open').slice(0, 3).map(item => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">{item.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{item.studentName}</span>
                    <span>•</span>
                    <span>{item.studentEmail}</span>
                    <span>•</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                <Link to="/admin/issues">
                  <Button variant="outline" size="sm" className="text-xs shrink-0">
                    Reply to Student
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500">
            <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1.5" />
            <p className="font-semibold text-slate-700">All student queries are resolved!</p>
            <p className="text-slate-400">No pending inquiries awaiting admin answer.</p>
          </div>
        )}
      </Card>

      {/* Verification Queue (Section 11 requirement!) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              Verification Queue ({pendingVerification.length})
            </h2>
          </div>

          <Link to="/admin/opportunities?filter=pending">
            <Button variant="ghost" size="sm" className="text-xs text-brand-blue font-semibold">
              View Queue <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {pendingVerification.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {pendingVerification.slice(0, 5).map(item => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <OpportunityTypeBadge type={item.type} />
                    <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{item.company}</span>
                    <span>•</span>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:underline inline-flex items-center gap-1"
                    >
                      Check Source <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <Link to="/admin/opportunities">
                  <Button variant="outline" size="sm" className="text-xs">
                    Review & Verify
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Verification queue is clear!</p>
            <p className="text-slate-400">All submissions have been checked against official sources.</p>
          </div>
        )}
      </Card>
    </div>
  );
};
