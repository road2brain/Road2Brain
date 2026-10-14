import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home as HomeIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto shadow-inner border border-blue-100">
          <span className="text-2xl font-black">404</span>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">Page Not Found</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The page or opportunity you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" leftIcon={<HomeIcon className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/opportunities">
            <Button variant="outline" leftIcon={<Compass className="w-4 h-4 text-brand-blue" />}>
              Browse Opportunities
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
