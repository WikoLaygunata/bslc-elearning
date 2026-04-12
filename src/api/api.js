// const BASE_URL = 'https://api.cms.bslc.or.id/api/public'
const BASE_URL = 'http://localhost:8000/api/public'

async function parseList(res) {
  const data = await res.json()
  return Array.isArray(data) ? data : data.data ?? []
}

/**
 * Laravel paginator or { data: { data, current_page, ... } } from respond().
 */
async function parsePaginated(res) {
  const body = await res.json()
  const root = body.data ?? body
  let items = []
  if (Array.isArray(root.data)) items = root.data
  else if (Array.isArray(root)) items = root
  return {
    items,
    meta: {
      currentPage: root.current_page ?? 1,
      pageSize: root.per_page ?? items.length,
      total: root.total ?? items.length,
      lastPage: root.last_page ?? 1,
      from: root.from ?? null,
      to: root.to ?? null,
    },
    raw: body,
  }
}

/** Query string for ?search=&page=&pageSize= (used by videos, forum posts, course modules latest). */
function paginationQuery(options = {}) {
  const { search = '', page = 1, pageSize = 10 } = options
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))
  return params.toString()
}

/**
 * POST /variables — body JSON { names: string[] }
 * Backend: Variable::whereIn('name', $names)
 */
export async function getVariables(names) {
  const list = Array.isArray(names) ? names : []
  const res = await fetch(`${BASE_URL}/variables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ names: list }),
  })
  return parseList(res)
}

// --- E-Learning (public) ---

export async function getFaculties(search = '') {
  const q = search ? `?search=${encodeURIComponent(search)}` : ''
  const res = await fetch(`${BASE_URL}/faculties${q}`)
  return parseList(res)
}

export async function getMajors(facultyId, search = '') {
  const params = new URLSearchParams()
  if (facultyId != null && facultyId !== '') params.set('faculty_id', String(facultyId))
  if (search) params.set('search', search)
  const qs = params.toString()
  const res = await fetch(`${BASE_URL}/majors${qs ? `?${qs}` : ''}`)
  return parseList(res)
}

export async function getCourses(majorId, search = '') {
  const params = new URLSearchParams()
  if (majorId != null && majorId !== '') params.set('major_id', String(majorId))
  if (search) params.set('search', search)
  const qs = params.toString()
  const res = await fetch(`${BASE_URL}/courses${qs ? `?${qs}` : ''}`)
  return parseList(res)
}

export async function getCourseModules(courseId) {
  const params = new URLSearchParams()
  if (courseId != null && courseId !== '') params.set('course_id', String(courseId))
  const qs = params.toString()
  const res = await fetch(`${BASE_URL}/course-modules${qs ? `?${qs}` : ''}`)
  return parseList(res)
}

/**
 * GET /course-modules/latest — paginated; search by course name.
 * @param {{ search?: string, page?: number, pageSize?: number }} options
 */
export async function getLatestCourseModules(options = {}) {
  const qs = paginationQuery(options)
  const res = await fetch(`${BASE_URL}/course-modules/latest?${qs}`)
  return parsePaginated(res)
}

/** GET /contributors — active contributors + contributions_count */
export async function getContributors() {
  const res = await fetch(`${BASE_URL}/contributors`)
  return parseList(res)
}

/**
 * GET /videos/latest — latest active videos; search title or contributor name.
 * @param {{ search?: string, page?: number, pageSize?: number }} options
 */
export async function getLatestVideos(options = {}) {
  const qs = paginationQuery(options)
  const res = await fetch(`${BASE_URL}/videos/latest?${qs}`)
  return parsePaginated(res)
}

/**
 * GET /forum-posts/latest — latest forum posts; search title or contributor name.
 * @param {{ search?: string, page?: number, pageSize?: number }} options
 */
export async function getLatestForumPosts(options = {}) {
  const qs = paginationQuery(options)
  const res = await fetch(`${BASE_URL}/forum-posts/latest?${qs}`)
  return parsePaginated(res)
}
