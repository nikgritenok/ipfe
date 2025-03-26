export interface Tag {
  _id: string
  name: string
}

export interface Course {
  _id: string
  title: string
  slug: string
  description?: string
  price: number
  image: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  published: boolean
  author: {
    _id: string
    firstName: string
    lastName: string
  }
  tags: Tag[]
  createdAt: string
}

export interface CourseQuery {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  category?: string
  level?: string
  search?: string
  tag?: string
  published?: boolean
}

export interface CourseResponse {
  status: string
  results: number
  total: number
  totalPages: number
  currentPage: number
  data: {
    courses: Course[]
  }
}

export interface CourseFormData {
  title: string
  description: string
  price: number
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  image?: File
}
