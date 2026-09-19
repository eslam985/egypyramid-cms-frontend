<script setup>
import { Menu, Settings } from '@lucide/vue'
import { useNotificationStore } from '../../stores/notificationStore'
import { useI18n } from 'vue-i18n'
import SearchMedia from '@/components/media/mediaList/searchMedia.vue'

const notiStore = useNotificationStore()
const { t } = useI18n()
</script>

<template>
  <header
    class="h-16 bg-card border-b border-line px-fluid flex items-center justify-between sticky top-0 z-0 shadow-soft transition-colors duration-300"
  >
    <!-- الشعار وزر القائمة -->
    <div class="flex items-center gap-fluid-gap">
      <button class="btn-icon" @click="notiStore.openSide()">
        <Menu class="size-5" />
      </button>

      <router-link to="/" class="group h-9 md:h-10 flex items-center shrink-0">
        <h1
          class="flex items-center flex-row-reverse gap-1.5 font-black tracking-tighter text-2xl select-none antialiased"
        >
          <span
            class="relative bg-linear-to-r from-yellow-600 via-yellow-400 to-yellow-600 dark:from-yellow-400 dark:via-yellow-200 dark:to-yellow-500 bg-clip-text text-transparent transition-all duration-300 group-hover:drop-shadow-sm"
          >
            PYRAMID
          </span>
          <span
            class="bg-accent text-slate-950 px-1.5 py-0.5 rounded-sm text-[10px] font-black shadow-sm transition-all duration-300 ease-out uppercase leading-none group-hover:shadow-glow group-hover:-translate-y-1"
          >
            EGY
          </span>
        </h1>
      </router-link>
    </div>

    <!-- صندوق البحث -->
    <div class="relative w-full max-w-md hidden sm:block">
      <SearchMedia />
    </div>

    <!-- زرار الاعدادات بس -->
    <div class="flex items-center gap-3">
      <router-link to="/settings" class="btn-icon" :title="t('settings.title')">
        <Settings class="size-5" />
      </router-link>
    </div>
  </header>
</template>
