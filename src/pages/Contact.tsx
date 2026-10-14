import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { useToast } from '@/contexts/ToastContext';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Report Broken Link / Opportunity');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill all contact fields.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Message sent! Our student support team will respond shortly.', 'success');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-brand-navy">Contact Road 2 Brain</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Have feedback, need to report an expired opportunity, or want to suggest a verified student program? Reach out to our team.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Thank you for getting in touch!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              We have received your message regarding <span className="font-semibold">{subject}</span>. We will review and follow up with you at <span className="font-semibold text-slate-800">{email}</span>.
            </p>
            <div className="pt-4">
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                required
                placeholder="e.g. Arjun Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                label="Your Email"
                type="email"
                required
                placeholder="you@college.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <Select
              label="Inquiry Topic"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              options={[
                { value: 'Report Broken Link / Opportunity', label: 'Report Broken Link or Expired Opportunity' },
                { value: 'Suggest a Student Program', label: 'Suggest a Verified Student Program or Hackathon' },
                { value: 'Roadmap Feedback', label: 'Feedback on Engineering Roadmaps' },
                { value: 'General Inquiry', label: 'General Startup Inquiry' },
              ]}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Message Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
                placeholder="Please include relevant links or details..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" size="lg" isLoading={loading} rightIcon={<Send className="w-4 h-4" />}>
              Submit Inquiry
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
