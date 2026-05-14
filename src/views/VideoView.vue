<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getFaculties, getLatestVideos } from '@/api/api'
import { ensureExternalUrl } from '@/utils/url'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 400

const videos = ref([])
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
  if (meta.value.total === 0) return 'Tidak ada data.'
  const from = (currentPage.value - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage.value * PAGE_SIZE, meta.value.total)
  return `Menampilkan ${from}-${to} dari ${meta.value.total} video`
})

const semesterOptions = [1, 2, 3, 4, 5, 6, 7]

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

async function loadVideos() {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await getLatestVideos({
      search: search.value.trim(),
      facultyId: selectedFaculty.value,
      semester: selectedSemester.value,
      page: currentPage.value,
      pageSize: PAGE_SIZE,
    })
    videos.value = res.items
    meta.value = res.meta
  } catch (error) {
    errorMessage.value = 'Gagal memuat video.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  loadVideos()
}

async function applyFilters() {
  currentPage.value = 1
  await loadVideos()
}

onMounted(async () => {
  faculties.value = await getFaculties()
  await loadVideos()
})

watch(search, () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadVideos()
  }, SEARCH_DEBOUNCE_MS)
})

onBeforeUnmount(() => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold tracking-tight text-bslc-ink md:text-4xl">Video Learning</h1>
      <p class="mt-1 text-sm text-bslc-muted">Video pembelajaran dari tim BSLC dan volunteer</p>
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
      <p class="text-sm text-bslc-muted mb-2 ms-2">{{ pageInfo }}</p>
      <input
        v-model="search"
        type="text"
        placeholder="Cari judul video atau kontributor..."
        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] sm:w-80"
      />
    </div>
      <p v-if="loading" class="text-sm text-bslc-muted">Memuat video...</p>
      <p v-else-if="errorMessage" class="text-sm text-red-700">{{ errorMessage }}</p>
      <p v-else-if="videos.length === 0" class="text-sm text-bslc-muted">Belum ada video.</p>

      <ul v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-3">
        <li
          v-for="vid in videos"
          :key="vid.id"
          class="group flex h-full flex-col rounded-2xl border border-bslc-cream/50 bg-white/60 p-5 backdrop-blur-md shadow-sm transition-all duration-300"
        >
        <div class="flex items-center justify-between gap-2 text-xs font-medium text-bslc-muted">
          <p class="truncate">{{ vid.contributor?.name ?? 'Kontributor' }}</p>
          <p class="shrink-0">{{ formatDate(vid.created_at) }}</p>
        </div>
        <div class="mb-2 mt-1 flex flex-wrap gap-1">
          <span
            v-if="vid.faculty?.name"
            class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600"
          >
            {{ vid.faculty.name }}
          </span>
          <span
            v-if="vid.semester"
            class="rounded-full bg-bslc-green/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-bslc-green"
          >
            Semester {{ vid.semester }}
          </span>
        </div>
          <div class="mb-3 border-t border-slate-200">
            <h3 class="mt-1 line-clamp-2 text-base font-semibold text-bslc-ink">
              {{ vid.title }}
            </h3>
            <p v-if="vid.description" class="mt-2 line-clamp-2 text-xs text-bslc-muted">
              {{ vid.description }}
            </p>
          </div>
          <a
            v-if="vid.link"
            :href="ensureExternalUrl(vid.link)"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-auto inline-flex w-full justify-center rounded-xl border border-bslc-cream bg-bslc-white px-4 py-2.5 text-sm font-semibold text-bslc-green transition-all duration-200 hover:bg-bslc-green hover:text-bslc-white!"
          >
            Tonton Video
          </a>
        </li>
      </ul>

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
