import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/module', name: 'module', component: () => import('@/views/ModuleView.vue') },
  { path: '/video', name: 'video', component: () => import('@/views/VideoView.vue') },
  { path: '/contributor', name: 'contributor', component: () => import('@/views/ContributorView.vue') },
  { path: '/forum', name: 'forum', component: () => import('@/views/ForumView.vue') },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
