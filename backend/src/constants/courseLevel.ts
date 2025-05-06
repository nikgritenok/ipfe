export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const

export type CourseLevel = (typeof COURSE_LEVELS)[keyof typeof COURSE_LEVELS]
