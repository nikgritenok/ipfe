export const USER_ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  ADMIN: 'admin',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
