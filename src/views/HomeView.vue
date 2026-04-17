<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getHome } from '@/api/api'

const latestModules = ref([])
const latestVideos = ref([])
const loadingModules = ref(true)
const loadingVideos = ref(true)
const errorModules = ref('')
const errorVideos = ref('')

onMounted(async () => {
  try {
    const res = await getHome()
    const items = await res.json()
    latestModules.value = items.latest_course_modules
    latestVideos.value = items.latest_videos
  } catch (e) {
    errorModules.value = 'Gagal memuat modul.'
    console.error(e)
  } finally {
    loadingModules.value = false
    loadingVideos.value = false
  }
})

</script>

<template>
  <div class="container-home bg-linear-to-b from-bslc-cream/35 via-bslc-white to-bslc-white">
    <section class="home-top mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-10 pt-8 md:gap-10 md:pb-12 md:pt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-6 lg:pb-16 lg:pt-14">
      <div class="title-right-home w-full max-w-xl space-y-6 md:space-y-8 lg:max-w-none lg:flex-1">
        <div class="space-y-2 md:space-y-3">
          <p
            class="title-1 text-2xl font-bold leading-tight text-bslc-ink md:text-3xl lg:text-4xl"
          >
            Hi Binusian!
          </p>
          <p
            class="title-2 text-base leading-relaxed text-bslc-muted md:text-lg lg:text-xl"
          >
            Let's enhance your knowledge with
            <span class="title-green font-bold text-bslc-green">E-Learning BSLC</span>!
          </p>
        </div>

        <div class="title-linear w-full max-w-lg">
          <div
            class="container-linear flex divide-x divide-bslc-cream overflow-hidden rounded-lg border border-bslc-cream bg-bslc-white shadow-sm"
          >
            <div
              class="linear-left flex flex-1 flex-col items-center justify-center py-3.5 md:py-4 lg:py-5"
            >
              <p
                class="green-bold text-lg font-bold text-bslc-green md:text-xl lg:text-2xl"
              >
                100%
              </p>
              <p
                class="regular mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-bslc-muted md:mt-1 md:text-xs"
              >
                FREE
              </p>
            </div>
            <div
              class="linear-mid flex flex-1 flex-col items-center justify-center py-3.5 md:py-4 lg:py-5"
            >
              <p
                class="green-bold text-lg font-bold text-bslc-green md:text-xl lg:text-2xl"
              >
                50+
              </p>
              <p
                class="regular mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-bslc-muted md:mt-1 md:text-xs"
              >
                MODULES
              </p>
            </div>
            <div
              class="linear-right flex flex-1 flex-col items-center justify-center py-3.5 md:py-4 lg:py-5"
            >
              <p
                class="green-bold text-lg font-bold text-bslc-green md:text-xl lg:text-2xl"
              >
                10+
              </p>
              <p
                class="regular mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-bslc-muted md:mt-1 md:text-xs"
              >
                MAJORS
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="title-left flex w-full shrink-0 justify-center lg:w-auto lg:max-w-md lg:justify-end xl:max-w-lg"
      >
        <img
          class="img-home h-auto w-full max-w-[280px] md:max-w-xs lg:max-w-none"
          src="/Image-Home.svg"
          alt=""
          width="467"
          height="468"
        />
      </div>
    </section>

    <!-- Latest modules -->
    <section class="border-t border-bslc-cream/80 bg-bslc-white py-12 md:py-14">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-bslc-ink md:text-3xl">Latest modules</h2>
            <p class="mt-1 text-sm text-bslc-muted">Modul pembelajaran terbaru</p>
          </div>
          <RouterLink
            :to="{ name: 'module' }"
            class="inline-flex w-fit items-center rounded-lg border border-bslc-green bg-bslc-green px-4 py-2 text-sm font-semibold text-bslc-white! transition hover:bg-bslc-green-dark hover:text-bslc-white! focus:text-bslc-white!"
          >
            See more
          </RouterLink>
        </div>

        <p v-if="loadingModules" class="text-sm text-bslc-muted">Memuat modul…</p>
        <p v-else-if="errorModules" class="text-sm text-red-700">{{ errorModules }}</p>
        <p v-else-if="latestModules.length === 0" class="text-sm text-bslc-muted">
          Belum ada modul.
        </p>
        <ul
          v-else
          class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          <li
            v-for="mod in latestModules"
            :key="mod.id"
            class="flex flex-col rounded-xl border border-bslc-cream bg-linear-to-b from-bslc-cream/20 to-bslc-white p-4 shadow-sm"
          >
            <p class="text-xs font-medium uppercase tracking-wide text-bslc-green">
              {{ mod.type ?? 'Module' }}{{ mod.year ? ` · ${mod.year}` : '' }}
            </p>
            <h3 class="mt-1 line-clamp-2 text-base font-semibold text-bslc-ink">
              {{ mod.title }}
            </h3>
            <p class="mt-1 text-sm font-medium text-bslc-muted">
              {{ mod.course?.name ?? '—' }}
            </p>
            <p class="mt-0.5 line-clamp-1 text-xs text-bslc-muted">
              {{ mod.course?.major?.name ?? '—' }}
            </p>
            <p v-if="mod.description" class="mt-2 line-clamp-2 text-xs text-bslc-muted">
              {{ mod.description }}
            </p>
              <a
                v-if="mod.link"
                :href="mod.link"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 inline-flex text-sm font-semibold w-full justify-center text-bslc-green underline-offset-2 hover:underline px-3 py-2 border border-bslc-cream rounded-lg bg-linear-to-b from-bslc-cream/20 to-bslc-white"
              >
                Buka Modul
              </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- Latest videos -->
    <section class="border-t border-bslc-cream/80 bg-linear-to-b from-bslc-cream/15 to-bslc-white py-12 md:py-14">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-bslc-ink md:text-3xl">Latest videos</h2>
            <p class="mt-1 text-sm text-bslc-muted">Video terbaru dari kontributor</p>
          </div>
          <RouterLink
            :to="{ name: 'video' }"
            class="inline-flex w-fit items-center rounded-lg border border-bslc-green bg-bslc-green px-4 py-2 text-sm font-semibold text-bslc-white! transition hover:bg-bslc-green-dark hover:text-bslc-white! focus:text-bslc-white!"
          >
            See more
          </RouterLink>
        </div>

        <p v-if="loadingVideos" class="text-sm text-bslc-muted">Memuat video…</p>
        <p v-else-if="errorVideos" class="text-sm text-red-700">{{ errorVideos }}</p>
        <p v-else-if="latestVideos.length === 0" class="text-sm text-bslc-muted">
          Belum ada video.
        </p>
        <ul
          v-else
          class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          <li
            v-for="vid in latestVideos"
            :key="vid.id"
            class="flex flex-col rounded-xl border border-bslc-cream bg-bslc-white p-4 shadow-sm"
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
              class="mt-3 inline-flex text-sm font-semibold w-full justify-center text-bslc-green underline-offset-2 hover:underline px-3 py-2 border border-bslc-cream rounded-lg bg-linear-to-b from-bslc-cream/20 to-bslc-white"
            >
              Tonton Video
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
