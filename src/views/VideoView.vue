<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getLatestVideos } from '@/api/api'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 400

const videos = ref([])
const search = ref('')
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

async function loadVideos() {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await getLatestVideos({
      search: search.value.trim(),
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

onMounted(async () => {
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

      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p class="text-sm text-bslc-muted">{{ pageInfo }}</p>
        <input
          v-model="search"
          type="text"
          placeholder="Cari judul video atau kontributor..."
          class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] sm:w-72"
        />
      </div>

      <p v-if="loading" class="text-sm text-bslc-muted">Memuat video...</p>
      <p v-else-if="errorMessage" class="text-sm text-red-700">{{ errorMessage }}</p>
      <p v-else-if="videos.length === 0" class="text-sm text-bslc-muted">Belum ada video.</p>

      <ul v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <li
          v-for="vid in videos"
          :key="vid.id"
          class="rounded-xl border border-bslc-cream bg-bslc-white p-4"
        >
          <p class="text-xs font-medium text-bslc-muted">
            {{ vid.contributor?.name ?? 'Kontributor' }}{{ vid.year ? ` · ${vid.year}` : '' }}
          </p>
          <h3 class="mt-1 line-clamp-2 text-base font-semibold text-bslc-ink">
            {{ vid.title }}
          </h3>
          <p v-if="vid.description" class="mt-2 line-clamp-2 text-xs text-bslc-muted">
            {{ vid.description }}
          </p>
          <a
            v-if="vid.link"
            :href="vid.link"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex text-sm font-semibold text-bslc-green underline-offset-2 hover:underline"
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
