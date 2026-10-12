<script setup lang="ts">

import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import { reactive, onMounted, toRaw, computed } from 'vue'

import { useGenresStore } from '@/stores/genreStore'
import { useMediaStore } from '@/stores/mediaStore'

import { createMediaSchema, updateMediaSchema } from '@/schemas/mediaSchema'
import { useFormValidation } from '@/composables/useFormValidation'

import type {
    CreateMediaInputsType,
    UpdateMediaInputsType,
} from '@/schemas/mediaSchema'

import type { MediasResponse, GenresResponse } from '@/types/globalTypes'

// استدعاء الـ Composable وتمرين الـ Schema
const genresStore = useGenresStore()
const route = useRoute()
const mediaStore = useMediaStore()

const router = useRouter()
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const mediaId = Number(id)

const currentSchema = computed(() => (mediaId ? updateMediaSchema : createMediaSchema))
const { errors, validate } = useFormValidation(currentSchema)

// تجميع الحقول في كائن reactive واحد
const formData = reactive<CreateMediaInputsType>({
    title: '',
    year: '',
    tmdb_id: '',
    poster_url: '',
    story: '',
    rating: '',
    runtime: '',
    is_ready: false,
    is_facebook_posted: false,
    labels: '',
    category: 'movie',
    media_type: 'movie',
    duration_iso: '',
    genres: [],
})
// جلب التصنيفات من السيرفر عند تحميل الصفحة

const handleSubmit = async (): Promise<void | null> => {

    // فحص البيانات باستخدام Zod بعد تجريد الـ Proxy
    const { isValid, data } = validate(toRaw(formData))
    if (!isValid || !data) return null


    const result: MediasResponse | null = mediaId
        ? await mediaStore.editMediaById(mediaId, data as UpdateMediaInputsType)
        : await mediaStore.addMedia(data as CreateMediaInputsType)


    if (!result) {
        return null
    } else {
        router.push({ name: 'mediaList' })
    }
}

onMounted(async () => {
    // 1. جلب قائمة كل التصنيفات أولاً
    const foundGenres: GenresResponse[] | null = await genresStore.fetchAllGenres()

    if (!foundGenres) {
        router.push({ name: 'NotFound' })
    }

    // 2. إذا كنا في وضع التعديل (يوجد mediaId)
    if (mediaId) {
        const foundMedia: MediasResponse | null = await mediaStore.getMediaById(mediaId)

        if (!foundMedia && !mediaStore.currentMedia) {
            router.push({ name: 'NotFound' })
        }

        if (mediaStore.currentMedia) {
            Object.assign(formData, mediaStore.currentMedia)

            // ب) تحويل مصفوفة الـ Objects إلى مصفوفة IDs للـ Checkboxes
            if (Array.isArray(mediaStore.currentMedia.genres)) {
                formData.genres = mediaStore.currentMedia.genres.map((g) =>
                    Number(typeof g === 'object' && g !== null ? (g as { id: number }).id : g),
                )
            }
        }
    }
})
</script>

<template>
    <main class="max-w-5xl mx-auto my-3 md:my-8 card p-6 md:p-8 shadow-soft">
        <!-- Header -->
        <div class="mb-6 pb-4 border-b border-line flex flex-col md:flex-row items-center justify-between gap-fluid">
            <div>
                <h2 class="text-fluid-h2 font-bold text-title">
                    {{ mediaId ? t('media.form.editTitle') : t('media.form.addTitle') }}
                </h2>
                <p v-if="mediaId" class="text-fluid-xs text-sub mt-1">
                    {{ t('media.form.editSubtitle') }}
                </p>
                <p v-else class="text-fluid-xs text-sub mt-1">
                    {{ t('media.form.addSubtitle') }}
                </p>
            </div>

            <div v-if="formData.poster_url" class="shrink-0">
                <img :src="formData.poster_url" decoding="async" alt="Poster Preview"
                    class="w-24 md:w-32 aspect-square object-cover rounded-xl shadow-soft border border-line"
                    loading="lazy" />
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-fluid-gap">
                <!-- المجموعة الأولى (اليسار) -->
                <div class="space-y-4">
                    <div>
                        <label for="name" class="form-label">{{ t('media.form.titleLabel') }}
                            <span class="text-danger">*</span></label>
                        <input type="text" id="name" name="name" class="form-input"
                            :placeholder="t('media.form.titlePlaceholder')" required autocomplete="name"
                            v-model="formData.title" />
                        <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
                    </div>

                    <div>
                        <label for="year" class="form-label">{{ t('media.form.yearLabel') }}
                            <span class="text-danger">*</span></label>
                        <input type="text" id="year" name="year" class="form-input" placeholder="2026"
                            autocomplete="year" required v-model="formData.year" />
                        <p v-if="errors.year" class="form-error">{{ errors.year }}</p>
                    </div>

                    <div>
                        <label for="tmdb_id" class="form-label">{{
                            t('media.form.tmdbIdLabel')
                            }}</label>
                        <input type="text" id="tmdb_id" name="tmdb_id" class="form-input"
                            placeholder="196322 أو tt39741670" autocomplete="tmdb_id" v-model="formData.tmdb_id" />
                        <p v-if="errors.tmdb_id" class="form-error">{{ errors.tmdb_id }}</p>
                    </div>

                    <div>
                        <label for="poster_url" class="form-label">{{
                            t('media.form.posterUrlLabel')
                            }}</label>
                        <input type="text" id="poster_url" name="poster_url" class="form-input"
                            placeholder="https://res.cloudinary.com/..." autocomplete="poster_url"
                            v-model="formData.poster_url" />
                        <p v-if="errors.poster_url" class="form-error">{{ errors.poster_url }}</p>
                    </div>

                    <div>
                        <label for="story" class="form-label">{{
                            t('media.form.storyLabel')
                            }}</label>
                        <textarea dir="rtl" id="story" name="story" rows="4" class="form-textarea resize-none"
                            :placeholder="t('media.form.storyPlaceholder')" autocomplete="story"
                            v-model="formData.story"></textarea>
                        <p v-if="errors.story" class="form-error">{{ errors.story }}</p>
                    </div>

                    <div>
                        <label for="rating" class="form-label">{{
                            t('media.form.ratingLabel')
                            }}</label>
                        <input type="text" step="0.1" id="rating" name="rating" class="form-input" placeholder="7.3"
                            autocomplete="rating" v-model="formData.rating" />
                        <p v-if="errors.rating" class="form-error">{{ errors.rating }}</p>
                    </div>

                    <!-- Genres Multi-Select Grid -->
                    <div>
                        <span class="form-label">{{ t('media.form.genresLabel') }}</span>
                        <div
                            class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2 p-3 bg-card-hover rounded-xl border border-line max-h-48 overflow-y-auto">
                            <label v-for="genre in genresStore.allGenres" :key="genre.id"
                                class="flex items-center gap-2 text-fluid-xs text-title cursor-pointer hover:text-accent transition-colors p-1.5 rounded-lg hover:bg-card">
                                <input type="checkbox" :value="genre.id"
                                    class="accent-accent size-4 rounded cursor-pointer" v-model="formData.genres" />
                                <span>{{ genre.name }}</span>
                            </label>
                        </div>
                        <p v-if="errors.genres" class="form-error">{{ errors.genres }}</p>
                    </div>
                </div>
                <!-- المجموعة الثانية (اليمين) -->
                <div class="space-y-4">
                    <div>
                        <label for="runtime" class="form-label">{{
                            t('media.form.runtimeLabel')
                            }}</label>
                        <input type="text" id="runtime" name="runtime" class="form-input"
                            :placeholder="t('media.form.runtimePlaceholder')" autocomplete="runtime"
                            v-model="formData.runtime" />
                        <p v-if="errors.runtime" class="form-error">{{ errors.runtime }}</p>
                    </div>

                    <div>
                        <label for="duration_iso" class="form-label">{{
                            t('media.form.durationIsoLabel')
                            }}</label>
                        <input type="text" id="duration_iso" name="duration_iso" class="form-input"
                            placeholder="PT01H57M" autocomplete="duration_iso" v-model="formData.duration_iso" />
                        <p v-if="errors.duration_iso" class="form-error">
                            {{ errors.duration_iso }}
                        </p>
                    </div>

                    <div>
                        <label for="labels" class="form-label">{{
                            t('media.form.labelsLabel')
                            }}</label>
                        <input type="text" id="labels" name="labels" class="form-input text-right"
                            :placeholder="t('media.form.labelsPlaceholder')" autocomplete="labels"
                            v-model="formData.labels" />
                        <p v-if="errors.labels" class="form-error">{{ errors.labels }}</p>
                    </div>

                    <!-- Category Radio Group -->
                    <div>
                        <span class="form-label">{{ t('media.form.categoryLabel') }}
                            <span class="text-danger">*</span></span>
                        <div class="flex items-center gap-6 mt-2 p-3 bg-card-hover rounded-xl border border-line">
                            <label for="Category_tv"
                                class="flex items-center gap-2 cursor-pointer text-fluid-xs font-medium text-title">
                                <input type="radio" id="Category_tv" name="Category" value="tv"
                                    class="accent-accent size-4" required v-model="formData.category" />
                                {{ t('media.form.categoryTv') }}
                            </label>
                            <label for="Category_movie"
                                class="flex items-center gap-2 cursor-pointer text-fluid-xs font-medium text-title">
                                <input type="radio" id="Category_movie" name="Category" value="movie"
                                    class="accent-accent size-4" v-model="formData.category" />
                                {{ t('media.form.categoryMovie') }}
                            </label>
                        </div>
                        <p v-if="errors.category" class="form-error">{{ errors.category }}</p>
                    </div>

                    <!-- Media Type Radio Group -->
                    <div>
                        <span class="form-label">{{ t('media.form.mediaTypeLabel') }}
                            <span class="text-danger">*</span></span>
                        <div class="flex items-center gap-6 mt-2 p-3 bg-card-hover rounded-xl border border-line">
                            <label for="type_series"
                                class="flex items-center gap-2 cursor-pointer text-fluid-xs font-medium text-title">
                                <input type="radio" id="type_series" name="media_type" value="series"
                                    class="accent-accent size-4" required v-model="formData.media_type" />
                                {{ t('media.form.typeSeries') }}
                            </label>
                            <label for="type_movie"
                                class="flex items-center gap-2 cursor-pointer text-fluid-xs font-medium text-title">
                                <input type="radio" id="type_movie" name="media_type" value="movie"
                                    class="accent-accent size-4" v-model="formData.media_type" />
                                {{ t('media.form.typeMovie') }}
                            </label>
                        </div>
                        <p v-if="errors.media_type" class="form-error">{{ errors.media_type }}</p>
                    </div>

                    <!-- Status: Is Ready Checkbox -->
                    <div>
                        <label for="is_ready"
                            class="flex items-center justify-between p-3 bg-card-hover rounded-xl border border-line cursor-pointer hover:bg-card transition-colors">
                            <span class="text-fluid-xs font-semibold text-title">{{
                                t('media.form.isReadyLabel')
                                }}</span>
                            <input type="checkbox" id="is_ready" name="is_ready"
                                class="accent-accent size-5 rounded cursor-pointer" v-model="formData.is_ready" />
                        </label>
                        <p v-if="errors.is_ready" class="form-error">{{ errors.is_ready }}</p>
                    </div>

                    <!-- Status: Is Facebook Posted Checkbox -->
                    <div>
                        <label for="is_facebook_posted"
                            class="flex items-center justify-between p-3 bg-card-hover rounded-xl border border-line cursor-pointer hover:bg-card transition-colors">
                            <span class="text-fluid-xs font-semibold text-title">{{
                                t('media.form.isFacebookPostedLabel')
                                }}</span>
                            <input type="checkbox" id="is_facebook_posted" name="is_facebook_posted"
                                class="accent-accent size-5 rounded cursor-pointer"
                                v-model="formData.is_facebook_posted" />
                        </label>
                        <p v-if="errors.is_facebook_posted" class="form-error">
                            {{ errors.is_facebook_posted }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Actions Bar -->
            <div class="pt-6 border-t border-line flex items-center justify-end gap-3">
                <button type="button" @click="router.back()" class="btn-secondary">
                    {{ t('common.cancel') }}
                </button>
                <button type="submit" class="btn-primary" :disabled="mediaStore.isLoading">
                    <span v-if="mediaStore.isLoading" class="flex items-center gap-2">
                        <span
                            class="size-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></span>
                        <span>{{ t('common.processing') }}</span>
                    </span>
                    <span v-else>{{
                        mediaId ? t('media.form.updateBtn') : t('media.form.addBtn')
                        }}</span>
                </button>
            </div>
        </form>
    </main>
</template>
