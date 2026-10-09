<!-- /src/components/ui/BaseGrid.vue -->
<script setup>
import { Loader2 } from '@lucide/vue'

defineProps({
    rows: { type: Array, required: true },
    isLoading: { type: Boolean, default: false },
})
</script>

<template>
    <div class="relative w-full">
        <!-- حالة التحميل (Loading) -->
        <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center py-20 gap-3 text-sub"
        >
            <Loader2 class="animate-spin text-accent w-10 h-10" />
        </div>

        <!-- حالة عدم وجود بيانات (Empty State) -->
        <div
            v-else-if="!rows.length"
            class="text-center py-20 text-sub border border-dashed border-line rounded-2xl"
        >
            لا توجد بيانات لعرضها
        </div>

        <!-- شبكة الكروت الديناميكية (Grid) -->
        <div
            v-else
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-fluid-gap"
        >
            <div
                v-for="(row, index) in rows"
                :key="row.id || index"
                class="max-h-[400px] bg-card border border-line rounded-2xl overflow-hidden shadow-soft hover:border-accent/40 hover:shadow-glow transition-all duration-300 flex flex-col group"
            >
                <!-- Slot مخصص لكل كارت بالكامل لتمرير محتوياته بحرية -->
                <slot name="card" :row="row"></slot>
            </div>
        </div>
    </div>
</template>
