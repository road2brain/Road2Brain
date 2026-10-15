import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Send, 
  ShieldCheck, 
  Link as LinkIcon, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { fetchAllIssues, replyToIssue, updateIssueStatus } from '@/services/issues.service';
import { IssueQuery, IssueStatus, IssueCategory } from '@/types';
import { formatDate } from '@/lib/utils';

export const AdminIssues: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [issues, setIssues] = useState<IssueQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Active issue for reply form
  const [replyingIssueId, setReplyingIssueId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<IssueStatus>('resolved');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const data = await fetchAllIssues();
      setIssues(data);
    } catch {
      showToast('Failed to load student queries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const openReplyModal = (issue: IssueQuery) => {
    setReplyingIssueId(issue.id);
    setReplyText(issue.adminReply || '');
    setReplyStatus(issue.status === 'open' ? 'resolved' : issue.status);
  };

  const handleSendReply = async (issueId: string) => {
    if (!replyText.trim()) {
      showToast('Please type a reply message.', 'error');
      return;
    }

    setReplySubmitting(true);
    try {
      const adminName = profile?.displayName ? `${profile.displayName} (Admin)` : 'Road 2 Brain Admin';
      const updated = await replyToIssue(issueId, replyText, adminName, replyStatus);

      setIssues(prev => prev.map(item => item.id === issueId ? updated : item));
      showToast(`Reply sent successfully! Marked as ${replyStatus}.`, 'success');
      setReplyingIssueId(null);
      setReplyText('');
    } catch {
      showToast('Failed to save reply.', 'error');
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    try {
      const updated = await updateIssueStatus(issueId, newStatus);
      setIssues(prev => prev.map(item => item.id === issueId ? updated : item));
      showToast(`Status updated to ${newStatus}.`, 'success');
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  // Metrics
  const totalCount = issues.length;
  const openCount = issues.filter(i => i.status === 'open').length;
  const inProgressCount = issues.filter(i => i.status === 'in_progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;

  // Filtered list
  const filtered = issues.filter(item => {
    const matchesSearch = 
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      item.studentEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600" /> In Review
          </span>
        );
      case 'open':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Needs Reply
          </span>
        );
    }
  };

  const applyPreset = (presetText: string, presetStatus: IssueStatus = 'resolved') => {
    setReplyText(presetText);
    setReplyStatus(presetStatus);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Help & Issue Resolution Desk
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review student inquiries, eligibility doubts, and broken link reports. Provide verified administrative answers.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Queries</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
        </Card>

        <Card className="p-4 bg-amber-50/50 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Pending Reply</p>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-900 mt-1">{openCount}</p>
        </Card>

        <Card className="p-4 bg-blue-50/50 border border-blue-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800">Under Review</p>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-900 mt-1">{inProgressCount}</p>
        </Card>

        <Card className="p-4 bg-emerald-50/50 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Resolved</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-900 mt-1">{resolvedCount}</p>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, email, or query keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-blue"
            >
              <option value="all">All Statuses</option>
              <option value="open">Needs Reply (Open)</option>
              <option value="in_progress">In Review</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-blue"
            >
              <option value="all">All Categories</option>
              <option value="broken_link">Broken Link Reports</option>
              <option value="internship_query">Internship Queries</option>
              <option value="roadmap_doubt">Roadmap Doubts</option>
              <option value="course_issue">Course Issues</option>
              <option value="account_support">Account Support</option>
              <option value="feature_request">Feature Requests</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Queries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading student inquiries...</div>
        ) : filtered.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-2 border-slate-200">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No student queries found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters.</p>
          </Card>
        ) : (
          filtered.map(issue => (
            <Card key={issue.id} className="p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(issue.status)}
                    <span className="text-xs font-bold text-slate-400">•</span>
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
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

                {/* Student Info */}
                <div className="sm:text-right text-xs bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 sm:justify-end">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{issue.studentName}</span>
                  </p>
                  <p className="text-slate-500 text-[11px] font-mono mt-0.5">{issue.studentEmail}</p>
                </div>
              </div>

              {/* Query body */}
              <div className="py-3 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                <p>{issue.description}</p>
                {issue.opportunityTitle && (
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-slate-700 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <LinkIcon className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                      <span>Drive: <strong className="font-semibold text-slate-900">{issue.opportunityTitle}</strong></span>
                    </div>
                    {issue.opportunityUrl && (
                      <a 
                        href={issue.opportunityUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-brand-blue font-bold flex items-center gap-1 hover:underline text-[11px] shrink-0"
                      >
                        Visit Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Existing Admin Reply */}
              {issue.adminReply && (
                <div className="mt-2 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-800 text-[11px]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Official Reply by {issue.adminRepliedBy}
                    </span>
                    {issue.adminRepliedAt && (
                      <span className="text-slate-400 font-normal">{formatDate(issue.adminRepliedAt)}</span>
                    )}
                  </div>
                  <p className="leading-relaxed">{issue.adminReply}</p>
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Change status:</span>
                  <select
                    value={issue.status}
                    onChange={e => handleStatusChange(issue.id, e.target.value as IssueStatus)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="open">Needs Reply</option>
                    <option value="in_progress">In Review</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <Button
                  size="sm"
                  variant={issue.adminReply ? 'outline' : 'primary'}
                  onClick={() => replyingIssueId === issue.id ? setReplyingIssueId(null) : openReplyModal(issue)}
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  {issue.adminReply ? 'Edit Admin Reply' : 'Reply to Student'}
                </Button>
              </div>

              {/* Inline Reply Form when expanded */}
              {replyingIssueId === issue.id && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-brand-blue/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-brand-blue" />
                      <span>Compose Official Reply to {issue.studentName}</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">Response will be visible to student on their query desk</span>
                  </div>

                  {/* Preset quick responses */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="text-slate-400 py-0.5">Quick Presets:</span>
                    <button
                      type="button"
                      onClick={() => applyPreset("Thank you for alerting us! We have verified and updated the official portal link on the platform.", "resolved")}
                      className="px-2 py-0.5 rounded bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 font-medium"
                    >
                      Broken Link Fixed
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("Hello! We checked the official eligibility criteria with the hiring team. You are fully eligible to apply for this drive.", "resolved")}
                      className="px-2 py-0.5 rounded bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 font-medium"
                    >
                      Eligibility Confirmed
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("Our verification desk has received your request and is currently researching this with the official program organizers.", "in_progress")}
                      className="px-2 py-0.5 rounded bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 font-medium"
                    >
                      Under Investigation
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type clear, helpful verification details or guidance for the student..."
                    className="w-full bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl p-3 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
                  />

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-semibold">Mark status after reply:</span>
                      <select
                        value={replyStatus}
                        onChange={e => setReplyStatus(e.target.value as IssueStatus)}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700"
                      >
                        <option value="resolved">Resolved</option>
                        <option value="in_progress">In Review</option>
                        <option value="open">Keep Open</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setReplyingIssueId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        isLoading={replySubmitting}
                        onClick={() => handleSendReply(issue.id)}
                        rightIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Publish Reply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
