import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Link as LinkIcon, 
  MessageSquare, 
  Compass, 
  BookOpen, 
  Map, 
  ChevronRight,
  User,
  Filter
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createIssue, fetchIssues } from '@/services/issues.service';
import { IssueCategory, IssueQuery, IssueStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export const RaiseIssue: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentUser, profile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'raise' | 'history'>('raise');
  const [name, setName] = useState(profile?.displayName || '');
  const [email, setEmail] = useState(profile?.email || currentUser?.email || '');
  const [category, setCategory] = useState<IssueCategory>('internship_query');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [opportunityTitle, setOpportunityTitle] = useState(searchParams.get('oppTitle') || '');
  const [opportunityUrl, setOpportunityUrl] = useState(searchParams.get('oppUrl') || '');
  const [submitting, setSubmitting] = useState(false);

  // Issues history
  const [issues, setIssues] = useState<IssueQuery[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (profile?.displayName && !name) setName(profile.displayName);
    const userEmail = profile?.email || currentUser?.email || '';
    if (userEmail && !email) setEmail(userEmail);
    
    // Auto set broken link category if oppTitle was passed
    if (searchParams.get('oppTitle')) {
      setCategory('broken_link');
      if (!subject) setSubject(`Issue regarding: ${searchParams.get('oppTitle')}`);
    }
  }, [profile, currentUser, searchParams]);

  const loadStudentIssues = async () => {
    setHistoryLoading(true);
    try {
      const studentIdentifier = currentUser?.uid || email || 'guest';
      const all = await fetchIssues();
      // Show user's issues, or demo seed issues if not logged in
      const studentOnly = currentUser
        ? all.filter(i => i.studentId === currentUser.uid || i.studentEmail.toLowerCase() === (currentUser.email || '').toLowerCase())
        : all;
      setIssues(studentOnly);
    } catch {
      showToast('Could not load query history.', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadStudentIssues();
  }, [currentUser, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !description.trim()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createIssue({
        studentId: currentUser?.uid || `guest-${Date.now()}`,
        studentName: name.trim(),
        studentEmail: email.trim(),
        category,
        subject: subject.trim(),
        description: description.trim(),
        opportunityTitle: opportunityTitle.trim() || undefined,
        opportunityUrl: opportunityUrl.trim() || undefined,
      });

      showToast('Issue submitted successfully! Our verification admin desk will review and reply shortly.', 'success');
      setSubject('');
      setDescription('');
      setOpportunityTitle('');
      setOpportunityUrl('');
      
      // Refresh list and switch to history tab
      setIssues(prev => [created, ...prev]);
      setActiveTab('history');
    } catch {
      showToast('Failed to submit issue. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'internship_query', label: 'Tech Internship Query / Eligibility Doubt' },
    { value: 'broken_link', label: 'Report Broken Link or Expired Opportunity' },
    { value: 'roadmap_doubt', label: 'Engineering Roadmap Guidance' },
    { value: 'course_issue', label: 'Course Access or Certificate Query' },
    { value: 'account_support', label: 'Student Account & Workspace Support' },
    { value: 'feature_request', label: 'Platform Feedback & Feature Request' },
    { value: 'other', label: 'Other Academic Query' },
  ];

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600" /> In Review
          </span>
        );
      case 'open':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Open Query
          </span>
        );
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (statusFilter === 'all') return true;
    return issue.status === statusFilter;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold mb-3 shadow-xs">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Student Support & Issue Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
          Raise an Issue or Query
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
          Found an expired link, have an internship eligibility question, or need roadmap advice? Post your query and our verification admin team will answer directly.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto border border-slate-200/80">
        <button
          type="button"
          onClick={() => setActiveTab('raise')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'raise'
              ? 'bg-white text-brand-blue shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Raise New Query</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-white text-brand-blue shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Queries & Replies</span>
          {issues.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-blue-100 text-brand-blue">
              {issues.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: RAISE ISSUE FORM */}
      {activeTab === 'raise' && (
        <Card className="p-6 sm:p-10 border border-slate-200/90 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Student Full Name"
                required
                placeholder="e.g. Aryan Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                label="Student Email Address"
                type="email"
                required
                placeholder="you@college.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                helperText="Admin replies will also be addressed to this email"
              />
            </div>

            {/* Category */}
            <Select
              label="Issue Category"
              value={category}
              onChange={e => setCategory(e.target.value as IssueCategory)}
              options={categoryOptions}
            />

            {/* Optional Opportunity Details */}
            {(category === 'broken_link' || category === 'internship_query' || opportunityTitle) && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Referenced Opportunity (Optional)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Drive / Opportunity Title"
                    placeholder="e.g. Google SDE Summer Intern 2027"
                    value={opportunityTitle}
                    onChange={e => setOpportunityTitle(e.target.value)}
                  />
                  <Input
                    label="Application or Career Portal Link"
                    placeholder="https://..."
                    value={opportunityUrl}
                    onChange={e => setOpportunityUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Subject */}
            <Input
              label="Subject / Query Title"
              required
              placeholder="e.g. Broken career link on Google SDE drive or Eligibility question"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 placeholder:text-slate-400"
                placeholder="Please describe what you encountered or what doubt you have. Include any error messages or specifics so the admin team can resolve it faster."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full rounded-xl shadow-elevated font-extrabold"
                isLoading={submitting}
                rightIcon={<Send className="w-4 h-4 ml-1" />}
              >
                Submit Query to Admin Desk
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: QUERY HISTORY & ADMIN REPLIES */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Status filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter by Status:</span>
              <div className="flex items-center gap-1.5">
                {['all', 'open', 'in_progress', 'resolved'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                      statusFilter === s
                        ? 'bg-brand-blue text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => setActiveTab('raise')} leftIcon={<Send className="w-3.5 h-3.5 text-brand-blue" />}>
              + Raise Another Query
            </Button>
          </div>

          {filteredIssues.length === 0 ? (
            <Card className="p-10 text-center border-dashed border-2 border-slate-200">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No queries found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                You haven't submitted any queries under this filter yet. Submit a query to receive verification support.
              </p>
              <Button variant="primary" size="sm" onClick={() => setActiveTab('raise')}>
                Submit Your First Query
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <Card key={issue.id} className="p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {getStatusBadge(issue.status)}
                        <span className="text-xs font-bold text-slate-400">•</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {issue.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400 font-medium">
                          {formatDate(issue.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {issue.subject}
                      </h3>
                    </div>

                    <div className="text-right text-xs text-slate-500 shrink-0">
                      <span className="font-semibold text-slate-700">{issue.studentName}</span>
                    </div>
                  </div>

                  {/* Student query description */}
                  <div className="py-3 text-sm text-slate-700 leading-relaxed">
                    <p>{issue.description}</p>
                    {issue.opportunityTitle && (
                      <div className="mt-2 text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-brand-blue" />
                        <span>Referenced Drive: <strong className="text-slate-800">{issue.opportunityTitle}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Admin Reply Box */}
                  {issue.adminReply ? (
                    <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-blue-50/50 to-emerald-50/40 border border-emerald-200/80 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Official Admin Response</span>
                          <span className="text-slate-400 font-normal">({issue.adminRepliedBy || 'Admin Team'})</span>
                        </div>
                        {issue.adminRepliedAt && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            {formatDate(issue.adminRepliedAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                        {issue.adminReply}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-amber-700 bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Our administration desk has received this query and is currently researching the verification. A reply will appear here soon.</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
