import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { BrandLogo } from '@/components/common/BrandLogo';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your registered email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
      showToast('Password reset link sent to your email!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error sending password reset email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <BrandLogo className="justify-center mb-4" />
          <h2 className="text-2xl font-extrabold text-brand-navy">Reset your password</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your college email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Check your inbox</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-800">{email}</span>, you will receive an email with instructions on how to reset your password shortly.
              </p>
              <div className="pt-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Return to Login</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered College Email"
                type="email"
                required
                placeholder="you@college.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />

              <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
                Send Password Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-blue">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
