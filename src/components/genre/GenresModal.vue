<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { reactive, onMounted, toRaw, onUnmounted } from 'vue'

import { createGenreSchema, updateGenreByIdSchema } from '@/schemas/genreSchema'
import { useFormValidation } from '@/composables/useFormValidation'
import { useGenresStore } from '@/stores/genreStore'
import { useI18n } from 'vue-i18n'

import type { CreateGenreSchemaType } from '@/schemas/genreSchema'
import type { GenresResponse } from '@/types/globalTypes'

const { t } = useI18n()
const router = useRouter()
const genresStore = useGenresStore()
const route = useRoute()

const id: string | string[] | undefined = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id
const genreId: number = Number(id)
const formData = reactive<CreateGenreSchemaType>({
    name: '',
})

// استبدل السطرين القديمين بهذا السطر فقط:
const { errors, validate } = useFormValidation(genreId ? updateGenreByIdSchema : createGenreSchema)

const handleSubmit = async (): Promise<void> => {
    const { isValid, data } = validate(toRaw(formData))
    if (!isValid || !data) return

    const isSuccess: GenresResponse | null = genreId
        ? await genresStore.editGenreById(genreId, data)
        : await genresStore.addGenre(data)

    if (isSuccess && Object.keys(isSuccess).length > 0) {
        router.push({ name: 'genresList' })
    }
}

onMounted(async () => {
    if (genreId) {
        // 1. انتظر حتى يتم جلب البيانات وتخزينها في الستور
        await genresStore.fetchGenreById(genreId)

        // 2. استخدام التوجيه الآمن (?) للتأكد من أن الكائن ليس null
        formData.name = genresStore.currentGenre?.name || ''
    }
})

onUnmounted(() => {
    genresStore.resetGenreState()
})
</script>
<template>
    <div class="max-w-xl mx-auto card my-6 shadow-soft">
        <!-- Header -->
        <div class="mb-6 pb-4 border-b border-line">
            <h2 class="text-fluid-h3 text-title">
                {{ genreId ? t('genres.editTitle') : t('genres.addTitle') }}
            </h2>
            <p class="text-fluid-xs text-sub mt-1">
                {{ genreId ? t('genres.editSubtitle') : t('genres.addSubtitle') }}
            </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Genre Name Input -->
            <div>
                <label for="name" class="form-label">
                    {{ t('genres.nameLabel') }} <span class="text-danger">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    v-model="formData.name"
                    :placeholder="t('genres.namePlaceholder')"
                    class="form-input border border-line rounded-xl"
                    :class="{
                        'border-danger focus:ring-danger/20 focus:border-danger': errors.name,
                    }"
                />
                <p v-if="errors.name" class="form-error">
                    {{ errors.name }}
                </p>
            </div>

            <!-- Actions Bar -->
            <div class="pt-4 border-t border-line flex items-center justify-end gap-3">
                <button type="button" @click="router.back()" class="btn-secondary">
                    {{ t('common.cancel') }}
                </button>
                <button type="submit" class="btn-primary" :disabled="genresStore.isLoading">
                    <span v-if="genresStore.isLoading" class="flex items-center gap-2">
                        <svg
                            class="animate-spin h-4 w-4 text-on-accent"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        {{ t('common.processing') }}
                    </span>
                    <span v-else>{{ genreId ? t('genres.updateBtn') : t('genres.addBtn') }}</span>
                </button>
            </div>
        </form>
    </div>
</template>
