import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { BrandLogo } from '@/components/common/BrandLogo';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin, currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('Please enter both your email address and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to Road 2 Brain!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Invalid email or password. Please verify your credentials.', 'error', 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role: 'student' | 'admin') => {
    setLoading(true);
    try {
      await demoLogin(role);
      showToast(`Signed in as demo ${role}.`, 'success');
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      showToast('Error during demo sign in.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <BrandLogo className="justify-center mb-4" />
          <h2 className="text-2xl font-extrabold text-brand-navy">Sign in to your account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your verified opportunities, bookmarks, and roadmap milestones.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              required
              placeholder="you@college.edu.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-brand-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Access Box */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Instant 1-Click Evaluation Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoSignIn('student')}
                leftIcon={<User className="w-3.5 h-3.5 text-brand-blue" />}
              >
                Demo Student
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoSignIn('admin')}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
              >
                Demo Admin
              </Button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-600">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-brand-blue hover:underline">
            Create student profile for free
          </Link>
        </p>
      </div>
    </div>
  );
};
