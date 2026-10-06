// /src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import MainLayout from '@/layouts/MainLayout.vue'

// 1️⃣ أولاً: توثيق وتوسيع حقول الـ meta المخصصة (Module Augmentation)
// لكي يفهم VS Code الـ Auto-complete لحقول الـ meta في أي صفحة
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    requiresAdmin?: boolean
  }
}

// 2️⃣ ثانياً: تقييد المصفوفة بنوع الموجه القياسي RouteRecordRaw لـ Vue Router
const routes: RouteRecordRaw[] = [
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
        meta: { requiresAdmin: true },
      },
      {
        path: '/edit-media/:id',
        name: 'editMedia',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAdmin: true },
      },
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

// 3️⃣ ثالثاً: تقييد دالة حارس المسارات (Navigation Guard) بالأنواع الصريحة لـ Vue Router
router.beforeEach(async (to, _from, next) => {
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

  const isAuthenticated: boolean = authStore.isAuthenticated

  // 2. حماية الصفحات الخاصة بالمستخدمين المسجلين
  const requiresAuth: boolean = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'login' })
  }

  // 3. منع المسجلين من فتح صفحات الزوار (مثل اللوجن)
  if (to.meta.guestOnly && isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  // 4. حماية المسارات الخاصة بالأدمن/الإيديتور
  const requiresAdmin: boolean = to.matched.some(record => record.meta.requiresAdmin)
  if (requiresAdmin && !authStore.isEditorAndAbove) {
    return next({ name: 'NotFound' })
  }

  next()
})

export default router
