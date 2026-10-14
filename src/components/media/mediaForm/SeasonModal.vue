<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { createSeasonSchema, updateSeasonSchema } from '@/schemas/seasonSchema'
import { useFormValidation } from '@/composables/useFormValidation'
import { useMediaContentStore } from '@/stores/mediaContentStore'
import { utilsSubmit } from '@/composables/useUtilsSubmit'
import { useMediaStore } from '@/stores/mediaStore'
import { toNumber } from '@/utils/global'

import type { SeasonsResponse, MediasResponse } from '@/types/globalTypes'
import type { CreateSeasonSchemaType } from '@/schemas/seasonSchema'


const mediaContentStore = useMediaContentStore()
const mediaStore = useMediaStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const mediaId: number | null = toNumber(route.params?.media_id)
const seasonId: number | null = toNumber(route.params.id)

const currentSchema = computed(() => (mediaId ? createSeasonSchema : updateSeasonSchema))
const { errors, validate } = useFormValidation(currentSchema)

const formData: {
    season_number: number
} = reactive<CreateSeasonSchemaType>({
    season_number: 0,
})

const loadData = async () => {
    // Add New Season In Current Media
    if (route.name === 'addSeason') {
        if (!mediaId) return
        const foundMedia: MediasResponse | null = await mediaStore.getMediaById(mediaId)

        if (!foundMedia && !mediaStore.currentMedia) {
            router.push({ name: 'NotFound' })
        }
    }

    // edit current season
    if (route.name === 'editSeason') {
        if (!seasonId) return

        const foundSeason: SeasonsResponse | null = await mediaContentStore.getSeasonById(
            seasonId,
            true,
        )

        if (!foundSeason && !mediaContentStore.currentSeason) {
            router.push({ name: 'NotFound' })
        }

        if (foundSeason && foundSeason.season_number !== undefined) {
            formData.season_number = toNumber(foundSeason.season_number) ?? 0
        }
    }
}



const handleSubmit = async (): Promise<void | null> => {
    route.name === 'addSeason' && mediaId
        ? utilsSubmit(mediaId, formData, validate, mediaContentStore.addSeason, () => router.push(`/media/${mediaId}/details`)) : null

    route.name === 'editSeason' && seasonId && mediaId
        ? utilsSubmit(seasonId, formData, validate, mediaContentStore.editSeasonById, () => router.push(`/media/${mediaId}/details`) ) : null

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
                        route.name === 'editSeason'
                            ? t('media.seasonForm.editTitle')
                            : t('media.seasonForm.addTitle')
                    }}
                </h2>
                <p class="text-fluid-xs text-sub mt-1">
                    {{
                        route.name === 'editSeason'
                            ? t('media.seasonForm.editSubtitle')
                            : t('media.seasonForm.addSubtitle')
                    }}
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div>
                    <label for="season_number" class="form-label">
                        {{ t('media.seasonForm.seasonNumberLabel') }}
                        <span class="text-danger">*</span>
                    </label>
                    <input type="number" id="season_number" name="season_number" required
                        v-model.number="formData.season_number"
                        :placeholder="t('media.seasonForm.seasonNumberPlaceholder')" class="form-input" :class="{
                            'border-danger focus:ring-danger/20 focus:border-danger':
                                errors.season_number,
                        }" />
                    <p v-if="errors.season_number" class="form-error">
                        {{ errors.season_number }}
                    </p>
                </div>

                <!-- Actions Bar -->
                <div class="pt-4 border-t border-line flex items-center justify-end gap-3">
                    <button type="button" @click="router.back()" class="btn-secondary">
                        {{ t('common.cancel') }}
                    </button>
                    <button type="submit" class="btn-primary" :disabled="mediaContentStore.isLoading">
                        <span v-if="mediaContentStore.isLoading" class="flex items-center gap-2">
                            <span
                                class="size-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></span>
                            <span>{{ t('common.processing') }}</span>
                        </span>
                        <span v-else>{{
                            route.name === 'editSeason'
                                ? t('media.seasonForm.updateBtn')
                                : t('media.seasonForm.addBtn')
                        }}</span>
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>
