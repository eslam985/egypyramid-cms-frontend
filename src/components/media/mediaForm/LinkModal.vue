<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { createLinkSchema, updateLinkByIdSchema } from '@/schemas/linkSchema'
import { useFormValidation } from '@/composables/useFormValidation'
import { useMediaContentStore } from '@/stores/mediaContentStore'
import { utilsSubmit } from '@/composables/useUtilsSubmit'
import { useMediaStore } from '@/stores/mediaStore'
import { toNumber } from '@/utils/global'

import type { EpisodeResponse, LinksResponse } from '@/types/globalTypes'
import type { CreateLinkSchemaType } from '@/schemas/linkSchema'

const mediaContentStore = useMediaContentStore()
const mediaStore = useMediaStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const currentSchema = computed(() =>
    route.name === 'addLink' ? createLinkSchema : updateLinkByIdSchema,
)

const { errors, validate } = useFormValidation(currentSchema)
const episodeId: number | null = toNumber(route.params.episode_id)
const linkId: number | null = toNumber(route.params.id)

const formData = reactive<CreateLinkSchemaType>({
    server_name: '',
    url: '',
    last_check_status: 'pending',
    link_type: 'watch',
    quality: '720p',
    is_fixed: false,
    check_count: 0,
})

const handleSubmit = async (): Promise<void> => {
    route.name === 'addLink' && episodeId
        ? utilsSubmit(episodeId, formData, validate, mediaContentStore.addLink, () => {
            const mediaId = mediaStore.currentMedia?.id
            if (!mediaId) return
            router.push(`/media/${mediaId}/details`)
        }) : null

    route.name === 'editLink' && linkId
        ? utilsSubmit(linkId, formData, validate, mediaContentStore.editLinkById, () => {
            const mediaId = mediaStore.currentMedia?.id

            if (!mediaId) return
            router.push(`/media/${mediaId}/details`)
        }) : null
}

const loadData = async () => {

    if (route.name === 'addLink') {
        if (!episodeId) return
        const foundEpisode: EpisodeResponse | null = await mediaContentStore.getEpisodeById(
            episodeId,
            true,
        )

        if (!foundEpisode) {
            router.push({ name: 'NotFound' })
        }
    } else if (route.name === 'editLink') {
        if (!linkId) return
        const link: LinksResponse | null = await mediaContentStore.getLinkById(linkId, true)

        if (!link) {
            router.push({ name: 'NotFound' })
        }

        if (link) {
            formData.server_name = link.server_name ?? ''
            formData.url = link.url ?? ''
            formData.is_fixed = link.is_fixed ?? false
            formData.check_count = toNumber(link.check_count) ?? 0
            formData.link_type = link.link_type === 'watch' ? link.link_type : 'download'

            formData.last_check_status =
                link.last_check_status === 'valid' || link.last_check_status === 'broken'
                    ? link.last_check_status
                    : 'pending'

            formData.quality =
                link.quality === '1080p' ||
                    link.quality === '720p' ||
                    link.quality === '480p' ||
                    link.quality === '360p' ||
                    link.quality === '4k'
                    ? link.quality
                    : undefined
        }
    }
}
onMounted(async () => {
    loadData()
})


</script>
<template>
    <main>
        <div class="max-w-2xl mx-auto card my-6 shadow-soft">
            <!-- Header -->
            <div class="mb-6 pb-4 border-b border-line">
                <h2 class="text-fluid-h3 text-title">
                    {{
                        route.name === 'addLink'
                            ? t('media.linkForm.addTitle')
                            : t('media.linkForm.editTitle')
                    }}
                </h2>
                <p class="text-fluid-xs text-sub mt-1">
                    {{
                        route.name === 'addLink'
                            ? t('media.linkForm.addSubtitle')
                            : t('media.linkForm.editSubtitle')
                    }}
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-fluid-gap">
                    <!-- اسم السيرفر -->
                    <div>
                        <label for="server_name" class="form-label">
                            {{ t('media.linkForm.serverNameLabel') }}
                            <span class="text-danger">*</span>
                        </label>
                        <input id="server_name" type="text" v-model="formData.server_name"
                            :placeholder="t('media.linkForm.serverNamePlaceholder')" class="form-input" required />
                        <p v-if="errors?.server_name" class="form-error">
                            {{ errors.server_name }}
                        </p>
                    </div>

                    <!-- نوع الرابط -->
                    <div>
                        <label for="link_type" class="form-label">
                            {{ t('media.linkForm.linkTypeLabel') }}
                            <span class="text-danger">*</span>
                        </label>
                        <select id="link_type" v-model="formData.link_type" class="form-select" required>
                            <option value="" disabled>
                                {{ t('media.linkForm.selectLinkType') }}
                            </option>
                            <option value="watch">{{ t('media.linkForm.typeWatch') }}</option>
                            <option value="download">{{ t('media.linkForm.typeDownload') }}</option>
                        </select>
                        <p v-if="errors?.link_type" class="form-error">
                            {{ errors.link_type }}
                        </p>
                    </div>

                    <!-- الجودة -->
                    <div>
                        <label for="quality" class="form-label">
                            {{ t('media.linkForm.qualityLabel') }}
                        </label>
                        <select id="quality" v-model="formData.quality" class="form-select">
                            <option value="">{{ t('media.linkForm.selectQuality') }}</option>
                            <option value="1080p">1080p (FHD)</option>
                            <option value="720p">720p (HD)</option>
                            <option value="480p">480p (SD)</option>
                            <option value="4k">4K (UHD)</option>
                        </select>
                        <p v-if="errors?.quality" class="form-error">
                            {{ errors.quality }}
                        </p>
                    </div>

                    <!-- عدد مرات الفحص -->
                    <div>
                        <label for="check_count" class="form-label">
                            {{ t('media.linkForm.checkCountLabel') }}
                        </label>
                        <input id="check_count" type="number" v-model.number="formData.check_count" min="0"
                            placeholder="0" class="form-input" />
                        <p v-if="errors?.check_count" class="form-error">
                            {{ errors.check_count }}
                        </p>
                    </div>

                    <!-- حالة الفحص الأخيرة -->
                    <div>
                        <label for="last_check_status" class="form-label">
                            {{ t('media.linkForm.lastCheckStatusLabel') }}
                        </label>
                        <select id="last_check_status" v-model="formData.last_check_status" class="form-select">
                            <option value="">{{ t('media.linkForm.selectCheckStatus') }}</option>
                            <option value="pending">{{ t('media.linkForm.statusPending') }}</option>
                            <option value="valid">{{ t('media.linkForm.statusValid') }}</option>
                            <option value="broken">{{ t('media.linkForm.statusBroken') }}</option>
                        </select>
                        <p v-if="errors?.last_check_status" class="form-error">
                            {{ errors.last_check_status }}
                        </p>
                    </div>

                    <!-- رابط السيرفر (URL) -->
                    <div class="sm:col-span-2">
                        <label for="url" class="form-label">
                            {{ t('media.linkForm.urlLabel') }} <span class="text-danger">*</span>
                        </label>
                        <input id="url" type="url" v-model="formData.url" placeholder="https://example.com/embed-xyz"
                            class="form-input" required />
                        <p v-if="errors?.url" class="form-error">
                            {{ errors.url }}
                        </p>
                    </div>

                    <!-- هل الرابط مصلَح / ثابت (is_fixed) -->
                    <div class="sm:col-span-2 flex items-center gap-3 pt-2">
                        <input id="is_fixed" type="checkbox" v-model="formData.is_fixed"
                            class="size-4 accent-accent rounded cursor-pointer" />
                        <label for="is_fixed" class="text-fluid-xs font-semibold text-title cursor-pointer select-none">
                            {{ t('media.linkForm.isFixedLabel') }}
                        </label>
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
                                route.name === 'addLink'
                                    ? t('media.linkForm.saveBtn')
                                    : t('media.linkForm.updateBtn')
                            }}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>
