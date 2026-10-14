import React, { useState, useEffect } from 'react';
import { Course, CourseLevel, CoursePriceType, CourseStatus } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { isValidUrl } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Course | null;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState<CourseLevel>('Beginner');
  const [priceType, setPriceType] = useState<CoursePriceType>('free');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  const [durationHours, setDurationHours] = useState<number | undefined>(40);
  const [certificateAvailable, setCertificateAvailable] = useState(true);
  const [officialUrl, setOfficialUrl] = useState('');
  const [status, setStatus] = useState<CourseStatus>('published');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setProvider(initialData.provider);
      setCategory(initialData.category);
      setLevel(initialData.level);
      setPriceType(initialData.priceType);
      setPrice(initialData.price);
      setCurrency(initialData.currency);
      setDurationHours(initialData.durationHours);
      setCertificateAvailable(initialData.certificateAvailable);
      setOfficialUrl(initialData.officialUrl);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setProvider('');
      setCategory('Web Development');
      setLevel('Beginner');
      setPriceType('free');
      setPrice(0);
      setCurrency('USD');
      setDurationHours(40);
      setCertificateAvailable(true);
      setOfficialUrl('');
      setStatus('published');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !provider.trim() || !officialUrl.trim()) {
      showToast('Please fill all required course fields.', 'error');
      return;
    }

    if (!isValidUrl(officialUrl)) {
      showToast('Official course URL must be a valid HTTP or HTTPS address.', 'error', 'Invalid URL');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title,
        provider,
        category,
        level,
        priceType,
        price: priceType === 'free' ? 0 : Number(price),
        currency,
        durationHours: durationHours ? Number(durationHours) : undefined,
        certificateAvailable,
        officialUrl,
        status,
        verificationStatus: 'verified',
      });
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Error saving course record.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Course Record' : 'Add Curated Course'}
      description="Curate top-tier courses without redistributing copyrighted materials."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Course Title"
          required
          placeholder="e.g. CS50's Introduction to Computer Science"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Course Provider / University"
            required
            placeholder="e.g. Harvard University, DeepLearning.AI"
            value={provider}
            onChange={e => setProvider(e.target.value)}
          />
          <Input
            label="Category"
            required
            placeholder="e.g. DSA, AI/ML, Cloud"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Difficulty Level"
            value={level}
            onChange={e => setLevel(e.target.value as CourseLevel)}
            options={[
              { value: 'Beginner', label: 'Beginner' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
            ]}
          />
          <Select
            label="Pricing Type"
            value={priceType}
            onChange={e => {
              const val = e.target.value as CoursePriceType;
              setPriceType(val);
              if (val === 'free') setPrice(0);
            }}
            options={[
              { value: 'free', label: '100% Free' },
              { value: 'paid', label: 'Paid' },
              { value: 'discounted', label: 'Discounted' },
            ]}
          />
          <Input
            label="Price Amount"
            type="number"
            disabled={priceType === 'free'}
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Estimated Duration (Hours)"
            type="number"
            placeholder="40"
            value={durationHours ?? ''}
            onChange={e => setDurationHours(e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            label="Official Course URL"
            type="url"
            required
            placeholder="https://official-course-website.com"
            value={officialUrl}
            onChange={e => setOfficialUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={certificateAvailable}
              onChange={e => setCertificateAvailable(e.target.checked)}
              className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue w-4 h-4"
            />
            <span>Certificate Available</span>
          </label>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            {initialData ? 'Update Course' : 'Add Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
