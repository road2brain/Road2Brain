import React, { useState } from 'react';
import { Opportunity } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';

interface VerificationNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  onConfirmVerify: (notes: string) => Promise<void>;
  onReject?: (notes: string) => Promise<void>;
}

export const VerificationNotesModal: React.FC<VerificationNotesModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onConfirmVerify,
  onReject,
}) => {
  const [notes, setNotes] = useState('Official career portal announcement confirmed. Eligibility and dates checked.');
  const [loading, setLoading] = useState(false);

  if (!opportunity) return null;

  const handleVerify = async () => {
    setLoading(true);
    try {
      await onConfirmVerify(notes);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    setLoading(true);
    try {
      await onReject(notes);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Official Source & Listing Integrity"
      description="Content must be checked against official company portals before verification."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Listing preview */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-900">{opportunity.title}</h4>
          <p className="text-xs text-slate-600 font-semibold">{opportunity.company}</p>

          <div className="mt-2 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="font-medium text-slate-500">Source URL:</span>
              <a
                href={opportunity.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue hover:underline inline-flex items-center gap-1 truncate max-w-[280px]"
              >
                {opportunity.sourceUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="font-medium text-slate-500">Application URL:</span>
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue hover:underline inline-flex items-center gap-1 truncate max-w-[280px]"
              >
                {opportunity.applicationUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Verification Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Admin Verification Notes
          </label>
          <textarea
            rows={3}
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl p-3 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
            placeholder="Record verification methodology, recruiter confirmation, or circular reference..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {onReject && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleReject}
              isLoading={loading}
              leftIcon={<AlertTriangle className="w-4 h-4" />}
            >
              Reject as Unverified
            </Button>
          )}

          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleVerify}
              isLoading={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Confirm Verified
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
