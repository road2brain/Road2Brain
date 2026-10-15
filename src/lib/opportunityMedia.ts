import { OpportunityType } from '@/types';

/**
 * Standard category background illustration mapping.
 * Generated bespoke 3D Pixar/Blender-style illustrations for tech student opportunities:
 * - internship: student working on code at laptop in futuristic startup workspace
 * - hackathon: student celebrating with golden trophy on national competition stage
 * - fresher_job: tech graduate entering software corporate headquarters with badge & backpack
 * - scholarship: engineering student in university tech library with digital tablet & grant scroll
 * - student_program: student leaders collaborating on campus tech initiative
 */
export const OPPORTUNITY_TYPE_BACKGROUNDS: Record<OpportunityType, string> = {
  internship: '/images/internship-student.jpg',
  hackathon: '/images/hackathon-student.jpg',
  fresher_job: '/images/job-student.jpg',
  scholarship: '/images/scholarship-student.jpg',
  student_program: '/images/hackathon-student.jpg',
};

/**
 * Returns the resolved background image URL for any opportunity,
 * prioritizing any explicitly provided `backgroundImage` with fallback to category 3D art.
 */
export function getOpportunityBgImage(type: OpportunityType, customImage?: string): string {
  if (customImage && customImage.trim().length > 0) {
    return customImage;
  }
  return OPPORTUNITY_TYPE_BACKGROUNDS[type] || '/images/internship-student.jpg';
}
