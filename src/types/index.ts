export type UserRole = 'student' | 'admin';

export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  collegeName?: string;
  branch?: string;
  graduationYear?: number;
  currentYear?: AcademicYear;
  interests?: string[];
  skills?: string[];
  targetCareerTrack?: string;
  selectedRoadmapId?: string;
  createdAt: string;
  updatedAt: string;
}

export type OpportunityType = 
  | 'internship' 
  | 'fresher_job' 
  | 'hackathon' 
  | 'scholarship' 
  | 'student_program';

export type OpportunityStatus = 'draft' | 'published' | 'expired' | 'archived';
export type VerificationStatus = 'draft' | 'pending_verification' | 'verified' | 'rejected';
export type LocationType = 'remote' | 'hybrid' | 'on-site';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  slug: string;
  type: OpportunityType;
  category: string;
  description: string;
  eligibility: string;
  academicYears: AcademicYear[];
  branches: string[];
  skills: string[];
  locationType: LocationType;
  location: string;
  stipendMin?: number;
  stipendMax?: number;
  currency?: string;
  applicationUrl: string;
  sourceUrl: string;
  deadline: string; // ISO format: YYYY-MM-DD
  status: OpportunityStatus;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CoursePriceType = 'free' | 'paid' | 'discounted';
export type CourseStatus = 'published' | 'draft' | 'archived';

export interface Course {
  id: string;
  title: string;
  provider: string;
  slug: string;
  category: string;
  level: CourseLevel;
  priceType: CoursePriceType;
  price: number;
  currency: string;
  durationHours?: number;
  certificateAvailable: boolean;
  officialUrl: string;
  priceVerifiedAt?: string;
  status: CourseStatus;
  verificationStatus: 'verified' | 'unverified';
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceLink {
  title: string;
  url: string;
  type?: 'article' | 'video' | 'doc' | 'course';
}

export interface Milestone {
  id: string;
  roadmapId: string;
  title: string;
  order: number;
  year: AcademicYear;
  description: string;
  skillTags: string[];
  estimatedHours: number;
  resourceUrls: ResourceLink[];
  projectIdea: string;
  isRequired: boolean;
}

export interface Roadmap {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  targetRoles: string[];
  targetBranches: string[];
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  milestones?: Milestone[];
}

export interface Bookmark {
  id: string;
  itemId: string;
  itemType: 'opportunity' | 'course';
  savedAt: string;
}

export interface RoadmapProgress {
  id: string;
  roadmapId: string;
  milestoneId: string;
  completed: boolean;
  completedAt?: string;
}

export interface VerificationLog {
  id: string;
  itemType: 'opportunity' | 'course';
  itemId: string;
  action: 'verified' | 'published' | 'rejected' | 'expired' | 'archived';
  adminUid: string;
  notes?: string;
  createdAt: string;
}

export type IssueCategory = 
  | 'internship_query' 
  | 'broken_link' 
  | 'roadmap_doubt' 
  | 'course_issue' 
  | 'account_support' 
  | 'feature_request' 
  | 'other';

export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface IssueQuery {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  category: IssueCategory;
  subject: string;
  description: string;
  opportunityTitle?: string;
  opportunityUrl?: string;
  status: IssueStatus;
  adminReply?: string;
  adminRepliedAt?: string;
  adminRepliedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueInput {
  studentId: string;
  studentName: string;
  studentEmail: string;
  category: IssueCategory;
  subject: string;
  description: string;
  opportunityTitle?: string;
  opportunityUrl?: string;
}
