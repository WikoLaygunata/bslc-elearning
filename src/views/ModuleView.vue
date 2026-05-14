<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  getCourses,
  getFaculties,
  getLatestCourseModules,
  getMajors,
} from '@/api/api'
import { ensureExternalUrl } from '@/utils/url'

const PAGE_SIZE = 10

const faculties = ref([])
const majors = ref([])
const courses = ref([])

const selectedFaculty = ref('')
const selectedMajor = ref('')
const selectedCourse = ref('')

const search = ref('')
const currentPage = ref(1)
const SEARCH_DEBOUNCE_MS = 400
let searchDebounceTimer = null

const loadingFilters = ref(false)
const loadingModules = ref(false)
const errorMessage = ref('')
const filterError = ref('')

const latestModules = ref([])
const latestMeta = ref({
  currentPage: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  lastPage: 1,
})

const displayedModules = computed(() => latestModules.value)

const totalItems = computed(() => latestMeta.value.total)

const totalPages = computed(() => {
  return Math.max(1, latestMeta.value.lastPage || 1)
})

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
  if (totalItems.value === 0) return 'Tidak ada data.'
  const from = (currentPage.value - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage.value * PAGE_SIZE, totalItems.value)
  return `Menampilkan ${from}-${to} dari ${totalItems.value} modul`
})

async function loadFaculties() {
  const data = await getFaculties()
  faculties.value = Array.isArray(data) ? data : []
}

async function loadMajorsByFaculty() {
  if (!selectedFaculty.value) {
    majors.value = []
    return
  }
  const data = await getMajors(selectedFaculty.value)
  majors.value = Array.isArray(data) ? data : []
}

async function loadCoursesByMajor() {
  if (!selectedMajor.value) {
    courses.value = []
    return
  }
  const data = await getCourses(selectedMajor.value)
  courses.value = Array.isArray(data) ? data : []
}

async function loadModules() {
  loadingModules.value = true
  errorMessage.value = ''
  try {
    const res = await getLatestCourseModules({
      search: search.value.trim(),
      page: currentPage.value,
      pageSize: PAGE_SIZE,
    })
    latestModules.value = res.items
    latestMeta.value = res.meta
  } catch (error) {
    errorMessage.value = 'Gagal memuat modul.'
    console.error(error)
  } finally {
    loadingModules.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
}

function applyCurriculumSearch() {
  filterError.value = ''
  if (!selectedFaculty.value || !selectedMajor.value || !selectedCourse.value) {
    filterError.value = 'Pilih fakultas, jurusan, dan mata kuliah terlebih dulu.'
    return
  }

  const selected = courses.value.find((course) => String(course.id) === selectedCourse.value)
  search.value = selected?.name ?? ''
}

onMounted(async () => {
  loadingFilters.value = true
  try {
    await loadFaculties()
    await loadModules()
  } catch (error) {
    errorMessage.value = 'Gagal memuat data awal.'
    console.error(error)
  } finally {
    loadingFilters.value = false
  }
})

watch(selectedFaculty, async () => {
  selectedMajor.value = ''
  selectedCourse.value = ''
  majors.value = []
  courses.value = []
  filterError.value = ''
  await loadMajorsByFaculty()
})

watch(selectedMajor, async () => {
  selectedCourse.value = ''
  courses.value = []
  filterError.value = ''
  await loadCoursesByMajor()
})

watch(selectedCourse, async () => {
  filterError.value = ''
})

watch(search, async () => {
  currentPage.value = 1
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    loadModules()
  }, SEARCH_DEBOUNCE_MS)
})

watch(currentPage, async (newPage, oldPage) => {
  if (newPage === oldPage) return
  await loadModules()
})

onBeforeUnmount(() => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold tracking-tight text-bslc-ink md:text-4xl">Course Module</h1>
      <p class="mt-1 text-sm text-bslc-muted">Modul pembelajaran dari tim BSLC</p>
    </div>

    <div class="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center gap-2">
        <h2 class="text-lg font-semibold text-slate-800">Cari Modul Berdasarkan Mata Kuliah</h2>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Fakultas
          </label>
          <select
            v-model="selectedFaculty"
            :disabled="loadingFilters"
            class="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] disabled:opacity-50"
          >
            <option value="">Semua Fakultas...</option>
            <option v-for="f in faculties" :key="f.id" :value="String(f.id)">
              {{ f.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Jurusan
          </label>
          <select
            v-model="selectedMajor"
            :disabled="!selectedFaculty || loadingFilters"
            class="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] disabled:opacity-50"
          >
            <option value="">Pilih Jurusan...</option>
            <option v-for="m in majors" :key="m.id" :value="String(m.id)">
              {{ m.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Mata Kuliah
          </label>
          <select
            v-model="selectedCourse"
            :disabled="!selectedMajor || loadingFilters"
            class="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] disabled:opacity-50"
          >
            <option value="">Pilih Mata Kuliah...</option>
            <option v-for="c in courses" :key="c.id" :value="String(c.id)">
              {{ c.name }}{{ c.course_modules_count !== undefined ? ` (${c.course_modules_count})` : '' }}
            </option>
          </select>
        </div>
      </div>
      <p v-if="filterError" class="mt-3 text-sm text-red-700">{{ filterError }}</p>
      <div class="mt-4 flex justify-end">
        <button
          type="button"
          class="rounded-lg bg-bslc-green px-4 py-2 text-sm font-semibold text-bslc-white transition hover:bg-bslc-green-dark"
          :disabled="loadingModules"
          @click="applyCurriculumSearch"
        >
          Filter Mata Kuliah
        </button>
      </div>
    </div>

      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-xl font-semibold text-bslc-ink">List Modul</h2>
          <p class="text-sm text-bslc-muted">{{ pageInfo }}</p>
        </div>
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama jurusan atau mata kuliah..."
          class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] sm:w-80"
        />
      </div>

      <p v-if="loadingModules" class="text-sm text-bslc-muted">Memuat modul...</p>
      <p v-else-if="errorMessage" class="text-sm text-red-700">{{ errorMessage }}</p>
      <p v-else-if="displayedModules.length === 0" class="text-sm text-bslc-muted">Belum ada modul.</p>

      <ul v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <li
          v-for="mod in displayedModules"
          :key="mod.id"
          class="flex h-full flex-col rounded-xl border border-bslc-cream bg-linear-to-b from-bslc-cream/20 to-bslc-white p-4"
        >
          <p class="text-xs font-medium uppercase tracking-wide text-bslc-green">
            {{ mod.type ?? 'Module' }}{{ mod.year ? ` · ${mod.year}` : '' }}
          </p>
          <h3 class="mt-1 line-clamp-2 text-base font-semibold text-bslc-ink">{{ mod.title }}</h3>
          <div class="mb-3 border-t border-slate-200">
          <p class="mt-1 text-sm font-medium text-bslc-muted">{{ mod.course?.name ?? '-' }}</p>
          <p class="mt-0.5 line-clamp-1 text-xs text-bslc-muted">
            {{ mod.course?.major?.name ?? '-' }}
          </p>
          <p v-if="mod.description" class="mt-2 line-clamp-2 text-xs text-bslc-muted">
            {{ mod.description }}
          </p>
        </div>
          <a
            v-if="mod.link"
            :href="ensureExternalUrl(mod.link)"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-auto inline-flex w-full justify-center rounded-lg border border-bslc-cream bg-linear-to-b from-bslc-cream/20 to-bslc-white px-3 py-2 pt-3 text-sm font-semibold text-bslc-green underline-offset-2 hover:underline"
          >
            Buka Modul
          </a>
        </li>
      </ul>

      <div class="mt-6 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white font-bold text-slate-700 shadow-sm transition hover:border-bslc-green hover:text-bslc-green disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage <= 1 || loadingModules"
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
            :disabled="loadingModules"
            @click="goToPage(item)"
          >
            {{ item }}
          </button>
        </template>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white font-bold text-slate-700 shadow-sm transition hover:border-bslc-green hover:text-bslc-green disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage >= totalPages || loadingModules"
          @click="goToPage(currentPage + 1)"
        >
          &gt;
        </button>
      </div>
  </section>
</template>
