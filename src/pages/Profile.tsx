import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { User, GraduationCap, Target, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import { AcademicYear } from '@/types';

export const Profile: React.FC = () => {
  const { profile, updateStudentProfile, currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [currentYear, setCurrentYear] = useState<AcademicYear>('3rd Year');
  const [graduationYear, setGraduationYear] = useState(2027);
  const [targetCareerTrack, setTargetCareerTrack] = useState('Software Development Engineer');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setCollegeName(profile.collegeName || '');
      setBranch(profile.branch || 'CSE');
      setCurrentYear(profile.currentYear || '3rd Year');
      setGraduationYear(profile.graduationYear || 2027);
      setTargetCareerTrack(profile.targetCareerTrack || 'Software Development Engineer');
      setSkills((profile.skills || []).join(', '));
      setInterests((profile.interests || []).join(', '));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      showToast('Display name cannot be empty.', 'error');
      return;
    }

    setLoading(true);
    try {
      await updateStudentProfile({
        displayName,
        collegeName,
        branch,
        currentYear,
        graduationYear: Number(graduationYear),
        targetCareerTrack,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: interests.split(',').map(s => s.trim()).filter(Boolean),
      });
      showToast('Profile updated successfully!', 'success');
    } catch {
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-blue">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
          Student Profile Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your profile helps personalize opportunity recommendations and track your graduation milestones.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read only email & role */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Registered Email
              </span>
              <span className="font-semibold text-slate-800">{currentUser?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Account Authorization Role
              </span>
              <span className={`font-bold uppercase ${profile?.role === 'admin' ? 'text-amber-700' : 'text-brand-blue'}`}>
                {profile?.role || 'Student'}
              </span>
            </div>
          </div>

          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-blue" /> Personal & Academic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Display Name"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
              <Input
                label="College / University Name"
                placeholder="e.g. National Institute of Technology"
                value={collegeName}
                onChange={e => setCollegeName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Branch / Major"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                options={[
                  { value: 'CSE', label: 'Computer Science (CSE)' },
                  { value: 'IT', label: 'Information Tech (IT)' },
                  { value: 'AI/DS', label: 'AI & Data Science' },
                  { value: 'ECE', label: 'Electronics (ECE)' },
                  { value: 'EE', label: 'Electrical (EE)' },
                  { value: 'Mechanical', label: 'Mechanical Engineering' },
                  { value: 'Other', label: 'Other Engineering' },
                ]}
              />

              <Select
                label="Current Academic Year"
                value={currentYear}
                onChange={e => setCurrentYear(e.target.value as AcademicYear)}
                options={[
                  { value: '1st Year', label: '1st Year (Freshman)' },
                  { value: '2nd Year', label: '2nd Year (Sophomore)' },
                  { value: '3rd Year', label: '3rd Year (Pre-final)' },
                  { value: '4th Year', label: '4th Year (Final Year)' },
                ]}
              />

              <Input
                label="Graduation Year"
                type="number"
                value={graduationYear}
                onChange={e => setGraduationYear(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Career & Skills */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-violet" /> Target Career Track & Skills
            </h3>

            <Select
              label="Primary Target Career Track"
              value={targetCareerTrack}
              onChange={e => setTargetCareerTrack(e.target.value)}
              options={[
                { value: 'Software Development Engineer', label: 'Software Development Engineer (SDE)' },
                { value: 'Machine Learning / AI Engineer', label: 'Machine Learning / AI Engineer' },
                { value: 'Data Analyst / Data Scientist', label: 'Data Analyst / Data Scientist' },
              ]}
            />

            <Input
              label="Technical Skills (Comma separated)"
              placeholder="e.g. C++, Java, Python, React, SQL, Git"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              helperText="These skills are used to match you with eligible technical internships and hackathons."
            />

            <Input
              label="Areas of Interest (Comma separated)"
              placeholder="e.g. Web Development, Cloud Computing, Distributed Systems"
              value={interests}
              onChange={e => setInterests(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link to="/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={loading} leftIcon={<Check className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
