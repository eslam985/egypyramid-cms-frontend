<script setup lang="ts">
import { House, Video, ChartBarStacked, Download, Settings, CircleUser,} from '@lucide/vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


</script>

<template>
    <!-- تم إضافة bg-transparent لضمان شفافية الخلفية تماماً -->
    <nav class="bg-transparent">
        <div class="overflow-x-auto max-w-full flex flex-nowrap items-center justify-start md:justify-center gap-2 md:gap-fluid-gap p-2 md:px-6">
            <!-- الرئيسية -->
            <router-link :to="{ name: 'dashboard' }"
                exact-active-class="btn-outline shadow-glow/10 text-accent hover:text-slate-900 hover:bg-accent/70"
                class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
                <House class="size-4 shrink-0" />
                <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.dashboard') }}</span>
            </router-link>

            <!-- الأعمال -->
            <router-link :to="{ name: 'mediaList' }"
                exact-active-class="btn-outline shadow-g no-scrollbarlow/30 text-accent hover:text-slate-900 hover:bg-accent/70"
                class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
                <Video class="size-4 shrink-0" />
                <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.media') }}</span>
            </router-link>

            <!-- التصنيفات -->
            <router-link :to="{ name: 'genresList' }"
                exact-active-class="btn-outline shadow-glow/10 text-accent hover:text-slate-900 hover:bg-accent/70"
                class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
                <ChartBarStacked class="size-4 shrink-0" />
                <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.genres') }}</span>
            </router-link>

            <!-- مهام التحميل -->
            <router-link :to="{ name: 'tasksList' }"
                exact-active-class="cursor-pointer btn-outline shadow-glow/10 text-accent hover:text-slate-900 hover:bg-accent/70"
                class=" max-w-[200px] btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
                <Download class="size-4 shrink-0" />
                <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.tasks') }}</span>
            </router-link>

            <!-- الإعدادات -->
            <router-link :to="{ name: 'settings' }"
                exact-active-class="btn-outline shadow-glow/10 text-accent hover:text-slate-900 hover:bg-accent/70"
                class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
                <Settings class="size-4 shrink-0" />
                <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.settings') }}</span>
            </router-link>

            <!-- profile -->
            <router-link :to="{ name: 'profile' }"
                exact-active-class="btn-outline shadow-glow/10 text-accent hover:text-slate-900 hover:bg-accent/70"
                class="btn-secondary text-fluid-xs shrink-0 whitespace-nowrap">
                <CircleUser class="size-4 shrink-0" />
                <span class="text-fluid-xs md:text-fluid-p">{{ t('sidebar.profile') }}</span>
            </router-link>
        </div>
    </nav>
</template>
