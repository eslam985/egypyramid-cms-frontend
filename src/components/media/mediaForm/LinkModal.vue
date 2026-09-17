<script setup>
import { reactive, onMounted, computed, toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useFormValidation } from '@/composables/useFormValidation'
import { useNotificationStore } from '@/stores/notificationStore'

import { createLinkSchema, updateLinkByIdSchema } from '@/schemas/linkSchema'
import { useMediaContentStore } from '@/stores/mediaContentStore'


const route = useRoute()
const router = useRouter()
const mediaContentStore = useMediaContentStore()
const notiStore = useNotificationStore()


const currentSchema = computed(() => route.name === 'addLink' ? createLinkSchema : updateLinkByIdSchema)
const { errors, validate } = useFormValidation(currentSchema)


const episodeId = route.params.episode_id
const linkId = route.params.id

const formData = reactive({
    server_name: '',
    url: '',
    last_check_status: '',
    link_type: '',
    quality: '',
    is_fixed: false,
    check_count: 0,
})

onMounted(async () => {
    if (route.name === "addLink") {
        const foundEpisode = await mediaContentStore.getEpisodeById(episodeId)
        if (!foundEpisode) {
            notiStore.triggerNotification(mediaContentStore.errorMessage || 'لم يتم العثور علي الحلقة!')
            router.push({ nme: 'NotFound' })
        }
    } else if (route.name === "editLink") {
        const link = await mediaContentStore.getLinkById(linkId)
        if (!link) {
            notiStore.triggerNotification(mediaContentStore.errorMessage || 'لم يتم العثور علي اللينك!')
            router.push({ nme: 'NotFound' })
        }

        if (link) {
            formData.server_name = link.server_name ?? ''
            formData.url = link.url ?? ''
            formData.last_check_status = link.last_check_status ?? ''
            formData.link_type = link.link_type ?? ''
            formData.quality = link.quality ?? ''
            formData.is_fixed = link.is_fixed ?? false
            formData.check_count = link.check_count ?? 0
        }
    }
})

const handleSubmit = async () => {
    mediaContentStore.successMessage = ''
    mediaContentStore.errorMessage = ''

    const { isValid, data } = validate(toRaw(formData))
    if (!isValid) return

    mediaContentStore.isLoading = true

    const isSuccess = route.name === "addLink"
        ? await mediaContentStore.addLink(episodeId, data)
        : await mediaContentStore.editLinkById(linkId, data)

    if (isSuccess) {
        const msg = route.name === 'addLink' ? 'تم اضافة لينك جديد بنجاح' : 'تم تعديل اللينك الحالي بنجاح'
        notiStore.triggerNotification(mediaContentStore.successMessage || msg)
        router.push({ name: 'mediaDetails' })

    } else {
        notiStore.triggerNotification(mediaContentStore.errorMessage || 'حدث خطأ أثناء الحفظ')
    }
}
</script>
<template>
    <main>
        <div class="max-w-2xl mx-auto card my-6 shadow-soft">
            <!-- Header -->
            <div class="mb-6 pb-4 border-b border-line">
                <h2 class="text-fluid-h3 text-title">
                    {{ route.name === 'addLink' ? 'إضافة رابط جديد' : 'تعديل بيانات الرابط' }}
                </h2>
                <p class="text-fluid-xs text-sub mt-1">
                    {{ route.name === 'addLink' ? 'إضافة رابط مشاهدة أو تحميل جديد' : 'تعديل بيانات وتفاصيل الرابط الحالي' }}
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-fluid-gap">

                    <!-- اسم السيرفر -->
                    <div>
                        <label for="server_name" class="form-label">
                            اسم السيرفر <span class="text-danger">*</span>
                        </label>
                        <input id="server_name" type="text" v-model="formData.server_name"
                            placeholder="مثال: MixDrop, Voe, Streamtape" class="form-input" required />
                        <p v-if="errors?.server_name" class="form-error">
                            {{ errors.server_name }}
                        </p>
                    </div>

                    <!-- نوع الرابط -->
                    <div>
                        <label for="link_type" class="form-label">
                            نوع الرابط <span class="text-danger">*</span>
                        </label>
                        <select id="link_type" v-model="formData.link_type" class="form-select" required>
                            <option value="" disabled>اختر نوع الرابط</option>
                            <option value="watch">مشاهدة (Watch)</option>
                            <option value="download">تحميل (Download)</option>
                        </select>
                        <p v-if="errors?.link_type" class="form-error">
                            {{ errors.link_type }}
                        </p>
                    </div>

                    <!-- الجودة -->
                    <div>
                        <label for="quality" class="form-label">
                            الجودة
                        </label>
                        <select id="quality" v-model="formData.quality" class="form-select">
                            <option value="">اختر الجودة (اختياري)</option>
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
                            عدد مرات الفحص
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
                            حالة الفحص الأخيرة
                        </label>
                        <select id="last_check_status" v-model="formData.last_check_status" class="form-select">
                            <option value="">اختر حالة الفحص (اختياري)</option>
                            <option value="pending">قيد الانتظار (pending)</option>
                            <option value="valid">شغال / سليم (valid)</option>
                            <option value="broken">معطّل / مكسور (broken)</option>
                        </select>
                        <p v-if="errors?.last_check_status" class="form-error">
                            {{ errors.last_check_status }}
                        </p>
                    </div>

                    <!-- رابط السيرفر (URL) -->
                    <div class="sm:col-span-2">
                        <label for="url" class="form-label">
                            رابط السيرفر (URL) <span class="text-danger">*</span>
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
                            تم إصلاح الرابط / رابط ثابت (Is Fixed)
                        </label>
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
                            {{ route.name === 'addLink' ? 'حفظ الرابط' : 'تحديث الرابط' }}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>
