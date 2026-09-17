<script setup>
import { useRouter, useRoute } from 'vue-router'
import { reactive, onMounted, toRaw, computed } from 'vue'

import { useGenresStore } from '@/stores/genreStore'
import { useMediaStore } from '@/stores/mediaStore'
import { useNotificationStore } from '@/stores/notificationStore'

import { createMediaSchema, updateMediaSchema } from '@/schemas/mediaSchema'
import { useFormValidation } from '@/composables/useFormValidation'

// استدعاء الـ Composable وتمرين الـ Schema
const genresStore = useGenresStore()
const route = useRoute()
const mediaStore = useMediaStore()

const router = useRouter()
const notiStore = useNotificationStore()
const mediaId = route.params.id // استخراج الـ ID من الرابط


const currentSchema = computed(() => mediaId ? updateMediaSchema : createMediaSchema)
const { errors, validate } = useFormValidation(currentSchema)


// تجميع الحقول في كائن reactive واحد
const formData = reactive({
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
    category: '',
    media_type: '',
    duration_iso: '',
    genres: [],
})
// جلب التصنيفات من السيرفر عند تحميل الصفحة

const handleSubmit = async () => {
    mediaStore.successMessage = ''
    mediaStore.errorMessage = ''

    // فحص البيانات باستخدام Zod بعد تجريد الـ Proxy
    const { isValid, data } = validate(toRaw(formData))
    if (!isValid) return // إيقاف التنفيذ إذا توجد أخطاء مدخلات

    mediaStore.isLoading = true

    const result = mediaId
        ? await mediaStore.editMediaById(mediaId, data)
        : await mediaStore.addMedia(data)

    mediaStore.isLoading = false

    if (result) {
        const msg = mediaId ? 'تم التعديل بنجاح' : 'تم إضافة العمل بنجاح'
        notiStore.triggerNotification(mediaStore.successMessage || msg)
        router.push({ name: 'mediaList'})
    } else {
        notiStore.triggerNotification(mediaStore.errorMessage || 'حدث خطأ أثناء الحفظ')
    }
}

onMounted(async () => {

    // 1. جلب قائمة كل التصنيفات أولاً
    const foundGenres = await genresStore.fetchAllGenres()

    if (!foundGenres) {
        notiStore.triggerNotification(genresStore.errorMessage || 'لم يتم العثور علي التصنيف!')
        router.push({ name: "NotFound" })
    }

    // 2. إذا كنا في وضع التعديل (يوجد mediaId)
    if (mediaId) {
        const foundMedia = await mediaStore.getMediaById(mediaId)

        if (!foundMedia && !mediaStore.currentMedia) {
            notiStore.triggerNotification(genresStore.errorMessage || 'لم يتم العثور علي الميديا')
            router.push({ name: "NotFound" })
        }

        if (mediaStore.currentMedia) {
            Object.assign(formData, mediaStore.currentMedia)

            // ب) تحويل مصفوفة الـ Objects إلى مصفوفة IDs للـ Checkboxes
            if (Array.isArray(mediaStore.currentMedia.genres)) {
                formData.genres = mediaStore.currentMedia.genres.map(g => (typeof g === 'object' ? g.id : g))
            }
        }
    }
})

</script>

<template>
    <main class="max-w-5xl mx-auto my-3 md:my-8 card p-6 md:p-8 shadow-soft">
        <!-- Header -->
        <div class="mb-6 pb-4 border-b border-line flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h2 class="text-fluid-h2 font-bold text-title">{{ mediaId ? 'Edit Media' : 'Add New Media' }}</h2>
                <p v-if="mediaId" class="text-fluid-xs text-sub mt-1">عدل بيانات العمل الدرامي أو السينمائي</p>
                <p v-else class="text-fluid-xs text-sub mt-1">أدخل بيانات العمل الدرامي أو السينمائي للإضافة إلى النظام</p>
            </div>

            <div v-if="formData.poster_url" class="shrink-0">
                <img :src="formData.poster_url" decoding="async" alt="Poster Preview"
                    class="w-24 md:w-32 aspect-square object-cover rounded-xl shadow-soft border border-line" loading="lazy">
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-fluid-gap">

                <!-- المجموعة الأولى (اليسار) -->
                <div class="space-y-4">
                    <div>
                        <label for="name" class="form-label">Title / Name <span class="text-danger">*</span></label>
                        <input type="text" id="name" name="name" class="form-input" placeholder="اكتب اسم العمل"
                            required autocomplete="name" v-model="formData.title">
                        <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
                    </div>

                    <div>
                        <label for="year" class="form-label">Year <span class="text-danger">*</span></label>
                        <input type="text" id="year" name="year" class="form-input" placeholder="2026"
                            autocomplete="year" required v-model="formData.year">
                        <p v-if="errors.year" class="form-error">{{ errors.year }}</p>
                    </div>

                    <div>
                        <label for="tmdb_id" class="form-label">TMDB ID</label>
                        <input type="text" id="tmdb_id" name="tmdb_id" class="form-input"
                            placeholder="196322 أو tt39741670" autocomplete="tmdb_id" v-model="formData.tmdb_id">
                        <p v-if="errors.tmdb_id" class="form-error">{{ errors.tmdb_id }}</p>
                    </div>

                    <div>
                        <label for="poster_url" class="form-label">Poster URL</label>
                        <input type="text" id="poster_url" name="poster_url" class="form-input"
                            placeholder="https://res.cloudinary.com/..." autocomplete="poster_url"
                            v-model="formData.poster_url">
                        <p v-if="errors.poster_url" class="form-error">{{ errors.poster_url }}</p>
                    </div>

                    <div>
                        <label for="story" class="form-label">Story / Overview</label>
                        <textarea id="story" name="story" rows="4" class="form-textarea resize-none"
                            placeholder="اكتب قصة العمل..." autocomplete="story" v-model="formData.story"></textarea>
                        <p v-if="errors.story" class="form-error">{{ errors.story }}</p>
                    </div>

                    <div>
                        <label for="rating" class="form-label">Rating</label>
                        <input type="text" step="0.1" id="rating" name="rating" class="form-input" placeholder="7.3"
                            autocomplete="rating" v-model="formData.rating">
                        <p v-if="errors.rating" class="form-error">{{ errors.rating }}</p>
                    </div>

                    <!-- Genres Multi-Select Grid -->
                    <div>
                        <span class="form-label">Genres</span>
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
                        <label for="runtime" class="form-label">Runtime</label>
                        <input type="text" id="runtime" name="runtime" class="form-input"
                            placeholder="1 ساعة و 57 دقيقة" autocomplete="runtime" v-model="formData.runtime">
                        <p v-if="errors.runtime" class="form-error">{{ errors.runtime }}</p>
                    </div>

                    <div>
                        <label for="duration_iso" class="form-label">Duration (ISO)</label>
                        <input type="text" id="duration_iso" name="duration_iso" class="form-input"
                            placeholder="PT01H57M" autocomplete="duration_iso" v-model="formData.duration_iso">
                        <p v-if="errors.duration_iso" class="form-error">{{ errors.duration_iso }}</p>
                    </div>

                    <div>
                        <label for="labels" class="form-label">Labels</label>
                        <input type="text" id="labels" name="labels" class="form-input text-right"
                            placeholder="دراما, تاريخ, إثارة, حرب" autocomplete="labels" v-model="formData.labels">
                        <p v-if="errors.labels" class="form-error">{{ errors.labels }}</p>
                    </div>

                    <!-- Category Radio Group -->
                    <div>
                        <span class="form-label">Category <span class="text-danger">*</span></span>
                        <div
                            class="flex items-center gap-6 mt-2 p-3 bg-card-hover rounded-xl border border-line">
                            <label for="Category_tv"
                                class="flex items-center gap-2 cursor-pointer text-fluid-xs font-medium text-title">
                                <input type="radio" id="Category_tv" name="Category" value="tv"
                                    class="accent-accent size-4" required v-model="formData.category">
                                TV
                            </label>
                            <label for="Category_movie"
                                class="flex items-center gap-2 cursor-pointer text-fluid-xs font-medium text-title">
                                <input type="radio" id="Category_movie" name="Category" value="movie"
                                    class="accent-accent size-4" v-model="formData.category">
                                Movie
                            </label>
                        </div>
                        <p v-if="errors.category" class="form-error">{{ errors.category }}</p>
                    </div>

                    <!-- Media Type Radio Group -->
                    <div>
                        <span class="form-label">Media Type <span class="text-danger">*</span></span>
                        <div
                            class="flex items-center gap-6 mt-2 p-3 bg-card-hover rounded-xl border border-line">
                            <label for="type_series"
                                class="flex items-center gap-2 cursor-pointer text-fluid-xs font-medium text-title">
                                <input type="radio" id="type_series" name="media_type" value="series"
                                    class="accent-accent size-4" required v-model="formData.media_type">
                                Series
                            </label>
                            <label for="type_movie"
                                class="flex items-center gap-2 cursor-pointer text-fluid-xs font-medium text-title">
                                <input type="radio" id="type_movie" name="media_type" value="movie"
                                    class="accent-accent size-4" v-model="formData.media_type">
                                Movie
                            </label>
                        </div>
                        <p v-if="errors.media_type" class="form-error">{{ errors.media_type }}</p>
                    </div>

                    <!-- Status: Is Ready Checkbox -->
                    <div>
                        <label for="is_ready"
                            class="flex items-center justify-between p-3 bg-card-hover rounded-xl border border-line cursor-pointer hover:bg-card transition-colors">
                            <span class="text-fluid-xs font-semibold text-title">Status: Is Ready</span>
                            <input type="checkbox" id="is_ready" name="is_ready"
                                class="accent-accent size-5 rounded cursor-pointer" v-model="formData.is_ready">
                        </label>
                        <p v-if="errors.is_ready" class="form-error">{{ errors.is_ready }}</p>
                    </div>

                    <!-- Status: Is Facebook Posted Checkbox -->
                    <div>
                        <label for="is_facebook_posted"
                            class="flex items-center justify-between p-3 bg-card-hover rounded-xl border border-line cursor-pointer hover:bg-card transition-colors">
                            <span class="text-fluid-xs font-semibold text-title">Status: Is Facebook Posted</span>
                            <input type="checkbox" id="is_facebook_posted" name="is_facebook_posted"
                                class="accent-accent size-5 rounded cursor-pointer"
                                v-model="formData.is_facebook_posted">
                        </label>
                        <p v-if="errors.is_facebook_posted" class="form-error">{{ errors.is_facebook_posted }}</p>
                    </div>

                </div>

            </div>

            <!-- Actions Bar -->
            <div class="pt-6 border-t border-line flex items-center justify-end gap-3">
                <button type="button" @click="router.back()" class="btn-secondary">
                    Cancel
                </button>
                <button type="submit" class="btn-primary" :disabled="mediaStore.isLoading">
                    <span v-if="mediaStore.isLoading" class="flex items-center gap-2">
                        <span class="size-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></span>
                        <span>Processing...</span>
                    </span>
                    <span v-else>{{ mediaId ? 'Update Media' : 'Add Media' }}</span>
                </button>
            </div>
        </form>
    </main>
</template>
