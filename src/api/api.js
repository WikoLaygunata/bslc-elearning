const BASE_URL = 'https://api.cms.bslc.or.id/api/public'
// const BASE_URL = 'http://localhost:8000/api/public'
const CACHE_TTL_MS = 60 * 1000
const responseCache = new Map()

function cloneCachedData(data) {
  return JSON.parse(JSON.stringify(data))
}

async function fetchJson(url, options = {}) {
  const { useCache = true, ttlMs = CACHE_TTL_MS } = options
  const cacheKey = url

  if (useCache) {
    const cached = responseCache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) {
      return cloneCachedData(cached.data)
    }
  }

  const res = await fetch(url)
  const data = await res.json()

  if (useCache) {
    responseCache.set(cacheKey, {
      data: cloneCachedData(data),
      expiresAt: Date.now() + ttlMs,
    })
  }

  return data
}

function parseList(data) {
  return Array.isArray(data) ? data : data.data ?? []
}

/**
 * Laravel paginator or { data: { data, current_page, ... } } from respond().
 */
function parsePaginated(body) {
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
  const { search = '', facultyId = '', semester = '', page = 1, pageSize = 10 } = options
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (facultyId !== '' && facultyId != null) params.set('faculty_id', String(facultyId))
  if (semester !== '' && semester != null) params.set('semester', String(semester))
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
  const data = await fetchJson(`${BASE_URL}/faculties${q}`)
  return parseList(data)
}

export async function getMajors(facultyId, search = '') {
  const params = new URLSearchParams()
  if (facultyId != null && facultyId !== '') params.set('faculty_id', String(facultyId))
  if (search) params.set('search', search)
  const qs = params.toString()
  const data = await fetchJson(`${BASE_URL}/majors${qs ? `?${qs}` : ''}`)
  return parseList(data)
}

export async function getCourses(majorId, search = '') {
  const params = new URLSearchParams()
  if (majorId != null && majorId !== '') params.set('major_id', String(majorId))
  if (search) params.set('search', search)
  const qs = params.toString()
  const data = await fetchJson(`${BASE_URL}/courses${qs ? `?${qs}` : ''}`)
  return parseList(data)
}

export async function getCourseModules(courseId) {
  const params = new URLSearchParams()
  if (courseId != null && courseId !== '') params.set('course_id', String(courseId))
  const qs = params.toString()
  const data = await fetchJson(`${BASE_URL}/course-modules${qs ? `?${qs}` : ''}`)
  return parseList(data)
}

/**
 * GET /course-modules/latest — paginated; search by course name.
 * @param {{ search?: string, page?: number, pageSize?: number }} options
 */
export async function getLatestCourseModules(options = {}) {
  const qs = paginationQuery(options)
  const data = await fetchJson(`${BASE_URL}/course-modules/latest?${qs}`)
  return parsePaginated(data)
}

/**
 * GET /contributors — paginated active contributors + total_contributions
 * @param {{ page?: number, pageSize?: number }} options
 */
export async function getContributors(options = {}) {
  const qs = paginationQuery(options)
  const data = await fetchJson(`${BASE_URL}/contributors?${qs}`)
  return parsePaginated(data)
}

/**
 * GET /videos/latest — latest active videos; search title or contributor name.
 * @param {{ search?: string, page?: number, pageSize?: number }} options
 */
export async function getLatestVideos(options = {}) {
  const qs = paginationQuery(options)
  const data = await fetchJson(`${BASE_URL}/videos/latest?${qs}`)
  return parsePaginated(data)
}

/**
 * GET /forum-posts/latest — latest forum posts; search title or contributor name.
 * @param {{ search?: string, page?: number, pageSize?: number }} options
 */
export async function getLatestForumPosts(options = {}) {
  const qs = paginationQuery(options)
  const data = await fetchJson(`${BASE_URL}/forum-posts/latest?${qs}`)
  return parsePaginated(data)
}

export async function getHome(){
  const data = await fetchJson(`${BASE_URL}/e-learning-home`)
  return {
    async json() {
      return cloneCachedData(data)
    },
  }
}