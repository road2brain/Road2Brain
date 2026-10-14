import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { 
  fetchCourses, 
  createCourse, 
  updateCourse, 
  verifyCoursePrice, 
  deleteCourse 
} from '@/services/courses.service';
import { Course } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { CourseFormModal } from '@/components/admin/CourseFormModal';
import { formatDate, formatCurrency } from '@/lib/utils';

export const AdminCourses: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCourses({ status: undefined });
      setCourses(data);
    } catch {
      showToast('Error loading courses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (formData: any) => {
    const adminUid = currentUser?.uid || 'admin';
    if (editingCourse) {
      await updateCourse(editingCourse.id, formData, adminUid);
      showToast('Course updated successfully.', 'success');
    } else {
      await createCourse(formData, adminUid);
      showToast('New course added to directory.', 'success');
    }
    await loadData();
  };

  const handleVerifyPrice = async (id: string) => {
    if (!currentUser) return;
    await verifyCoursePrice(id, currentUser.uid);
    showToast('Course price confirmed as verified today.', 'success');
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    if (!currentUser) return;
    await deleteCourse(id, currentUser.uid);
    showToast('Course removed.', 'info');
    await loadData();
  };

  const filtered = courses.filter(c => {
    if (search.trim()) {
      const t = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(t) ||
        c.provider.toLowerCase().includes(t) ||
        c.category.toLowerCase().includes(t)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Course Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Curate world-class courses, monitor verified certificates, and track pricing accuracy.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingCourse(null);
            setIsFormOpen(true);
          }}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Add Course
        </Button>
      </div>

      <Card className="p-4">
        <Input
          placeholder="Search courses by title, provider, or category..."
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
                <th className="p-4">Course & Provider</th>
                <th className="p-4">Category</th>
                <th className="p-4">Level</th>
                <th className="p-4">Price</th>
                <th className="p-4">Price Verified</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(course => (
                <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 text-sm max-w-sm truncate">{course.title}</p>
                    <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-700">{course.provider}</span>
                      <span>•</span>
                      <a
                        href={course.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:underline inline-flex items-center gap-0.5"
                      >
                        Official Page <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </td>

                  <td className="p-4">
                    <Badge variant="info">{course.category}</Badge>
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-slate-700">{course.level}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-emerald-700">
                      {course.priceType === 'free' ? '100% Free' : formatCurrency(course.price, course.currency)}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="text-slate-600 font-medium">{formatDate(course.priceVerifiedAt)}</span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] px-2 py-1"
                        onClick={() => handleVerifyPrice(course.id)}
                        title="Confirm current pricing"
                      >
                        Verify Price
                      </Button>

                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setIsFormOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-blue hover:bg-slate-100"
                        title="Edit course"
                        aria-label="Edit course"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete course"
                        aria-label="Delete course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No courses found matching search.
            </div>
          )}
        </div>
      </Card>

      <CourseFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCourse(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingCourse}
      />
    </div>
  );
};
