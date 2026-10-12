<script setup lang="ts">
import { SquarePen, SaveCheck } from '@lucide/vue'
import { ref, toRaw } from 'vue'

import { useAuthStore } from '@/stores/authStore'
import { useFormValidation } from '@/composables/useFormValidation'
import { createUserSchema } from '@/schemas/authSchema'
import { useNotificationStore } from '@/stores/notificationStore'

import type { CreateUserInputsType } from '@/schemas/authSchema'

const { validate: validateProfile, errors: profileErrors } = useFormValidation(createUserSchema)

const authStore = useAuthStore()
const notiStore = useNotificationStore()

let formData = ref<CreateUserInputsType>({
    username: '',
    email: '',
    roles: '',
    password: '',
})

const resetForm = (): {
    username: string
    email: string
    roles: string
    password: string
} =>
    (formData.value = {
        username: '',
        email: '',
        roles: '',
        password: '',
    })

// 1. (اختياري ولكن أنظف) يمكنك تعريف أنواع للـ Schemas والـ API لتسهيل القراءة
type ValidationResult = {
    isValid: boolean
    data: any | null
}

const utilsSubmit = async <TInputs, TResponse>(
    formData: TInputs,
    validateSchema: (data: any) => ValidationResult,
    apiCall: (data: TInputs) => Promise<TResponse | null>,
): Promise<TResponse | null> => {
    const rawFormData = toRaw(formData)
    const { isValid, data } = validateSchema(rawFormData)

    if (!isValid || !data) return null

    await apiCall(data)

    return null
}

const handleSubmitFormData = async (): Promise<void | null> => {
    if (!formData.value) {
        notiStore.triggerNotification('يجب ارسال بيانات اولا!')
        return null
    }

    utilsSubmit(formData.value, validateProfile, authStore.register)
}
</script>
<template>
    <!-- left -->
    <div class="space-y-6 max-w-6xl mx-auto w-full min-w-0 overflow-x-hidden">
        <!-- form edit  -->
        <form
            v-if="authStore.isAdmin"
            @submit.prevent="handleSubmitFormData"
            class="max-w-xs card space-y-5"
        >
            <!-- header h2 & P -->
            <div>
                <div class="flex gap-2">
                    <SquarePen :stroke-width="1" class="text-accent" />
                    <span class="text-fluid-h3">Add New User</span>
                </div>
                <p class="text-fluid-xs text-sub">Add New User in Your System</p>
            </div>

            <div>
                <label for="userName" class="form-label">Name</label>
                <input
                    id="userName"
                    type="text"
                    placeholder="Eslam Sayed"
                    required
                    class="form-input"
                    v-model="formData.username"
                />
                <p v-if="profileErrors?.username" class="form-error">
                    {{ profileErrors.username }}
                </p>
            </div>

            <div>
                <label for="email" class="form-label">email</label>
                <input
                    id="email"
                    type="text"
                    placeholder="es@gmail.com"
                    required
                    class="form-input"
                    v-model="formData.email"
                />
                <p v-if="profileErrors?.email" class="form-error">
                    {{ profileErrors.email }}
                </p>
            </div>

            <div>
                <label for="roles" class="roles">Roles</label>
                <input
                    id="roles"
                    type="text"
                    class="form-input text-link"
                    placeholder="2001"
                    v-model="formData.roles"
                />
                <p v-if="profileErrors?.roles" class="form-error">
                    {{ profileErrors.roles }}
                </p>
            </div>
            <div>
                <label for="password" class="form-label">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="**********"
                    required
                    class="form-input"
                    v-model="formData.password"
                />
                <p v-if="formData?.password" class="form-error">
                    {{ profileErrors.password }}
                </p>
            </div>
            <!-- الأزرار -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-line">
                <button type="button" @click="resetForm" class="btn-secondary">cancel</button>
                <button
                    type="submit"
                    :disabled="authStore.isLoading"
                    class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70"
                >
                    <SaveCheck />
                    Save Change
                </button>
            </div>
        </form>
    </div>
</template>
