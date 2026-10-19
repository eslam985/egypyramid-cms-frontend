<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { createEpisodeSchema, updateEpisodeSchema } from '@/schemas/episodeSchema'
import { useFormValidation } from '@/composables/useFormValidation'
import { useMediaContentStore } from '@/stores/mediaContentStore'
import { utilsSubmit } from '@/composables/useUtilsSubmit'
import { useMediaStore } from '@/stores/mediaStore'
import { toNumber } from '@/utils/global'

import type { CreateEpisodeSchemaType } from '@/schemas/episodeSchema'
import type { MediasResponse } from '@/types/mediaType'

const mediaContentStore = useMediaContentStore()
const mediaStore = useMediaStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const currentSchema = computed(() =>
    route.name === 'addEpisode' ? createEpisodeSchema : updateEpisodeSchema,
)

const isSeries = computed(() => {
    const media = mediaStore.currentMedia
    return media?.category === 'tv' || media?.media_type === 'series'
})

const { errors, validate } = useFormValidation(currentSchema)
const mediaId: number | null = toNumber(route.params.media_id)
const episodeId: number | null = toNumber(route.params.id)

const formData = reactive<CreateEpisodeSchemaType>({
    episode_number: 0,
    season_id: null,
    progress_percent: 0,
    status_message: '',
    download_speed: '',
    status: '',
    download_url: '',
})

const loadData = async () => {
    if (route.name === 'addEpisode') {
        if (!mediaId) return

        const media: MediasResponse | null = await mediaStore.getMediaById(mediaId)

        if (!media) return router.push({ name: 'NotFound' })

        if (isSeries.value) {
            await mediaContentStore.getSeasonsByMediaId(mediaId, true)

            mediaContentStore.seasons
                ? (formData.season_id = toNumber(mediaContentStore.seasons[0]?.id))
                : null
        } else {
            formData.season_id = null
        }

    } else if (route.name === 'editEpisode') {
        if (!episodeId) return

        const episode = await mediaContentStore.getEpisodeById(episodeId, true)

        if (!episode) return router.push({ name: 'NotFound' })
        formData.status_message = episode.status_message ?? ''
        formData.download_speed = episode.download_speed ?? ''
        formData.status = episode.status ?? ''
        formData.download_url = episode.download_url ?? ''
        formData.season_id = toNumber(episode.season_id)
        formData.progress_percent = toNumber(episode.progress_percent) ?? 0
        formData.episode_number = toNumber(episode.episode_number) ?? 0
    }
}


const handleSubmit = async (): Promise<void | null> => {

    route.name === 'addEpisode' && mediaId
        ? utilsSubmit(mediaId, formData, validate, mediaContentStore.addEpisode, () => router.push(`/media/${mediaId}/details`)) : null

    route.name === 'editEpisode' && episodeId
        ? utilsSubmit(episodeId, formData, validate, mediaContentStore.addEpisode, () => router.push(`/media/${mediaId}/details`)) : null
}

onMounted(async () => {
    loadData()
})
</script>
<template>
    <main>
        <div class="max-w-xl mx-auto card my-6 shadow-soft">
            <!-- Header -->
            <div class="mb-6 pb-4 border-b border-line">
                <h2 class="text-fluid-h3 text-title">
                    {{
                        route.name === 'addEpisode'
                            ? t('media.episodeForm.addTitle')
                            : t('media.episodeForm.editTitle')
                    }}
                </h2>
                <p class="text-fluid-xs text-sub mt-1">
                    {{
                        route.name === 'addEpisode'
                            ? t('media.episodeForm.addSubtitle')
                            : t('media.episodeForm.editSubtitle')
                    }}
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-fluid-gap">
                    <!-- رقم الحلقة -->
                    <div>
                        <label for="episode_number" class="form-label">
                            {{ t('media.episodeForm.episodeNumberLabel') }}
                            <span class="text-danger">*</span>
                        </label>
                        <input id="episode_number" type="number" v-model.number="formData.episode_number" min="1"
                            :placeholder="t('media.episodeForm.episodeNumberPlaceholder')" class="form-input"
                            required />
                        <p v-if="errors?.episode_number" class="form-error">
                            {{ errors.episode_number }}
                        </p>
                    </div>

                    <!-- اختيار الموسم -->
                    <div v-if="isSeries">
                        <label for="season_id" class="form-label">{{
                            t('media.episodeForm.seasonLabel')
                        }}</label>
                        <select id="season_id" v-model="formData.season_id" class="form-select">
                            <option v-if="!mediaContentStore.seasons?.length" disabled :value="null">
                                {{ t('media.episodeForm.noSeasons') }}
                            </option>

                            <option v-for="season in mediaContentStore.seasons" :key="season.id" :value="season.id">
                                {{
                                    t('media.seasonInfo.seasonLabel', {
                                        number: season.season_number,
                                    })
                                }}
                            </option>
                        </select>

                        <p v-if="errors?.season_id" class="form-error">
                            {{ errors.season_id }}
                        </p>
                    </div>

                    <!-- نسبة التقدم -->
                    <div>
                        <label for="progress_percent" class="form-label">
                            {{ t('media.episodeForm.progressLabel') }}
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
                            {{ t('media.episodeForm.statusLabel') }}
                        </label>
                        <input id="status" type="text" v-model="formData.status"
                            :placeholder="t('media.episodeForm.statusPlaceholder')" class="form-input" />
                        <p v-if="errors?.status" class="form-error">
                            {{ errors.status }}
                        </p>
                    </div>

                    <!-- رسالة الحالة -->
                    <div>
                        <label for="status_message" class="form-label">
                            {{ t('media.episodeForm.statusMessageLabel') }}
                        </label>
                        <input id="status_message" type="text" v-model="formData.status_message"
                            :placeholder="t('media.episodeForm.statusMessagePlaceholder')" class="form-input" />
                        <p v-if="errors?.status_message" class="form-error">
                            {{ errors.status_message }}
                        </p>
                    </div>

                    <!-- سرعة التحميل -->
                    <div>
                        <label for="download_speed" class="form-label">
                            {{ t('media.episodeForm.downloadSpeedLabel') }}
                        </label>
                        <input id="download_speed" type="text" v-model="formData.download_speed"
                            :placeholder="t('media.episodeForm.downloadSpeedPlaceholder')" class="form-input" />
                        <p v-if="errors?.download_speed" class="form-error">
                            {{ errors.download_speed }}
                        </p>
                    </div>

                    <!-- رابط التحميل -->
                    <div class="sm:col-span-2">
                        <label for="download_url" class="form-label">
                            {{ t('media.episodeForm.downloadUrlLabel') }}
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
                        {{ t('common.cancel') }}
                    </button>
                    <button type="submit" class="btn-primary" :disabled="mediaContentStore.isLoading">
                        <span v-if="mediaContentStore.isLoading" class="flex items-center gap-2">
                            <span
                                class="size-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></span>
                            <span>{{ t('common.processing') }}</span>
                        </span>
                        <span v-else>
                            {{
                                route.name === 'addEpisode'
                                    ? t('media.episodeForm.saveBtn')
                                    : t('media.episodeForm.updateBtn')
                            }}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>
