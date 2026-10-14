import { describe, it, expect, beforeEach } from 'vitest';
import { 
  fetchOpportunities, 
  fetchOpportunityBySlug,
  createOpportunity,
  verifyOpportunity,
  publishOpportunity,
  expireOpportunity
} from '@/services/opportunities.service';
import { isExpired, isValidUrl } from '@/lib/utils';

describe('Opportunity Service & Verification System Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('4. loads verified opportunities and filters by type and academic year', async () => {
    const all = await fetchOpportunities();
    expect(all.length).toBeGreaterThan(0);
    // All public opportunities must be published & verified
    all.forEach(opp => {
      expect(opp.status).toBe('published');
      expect(opp.verificationStatus).toBe('verified');
      expect(isExpired(opp.deadline)).toBe(false);
    });

    const internships = await fetchOpportunities({ type: 'internship' });
    internships.forEach(opp => {
      expect(opp.type).toBe('internship');
    });

    const secondYearOpps = await fetchOpportunities({ academicYear: '2nd Year' });
    secondYearOpps.forEach(opp => {
      expect(opp.academicYears).toContain('2nd Year');
    });
  });

  it('5. fetches opportunity by slug correctly', async () => {
    const opp = await fetchOpportunityBySlug('google-software-engineering-intern-2027');
    expect(opp).not.toBeNull();
    expect(opp?.company).toBe('Google');
    expect(opp?.verificationStatus).toBe('verified');
  });

  it('10. enforces Content Verification lifecycle: cannot publish without verification', async () => {
    const adminUid = 'admin_tester_1';
    
    // 1. Create a draft opportunity
    const newOpp = await createOpportunity({
      title: 'Systems Engineering Intern',
      company: 'Test Org',
      type: 'internship',
      category: 'Systems',
      description: 'Internship description',
      eligibility: '3rd year students',
      academicYears: ['3rd Year'],
      branches: ['CSE', 'IT'],
      skills: ['C++', 'Linux'],
      locationType: 'on-site',
      location: 'Bengaluru',
      applicationUrl: 'https://company.com/apply',
      sourceUrl: 'https://company.com/official-notice',
      deadline: '2027-01-01',
    }, adminUid);

    expect(newOpp.status).toBe('draft');
    expect(newOpp.verificationStatus).toBe('pending_verification');

    // 2. Attempting to publish an unverified listing must fail
    await expect(publishOpportunity(newOpp.id, adminUid)).rejects.toThrow(
      /Cannot publish an unverified listing/i
    );

    // 3. Admin verifies official source
    const verified = await verifyOpportunity(newOpp.id, adminUid, 'Official circular verified.');
    expect(verified.verificationStatus).toBe('verified');
    expect(verified.verifiedBy).toBe(adminUid);
    expect(verified.verifiedAt).toBeTruthy();

    // 4. Now publishing succeeds!
    const published = await publishOpportunity(newOpp.id, adminUid);
    expect(published.status).toBe('published');
  });

  it('13. correctly detects expired listings and prevents them from appearing in active feed', async () => {
    expect(isExpired('2020-01-01')).toBe(true);
    expect(isExpired('2029-12-31')).toBe(false);

    // Fetching without includeExpired should not return expired listings
    const active = await fetchOpportunities({ includeExpired: false });
    active.forEach(opp => {
      expect(isExpired(opp.deadline)).toBe(false);
    });
  });
});
