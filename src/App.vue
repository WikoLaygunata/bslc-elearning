<script setup>
import { RouterLink, RouterView } from 'vue-router'

const links = [
  { to: '/', label: 'Home' },
  { to: '/module', label: 'Module' },
  { to: '/video', label: 'Video' },
  { to: '/forum', label: 'Forum' },
  { to: '/contributor', label: 'Contributor' },
]

const year = new Date().getFullYear()

const socialLinks = [
  {
    href: 'https://www.youtube.com/c/BinusStudentLearningCommunity',
    icon: '/youtube-white.svg',
    label: 'YouTube',
    imgClass: 'h-7 w-7 sm:h-8 sm:w-8',
  },
  {
    href: 'https://twitter.com/BSLC_BINUS',
    icon: '/x-white.svg',
    label: 'X',
    imgClass: 'h-6 w-6 sm:h-7 sm:w-7',
  },
  {
    href: 'https://id.linkedin.com/company/binus-student-learning-community',
    icon: '/linkedln.svg',
    label: 'LinkedIn',
    imgClass: 'h-7 w-7 sm:h-8 sm:w-8',
  },
  {
    href: 'https://liff.line.me/1645278921-kWRPP32q/?accountId=hlh6945o',
    icon: '/line-white.svg',
    label: 'LINE',
    imgClass: 'h-7 w-7 sm:h-8 sm:w-8',
  },
  {
    href: 'https://www.instagram.com/bslc_binus/',
    icon: '/instagram-white.svg',
    label: 'Instagram',
    imgClass: 'h-7 w-7 sm:h-8 sm:w-8',
  },
]

</script>

<template>
  <div class="flex min-h-screen flex-col bg-bslc-white text-bslc-ink antialiased">
    <header class="sticky top-0 z-50 border-b border-bslc-cream/30 bg-white/85 backdrop-blur-lg shadow-sm shadow-bslc-green/5 transition-all duration-300">
      <div class="container-navbar mx-auto max-w-6xl px-4 sm:px-6">
        <!-- Mobile & tablet: satu baris brand (tanpa duplikat E-LEARNING) -->
        <div
          class="title-left-navbar flex min-h-13 w-full items-center justify-between gap-3 py-3 min-[900px]:hidden"
        >
          <RouterLink
            to="/"
            class="elearning-left shrink-0 text-base font-bold tracking-wide text-bslc-green transition hover:text-bslc-green-dark sm:text-lg"
          >
            E-LEARNING
          </RouterLink>
          <a
            href="https://new.bslc.or.id/"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0"
          >
            <img src="/Logo-bslc-mobile-navbar.svg" alt="BSLC" class="h-8 w-auto sm:h-9" />
          </a>
        </div>

        <!-- Desktop lebar: brand kiri + nav kanan -->
        <div
          class="hidden min-[900px]:flex min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-6 min-[900px]:py-4"
        >
          <div class="min-w-0 shrink">
            <RouterLink
              to="/"
              class="text-xl font-bold tracking-wide text-bslc-green transition hover:text-bslc-green-dark"
            >
              E-LEARNING
            </RouterLink>
            <div class="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span class="text-sm text-bslc-muted">by</span>
              <a
                class="text-base leading-snug text-bslc-ink transition hover:opacity-80"
                href="https://new.bslc.or.id/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="font-bold text-bslc-green">BINUS</span>
                Student Learning Community
              </a>
            </div>
          </div>

          <nav
            class="flex max-w-full flex-wrap items-center justify-end gap-x-1 gap-y-1 pl-4 min-[900px]:max-w-[min(100%,26rem)] min-[900px]:shrink-0 lg:max-w-none lg:gap-2"
            aria-label="Main"
          >
            <RouterLink
              v-for="item in links"
              :key="item.to"
              :to="item.to"
              class="rounded-lg px-3 py-2 text-xs font-medium text-bslc-muted transition-all hover:bg-bslc-green/5 hover:text-bslc-green lg:px-4 lg:text-sm"
              active-class="bg-bslc-green/10 font-bold text-bslc-green shadow-xs"
            >
              {{ item.label }}
            </RouterLink>
          </nav>
        </div>

        <!-- Nav baris kedua: mobile / tablet saja -->
        <nav
          class="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1 border-t border-bslc-cream/60 px-0 py-2.5 min-[900px]:hidden sm:justify-end sm:gap-1"
          aria-label="Main"
        >
          <RouterLink
            v-for="item in links"
            :key="item.to"
            :to="item.to"
            class="rounded-lg px-2.5 py-2 text-[11px] font-medium text-bslc-muted transition-all hover:bg-bslc-green/5 hover:text-bslc-green sm:px-3 sm:text-sm"
            active-class="bg-bslc-green/10 font-bold text-bslc-green shadow-xs"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="bg-bslc-footer-outer text-white">
      <section class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div class="flex flex-col items-center min-[640px]:flex-row min-[640px]:justify-between">
          <!-- Logo kiri (atau atas di mobile) -->
          <div class="footer-logo flex justify-center min-[640px]:justify-start min-[640px]:flex-1">
            <img
              src="/Logo_BSLC_White-01-1.png"
              alt="BSLC"
              class="max-h-24 w-auto object-contain"
            />
          </div>
          <!-- Kontak kanan (atau bawah di mobile) -->
          <div class="contact flex flex-col items-center gap-4 mt-8 min-[640px]:mt-0 min-[640px]:items-end min-[640px]:flex-1">
            <RouterLink
              to="/form"
              class="inline-flex items-center rounded-lg border border-white/35 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:text-sm"
            >
              Ikut Berkontribusi Postingan Forum/Video
            </RouterLink>
            <div class="text">
              <p class="text-center text-sm font-medium text-white/95 min-[640px]:text-right">Contact us on</p>
            </div>
            <div class="icon-contact flex flex-wrap items-center justify-center gap-5 sm:gap-6 min-[640px]:justify-end">
              <a
                v-for="item in socialLinks"
                :key="item.label"
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                class="opacity-90 transition hover:opacity-100"
                :aria-label="item.label"
              >
                <img :src="item.icon" :alt="item.label" :class="['object-contain', item.imgClass]" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <div
        class="credit border-t border-white/10 bg-bslc-footer-bg py-4 text-center text-xs text-white/55 sm:text-sm"
      >
        Copyright © {{ year }} | BINUS Student Learning Community
      </div>
    </footer>
  </div>
</template>
