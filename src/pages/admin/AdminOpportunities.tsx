import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  Clock, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Archive,
  RefreshCw
} from 'lucide-react';
import { 
  fetchOpportunities, 
  createOpportunity, 
  updateOpportunity, 
  verifyOpportunity, 
  publishOpportunity, 
  expireOpportunity, 
  archiveOpportunity, 
  rejectOpportunity,
  deleteOpportunity 
} from '@/services/opportunities.service';
import { Opportunity } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Card } from '@/components/common/Card';
import { OpportunityTypeBadge, VerificationBadge } from '@/components/common/Badge';
import { OpportunityFormModal } from '@/components/admin/OpportunityFormModal';
import { VerificationNotesModal } from '@/components/admin/VerificationNotesModal';
import { formatDate, isExpired } from '@/lib/utils';
import { getOpportunityBgImage } from '@/lib/opportunityMedia';

export const AdminOpportunities: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('filter') || 'all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [verifyModalOpp, setVerifyModalOpp] = useState<Opportunity | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchOpportunities({ includeExpired: true, status: undefined });
      setOpportunities(data);
    } catch (err) {
      showToast('Error loading opportunities.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (formData: any) => {
    const adminUid = currentUser?.uid || 'admin';
    if (editingOpp) {
      await updateOpportunity(editingOpp.id, formData, adminUid);
      showToast('Listing updated successfully.', 'success');
    } else {
      await createOpportunity(formData, adminUid);
      showToast('New draft listing created.', 'success');
    }
    await loadData();
  };

  const handleConfirmVerify = async (notes: string) => {
    if (!verifyModalOpp || !currentUser) return;
    try {
      await verifyOpportunity(verifyModalOpp.id, currentUser.uid, notes);
      showToast('Listing marked as Verified!', 'success');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Verification failed.', 'error');
    }
  };

  const handleReject = async (notes: string) => {
    if (!verifyModalOpp || !currentUser) return;
    try {
      await rejectOpportunity(verifyModalOpp.id, currentUser.uid, notes);
      showToast('Listing rejected as unverified.', 'info');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Rejection failed.', 'error');
    }
  };

  const handlePublish = async (opp: Opportunity) => {
    if (!currentUser) return;
    try {
      await publishOpportunity(opp.id, currentUser.uid);
      showToast('Listing published successfully! It is now live in the student directory.', 'success');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Cannot publish listing.', 'error', 'Publish Error');
    }
  };

  const handleExpire = async (id: string) => {
    if (!currentUser) return;
    await expireOpportunity(id, currentUser.uid);
    showToast('Listing marked as expired.', 'info');
    await loadData();
  };

  const handleArchive = async (id: string) => {
    if (!currentUser) return;
    await archiveOpportunity(id, currentUser.uid);
    showToast('Listing archived.', 'info');
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this opportunity?')) return;
    if (!currentUser) return;
    await deleteOpportunity(id, currentUser.uid);
    showToast('Listing permanently deleted.', 'info');
    await loadData();
  };

  // Filter pipeline
  const filtered = opportunities.filter(item => {
    if (statusFilter === 'pending') {
      if (item.verificationStatus !== 'pending_verification') return false;
    } else if (statusFilter === 'published') {
      if (item.status !== 'published') return false;
    } else if (statusFilter === 'expired') {
      if (!isExpired(item.deadline) && item.status !== 'expired') return false;
    } else if (statusFilter === 'draft') {
      if (item.status !== 'draft') return false;
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(term) ||
        item.company.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Opportunity Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, verify official sources, publish, and expire student listings.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingOpp(null);
            setIsFormOpen(true);
          }}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Add Opportunity
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by title, company, or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: `All Listings (${opportunities.length})` },
              { value: 'pending', label: 'Pending Verification' },
              { value: 'published', label: 'Published & Live' },
              { value: 'expired', label: 'Expired / Closed' },
              { value: 'draft', label: 'Drafts' },
            ]}
          />
        </div>
      </Card>

      {/* Listing Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Role & Company</th>
                <th className="p-4">Type</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Status</th>
                <th className="p-4">Deadline</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(opp => {
                const expired = isExpired(opp.deadline);
                return (
                  <tr key={opp.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Title & Company */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-950 shadow-xs">
                          <img
                            src={getOpportunityBgImage(opp.type, opp.backgroundImage)}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm max-w-xs truncate">{opp.title}</p>
                          <div className="flex items-center gap-2 text-slate-500 mt-0.5 text-xs">
                            <span className="font-medium text-slate-700">{opp.company}</span>
                            <span>•</span>
                            <a
                              href={opp.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-blue hover:underline inline-flex items-center gap-0.5"
                              title="Verify source"
                            >
                              Source <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-4">
                      <OpportunityTypeBadge type={opp.type} />
                    </td>

                    {/* Verification Status */}
                    <td className="p-4">
                      <VerificationBadge status={opp.verificationStatus} />
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                        opp.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : opp.status === 'draft'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {opp.status}
                      </span>
                    </td>

                    {/* Deadline */}
                    <td className="p-4">
                      <span className={`font-semibold ${expired ? 'text-rose-600' : 'text-slate-700'}`}>
                        {formatDate(opp.deadline)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Verify Button */}
                        {opp.verificationStatus !== 'verified' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[11px] px-2 py-1"
                            onClick={() => setVerifyModalOpp(opp)}
                          >
                            Verify Source
                          </Button>
                        )}

                        {/* Publish Button */}
                        {opp.status !== 'published' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-[11px] px-2 py-1 bg-brand-blue"
                            onClick={() => handlePublish(opp)}
                            disabled={opp.verificationStatus !== 'verified'}
                            title={opp.verificationStatus !== 'verified' ? 'Must verify official sources before publishing' : 'Publish listing'}
                          >
                            Publish
                          </Button>
                        )}

                        {/* Expire / Archive */}
                        {opp.status === 'published' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-slate-600 text-[11px] px-2 py-1"
                            onClick={() => handleExpire(opp.id)}
                          >
                            Expire
                          </Button>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditingOpp(opp);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-blue hover:bg-slate-100"
                          title="Edit listing"
                          aria-label="Edit listing"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(opp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete permanently"
                          aria-label="Delete permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No opportunities found matching current filter.
            </div>
          )}
        </div>
      </Card>

      {/* Edit / Create Modal */}
      <OpportunityFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingOpp(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingOpp}
      />

      {/* Verification Notes & Audit Modal */}
      <VerificationNotesModal
        isOpen={Boolean(verifyModalOpp)}
        onClose={() => setVerifyModalOpp(null)}
        opportunity={verifyModalOpp}
        onConfirmVerify={handleConfirmVerify}
        onReject={handleReject}
      />
    </div>
  );
};
