<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getHome } from '@/api/api'
import { ensureExternalUrl } from '@/utils/url'

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
</script>

<template>
  <div class="container-home bg-white">
    <section class="home-top relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="animate-blob absolute -left-16 top-8 h-44 w-44 rounded-full bg-bslc-green/15 blur-3xl"></div>
        <div class="animate-blob-slow absolute -right-16 top-0 h-56 w-56 rounded-full bg-bslc-cream/70 blur-3xl"></div>
        <div class="animate-blob absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-bslc-green/10 blur-3xl" style="animation-delay: 2s;"></div>
        <div class="animate-blob-slow absolute right-1/4 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-bslc-cream/40 blur-2xl" style="animation-delay: 4s;"></div>
      </div>
      <div class="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-10 pt-8 md:gap-10 md:pb-12 md:pt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-6 lg:pb-16 lg:pt-14">
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
            <span class="title-green font-extrabold text-transparent bg-clip-text bg-linear-to-r from-bslc-green to-emerald-500">E-Learning BSLC</span>!
          </p>
        </div>

        <div class="title-linear w-full max-w-lg mt-2">
          <div class="rounded-xl bg-linear-to-r from-bslc-green/60 via-bslc-green/80 to-emerald-400 p-[1.5px] shadow-lg shadow-bslc-green/10 transition-transform duration-300 hover:-translate-y-1">
            <div
              class="container-linear flex divide-x divide-bslc-cream/30 overflow-hidden rounded-[calc(var(--radius-xl)-1.5px)] bg-bslc-white/95 backdrop-blur-sm"
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
      </div>

        <div
          class="title-left flex w-full shrink-0 justify-center lg:w-auto lg:max-w-md lg:justify-end xl:max-w-lg"
        >
          <img
            class="img-home animate-float h-auto w-full max-w-[280px] md:max-w-xs lg:max-w-none drop-shadow-xl py-8"
            src="/Image-Home.svg"
            alt=""
            width="467"
            height="468"
          />
        </div>
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
            class="inline-flex w-fit items-center rounded-xl bg-linear-to-r from-bslc-green to-emerald-600 px-5 py-2.5 text-sm font-semibold text-bslc-white! shadow-md shadow-bslc-green/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bslc-green/30"
          >
            See more
          </RouterLink>
        </div>

        <ul v-if="loadingModules" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <li v-for="i in 4" :key="i" class="flex h-full min-h-[160px] flex-col rounded-2xl border border-bslc-cream/50 bg-white/60 p-5 shadow-sm">
            <div class="mb-3 h-3 w-20 animate-pulse rounded-full bg-slate-200"></div>
            <div class="mb-2 h-5 w-3/4 animate-pulse rounded-md bg-slate-200"></div>
            <div class="mb-4 h-4 w-1/2 animate-pulse rounded-md bg-slate-200"></div>
            <div class="mt-auto h-10 w-full animate-pulse rounded-xl bg-slate-200"></div>
          </li>
        </ul>
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
            class="group flex h-full flex-col rounded-2xl border border-bslc-cream/50 bg-white/60 p-5 backdrop-blur-md shadow-sm transition-all duration-300"
          >
            <p class="text-xs font-medium uppercase tracking-wide text-bslc-green">
              {{ mod.type ?? 'Module' }}{{ mod.year ? ` · ${mod.year}` : '' }}
            </p>
            <h3 class="mt-1 line-clamp-2 text-base font-semibold text-bslc-ink">
              {{ mod.title }}
            </h3>
            <div class="mb-3 border-t border-slate-200">
            <p class="mt-1 text-sm font-medium text-bslc-muted">
              {{ mod.course?.name ?? '—' }}
            </p>
              <p class="mt-0.5 line-clamp-1 text-xs text-bslc-muted">
                {{ mod.course?.major?.name ?? '—' }}
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
                class="mt-auto inline-flex w-full justify-center rounded-xl border border-bslc-cream bg-bslc-white px-4 py-2.5 text-sm font-semibold text-bslc-green transition-all duration-200 hover:bg-bslc-green hover:text-bslc-white!"
              >
                Buka Modul
              </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- Latest videos -->
    <section class="border-t border-bslc-cream/80 bg-slate-50/50 py-12 md:py-14">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-bslc-ink md:text-3xl">Latest videos</h2>
            <p class="mt-1 text-sm text-bslc-muted">Video terbaru dari kontributor</p>
          </div>
          <RouterLink
            :to="{ name: 'video' }"
            class="inline-flex w-fit items-center rounded-xl bg-linear-to-r from-bslc-green to-emerald-600 px-5 py-2.5 text-sm font-semibold text-bslc-white! shadow-md shadow-bslc-green/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bslc-green/30"
          >
            See more
          </RouterLink>
        </div>

        <ul v-if="loadingVideos" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <li v-for="i in 4" :key="i" class="flex h-full min-h-[150px] flex-col rounded-2xl border border-bslc-cream/50 bg-white/60 p-5 shadow-sm">
            <div class="mb-3 flex items-center justify-between">
              <div class="h-3 w-20 animate-pulse rounded-full bg-slate-200"></div>
              <div class="h-3 w-16 animate-pulse rounded-full bg-slate-200"></div>
            </div>
            <div class="mb-2 h-5 w-full animate-pulse rounded-md bg-slate-200"></div>
            <div class="mb-4 h-4 w-2/3 animate-pulse rounded-md bg-slate-200"></div>
            <div class="mt-auto h-10 w-full animate-pulse rounded-xl bg-slate-200"></div>
          </li>
        </ul>
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
            class="group flex h-full flex-col rounded-2xl border border-bslc-cream/50 bg-white/60 p-5 backdrop-blur-md shadow-sm transition-all duration-300"
          >
          <div class="flex items-center justify-between gap-2 text-xs font-medium text-bslc-muted">
            <p class="truncate">{{ vid.contributor?.name ?? 'Kontributor' }}</p>
            <!-- <p class="shrink-0">{{ formatDate(vid.created_at) }}</p> -->
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
      </div>
    </section>

    <!-- Contribution CTA -->
    <section class="border-t border-bslc-cream/80 bg-bslc-white py-14 md:py-18">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          class="rounded-2xl border border-bslc-cream bg-linear-to-r from-bslc-cream/20 via-bslc-white to-bslc-cream/10 px-8 shadow-sm md:px-10 py-12"
        >
          <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div class="max-w-2xl">
              <h2 class="text-2xl font-bold text-bslc-ink md:text-3xl">
                Punya materi yang bermanfaat?
              </h2>
              <p class="mt-2 text-sm leading-relaxed text-bslc-muted md:text-base">
                Mahasiswa BINUS bisa ikut berkontribusi dengan mengirimkan modul atau video
                pembelajaran. Yuk bantu teman-teman belajar lewat konten terbaikmu.
              </p>
            </div>
            <RouterLink
              to="/form"
              class="inline-flex w-fit items-center justify-center rounded-xl bg-linear-to-r from-bslc-green to-emerald-600 px-6 py-3 text-sm font-semibold text-bslc-white! shadow-md shadow-bslc-green/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bslc-green/30"
            >
              Isi Form Kontribusi
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="border-t border-bslc-cream/80 bg-linear-to-b from-bslc-cream/10 to-bslc-white py-12 md:py-14">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-bslc-ink md:text-3xl">FAQ E-Learning BSLC</h2>
          <p class="mt-1 text-sm text-bslc-muted">
            Penjelasan singkat mengenai platform pembelajaran E-Learning BSLC.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <article class="group rounded-2xl border border-bslc-cream/60 bg-white/70 p-6 backdrop-blur-sm shadow-sm transition-all duration-300">
            <h3 class="text-base font-semibold text-bslc-ink">
              Apa itu E-Learning BSLC?
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-bslc-muted">
              E-Learning BSLC adalah platform belajar gratis berisi modul dan video untuk
              membantu mahasiswa BINUS memperdalam materi akademik maupun skill praktikal.
            </p>
          </article>

          <article class="group rounded-2xl border border-bslc-cream/60 bg-white/70 p-6 backdrop-blur-sm shadow-sm transition-all duration-300">
            <h3 class="text-base font-semibold text-bslc-ink">
              Siapa saja yang bisa mengakses kontennya?
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-bslc-muted">
              Seluruh Binusian dapat mengakses konten yang tersedia. Platform ini dirancang
              agar pembelajaran bisa dilakukan kapan saja dan dari mana saja.
            </p>
          </article>

          <article class="group rounded-2xl border border-bslc-cream/60 bg-white/70 p-6 backdrop-blur-sm shadow-sm transition-all duration-300">
            <h3 class="text-base font-semibold text-bslc-ink">
              Konten apa saja yang tersedia?
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-bslc-muted">
              Kamu bisa menemukan modul pembelajaran terstruktur dan video dari kontributor
              mahasiswa untuk berbagai jurusan serta topik yang relevan.
            </p>
          </article>

          <article class="group rounded-2xl border border-bslc-cream/60 bg-white/70 p-6 backdrop-blur-sm shadow-sm transition-all duration-300">
            <h3 class="text-base font-semibold text-bslc-ink">
              Bagaimana cara ikut berkontribusi?
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-bslc-muted">
              Klik tombol form kontribusi, isi data yang dibutuhkan, lalu kirim materi terbaikmu.
              Tim BSLC akan melakukan review sebelum konten dipublikasikan.
            </p>
          </article>
        </div>
      </div>
    </section>


    <!-- Vision -->
    <section class="relative overflow-hidden border-t border-bslc-cream/80 bg-bslc-white py-24 md:py-32">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="animate-blob absolute -left-20 top-10 h-56 w-56 rounded-full bg-bslc-green/15 blur-3xl"></div>
        <div class="animate-blob-slow absolute -right-16 bottom-6 h-64 w-64 rounded-full bg-bslc-cream/80 blur-3xl" style="animation-delay: 2s;"></div>
        <div class="animate-blob absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-bslc-green/10 blur-2xl" style="animation-delay: 4s;"></div>
      </div>
      <div class="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-bslc-green">Our Vision</p>
        <h2 class="mt-4 text-lg font-bold leading-tight text-bslc-ink md:text-2xl">
          Menjadi komunitas belajar yang unggul dan kolaboratif untuk menghasilkan generasi
          berprestasi melalui pengembangan akademik, keterampilan, dan kepemimpinan yang berdampak
          bagi masyarakat.
        </h2>
        <div class="mt-8">
          <a
            href="https://bslc.or.id"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-bslc-green to-emerald-600 px-8 py-3 text-sm font-semibold text-bslc-white! shadow-md shadow-bslc-green/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bslc-green/30"
          >
            Visit our main website
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
