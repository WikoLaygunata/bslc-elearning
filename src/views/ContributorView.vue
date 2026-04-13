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
  return `http://localhost:8000/api/storage/${path.startsWith('/') ? '' : '/'}${path}`
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

    <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="item in sortedContributors"
        :key="item.id"
        class="rounded-2xl border border-bslc-cream bg-white p-5 shadow-sm"
      >
        <div class="flex items-start gap-4">
          <div class="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <img
              v-if="item.image_path"
              :src="formatImagePath(item.image_path)"
              :alt="item.name"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-sm font-bold text-bslc-green">
              {{ getInitials(item.name) }}
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <h2 class="truncate text-base font-semibold text-bslc-ink">{{ item.name }}</h2>
            <p class="mt-1 text-sm text-bslc-muted">{{ item.major || '-' }}</p>
            <p class="text-xs text-slate-500">{{ item.region || '-' }}</p>
          </div>
        </div>

        <div class="mt-4 border-t border-slate-200 pt-4">
          <div class="group relative inline-flex items-center gap-2">
            <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Contributions</span>
            <span class="rounded-md bg-bslc-green/10 px-2 py-1 text-sm font-semibold text-bslc-green">
              {{ item.contributions_count ?? 0 }}
            </span>

            <div
              class="pointer-events-none absolute -top-2 left-full z-10 ml-2 w-40 -translate-y-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100"
            >
              <p>Videos: {{ item.videos_count ?? 0 }}</p>
              <p>Forum posts: {{ item.forum_posts_count ?? 0 }}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
