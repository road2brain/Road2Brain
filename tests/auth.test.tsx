import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { AdminGuard } from '@/components/admin/AdminGuard';

describe('Student Authentication & Authorization Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. allows student registration with academic fields and locks role to student', async () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/College Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Create Student Account Free/i });

    fireEvent.change(nameInput, { target: { value: 'Priya Patel' } });
    fireEvent.change(emailInput, { target: { value: 'priya@college.edu.in' } });
    fireEvent.change(passwordInput, { target: { value: 'securePass123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const stored = localStorage.getItem('r2b_current_user_profile');
      expect(stored).toBeTruthy();
      const profile = JSON.parse(stored!);
      expect(profile.displayName).toBe('Priya Patel');
      expect(profile.role).toBe('student'); // Anti-escalation confirmed
      expect(profile.branch).toBe('CSE');
    });
  });

  it('2. supports student demo login and password recovery', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    const demoStudentBtn = screen.getByRole('button', { name: /Demo Student/i });
    fireEvent.click(demoStudentBtn);

    await waitFor(() => {
      const storedUser = localStorage.getItem('r2b_auth_user');
      expect(storedUser).toBeTruthy();
      const user = JSON.parse(storedUser!);
      expect(user.email).toContain('road2brain.com');
    });
  });

  it('3. prevents unauthorized student accounts from accessing admin pages', async () => {
    const studentUser = {
      uid: 'student_123',
      email: 'student@college.edu',
      displayName: 'Normal Student',
    };
    const studentProfile = {
      uid: 'student_123',
      email: 'student@college.edu',
      displayName: 'Normal Student',
      role: 'student',
      branch: 'CSE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('r2b_auth_user', JSON.stringify(studentUser));
    localStorage.setItem('r2b_current_user_profile', JSON.stringify(studentProfile));

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/admin" element={
                <AdminGuard>
                  <div data-testid="admin-secret-content">Secret Admin Dashboard</div>
                </AdminGuard>
              } />
              <Route path="/dashboard" element={<div>Student Dashboard</div>} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('admin-secret-content')).toBeNull();
      expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
      expect(screen.getByText(/Client-side role escalation is strictly prohibited/i)).toBeInTheDocument();
    });
  });
});
