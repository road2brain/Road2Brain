import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityType, LocationType, AcademicYear } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { isValidUrl } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

interface OpportunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Opportunity | null;
}

export const OpportunityFormModal: React.FC<OpportunityFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<OpportunityType>('internship');
  const [category, setCategory] = useState('Software Engineering');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(['2nd Year', '3rd Year']);
  const [branches, setBranches] = useState<string>('CSE, IT, ECE');
  const [skills, setSkills] = useState<string>('Data Structures, Algorithms, C++, Java');
  const [locationType, setLocationType] = useState<LocationType>('hybrid');
  const [location, setLocation] = useState('Bengaluru / Hyderabad');
  const [stipendMin, setStipendMin] = useState<number | undefined>(50000);
  const [stipendMax, setStipendMax] = useState<number | undefined>(75000);
  const [applicationUrl, setApplicationUrl] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCompany(initialData.company);
      setType(initialData.type);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setEligibility(initialData.eligibility);
      setAcademicYears(initialData.academicYears || []);
      setBranches((initialData.branches || []).join(', '));
      setSkills((initialData.skills || []).join(', '));
      setLocationType(initialData.locationType);
      setLocation(initialData.location);
      setStipendMin(initialData.stipendMin);
      setStipendMax(initialData.stipendMax);
      setApplicationUrl(initialData.applicationUrl);
      setSourceUrl(initialData.sourceUrl);
      setDeadline(initialData.deadline);
    } else {
      // Default reset
      setTitle('');
      setCompany('');
      setType('internship');
      setCategory('Software Engineering');
      setDescription('');
      setEligibility('');
      setAcademicYears(['2nd Year', '3rd Year']);
      setBranches('CSE, IT, ECE');
      setSkills('C++, Java, Data Structures');
      setLocationType('hybrid');
      setLocation('Bengaluru');
      setStipendMin(undefined);
      setStipendMax(undefined);
      setApplicationUrl('');
      setSourceUrl('');
      setDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  }, [initialData, isOpen]);

  const toggleYear = (yr: AcademicYear) => {
    setAcademicYears(prev =>
      prev.includes(yr) ? prev.filter(y => y !== yr) : [...prev, yr]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !company.trim() || !applicationUrl.trim() || !sourceUrl.trim() || !deadline) {
      showToast('Please fill in all mandatory fields.', 'error');
      return;
    }

    if (!isValidUrl(applicationUrl)) {
      showToast('Application URL must be a valid http:// or https:// address.', 'error', 'Invalid URL');
      return;
    }

    if (!isValidUrl(sourceUrl)) {
      showToast('Official Source URL must be a valid http:// or https:// address.', 'error', 'Invalid Source URL');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title,
        company,
        type,
        category,
        description,
        eligibility,
        academicYears,
        branches: branches.split(',').map(s => s.trim()).filter(Boolean),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        locationType,
        location,
        stipendMin: stipendMin ? Number(stipendMin) : undefined,
        stipendMax: stipendMax ? Number(stipendMax) : undefined,
        currency: 'INR',
        applicationUrl,
        sourceUrl,
        deadline,
      });
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Error saving opportunity.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Opportunity Listing' : 'Create New Opportunity Listing'}
      description="All listings must have a verified official company source before being published."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Listing Title"
            required
            placeholder="e.g. Software Engineering Intern"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Input
            label="Company / Organisation"
            required
            placeholder="e.g. Google, Amazon, ISRO"
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Opportunity Type"
            value={type}
            onChange={e => setType(e.target.value as OpportunityType)}
            options={[
              { value: 'internship', label: 'Internship' },
              { value: 'fresher_job', label: 'Fresher Job' },
              { value: 'hackathon', label: 'Hackathon' },
              { value: 'scholarship', label: 'Scholarship' },
              { value: 'student_program', label: 'Student Program' },
            ]}
          />
          <Input
            label="Category"
            placeholder="e.g. Software Development"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          <Select
            label="Work Mode"
            value={locationType}
            onChange={e => setLocationType(e.target.value as LocationType)}
            options={[
              { value: 'remote', label: 'Remote / Virtual' },
              { value: 'hybrid', label: 'Hybrid' },
              { value: 'on-site', label: 'On-site' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Location"
            placeholder="e.g. Bengaluru / Hyderabad / Remote"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <Input
            label="Application Deadline"
            type="date"
            required
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Official Application URL"
            type="url"
            required
            placeholder="https://careers.company.com/apply"
            value={applicationUrl}
            onChange={e => setApplicationUrl(e.target.value)}
          />
          <Input
            label="Official Verification Source URL"
            type="url"
            required
            placeholder="https://company.com/announcement"
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
          />
        </div>

        {/* Stipend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Stipend / Salary Min (INR)"
            type="number"
            placeholder="e.g. 50000"
            value={stipendMin ?? ''}
            onChange={e => setStipendMin(e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            label="Stipend / Salary Max (INR)"
            type="number"
            placeholder="e.g. 80000"
            value={stipendMax ?? ''}
            onChange={e => setStipendMax(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        {/* Academic Years Checklist */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Eligible Academic Years
          </label>
          <div className="flex flex-wrap gap-2">
            {(['1st Year', '2nd Year', '3rd Year', '4th Year'] as AcademicYear[]).map(yr => (
              <button
                type="button"
                key={yr}
                onClick={() => toggleYear(yr)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                  academicYears.includes(yr)
                    ? 'bg-brand-blue text-white border-brand-blue'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Eligible Branches (Comma separated)"
          placeholder="CSE, IT, ECE"
          value={branches}
          onChange={e => setBranches(e.target.value)}
        />

        <Input
          label="Required Skills (Comma separated)"
          placeholder="C++, Java, React, SQL"
          value={skills}
          onChange={e => setSkills(e.target.value)}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Eligibility Criteria
          </label>
          <textarea
            rows={2}
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl p-3 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
            placeholder="e.g. B.Tech CSE/IT students graduating in 2027 with minimum 7.0 CGPA."
            value={eligibility}
            onChange={e => setEligibility(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Role Description & Responsibilities
          </label>
          <textarea
            rows={3}
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl p-3 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
            placeholder="Detailed description of responsibilities, project expectations, and learning outcomes."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            {initialData ? 'Update Listing' : 'Save as Draft'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
