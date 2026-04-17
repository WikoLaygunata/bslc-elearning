<script setup>
import { computed, onMounted, ref } from 'vue'
import { getContributors } from '@/api/api'

const contributors = ref([])
const loading = ref(false)
const errorMessage = ref('')

const sortedContributors = computed(() =>
  [...contributors.value].sort((a, b) => (b.contributions_count ?? 0) - (a.contributions_count ?? 0)),
)

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

onMounted(async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await getContributors()
    contributors.value = Array.isArray(data) ? data : []
  } catch (error) {
    errorMessage.value = 'Gagal memuat data kontributor.'
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold tracking-tight text-bslc-ink md:text-4xl">Contributor</h1>
      <p class="mt-1 text-sm text-bslc-muted">List volunteer beserta total kontribusi</p>
    </div>

    <p v-if="loading" class="text-sm text-bslc-muted">Memuat data kontributor...</p>
    <p v-else-if="errorMessage" class="text-sm text-red-700">{{ errorMessage }}</p>
    <p v-else-if="sortedContributors.length === 0" class="text-sm text-bslc-muted">
      Belum ada data kontributor.
    </p>

    <ul v-else class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      <li v-for="item in sortedContributors" :key="item.id" class="flex flex-col gap-2.5 rounded-xl border border-bslc-cream bg-white p-3">
        
        <!-- Top: avatar + info centered -->
        <div class="flex flex-col items-center gap-2 text-center">
          <div class="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <img v-if="item.image_path" :src="formatImagePath(item.image_path)" :alt="item.name" class="h-full w-full object-cover" />
            <div v-else class="flex h-full w-full items-center justify-center text-xs font-medium text-bslc-green">
              {{ getInitials(item.name) }}
            </div>
          </div>
          <div class="w-full min-w-0">
            <p class="truncate text-[13px] font-medium text-bslc-ink">{{ item.name }}</p>
            <p class="truncate text-[11px] text-bslc-muted">{{ item.major || '-' }}</p>
            <p class="truncate text-[10px] text-slate-400">{{ item.region || '-' }}</p>
          </div>
        </div>

        <!-- Footer: stats + badge -->
        <div class="flex items-center justify-between border-t border-slate-100 pt-2">
          <div class="flex gap-2.5">
            <div class="flex flex-col items-center">
              <span class="text-[13px] font-medium text-bslc-ink">{{ item.videos_count ?? 0 }}</span>
              <span class="text-[10px] text-slate-400">Video</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[13px] font-medium text-bslc-ink">{{ item.forum_posts_count ?? 0 }}</span>
              <span class="text-[10px] text-slate-400">Forum</span>
            </div>
          </div>
          <span class="rounded-full bg-bslc-green/10 px-2.5 py-0.5 text-xs font-medium text-bslc-green">
            {{ item.contributions_count ?? 0 }}
          </span>
        </div>

      </li>
    </ul>
  </section>
</template>
