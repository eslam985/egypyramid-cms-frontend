<script setup>
import { reactive, onMounted, computed, toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useFormValidation } from '@/composables/useFormValidation'
import { createSeasonSchema, updateSeasonSchema } from '@/schemas/seasonSchema'
import { useNotificationStore } from '@/stores/notificationStore'

import { useMediaContentStore } from '@/stores/mediaContentStore'
import { useMediaStore } from '@/stores/mediaStore'

const { t } = useI18n()

const mediaContentStore = useMediaContentStore()
const mediaStore = useMediaStore()
const router = useRouter()
const route = useRoute()
const notiStore = useNotificationStore()

const mediaId = route.params.media_id
const seasonId = route.params.id

const currentSchema = computed(() => (mediaId ? createSeasonSchema : updateSeasonSchema))
const { errors, validate } = useFormValidation(currentSchema)

const formData = reactive({
  season_number: 0,
})

onMounted(async () => {
  // Add New Season In Current Media
  if (route.name === 'addSeason') {
    const foundMedia = await mediaStore.getMediaById(mediaId)
    if (!foundMedia && !mediaStore.currentMedia) {
      notiStore.triggerNotification(mediaStore.errorMessage || t('media.form.notFound'))
      router.push({ name: 'NotFound' })
    }
  }

  // edit current season
  if (route.name === 'editSeason') {
    const foundSeason = await mediaContentStore.getSeasonById(seasonId, true)

    if (!foundSeason && !mediaContentStore.currentSeason) {
      notiStore.triggerNotification(mediaContentStore.errorMessage || t('media.seasonForm.notFound'))
      router.push({ name: 'NotFound' })
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

  const isSuccess =
    route.name === 'editSeason'
      ? await mediaContentStore.editSeasonById(seasonId, data)
      : await mediaContentStore.addSeason(mediaId, data)

  if (isSuccess) {
    const msg = route.name === 'addSeason' ? t('media.seasonForm.addedSuccess') : t('media.seasonForm.updatedSuccess')
    notiStore.triggerNotification(mediaContentStore.successMessage || msg)
    router.push({ name: 'mediaDetails' })
  } else {
    notiStore.triggerNotification(mediaContentStore.errorMessage || t('media.seasonForm.saveError'))
  }
}
</script>
<template>
  <main>
    <div class="max-w-xl mx-auto card my-6 shadow-soft">
      <!-- Header -->
      <div class="mb-6 pb-4 border-b border-line">
        <h2 class="text-fluid-h3 text-title">
          {{ route.name === 'editSeason' ? t('media.seasonForm.editTitle') : t('media.seasonForm.addTitle') }}
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
            {{ t('media.seasonForm.seasonNumberLabel') }} <span class="text-danger">*</span>
          </label>
          <input type="number" id="season_number" name="season_number" required v-model.number="formData.season_number"
            :placeholder="t('media.seasonForm.seasonNumberPlaceholder')" class="form-input" :class="{
              'border-danger focus:ring-danger/20 focus:border-danger': errors.season_number,
            }" />
          <p v-if="errors.season_number" class="form-error">
            {{ errors.season_number }}
          </p>
        </div>

        <!-- Actions Bar -->
        <div class="pt-4 border-t border-line flex items-center justify-end gap-3">
          <button type="button" @click="router.back()" class="btn-secondary">{{ t('common.cancel') }}</button>
          <button type="submit" class="btn-primary" :disabled="mediaContentStore.isLoading">
            <span v-if="mediaContentStore.isLoading" class="flex items-center gap-2">
              <span class="size-4 border-2 border-on-accent border-t-transparent rounded-full animate-spin"></span>
              <span>{{ t('common.processing') }}</span>
            </span>
            <span v-else>{{ route.name === 'editSeason' ? t('media.seasonForm.updateBtn') : t('media.seasonForm.addBtn')
              }}</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
