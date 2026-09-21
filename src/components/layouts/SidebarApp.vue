<script setup>
import { House, Video, ChartBarStacked, Download, PanelLeftClose, Settings } from '@lucide/vue'
import { useNotificationStore } from '../../stores/notificationStore'
import { useI18n } from 'vue-i18n'

const notiStore = useNotificationStore()
const { t } = useI18n()
</script>
<template>
  <aside
    v-if="notiStore.isShowSideBar"
    class="bg-sidebar w-64 h-full p-fluid flex flex-col gap-1.5 select-none fixed inset-y-0 inset-s-0 z-50 md:static border-e border-sidebar-line"
    :class="{ 'hidden md:flex': !notiStore.isShowSideBar }"
  >
    <div class="flex justify-between px-3 py-2 mb-2">
      <button class="btn-icon md:hidden" @click="notiStore.openSide">
        <PanelLeftClose class="size-5 text-sub hover:text-accent" />
      </button>
      <span
        class="self-center text-accent text-fluid-xs font-bold tracking-widest uppercase block opacity-80"
      >
        {{ t('sidebar.mainMenu') }}
      </span>
    </div>

    <!-- الرئيسية -->
    <router-link
      :to="{ name: 'dashboard' }"
      class="sidebar-link"
      exact-active-class="sidebar-link-active"
    >
      <House class="size-5" />
      <span class="text-fluid-sm">{{ t('sidebar.dashboard') }}</span>
    </router-link>

    <!-- الأعمال -->
    <router-link
      :to="{ name: 'mediaList' }"
      class="sidebar-link"
      exact-active-class="sidebar-link-active"
    >
      <Video class="size-5" />
      <span class="text-fluid-sm">{{ t('sidebar.media') }}</span>
    </router-link>

    <!-- التصنيفات -->
    <router-link
      :to="{ name: 'genresList' }"
      class="sidebar-link"
      exact-active-class="sidebar-link-active"
    >
      <ChartBarStacked class="size-5" />
      <span class="text-fluid-sm">{{ t('sidebar.genres') }}</span>
    </router-link>

    <!-- مهام التحميل -->
    <router-link
      :to="{ name: 'tasksList' }"
      class="sidebar-link"
      exact-active-class="sidebar-link-active"
    >
      <Download class="size-5" />
      <span class="text-fluid-sm">{{ t('sidebar.tasks') }}</span>
    </router-link>

    <!-- الإعدادات -->
    <router-link
      :to="{ name: 'settings' }"
      class="sidebar-link mt-auto border-t border-sidebar-line pt-2"
      exact-active-class="sidebar-link-active"
    >
      <Settings class="size-5" />
      <span class="text-fluid-sm">{{ t('sidebar.settings') }}</span>
    </router-link>
  </aside>
</template>
