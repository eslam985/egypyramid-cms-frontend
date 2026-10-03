import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import MainLayout from '@/layouts/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/ProfileView.vue'),
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings/SettingsView.vue'),
      },
      {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardOverviewView.vue'),
      },
      {
        path: '/media',
        name: 'mediaList',
        component: () => import('@/views/media/MediaListView.vue'),
      },
      {
        path: '/media/:id/details',
        name: 'mediaDetails',
        component: () => import('@/views/media/MediaDetailView.vue'),
      },
      {
        path: '/new-media',
        name: 'addMedia',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true }, // البارنت أصلاً عليه requiresAuth فمش لازم تكررها هنا
      },
      {
        path: '/edit-media/:id',
        name: 'editMedia',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
      // genres
      {
        path: '/genres',
        name: 'genresList',
        component: () => import('@/views/genres/GenresListView.vue'),
      },
      {
        path: '/new-genre',
        name: 'addGenre',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/edit-genre/:id',
        name: 'editGenre',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/media/:media_id/new-season',
        name: 'addSeason',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/edit-season/:id',
        name: 'editSeason',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/media/:media_id/new-episode',
        name: 'addEpisode',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/edit-episode/:id',
        name: 'editEpisode',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/episode/:episode_id/new-link',
        name: 'addLink',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/edit-link/:id',
        name: 'editLink',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
      // DownloadTask
      {
        path: '/tasks',
        name: 'tasksList',
        component: () => import('@/views/tasks/DownloadTasksListView.vue'),
      },
      {
        path: '/new-task',
        name: 'addTask',
        component: () => import('@/views/tasks/DownloadTaskFormView.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/edit-task/:id',
        name: 'editTask',
        component: () => import('@/views/tasks/DownloadTaskFormView.vue'),
        meta: { requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// حارس المسارات (Navigation Guard)
router.beforeEach(async (to, from, next) => {
  // ✅ استدعاء الـ Store هنا جوا الدالة سليم 100% ويمنع مشاكل التحميل
  const authStore = useAuthStore()

  // 1. استرجاع الجلسة عند فتح التطبيق أول مرة أو عند Refresh
  if (!authStore.isInitialized) {
    try {
      await authStore.restoreSession()
    } catch (err) {
      console.error('السيرفر متوقف أو لا يستجيب:', err)
      authStore.isServerError = true
      return next({ name: 'login' })
    }
  }

  const isAuthenticated = authStore.isAuthenticated

  // 2. حماية الصفحات الخاصة بالمستخدمين المسجلين (يقحص المسار أو الأبناء)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'login' })
  }

  // 3. منع المسجلين من فتح صفحات الزوار (مثل اللوجن)
  if (to.meta.guestOnly && isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  // 4. حماية المسارات الخاصة بالأدمن/الإيديتور
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  if (requiresAdmin && !authStore.isEditorAndAbove) {
    return next({ name: 'NotFound' })
  }

  next()
})

export default router
