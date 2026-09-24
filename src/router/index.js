import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import MainLayout from '@/layouts/MainLayout.vue'
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true }, // للزوار فقط (لو مسجل دخول يتم توجيهه للداشبورد)
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
        meta: { requiresAuth: true },
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings/SettingsView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardOverviewView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/media',
        name: 'mediaList',
        component: () => import('@/views/media/MediaListView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/media/:id/details',
        name: 'mediaDetails',
        component: () => import('@/views/media/MediaDetailView.vue'), // لعرض مواسم وحلقات وروابط عمل محدد
        meta: { requiresAuth: true },
      },
      {
        path: '/new-media',
        name: 'addMedia',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/edit-media/:id',
        name: 'editMedia',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      // genres
      {
        path: '/genres',
        name: 'genresList',
        component: () => import('@/views/genres/GenresListView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/new-genre',
        name: 'addGenre',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/edit-genre/:id',
        name: 'editGenre',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/media/:media_id/new-season',
        name: 'addSeason',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/edit-season/:id',
        name: 'editSeason',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/media/:media_id/new-episode',
        name: 'addEpisode',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/edit-episode/:id',
        name: 'editEpisode',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/episode/:episode_id/new-link',
        name: 'addLink',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/edit-link/:id',
        name: 'editLink',
        component: () => import('@/views/media/MediaFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      // DownloadTask
      {
        path: '/tasks',
        name: 'tasksList',
        component: () => import('@/views/tasks/DownloadTasksListView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/new-task',
        name: 'addTask',
        component: () => import('@/views/tasks/DownloadTaskFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
      },
      {
        path: '/edit-task/:id',
        name: 'editTask',
        component: () => import('@/views/tasks/DownloadTaskFormView.vue'),
        meta: { requiresAuth: true }, // صفحة محمية تتطلب تسجيل دخول
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

  // 2. حماية الصفحات الخاصة بالمستخدمين المسجلين
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' })
  }

  // 3. منع المسجلين من فتح صفحات الزوار (مثل اللوجن)
  if (to.meta.guestOnly && isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  next()
})
export default router
