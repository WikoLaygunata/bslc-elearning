<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getFaculties, getLatestForumPosts } from '@/api/api'
import { ensureExternalUrl } from '@/utils/url'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 400

const posts = ref([])
const faculties = ref([])
const search = ref('')
const selectedFaculty = ref('')
const selectedSemester = ref('')
const currentPage = ref(1)

const loading = ref(false)
const errorMessage = ref('')
const meta = ref({
  currentPage: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  lastPage: 1,
})

let searchDebounceTimer = null

const totalPages = computed(() => Math.max(1, meta.value.lastPage || 1))

const paginationItems = computed(() => {
  const lastPage = totalPages.value
  const current = currentPage.value

  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, index) => index + 1)

  const pages = new Set([1, lastPage, current, current - 1, current + 1])
  const sortedPages = [...pages]
    .filter((item) => item >= 1 && item <= lastPage)
    .sort((a, b) => a - b)
  const items = []

  sortedPages.forEach((item, index) => {
    if (index > 0 && item - sortedPages[index - 1] > 1) {
      items.push(`ellipsis-${item}`)
    }
    items.push(item)
  })

  return items
})

const pageInfo = computed(() => {
  if (meta.value.total === 0) return 'Tidak ada post.'
  const from = (currentPage.value - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage.value * PAGE_SIZE, meta.value.total)
  return `Menampilkan ${from}-${to} dari ${meta.value.total} post`
})

const semesterOptions = [1, 2, 3, 4, 5, 6, 7]

function initials(name) {
  const safe = String(name ?? '').trim()
  if (!safe) return 'U'
  return safe
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatImagePath(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  // return `http://localhost:8000/storage/${path.startsWith('/') ? '' : '/'}${path}`
  return `https://api.cms.bslc.or.id/storage/${path.startsWith('/') ? '' : '/'}${path}`
}

async function loadPosts() {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await getLatestForumPosts({
      search: search.value.trim(),
      facultyId: selectedFaculty.value,
      semester: selectedSemester.value,
      page: currentPage.value,
      pageSize: PAGE_SIZE,
    })
    posts.value = res.items
    meta.value = res.meta
  } catch (error) {
    errorMessage.value = 'Gagal memuat post forum.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  loadPosts()
}

async function applyFilters() {
  currentPage.value = 1
  await loadPosts()
}

onMounted(async () => {
  faculties.value = await getFaculties()
  await loadPosts()
})

watch(search, () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadPosts()
  }, SEARCH_DEBOUNCE_MS)
})

onBeforeUnmount(() => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
})
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold tracking-tight text-bslc-ink md:text-4xl">Forum</h1>
      <p class="mt-1 text-sm text-bslc-muted">Forum informasi mengenai pembelajaran, contact tim BSLC atau 
        <span class="text-bslc-green underline">
          <RouterLink to="/form" class="text-bslc-green underline">klik link ini</RouterLink>
        </span> untuk berkontribusi</p>
    </div>

    <div class="mb-5 rounded-2xl border border-bslc-cream/60 bg-white/70 p-4 backdrop-blur-sm shadow-sm sm:p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
          <select
            v-model="selectedFaculty"
            class="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] sm:w-auto sm:min-w-44"
          >
            <option value="">Semua Fakultas...</option>
            <option v-for="f in faculties" :key="f.id" :value="String(f.id)">
              {{ f.name }}
            </option>
          </select>
          <select
            v-model="selectedSemester"
            class="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] sm:w-auto sm:min-w-36"
          >
            <option value="">Semua Semester...</option>
            <option v-for="semester in semesterOptions" :key="semester" :value="String(semester)">
              Semester {{ semester }}
            </option>
          </select>
        </div>
        <button
          type="button"
          class="w-full rounded-xl bg-linear-to-r from-bslc-green to-emerald-600 px-8 py-2 text-sm font-semibold text-bslc-white! shadow-md shadow-bslc-green/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bslc-green/30 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md sm:w-auto shrink-0"
          :disabled="loading"
          @click="applyFilters"
        >
          Filter
        </button>
      </div>
    </div>
    
    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-bslc-muted ms-2">{{ pageInfo }}</p>
      <input
        v-model="search"
        type="text"
        placeholder="Cari judul post atau kontributor..."
        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] sm:w-80"
      />
    </div>

    <div v-if="loading" class="space-y-4 mt-3">
      <div v-for="i in 4" :key="i" class="rounded-2xl border border-bslc-cream/50 bg-white/60 p-6 shadow-sm">
        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200"></div>
            <div class="flex flex-col gap-1.5">
              <div class="h-4 w-32 animate-pulse rounded bg-slate-200"></div>
              <div class="h-3 w-20 animate-pulse rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
        <div class="mb-2 h-6 w-3/4 animate-pulse rounded bg-slate-200"></div>
        <div class="h-4 w-full animate-pulse rounded bg-slate-200"></div>
        <div class="mt-4 h-10 w-28 animate-pulse rounded-xl bg-slate-200"></div>
      </div>
    </div>
    <p v-else-if="errorMessage" class="text-sm text-red-700">{{ errorMessage }}</p>
    <p v-else-if="posts.length === 0" class="text-sm text-bslc-muted">Belum ada post forum.</p>

    <div v-else class="space-y-4 mt-3">
      <article
        v-for="post in posts"
        :key="post.id"
        class="group rounded-2xl border border-bslc-cream/50 bg-white/60 p-6 backdrop-blur-md shadow-sm transition-all duration-300"
      >
        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex min-w-0 items-start gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bslc-green/15 text-sm font-bold text-bslc-green"
            >
              <img
                v-if="post.contributor?.image_path"
                :src="formatImagePath(post.contributor.image_path)"
                :alt="post.contributor?.name ?? 'Kontributor'"
                class="h-full w-full rounded-full object-cover"
              />
              <span v-else>{{ initials(post.contributor?.name) }}</span>
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-bslc-ink">
                {{ post.contributor?.name ?? 'Kontributor' }}
              </p>
              <p class="text-xs text-bslc-muted">
                {{ formatDate(post.created_at) }}
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-1 sm:justify-end">
            <span
              v-if="post.faculty?.name"
              class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600"
            >
              {{ post.faculty.name }}
            </span>
            <span
              v-if="post.semester"
              class="rounded-full bg-bslc-green/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-bslc-green"
            >
              Semester {{ post.semester }}
            </span>
          </div>
        </div>

        <h2 class="text-lg font-semibold leading-snug text-bslc-ink">{{ post.title }}</h2>
        <p v-if="post.description" class="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {{ post.description }}
        </p>
          <a v-if="post.link" :href="ensureExternalUrl(post.link)" :title="post.link" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center justify-center rounded-xl bg-bslc-white px-5 py-2.5 text-sm font-semibold text-bslc-green border border-bslc-cream transition-all duration-200 hover:bg-bslc-green hover:text-bslc-white!">
            Buka Link
          </a>
      </article>
    </div>

    <div class="mt-6 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white font-bold text-slate-700 shadow-sm transition hover:border-bslc-green hover:text-bslc-green disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="currentPage <= 1 || loading"
        @click="goToPage(currentPage - 1)"
      >
        &lt;
      </button>
      <template v-for="item in paginationItems" :key="item">
        <span
          v-if="typeof item === 'string'"
          class="flex h-10 w-10 items-center justify-center text-sm font-semibold text-slate-400"
        >
          ...
        </span>
        <button
          v-else
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full border font-bold shadow-sm transition"
          :class="
            currentPage === item
              ? 'border-bslc-green bg-bslc-green text-white shadow-bslc-green/20'
              : 'border-slate-200 bg-white text-slate-700 hover:border-bslc-green hover:text-bslc-green'
          "
          :disabled="loading"
          @click="goToPage(item)"
        >
          {{ item }}
        </button>
      </template>
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white font-bold text-slate-700 shadow-sm transition hover:border-bslc-green hover:text-bslc-green disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="currentPage >= totalPages || loading"
        @click="goToPage(currentPage + 1)"
      >
        &gt;
      </button>
    </div>
  </section>
</template>
