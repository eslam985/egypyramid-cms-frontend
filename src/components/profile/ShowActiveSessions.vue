<script setup>
import { Trash, MonitorCheck } from '@lucide/vue'

import BaseTable from '@/components/ui/BaseTable.vue'
import { useUserStore } from '@/stores/userStore'
import { confirmAndDelete, formatDate } from '@/utils/global'
import { useNotificationStore } from '@/stores/notificationStore'

const userStore = useUserStore()
const notiStore = useNotificationStore()
const columns = [
    { label: 'Device / User Agent', key: 'user_agent', sortable: true },
    { label: 'IP Address', key: 'ip_address', sortable: true },
    { label: 'Expires At', key: 'expires_at', sortable: true },
    { label: 'Created At', key: 'created_at', sortable: true },
    { label: 'Updated At', key: 'updated_at', sortable: true },
    { label: 'Action', key: 'Action' },
]

const handleSort = (column) => {
    userStore.setSort(column)
}
const handleDelete = (sessionId) => {
    if (!sessionId) {
        notiStore.triggerNotification(`session Id required!, sessionId: ${sessionId}`)
        return
    }
    console.log(sessionId)
    confirmAndDelete({
        message: 'هل انت متأكد من حذف الجلسة ؟ّ',
        action: () => userStore.removeSessionById(sessionId),
        store: userStore,
        notiStore,
        fallbackSuccess: 'تم حذف الجلسة بنجاح',
        fallbackError: 'حدثت مشكلة اثناء حذف الجلسة!',
    })
}
</script>
<template>
    <section
        class="grid grid-cols-1 gap-fluid-gap max-w-6xl mx-auto mb-8 w-full min-w-0 overflow-x-hidden"
    >
        <div>
            <div class="flex gap-2">
                <MonitorCheck :stroke-width="1" class="text-accent" />
                <span class="text-fluid-h2">Active Sessions</span>
            </div>
            <p class="text-fluid-xs text-sub">
                Manage and revoke active sessions across your devices
            </p>
        </div>

        <BaseTable
            :columns="columns"
            :rows="userStore.sessions"
            :isLoading="userStore.isLoading"
            :sortBy="userStore.filters.sortBy"
            :sortOrder="userStore.filters.sortOrder"
            @sort="handleSort"
        >
            <template #cell-Action="{ row }">
                <button
                    class="mx-auto flex gap-2 px-3 py-2 rounded-xl border border-danger/20 hover:bg-danger/10 font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    type="button"
                    @click="handleDelete(row.id)"
                >
                    <Trash class="self-center text-danger" />
                    <span class="self-center">Delete</span>
                </button>
            </template>

            <template #cell-created_at="{ value }"> {{ formatDate(value) }} </template>
            <template #cell-expires_at="{ value }"> {{ formatDate(value) }} </template>
            <template #cell-updated_at="{ value }"> {{ formatDate(value) }} </template>
        </BaseTable>
    </section>
</template>
