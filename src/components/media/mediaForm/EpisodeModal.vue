<script setup>
import { reactive, onMounted, computed, toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useFormValidation } from '@/composables/useFormValidation'
import { useNotificationStore } from '@/stores/notificationStore'

import { createEpisodeSchema, updateEpisodeSchema } from '@/schemas/episodeSchema'
import { useMediaContentStore } from '@/stores/mediaContentStore'
import { useMediaStore } from '@/stores/mediaStore'


const route = useRoute()
const router = useRouter()
const mediaContentStore = useMediaContentStore()
const mediaStore = useMediaStore()
const notiStore = useNotificationStore()

const mediaId = route.params.media_id
const episodeId = route.params.id

const currentSchema = computed(() => route.name === 'addEpisode' ? createEpisodeSchema : updateEpisodeSchema)
const { errors, validate } = useFormValidation(currentSchema)

const isSeries = computed(() => {
    const media = mediaStore.currentMedia
    return media?.category === 'tv' || media?.media_type === 'series'
})

const formData = reactive({
    episode_number: 0,
    season_id: null,
    progress_percent: 0,
    status_message: '',
    download_speed: '',
    status: '',
    download_url: ''
})

onMounted(async () => {
    if (route.name === "addEpisode") {
        const media = await mediaStore.getMediaById(mediaId)

        // 👈 إذا كان المسلسل/الفيلم غير موجود بالأساس
        if (!media && !mediaStore.currentMedia) {
            notiStore.triggerNotification('العمل المطلوب غير موجود')
            return router.push({ name: 'NotFound' })
        }

        if (isSeries.value) {
            await mediaContentStore.getSeasonsByMediaId(mediaId, true)
            formData.season_id = mediaContentStore.seasons[0]?.id || null
        } else {
            formData.season_id = null
        }
    } else if (route.name === "editEpisode") {
        const episode = await mediaContentStore.getEpisodeById(episodeId)

        // 👈 إذا كانت الحلقة غير موجودة
        if (!episode) {
            notiStore.triggerNotification('الحلقة المطلوبة غير موجودة')
            return router.push({ name: 'NotFound' })
        }

        formData.episode_number = episode.episode_number
        formData.season_id = episode.season_id
        formData.progress_percent = episode.progress_percent ?? 0
        formData.status_message = episode.status_message ?? ''
        formData.download_speed = episode.download_speed ?? ''
        formData.status = episode.status ?? ''
        formData.download_url = episode.download_url ?? ''
    }
})

const handleSubmit = async () => {
    mediaContentStore.successMessage = ''
    mediaContentStore.errorMessage = ''

    const { isValid, data } = validate(toRaw(formData))
    if (!isValid) return

    mediaContentStore.isLoading = true

    const isSuccess = route.name === "addEpisode"
        ? await mediaContentStore.addEpisode(mediaId, data)
        : await mediaContentStore.editEpisodeById(episodeId, data)

    if (isSuccess) {
        const msg = route.name === 'addEpisode' ? 'تم اضافة حلقة جديده' : 'تم تعديل الحلقة الحالية'
        notiStore.triggerNotification(mediaContentStore.successMessage || msg)
        router.push({ name: 'mediaDetails'})
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
                    {{ route.name === 'addEpisode' ? 'إضافة حلقة جديدة' : 'تعديل بيانات الحلقة' }}
                </h2>
                <p class="text-fluid-xs text-sub mt-1">
                    {{ route.name === 'addEpisode' ? 'إضافة حلقة جديدة للعمل الحالي' : 'تعديل بيانات الحلقة الحالية' }}
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-fluid-gap">
                    <!-- رقم الحلقة -->
                    <div>
                        <label for="episode_number" class="form-label">
                            رقم الحلقة <span class="text-danger">*</span>
                        </label>
                        <input id="episode_number" type="number" v-model.number="formData.episode_number" min="1"
                            placeholder="مثال: 1" class="form-input" required />
                        <p v-if="errors?.episode_number" class="form-error">
                            {{ errors.episode_number }}
                        </p>
                    </div>

                    <!-- اختيار الموسم -->
                    <div v-if="isSeries">
                        <label for="season_id" class="form-label">الموسم</label>
                        <select id="season_id" v-model="formData.season_id" class="form-select">
                            <option v-if="!mediaContentStore.seasons.length" disabled :value="null">
                                لا توجد مواسم مضافة لهذا المسلسل
                            </option>

                            <option v-for="season in mediaContentStore.seasons" :key="season.id" :value="season.id">
                                الموسم {{ season.season_number }}
                            </option>
                        </select>

                        <p v-if="errors?.season_id" class="form-error">
                            {{ errors.season_id }}
                        </p>
                    </div>

                    <!-- نسبة التقدم -->
                    <div>
                        <label for="progress_percent" class="form-label">
                            نسبة التقدم (%)
                        </label>
                        <input id="progress_percent" type="number" v-model.number="formData.progress_percent" min="0"
                            max="100" placeholder="0 - 100" class="form-input" />
                        <p v-if="errors?.progress_percent" class="form-error">
                            {{ errors.progress_percent }}
                        </p>
                    </div>

                    <!-- الحالة -->
                    <div>
                        <label for="status" class="form-label">
                            الحالة (Status)
                        </label>
                        <input id="status" type="text" v-model="formData.status" placeholder="مثال: active, completed"
                            class="form-input" />
                        <p v-if="errors?.status" class="form-error">
                            {{ errors.status }}
                        </p>
                    </div>

                    <!-- رسالة الحالة -->
                    <div>
                        <label for="status_message" class="form-label">
                            رسالة الحالة
                        </label>
                        <input id="status_message" type="text" v-model="formData.status_message"
                            placeholder="مثال: ready" class="form-input" />
                        <p v-if="errors?.status_message" class="form-error">
                            {{ errors.status_message }}
                        </p>
                    </div>

                    <!-- سرعة التحميل -->
                    <div>
                        <label for="download_speed" class="form-label">
                            سرعة التحميل
                        </label>
                        <input id="download_speed" type="text" v-model="formData.download_speed"
                            placeholder="مثال: 5 MB/s" class="form-input" />
                        <p v-if="errors?.download_speed" class="form-error">
                            {{ errors.download_speed }}
                        </p>
                    </div>

                    <!-- رابط التحميل -->
                    <div class="sm:col-span-2">
                        <label for="download_url" class="form-label">
                            رابط التحميل (Download URL)
                        </label>
                        <input id="download_url" type="url" v-model="formData.download_url"
                            placeholder="https://example.com/video.mp4" class="form-input" />
                        <p v-if="errors?.download_url" class="form-error">
                            {{ errors.download_url }}
                        </p>
                    </div>
                </div>

                <!-- الأزرار -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-line">
                    <button type="button" class="btn-secondary" @click="router.back()">
                        إلغاء
                    </button>
                    <button type="submit" class="btn-primary" :disabled="mediaContentStore.isLoading">
                        <span v-if="mediaContentStore.isLoading" class="flex items-center gap-2">
                            <span class="size-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></span>
                            <span>جاري الحفظ...</span>
                        </span>
                        <span v-else>
                            {{ route.name === 'addEpisode' ? 'حفظ الحلقة' : 'تحديث البيانات' }}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>
