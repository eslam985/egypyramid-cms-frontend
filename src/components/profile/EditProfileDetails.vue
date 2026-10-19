<script setup lang="ts">
import { SquarePen, SaveCheck, ShieldLock, KeyRound, Eye, EyeOff } from '@lucide/vue'
import { onMounted, ref } from 'vue'


import { updateUserByIdSchema, changePasswordSchema } from '@/schemas/authSchema'
import { useFormValidation } from '@/composables/useFormValidation'
import { utilsSubmit } from '@/composables/useUtilsSubmit'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'

import AddNewUser from '@/components/profile/AddNewUser.vue'

import type { UpdateUserInputsType, ChangePasswordInputsType } from '@/schemas/authSchema'
import type { UserDataResponse } from '@/types/userType'

const userStore = useUserStore()
const authStore = useAuthStore()

const { validate: validateProfile, errors: profileErrors } = useFormValidation(updateUserByIdSchema)
const { validate: validatePassword, errors: passwordErrors } =
    useFormValidation(changePasswordSchema)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

let formData = ref<UpdateUserInputsType>({
    username: '',
    email: '',
    avatar_url: '',
    roles: '',
})

let formPasswordData = ref<ChangePasswordInputsType>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
})


const data = () => {
    formData.value.username = userStore.userInfo?.username ?? ''
    formData.value.email = userStore.userInfo?.email ?? ''
    formData.value.avatar_url = userStore.userInfo?.avatar_url ?? ''
    formData.value.roles = userStore.userInfo?.roles ?? ''
}

const handleSubmitFormData = async (): Promise<UserDataResponse | null> =>
    utilsSubmit(undefined, formData.value, validateProfile, userStore.updateUserInfo)

const handleSubmitFormPasswordData = async (): Promise<void | null> => {
    const isPassSame: boolean = formPasswordData.value.newPassword !== formPasswordData.value.confirmNewPassword

    if (isPassSame) {
        userStore.notiStore.triggerNotification('The password does not match.')
        return null
    }

    utilsSubmit(undefined, formPasswordData.value, validatePassword, userStore.ChangePassword)
}


const userInfo = async () => await userStore.getUserById(false)
onMounted(async () => {
    await userInfo()
    data()
})

</script>
<template>
    <!-- container -->
    <section :class="authStore.isEditorAndAbove ? 'md:grid-cols-3' : 'md:grid-cols-2'"
        class="grid grid-cols-1 gap-3 space-y-6 max-w-6xl mx-auto mb-8 w-full min-w-0 overflow-x-hidden">
        <!-- left -->
        <div>
            <!-- form edit  -->
            <form @submit.prevent="handleSubmitFormData" class="max-w-xl card space-y-5">
                <!-- header h2 & P -->
                <div>
                    <div class="flex gap-2">
                        <SquarePen :stroke-width="1" class="text-accent" />
                        <span class="text-fluid-h3">Edit Profile</span>
                    </div>
                    <p class="text-fluid-xs text-sub">Update your personal information</p>
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
                <div v-if="authStore.isAdmin">
                    <label for="roles" class="roles">Roles</label>
                    <input id="roles" type="text" class="form-input text-link" placeholder="2001"
                        v-model="formData.roles" />
                    <p v-if="profileErrors?.roles" class="form-error">
                        {{ profileErrors.roles }}
                    </p>
                </div>
                <div>
                    <label for="avatarUrl" class="form-label">Avatar Url</label>
                    <input id="avatarUrl" type="text" class="form-input text-link"
                        placeholder="https://edn.egypyramid.io/avatars/ahmed.png" v-model="formData.avatar_url" />
                    <p v-if="profileErrors?.avatar_url" class="form-error">
                        {{ profileErrors.avatar_url }}
                    </p>
                </div>

                <!-- الأزرار -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-line">
                    <button type="button" @click="data" class="btn-secondary">cancel</button>
                    <button type="submit" :disabled="userStore.isLoading"
                        class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
                        <SaveCheck />
                        Save Change
                    </button>
                </div>
            </form>
        </div>

        <!-- right -->
        <div>
            <!-- form edit  -->
            <form @submit.prevent="handleSubmitFormPasswordData" class="max-w-xl card space-y-5 px-2 lg:px-4">
                <!-- header h2 & P -->
                <div>
                    <div class="flex gap-0.5 lg:gap-2">
                        <ShieldLock :stroke-width="1" class="text-accent" />
                        <span class="text-fluid-h3 text-nowrap">Change Password</span>
                    </div>
                    <p class="text-fluid-xs text-sub">Update your personal password</p>
                </div>

                <div>
                    <label for="currentPassword" class="form-label">Current Password</label>
                    <div class="relative">
                        <input id="currentPassword" :type="showCurrentPassword ? 'text' : 'password'"
                            placeholder="********" required class="form-input"
                            v-model="formPasswordData.currentPassword" />

                        <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-sub hover:text-accent">
                            <EyeOff v-if="showCurrentPassword" class="w-5 h-5" />
                            <Eye v-else class="w-5 h-5" />
                        </button>
                    </div>
                    <p v-if="passwordErrors?.currentPassword" class="form-error">
                        {{ passwordErrors.currentPassword }}
                    </p>
                </div>

                <div>
                    <label for="newPassword" class="form-label">New Password</label>
                    <div class="relative">
                        <input id="newPassword" :type="showNewPassword ? 'text' : 'password'" placeholder="**********"
                            required class="form-input" v-model="formPasswordData.newPassword" />

                        <button type="button" @click="showNewPassword = !showNewPassword"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-sub hover:text-accent">
                            <EyeOff v-if="showNewPassword" class="w-5 h-5" />
                            <Eye v-else class="w-5 h-5" />
                        </button>
                    </div>
                    <p v-if="passwordErrors?.newPassword" class="form-error">
                        {{ passwordErrors.newPassword }}
                    </p>
                </div>

                <div>
                    <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                    <div class="relative">
                        <input id="confirmNewPassword" :type="showConfirmPassword ? 'text' : 'password'"
                            class="form-input" placeholder="**********" required
                            v-model="formPasswordData.confirmNewPassword" />

                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-sub hover:text-accent">
                            <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
                            <Eye v-else class="w-5 h-5" />
                        </button>
                    </div>
                    <p v-if="passwordErrors?.confirmNewPassword" class="form-error">
                        {{ passwordErrors.confirmNewPassword }}
                    </p>
                </div>

                <!-- الأزرار -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-line">
                    <button type="button" class="btn-secondary">cancel</button>
                    <button type="submit" :disabled="userStore.isLoading"
                        class="btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
                        <KeyRound />
                        Change Password
                    </button>
                </div>
            </form>
        </div>
        <AddNewUser />
    </section>
</template>
