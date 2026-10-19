<script setup lang="ts">
import { SquarePen, SaveCheck, Eye, EyeOff } from '@lucide/vue'
import { ref } from 'vue'

import { useFormValidation } from '@/composables/useFormValidation'
import { utilsSubmit } from '@/composables/useUtilsSubmit'
import { createUserSchema } from '@/schemas/authSchema'
import { useAuthStore } from '@/stores/authStore'


import type { CreateUserInputsType } from '@/schemas/authSchema'
import type { RegisterDataResponse } from '@/types/userType'

const { validate: validateProfile, errors: profileErrors } = useFormValidation(createUserSchema)

const authStore = useAuthStore()
const showPassword = ref<boolean>(false)
let formData = ref<CreateUserInputsType>({
    username: '',
    email: '',
    roles: '',
    password: '',
})

const resetForm = () => {
    return formData.value = {
        username: '',
        email: '',
        roles: '',
        password: '',
    }
}

const handleSubmitFormData = async (): Promise<RegisterDataResponse | null> =>
    utilsSubmit(undefined, formData.value, validateProfile, authStore.register)

</script>
<template>
    <!-- left -->
    <div class="space-y-6 max-w-6xl mx-auto w-full min-w-0 overflow-x-hidden">
        <!-- form edit  -->
        <form v-if="authStore.isAdmin" @submit.prevent="handleSubmitFormData" class="max-w-xs card space-y-5">
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
                <input id="userName" type="text" placeholder="Eslam Sayed" required class="form-input"
                    v-model="formData.username" />
                <p v-if="profileErrors?.username" class="form-error">
                    {{ profileErrors.username }}
                </p>
            </div>

            <div>
                <label for="email" class="form-label">email</label>
                <input id="email" type="text" placeholder="es@gmail.com" required class="form-input"
                    v-model="formData.email" />
                <p v-if="profileErrors?.email" class="form-error">
                    {{ profileErrors.email }}
                </p>
            </div>

            <div>
                <label for="roles" class="roles">Roles</label>
                <input id="roles" type="text" class="form-input text-link" placeholder="2001"
                    v-model="formData.roles" />
                <p v-if="profileErrors?.roles" class="form-error">
                    {{ profileErrors.roles }}
                </p>
            </div>
            <div>
                <label for="password" class="form-label">Password</label>

                <!-- حقل الباسورد -->
                <div class="relative">
                    <input id="password" :type="showPassword ? 'text' : 'password'" placeholder="**********" required
                        class="form-input pr-10" v-model="formData.password" />

                    <!-- زر إظهار وإخفاء الباسورد -->
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 flex items-center pr-3 text-sub hover:text-accent">
                        <EyeOff v-if="showPassword" class="w-5 h-5" />
                        <Eye v-else class="w-5 h-5" />
                        </button>
                </div>

                <p v-if="profileErrors?.password" class="form-error">
                    {{ profileErrors.password }}
                </p>
            </div>
            <!-- الأزرار -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-line">
                <button type="button" @click="resetForm" class="btn-secondary">cancel</button>
                <button type="submit" :disabled="authStore.isLoading"
                    class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
                    <SaveCheck />
                    Save Change
                </button>
            </div>
        </form>
    </div>
</template>
