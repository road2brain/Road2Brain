import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, Sparkles, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { BrandLogo } from '@/components/common/BrandLogo';
import { AcademicYear } from '@/types';

export const Signup: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [currentYear, setCurrentYear] = useState<AcademicYear>('2nd Year');
  const [graduationYear, setGraduationYear] = useState(2027);
  const [collegeName, setCollegeName] = useState('');
  const [targetCareerTrack, setTargetCareerTrack] = useState('Software Development Engineer');
  const [loading, setLoading] = useState(false);

  const { signup, currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim() || !email.trim() || !password) {
      showToast('Please provide your name, college email, and password.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, {
        displayName,
        branch,
        currentYear,
        graduationYear: Number(graduationYear),
        collegeName,
        targetCareerTrack,
        selectedRoadmapId: targetCareerTrack.includes('AI') ? 'roadmap-aiml' : targetCareerTrack.includes('Data') ? 'roadmap-data' : 'roadmap-sde',
        skills: ['Data Structures', 'Python', 'C++'],
        interests: [targetCareerTrack],
      });
      showToast('Your student account has been created! Welcome to Road 2 Brain.', 'success', 'Account Created 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Error creating account. Please try again.', 'error', 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <BrandLogo className="justify-center mb-4" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Create your student profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            Personalized opportunity alerts, milestone tracking, and placement roadmaps.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Arjun Sharma"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="College Email"
                type="email"
                required
                placeholder="you@college.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />
              <Input
                label="Password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Branch"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                options={[
                  { value: 'CSE', label: 'CSE' },
                  { value: 'IT', label: 'IT' },
                  { value: 'AI/DS', label: 'AI & DS' },
                  { value: 'ECE', label: 'ECE' },
                  { value: 'EE', label: 'EE' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <Select
                label="Academic Year"
                value={currentYear}
                onChange={e => setCurrentYear(e.target.value as AcademicYear)}
                options={[
                  { value: '1st Year', label: '1st Year' },
                  { value: '2nd Year', label: '2nd Year' },
                  { value: '3rd Year', label: '3rd Year' },
                  { value: '4th Year', label: '4th Year' },
                ]}
              />

              <Input
                label="Graduation Year"
                type="number"
                value={graduationYear}
                onChange={e => setGraduationYear(Number(e.target.value))}
              />
            </div>

            <Input
              label="College Name (Optional)"
              placeholder="e.g. SRM / VIT / NIT / IIT / State University"
              value={collegeName}
              onChange={e => setCollegeName(e.target.value)}
            />

            <Select
              label="Target Career Track"
              value={targetCareerTrack}
              onChange={e => setTargetCareerTrack(e.target.value)}
              options={[
                { value: 'Software Development Engineer', label: 'Software Development Engineer (SDE)' },
                { value: 'Machine Learning / AI Engineer', label: 'Machine Learning / AI Engineer' },
                { value: 'Data Analyst / Data Scientist', label: 'Data Analyst / Data Scientist' },
              ]}
            />

            <Button type="submit" variant="primary" className="w-full mt-4" size="lg" isLoading={loading}>
              Create Student Account Free
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-blue hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
