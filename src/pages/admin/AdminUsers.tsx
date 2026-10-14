import React, { useState, useEffect } from 'react';
import { Users, Search, GraduationCap, ShieldCheck, User } from 'lucide-react';
import { fetchAllUsers } from '@/services/user.service';
import { UserProfile } from '@/types';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { formatDate } from '@/lib/utils';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    if (search.trim()) {
      const t = search.toLowerCase();
      return (
        u.displayName.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t) ||
        (u.branch && u.branch.toLowerCase().includes(t)) ||
        (u.collegeName && u.collegeName.toLowerCase().includes(t))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">User Account Oversight</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect registered student accounts, target career tracks, and platform enrollment.
        </p>
      </div>

      <Card className="p-4">
        <Input
          placeholder="Search students by name, email, branch, or college..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        />
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Branch & Year</th>
                <th className="p-4">College</th>
                <th className="p-4">Target Track</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => (
                <tr key={user.uid} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 text-sm truncate">{user.displayName}</p>
                    <p className="text-slate-500 text-xs truncate">{user.email}</p>
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-slate-800">{user.branch || 'CSE'}</span>
                    <span className="text-slate-500 block text-[11px]">{user.currentYear || '3rd Year'}</span>
                  </td>

                  <td className="p-4">
                    <span className="text-slate-700 font-medium truncate block max-w-xs">
                      {user.collegeName || 'Not specified'}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-medium text-slate-800 truncate block max-w-xs">
                      {user.targetCareerTrack || 'Software Development'}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-brand-blue'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="text-slate-500">{formatDate(user.createdAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No registered user accounts found matching your query.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
