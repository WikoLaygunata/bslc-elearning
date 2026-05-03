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
  currentPage.value = 1
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    loadVideos()
  }, SEARCH_DEBOUNCE_MS)
})

watch(currentPage, async (newPage, oldPage) => {
  if (newPage === oldPage) return
  await loadVideos()
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

    <div class="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
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
        <button
          type="button"
          class="w-full rounded-lg bg-bslc-green px-8 py-2 text-xs font-semibold text-bslc-white transition hover:bg-bslc-green-dark disabled:opacity-50 sm:w-auto"
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

      <ul v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <li
          v-for="vid in videos"
          :key="vid.id"
          class="flex h-full flex-col rounded-xl border border-bslc-cream bg-bslc-white p-4"
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
            class="mt-auto inline-flex w-full justify-center rounded-lg border border-bslc-cream bg-linear-to-b from-bslc-cream/20 to-bslc-white px-3 py-2 pt-3 text-sm font-semibold text-bslc-green underline-offset-2 hover:underline"
          >
            Tonton video
          </a>
        </li>
      </ul>

      <div class="mt-6 flex justify-end border-t border-slate-200 pt-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-600">Page {{ currentPage }} / {{ totalPages }}</span>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage <= 1 || loading"
            @click="goToPage(currentPage - 1)"
          >
            <p>&lt;</p>
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="currentPage >= totalPages || loading"
            @click="goToPage(currentPage + 1)"
          >
            <p>&gt;</p>
          </button>
        </div>
    </div>
  </section>
</template>
