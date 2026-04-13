<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getLatestForumPosts } from '@/api/api'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 400

const posts = ref([])
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
  if (meta.value.total === 0) return 'Tidak ada post.'
  const from = (currentPage.value - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage.value * PAGE_SIZE, meta.value.total)
  return `Menampilkan ${from}-${to} dari ${meta.value.total} post`
})

function initials(name) {
  const safe = String(name ?? '').trim()
  if (!safe) return 'U'
  return safe
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

async function loadPosts() {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await getLatestForumPosts({
      search: search.value.trim(),
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
}

onMounted(async () => {
  await loadPosts()
})

watch(search, () => {
  currentPage.value = 1
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    loadPosts()
  }, SEARCH_DEBOUNCE_MS)
})

watch(currentPage, async (newPage, oldPage) => {
  if (newPage === oldPage) return
  await loadPosts()
})

onBeforeUnmount(() => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
})
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold tracking-tight text-bslc-ink md:text-4xl">Forum</h1>
      <p class="mt-1 text-sm text-bslc-muted">Forum informasi mengenai pembelajaran, contact tim BSLC untuk berkontribusi</p>
    </div>

      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p class="text-sm text-bslc-muted">{{ pageInfo }}</p>
        <input
          v-model="search"
          type="text"
          placeholder="Cari judul post atau nama kontributor..."
          class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#19A89D] focus:ring-2 focus:ring-[#19A89D] sm:w-80"
        />
      </div>

    <p v-if="loading" class="text-sm text-bslc-muted">Memuat post forum...</p>
    <p v-else-if="errorMessage" class="text-sm text-red-700">{{ errorMessage }}</p>
    <p v-else-if="posts.length === 0" class="text-sm text-bslc-muted">Belum ada post forum.</p>

    <div v-else class="space-y-4">
      <article
        v-for="post in posts"
        :key="post.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="mb-4 flex items-start gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bslc-green/15 text-sm font-bold text-bslc-green"
          >
            {{ initials(post.contributor?.name) }}
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-bslc-ink">
              {{ post.contributor?.name ?? 'Kontributor' }}
            </p>
            <p class="text-xs text-bslc-muted">
              {{ post.year ? `Tahun ${post.year}` : 'Forum post' }}
            </p>
          </div>
        </div>

        <h2 class="text-lg font-semibold leading-snug text-bslc-ink">{{ post.title }}</h2>
        <p v-if="post.description" class="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {{ post.description }}
        </p>
          <a v-if="post.link" :href="post.link" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 text-sm font-semibold text-bslc-green underline-offset-2 hover:underline px-5 py-3 mt-2 border border-bslc-green rounded-lg">
            {{ post.link }}
          </a>
      </article>
    </div>

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
