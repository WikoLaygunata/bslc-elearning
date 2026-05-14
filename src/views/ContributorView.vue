<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { getContributors } from '@/api/api'

const PAGE_SIZE = 20
const currentPage = ref(1)

const contributors = ref([])
const loading = ref(false)
const errorMessage = ref('')
const meta = ref({
  currentPage: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  lastPage: 1,
})

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

function goToPage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  loadContributors()
}

function getInitials(name) {
  const safe = String(name ?? '').trim()
  if (!safe) return 'U'
  return safe
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatImagePath(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  // return `http://localhost:8000/storage/${path.startsWith('/') ? '' : '/'}${path}`
  return `https://api.cms.bslc.or.id/storage/${path.startsWith('/') ? '' : '/'}${path}`
}

function getBatchBadge(nim) {
  const digits = String(nim ?? '').replace(/\D/g, '')
  if (digits.length < 2) return ''
  return `B${digits.slice(0, 2)}`
}

async function loadContributors() {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await getContributors({
      page: currentPage.value,
      pageSize: PAGE_SIZE,
    })
    contributors.value = data.items
    meta.value = data.meta
  } catch (error) {
    errorMessage.value = 'Gagal memuat data kontributor.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadContributors()
})

</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold tracking-tight text-bslc-ink md:text-4xl">Contributor</h1>
      <p class="mt-1 text-sm text-bslc-muted">List volunteer beserta total kontribusi</p>
    </div>

    <ul v-if="loading" class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 mt-3">
      <li v-for="i in 8" :key="i" class="relative flex flex-col overflow-hidden rounded-2xl border border-bslc-cream/50 bg-white/60 shadow-sm">
        <div class="absolute inset-x-0 top-0 h-14 animate-pulse bg-slate-200"></div>
        <div class="relative z-10 mt-5 flex flex-col items-center gap-2 px-4 text-center">
          <div class="h-16 w-16 shrink-0 animate-pulse rounded-full border-4 border-white bg-slate-300"></div>
          <div class="mt-1 flex w-full flex-col items-center gap-1.5">
            <div class="h-4 w-3/4 animate-pulse rounded bg-slate-200"></div>
            <div class="h-3 w-1/2 animate-pulse rounded bg-slate-200"></div>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between border-t border-slate-100/60 bg-white/40 px-5 py-3">
          <div class="flex gap-4">
            <div class="h-8 w-8 animate-pulse rounded bg-slate-200"></div>
            <div class="h-8 w-8 animate-pulse rounded bg-slate-200"></div>
          </div>
          <div class="h-6 w-10 animate-pulse rounded bg-slate-200"></div>
        </div>
      </li>
    </ul>
    <p v-else-if="errorMessage" class="text-sm text-red-700">{{ errorMessage }}</p>
    <p v-else-if="contributors.length === 0" class="text-sm text-bslc-muted">
      Belum ada data kontributor.
    </p>

    <ul v-else class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      <li v-for="item in contributors" :key="item.id" class="group relative flex flex-col overflow-hidden rounded-2xl border border-bslc-cream/50 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-bslc-green/10">
        
        <!-- Cover Background (Abstract Gradient) -->
        <div class="absolute inset-x-0 top-0 h-14 bg-linear-to-r from-bslc-green/10 via-emerald-400/10 to-bslc-cream/10 transition-opacity duration-300 group-hover:opacity-80"></div>

        <span
          v-if="getBatchBadge(item.nim)"
          class="absolute left-3 top-3 z-10 rounded-full border border-white/40 bg-white/70 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold tracking-wide text-bslc-green shadow-xs"
        >
          {{ getBatchBadge(item.nim) }}
        </span>
        
        <!-- Top: avatar + info centered -->
        <div class="relative z-10 mt-5 flex flex-col items-center gap-2 px-4 text-center">
          <div class="h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-bslc-cream/50">
            <img v-if="item.image_path" :src="formatImagePath(item.image_path)" :alt="item.name" class="h-full w-full object-cover" />
            <div v-else class="flex h-full w-full items-center justify-center bg-bslc-green/10 text-sm font-bold text-bslc-green">
              {{ getInitials(item.name) }}
            </div>
          </div>
          <div class="w-full min-w-0 mt-1">
            <p class="truncate text-sm font-bold text-bslc-ink transition-colors group-hover:text-bslc-green">{{ item.name }}</p>
            <p class="truncate text-[11px] font-medium text-bslc-muted">{{ item.major || '-' }}</p>
            <p class="truncate text-[10px] text-slate-400 mt-0.5">{{ item.region || '-' }}</p>
          </div>
        </div>

        <!-- Footer: stats + badge -->
        <div class="mt-4 flex items-center justify-between border-t border-slate-100/60 bg-white/40 px-5 py-3">
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <span class="text-sm font-bold text-bslc-ink">{{ item.videos_count ?? 0 }}</span>
              <span class="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Video</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-sm font-bold text-bslc-ink">{{ item.forum_posts_count ?? 0 }}</span>
              <span class="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Forum</span>
            </div>
          </div>
          <div class="flex flex-col items-end">
             <span class="rounded-lg bg-bslc-green px-3 py-1 text-xs font-bold text-white shadow-sm shadow-bslc-green/20">
               {{ item.total_contributions ?? 0 }}
             </span>
          </div>
        </div>
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
