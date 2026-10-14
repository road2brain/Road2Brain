import { describe, it, expect } from 'vitest';
import { isValidUrl } from '@/lib/utils';
import { updateUserProfile, createUserProfile } from '@/services/user.service';
import fs from 'fs';
import path from 'path';

describe('Security & Input Validation Tests', () => {
  it('12a. strictly validates URL schemes to prevent XSS / javascript: injection', () => {
    // Valid URLs
    expect(isValidUrl('https://careers.google.com')).toBe(true);
    expect(isValidUrl('http://sih.gov.in')).toBe(true);
    expect(isValidUrl('https://www.amazon.jobs/en/landing_pages/wow-india')).toBe(true);

    // Malicious or invalid protocols
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isValidUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isValidUrl('file:///etc/passwd')).toBe(false);
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('random-text-not-a-url')).toBe(false);
  });

  it('12b. enforces anti-escalation security in client-side profile updates', async () => {
    localStorage.clear();

    const studentUid = 'student_attempting_exploit';
    await createUserProfile({
      uid: studentUid,
      email: 'student@college.edu',
      displayName: 'Normal Student',
      role: 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Attempt to escalate role to 'admin'
    const updated = await updateUserProfile(studentUid, {
      role: 'admin' as any,
      displayName: 'Exploiter',
    });

    // Role MUST remain 'student'
    expect(updated.role).toBe('student');
    expect(updated.displayName).toBe('Exploiter');

    const stored = JSON.parse(localStorage.getItem('r2b_current_user_profile')!);
    expect(stored.role).toBe('student');
  });

  it('12c. verifies firestore.rules file structure and security constraints', () => {
    const rulesPath = path.resolve(__dirname, '../firestore.rules');
    expect(fs.existsSync(rulesPath)).toBe(true);

    const rulesContent = fs.readFileSync(rulesPath, 'utf8');

    // Verify rules match Section 9 & 10 requirements
    expect(rulesContent).toContain("rules_version = '2'");
    expect(rulesContent).toContain('function isAdmin()');
    expect(rulesContent).toContain('function isOwner(userId)');
    expect(rulesContent).toContain('request.resource.data.role == resource.data.role');
    expect(rulesContent).toContain("resource.data.status == 'published'");
    expect(rulesContent).toContain("resource.data.verificationStatus == 'verified'");
    expect(rulesContent).toContain('allow update, delete: if false'); // audit log immutability
  });
});
