import { describe, it, expect, beforeEach } from 'vitest';
import { 
  createIssue, 
  fetchIssues, 
  fetchStudentIssues, 
  replyToIssue, 
  updateIssueStatus 
} from '../src/services/issues.service';

describe('Student Query & Issue Resolution Desk Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. allows a student to raise a new query/issue with category and description', async () => {
    const newIssue = await createIssue({
      studentId: 'student_test_123',
      studentName: 'Aarav Patel',
      studentEmail: 'aarav@college.edu.in',
      category: 'broken_link',
      subject: 'Application URL 404 error on Microsoft SWE Intern',
      description: 'The apply button redirects to an error page instead of Microsoft careers portal.',
      opportunityTitle: 'Microsoft Software Engineering Intern',
      opportunityUrl: 'https://careers.microsoft.com/test'
    });

    expect(newIssue.id).toBeDefined();
    expect(newIssue.status).toBe('open');
    expect(newIssue.studentName).toBe('Aarav Patel');
    expect(newIssue.category).toBe('broken_link');

    // Verify it is returned in fetchIssues
    const all = await fetchIssues();
    const found = all.find(i => i.id === newIssue.id);
    expect(found).toBeDefined();
    expect(found?.subject).toContain('Application URL 404');
  });

  it('2. filters issues specifically for a given student email or uid', async () => {
    await createIssue({
      studentId: 'user_A',
      studentName: 'User A',
      studentEmail: 'usera@college.edu.in',
      category: 'internship_query',
      subject: 'Query from user A',
      description: 'Description A',
    });

    await createIssue({
      studentId: 'user_B',
      studentName: 'User B',
      studentEmail: 'userb@college.edu.in',
      category: 'course_issue',
      subject: 'Query from user B',
      description: 'Description B',
    });

    const userAIssues = await fetchStudentIssues('usera@college.edu.in');
    expect(userAIssues.some(i => i.studentEmail === 'usera@college.edu.in')).toBe(true);
    expect(userAIssues.every(i => i.studentEmail === 'usera@college.edu.in' || i.studentId === 'usera@college.edu.in')).toBe(true);
  });

  it('3. allows an administrator to publish a reply and resolve the student query', async () => {
    const created = await createIssue({
      studentId: 'student_789',
      studentName: 'Kavita Sen',
      studentEmail: 'kavita@college.edu.in',
      category: 'roadmap_doubt',
      subject: 'Doubts regarding AI/ML project milestones',
      description: 'Should I implement CNNs from scratch or use PyTorch first?',
    });

    expect(created.status).toBe('open');
    expect(created.adminReply).toBeUndefined();

    // Admin replies
    const replied = await replyToIssue(
      created.id,
      'We recommend building a small 2-layer perceptron from scratch in NumPy, then moving directly to PyTorch for CNN architectures.',
      'Admin Team (Road 2 Brain)',
      'resolved'
    );

    expect(replied.status).toBe('resolved');
    expect(replied.adminReply).toContain('NumPy');
    expect(replied.adminRepliedBy).toContain('Admin Team');
    expect(replied.adminRepliedAt).toBeDefined();

    // Verify status update in fetch
    const all = await fetchIssues({ status: 'resolved' });
    const match = all.find(i => i.id === created.id);
    expect(match).toBeDefined();
    expect(match?.adminReply).toContain('PyTorch');
  });
});
