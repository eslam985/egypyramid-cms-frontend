<script setup>
import { reactive, onMounted, computed, toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useFormValidation } from '@/composables/useFormValidation'
import { createSeasonSchema, updateSeasonSchema } from '@/schemas/seasonSchema'
import { useNotificationStore } from '@/stores/notificationStore'

import { useMediaContentStore } from '@/stores/mediaContentStore'
import { useMediaStore } from '@/stores/mediaStore'

const mediaContentStore = useMediaContentStore()
const mediaStore = useMediaStore()
const router = useRouter()
const route = useRoute()
const notiStore = useNotificationStore()

const mediaId = route.params.media_id
const seasonId = route.params.id

const currentSchema = computed(() => mediaId ? createSeasonSchema : updateSeasonSchema)
const { errors, validate } = useFormValidation(currentSchema)

const formData = reactive({
    season_number: 0
})

onMounted(async () => {
    // Add New Season In Currnt Media
    if (route.name === 'addSeason') {
        const foundMedia = await mediaStore.getMediaById(mediaId)
        if (!foundMedia && !mediaStore.currentMedia) {
            notiStore.triggerNotification(mediaStore.errorMessage || 'لم يتم العثور علي الميديا')
            router.push({ name: "NotFound" })
        }
    }

    // edit currnt season
    if (route.name === 'editSeason') {
        const foundSeason = await mediaContentStore.getSeasonById(seasonId)

        if (!foundSeason && !mediaContentStore.currentSeason) {
            notiStore.triggerNotification(mediaContentStore.errorMessage || 'لم يتم العثور علي السيزون')
            router.push({ name: "NotFound" })
        }

        if (foundSeason && foundSeason.season_number !== undefined) {
            formData.season_number = foundSeason.season_number
        }
    }
})


const handleSubmit = async () => {
    mediaContentStore.successMessage = ''
    mediaContentStore.errorMessage = ''

    const { isValid, data } = validate(toRaw(formData))
    if (!isValid) return
    mediaContentStore.isLoading = true

    const isSuccess = route.name === 'editSeason'
        ? await mediaContentStore.editSeasonById(seasonId, data)
        : await mediaContentStore.addSeason(mediaId, data)

    if (isSuccess) {
        const msg = route.name === 'addSeason' ? 'تم إضافة الموسم الجديد' : 'تم تعديل الموسم الحالي'
        notiStore.triggerNotification(mediaContentStore.successMessage || msg)
        router.push({ name: 'mediaDetails' })
    } else {
        notiStore.triggerNotification(mediaContentStore.errorMessage || 'حدث خطأ أثناء الحفظ')
    }
}

</script>
<template>
    <main>
        <div class="max-w-xl mx-auto card my-6 shadow-soft">
            <!-- Header -->
            <div class="mb-6 pb-4 border-b border-line">
                <h2 class="text-fluid-h3 text-title">
                    {{ route.name === 'editSeason' ? 'Edit Season' : 'Add New Season' }}
                </h2>
                <p class="text-fluid-xs text-sub mt-1">
                    {{ route.name === 'editSeason' ? 'تعديل بيانات الموسم الحالي' : 'إضافة موسم جديد للعمل الحالي' }}
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div>
                    <label for="season_number" class="form-label">
                        Season Number <span class="text-danger">*</span>
                    </label>
                    <input type="number" id="season_number" name="season_number" required
                        v-model.number="formData.season_number" placeholder="مثال: 1"
                        class="form-input"
                        :class="{ 'border-danger focus:ring-danger/20 focus:border-danger': errors.season_number }" />
                    <p v-if="errors.season_number" class="form-error">
                        {{ errors.season_number }}
                    </p>
                </div>

                <!-- Actions Bar -->
                <div class="pt-4 border-t border-line flex items-center justify-end gap-3">
                    <button type="button" @click="router.back()" class="btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" class="btn-primary" :disabled="mediaContentStore.isLoading">
                        <span v-if="mediaContentStore.isLoading" class="flex items-center gap-2">
                            <span class="size-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></span>
                            <span>Processing...</span>
                        </span>
                        <span v-else>{{ route.name === 'editSeason' ? 'Update Season' : 'Add Season' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>
