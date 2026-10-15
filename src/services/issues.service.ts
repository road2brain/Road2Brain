import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { IssueQuery, CreateIssueInput, IssueStatus } from '@/types';

const STORAGE_KEY = 'r2b_student_issues';

const SEED_ISSUES: IssueQuery[] = [
  {
    id: 'issue-seed-1',
    studentId: 'student_demo_1',
    studentName: 'Rohan Verma',
    studentEmail: 'rohan.v@vitstudent.ac.in',
    category: 'broken_link',
    subject: 'Google Summer 2027 SWE Intern careers link gives requisition notice',
    description: 'When clicking on the official apply link for Google SDE Summer Intern 2027, the page returned a "Job requisition moved" prompt. Could you please verify the new link?',
    opportunityTitle: 'Google Software Engineering Intern 2027',
    opportunityUrl: 'https://careers.google.com/jobs/results/',
    status: 'resolved',
    adminReply: 'Thank you for alerting our verification desk, Rohan! Google updated their APAC campus job requisition URL yesterday. We verified the new portal link and updated the listing on Road 2 Brain.',
    adminRepliedAt: '2026-10-14T14:30:00.000Z',
    adminRepliedBy: 'Verification Desk Admin',
    createdAt: '2026-10-14T12:10:00.000Z',
    updatedAt: '2026-10-14T14:30:00.000Z',
  },
  {
    id: 'issue-seed-2',
    studentId: 'student_demo_2',
    studentName: 'Priya Nair',
    studentEmail: 'priya.nair@mit.edu.in',
    category: 'internship_query',
    subject: 'Eligibility doubt: Is 2028 batch eligible for Amazon WOW Internship?',
    description: 'I am currently in 2nd year B.Tech CSE (graduating 2028). Is Amazon WOW open for 2028 batch female students or strictly 2027?',
    opportunityTitle: 'Amazon WOW Student Internship Program',
    status: 'resolved',
    adminReply: 'Hello Priya! Yes, Amazon WOW specifically invites female engineering students graduating in both 2027 and 2028 for their mentorship and 6-month intern tracks. You are fully eligible to apply.',
    adminRepliedAt: '2026-10-14T17:15:00.000Z',
    adminRepliedBy: 'Student Support Admin',
    createdAt: '2026-10-14T15:20:00.000Z',
    updatedAt: '2026-10-14T17:15:00.000Z',
  },
  {
    id: 'issue-seed-3',
    studentId: 'student_demo_3',
    studentName: 'Aditya Kulkarni',
    studentEmail: 'aditya.kulkarni@coep.ac.in',
    category: 'roadmap_doubt',
    subject: 'Guidance on Algorithms milestone before LeetCode contests',
    description: 'I am currently progressing through SDE Milestone 2 (Data Structures & Algorithms). Should I complete Graphs and Dynamic Programming before attempting Weekly contests, or solve contest problems alongside?',
    status: 'open',
    createdAt: '2026-10-15T06:40:00.000Z',
    updatedAt: '2026-10-15T06:40:00.000Z',
  }
];

function getLocalIssues(): IssueQuery[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ISSUES));
    return SEED_ISSUES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_ISSUES;
  }
}

function saveLocalIssues(items: IssueQuery[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export interface IssueFilters {
  studentId?: string;
  status?: IssueStatus | 'all';
  category?: string;
  search?: string;
}

export async function fetchIssues(filters: IssueFilters = {}): Promise<IssueQuery[]> {
  let list: IssueQuery[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'issues'));
      list = snap.docs.map(d => ({ id: d.id, ...d.data() } as IssueQuery));
    } catch (err) {
      console.warn('Firestore fetch issues failed, falling back to local:', err);
      list = getLocalIssues();
    }
  } else {
    list = getLocalIssues();
  }

  let filtered = [...list];

  if (filters.studentId) {
    filtered = filtered.filter(i => i.studentId === filters.studentId || i.studentEmail === filters.studentId);
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(i => i.status === filters.status);
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(i => i.category === filters.category);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(i => 
      i.subject.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.studentName.toLowerCase().includes(q) ||
      i.studentEmail.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return filtered;
}

export async function fetchStudentIssues(studentIdOrEmail: string): Promise<IssueQuery[]> {
  const all = await fetchIssues();
  return all.filter(i => i.studentId === studentIdOrEmail || i.studentEmail.toLowerCase() === studentIdOrEmail.toLowerCase());
}

export async function fetchAllIssues(): Promise<IssueQuery[]> {
  return fetchIssues();
}

export async function createIssue(input: CreateIssueInput): Promise<IssueQuery> {
  const newIssue: IssueQuery = {
    id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    studentId: input.studentId,
    studentName: input.studentName,
    studentEmail: input.studentEmail,
    category: input.category,
    subject: input.subject.trim(),
    description: input.description.trim(),
    opportunityTitle: input.opportunityTitle?.trim(),
    opportunityUrl: input.opportunityUrl?.trim(),
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'issues'), {
        ...newIssue,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      newIssue.id = docRef.id;
    } catch (err) {
      console.warn('Firestore create issue failed, saving locally:', err);
    }
  }

  // Always update local cache
  const local = getLocalIssues();
  local.unshift(newIssue);
  saveLocalIssues(local);

  return newIssue;
}

export async function replyToIssue(
  issueId: string, 
  reply: string, 
  adminName: string, 
  status: IssueStatus = 'resolved'
): Promise<IssueQuery> {
  const now = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'issues', issueId);
      await updateDoc(ref, {
        adminReply: reply.trim(),
        adminRepliedAt: serverTimestamp(),
        adminRepliedBy: adminName,
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore reply issue failed, saving locally:', err);
    }
  }

  // Update local storage
  const local = getLocalIssues();
  const index = local.findIndex(i => i.id === issueId);
  if (index === -1) {
    throw new Error('Issue not found');
  }

  local[index] = {
    ...local[index],
    adminReply: reply.trim(),
    adminRepliedAt: now,
    adminRepliedBy: adminName,
    status,
    updatedAt: now,
  };

  saveLocalIssues(local);
  return local[index];
}

export async function updateIssueStatus(issueId: string, status: IssueStatus): Promise<IssueQuery> {
  const now = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'issues', issueId);
      await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore update issue status failed, saving locally:', err);
    }
  }

  const local = getLocalIssues();
  const index = local.findIndex(i => i.id === issueId);
  if (index === -1) {
    throw new Error('Issue not found');
  }

  local[index] = {
    ...local[index],
    status,
    updatedAt: now,
  };

  saveLocalIssues(local);
  return local[index];
}
