import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'ホーム' },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
      meta: { title: '作品' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'プロフィール' },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogIndexView.vue'),
      meta: { title: 'Blog' },
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('@/views/BlogPostView.vue'),
      meta: { title: 'Blog' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = import.meta.env.VITE_SITE_TITLE ?? 'Portfolio'
  const title = to.meta.title
  document.title = title ? `${title} | ${base}` : base
})

export default router
