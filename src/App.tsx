import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Layout } from '@/components/layout/Layout';
import { StudentGuard } from '@/components/common/StudentGuard';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Public pages
import { Home } from '@/pages/Home';
import { Opportunities } from '@/pages/Opportunities';
import { OpportunityDetails } from '@/pages/OpportunityDetails';
import { Courses } from '@/pages/Courses';
import { Roadmaps } from '@/pages/Roadmaps';
import { RoadmapDetails } from '@/pages/RoadmapDetails';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { RaiseIssue } from '@/pages/RaiseIssue';
import { NotFound } from '@/pages/NotFound';

// Protected student pages
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';

// Admin pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminOpportunities } from '@/pages/admin/AdminOpportunities';
import { AdminCourses } from '@/pages/admin/AdminCourses';
import { AdminRoadmaps } from '@/pages/admin/AdminRoadmaps';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminIssues } from '@/pages/admin/AdminIssues';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public and Student Shell Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="opportunities/:slug" element={<OpportunityDetails />} />
              <Route path="courses" element={<Courses />} />
              <Route path="roadmaps" element={<Roadmaps />} />
              <Route path="roadmaps/:slug" element={<RoadmapDetails />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="raise-issue" element={<RaiseIssue />} />

              {/* Protected Student Routes */}
              <Route element={<StudentGuard />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* 404 Catch All */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="opportunities" element={<AdminOpportunities />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="roadmaps" element={<AdminRoadmaps />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="issues" element={<AdminIssues />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
