<script setup>
// /src/components/media/mediaDetail/LinksInfo.vue
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notificationStore'
import { useMediaContentStore } from '@/stores/mediaContentStore'
import { confirmAndDelete, formatDate } from '@/utils/global'
import BaseTable from '@/components/ui/BaseTable.vue'
import { Link2, Plus, Pencil, Trash2 } from '@lucide/vue'

const router = useRouter()
const { t } = useI18n()
const mediaContentStore = useMediaContentStore()
const notiStore = useNotificationStore()

const columns = [
  { key: 'server_name', label: t('media.linksInfo.table.server') },
  { key: 'last_check_status', label: t('media.linksInfo.table.linkStatus') },
  { key: 'last_check_at', label: t('media.linksInfo.table.lastCheck') },
  { key: 'created_at', label: t('media.linksInfo.table.createdAt') },
  { key: 'url', label: t('media.linksInfo.table.directUrl') },
  { key: 'check_count', label: t('media.linksInfo.table.checks') },
  { key: 'error_message', label: t('media.linksInfo.table.errorMessage') },
  { key: 'actions', label: t('media.linksInfo.table.actions') },
]

const handleAddLink = (episodeId) => router.push({ name: 'addLink', params: { episode_id: episodeId } })
const handleEditLink = (linkId) => router.push({ name: 'editLink', params: { id: linkId } })
const handleDeleteLink = async (linkId) => {
  confirmAndDelete({
    message: t('media.linksInfo.confirmDelete', { id: linkId }),
    action: () => mediaContentStore.removeLinkById(linkId),
    store: mediaContentStore,
    notiStore,
  })
}
</script>

<template>
  <div class=" bg-card rounded-2xl border border-line p-fluid shadow-soft space-y-4 my-6 overflow-hidden">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-fluid pb-4 border-b border-line">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
          <Link2 class="w-5 h-5" />
        </div>
        <div :id="`${mediaContentStore.currentEpisode?.id}`">
          <h3 class="text-fluid-h2 font-bold flex items-center gap-2">
            <span>{{ t('media.linksInfo.episodeServers') }}</span>
            <span v-if="mediaContentStore.currentEpisode?.episode_number" class="text-accent font-black">#{{
              mediaContentStore.currentEpisode.episode_number }}</span>
          </h3>
          <p class="text-fluid-xs text-sub">{{ t('media.linksInfo.manageDesc') }}</p>
        </div>
      </div>
      <button v-if="mediaContentStore.currentEpisode?.id || mediaContentStore.links?.[0]?.episode_id" type="button"
        @click="handleAddLink(mediaContentStore.currentEpisode?.id || mediaContentStore.links[0].episode_id)"
        class="btn-primary w-full sm:w-auto px-4 py-2 text-fluid-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
        <Plus class="w-4 h-4" />
        <span>{{ t('media.linksInfo.addNewServer') }}</span>
      </button>
    </div>

    <div v-if="!mediaContentStore.links || mediaContentStore.links.length === 0"
      class="text-fluid-xs text-sub py-10 text-center bg-line/5 rounded-2xl border border-dashed border-line space-y-3">
      <p class="font-semibold text-main">{{ t('media.linksInfo.noLinksYet') }}</p>
      <p class="text-sub">{{ t('media.linksInfo.noLinksHint') }}</p>
    </div>

    <BaseTable v-else :columns="columns" :rows="mediaContentStore.links" :isLoading="mediaContentStore.isLoading"
      storeKey="media.linksInfo">
      <template #cell-server_name="{ row }">
        <span class="flex items-center gap-2 font-bold capitalize">
          <span class="w-2 h-2 rounded-full bg-accent"></span>{{ row.server_name }}
        </span>
      </template>

      <template #cell-last_check_status="{ value }">
        <span v-if="value === 'valid'"
          class="px-2.5 py-1 rounded-md text- bg-success/10 text-success border border-success/20">{{
            t('media.linksInfo.status.valid') }}</span>
        <span v-else-if="value === 'broken'"
          class="px-2.5 py-1 rounded-md text- bg-danger/10 text-danger border border-danger/20">{{
            t('media.linksInfo.status.broken') }}</span>
        <span v-else class="px-2.5 py-1 rounded-md text- bg-amber-500/10 text-amber-500 border border-amber-500/20">{{
          t('media.linksInfo.status.pending') }}</span>
      </template>

      <template #cell-last_check_at="{ value }"><span class="font-mono text-sub">{{ formatDate(value)
          }}</span></template>
      <template #cell-created_at="{ value }"><span class="font-mono text-sub">{{ formatDate(value) }}</span></template>
      <template #cell-url="{ row }"><a :href="row.url" target="_blank"
          class="text-sub hover:text-accent font-mono truncate max-w- block dir-ltr">{{ row.url }}</a></template>
      <template #cell-check_count="{ value }"><span
          class="px-2 py-0.5 bg-line/20 rounded border border-line font-bold">{{ value ?? 0 }}</span></template>
      <template #cell-error_message="{ value }"><span :class="value ? 'text-danger' : 'text-sub'"
          class="truncate max-w- block">{{ value || '-' }}</span></template>

      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center gap-1" @click.stop>
          <button @click="handleEditLink(row.id)"
            class="p-1.5 rounded-lg hover:bg-accent/10 text-sub hover:text-accent cursor-pointer">
            <Pencil class="w-4 h-4" />
          </button>
          <button @click="handleDeleteLink(row.id)"
            class="p-1.5 rounded-lg hover:bg-danger/10 text-sub hover:text-danger cursor-pointer">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>
