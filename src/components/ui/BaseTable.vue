<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  storeKey: { type: String, default: 'tasks' },
  sortBy: String,      // اللي بيتعمله sort حاليا
  sortOrder: String    // ASC or DESC
})

const { t } = useI18n()
defineEmits(['sort', 'row-click'])

</script>

<template>
  <div class="bg-card border border-line rounded-2xl shadow-soft overflow-hidden">
    <!-- loading -->
    <div v-if="isLoading" class="p-8 text-center text-sub font-medium">
      {{ t(`${storeKey}.loading`) }}
    </div>

    <!-- table -->
    <div
      v-else-if="rows && rows.length > 0"
      class="w-full overflow-x-auto">
      <table class="w-full text-fluid-xs whitespace-nowrap">
        <thead class="bg-background-alt border-b border-line text-sub font-semibold">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              @click="col.sortable && $emit('sort', col.key)"
              :class="['p-fluid text-center select-none', col.sortable ? 'cursor-pointer hover:bg-line/30' : '']"
              >
              <div class="flex items-center gap-1 justify-center">
                <span>{{ col.label }}</span>
                <span v-if="col.sortable && sortBy === col.key">
                  {{ sortOrder === 'ASC' ? '▲' : '▼' }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line/60 bg-card text-main">
          <tr
              v-for="row in rows"
              :key="row.id"
              @click="$emit('row-click', row)"
                class="hover:bg-line/10 transition-colors"
            >
            <td
              v-for="col in columns"
              :key="col.key"
              class="p-fluid text-center"
              >
              <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
                {{ row[col.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- no data -->
    <div v-else class="text-fluid-xs text-sub py-12 text-center bg-line/5 space-y-3">
      <p class="font-semibold text-main">{{ t(`${storeKey}.noData`) }}</p>
      <p class="text-sub">{{ t(`${storeKey}.noDataHint`) }}</p>
    </div>
  </div>
</template>
