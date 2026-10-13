<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFormValidation } from '../../composables/useFormValidation'
import { utilsSubmit } from '@/composables/useUtilsSubmit'
import { loginUserSchema } from '../../schemas/authSchema'
import { useAuthStore } from '../../stores/authStore'

import type { LoginUserInputsType } from '../../schemas/authSchema'

const showPassword = ref(false)

const formData = reactive<LoginUserInputsType>({
    email: '',
    password: '',
})

const { errors, validate } = useFormValidation(loginUserSchema)

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const handleSubmit = async (): Promise<boolean | null> =>
    utilsSubmit(undefined, formData, validate, authStore.loginUser, () => router.push('/'))

</script>

<template>
    <div class="min-h-screen flex select-none">

        <!-- القسم الأيسر: فورم تسجيل الدخول -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 ">
            <!-- صندوق تسجيل الدخول -->
            <div class="card p-fluid-section flex flex-col gap-4 bg-card/80">
                <!-- شعار ومقدمة ترحيبية -->
                <div class="text-center space-y-2">
                    <div
                        class="inline-flex w-12 h-12 bg-accent rounded-2xl items-center justify-center text-white font-black text-lg shadow-lg shadow-accent/20 mb-2">
                        D
                    </div>
                    <h2 class="text-2xl font-bold text-title tracking-tight">
                        {{ t('auth.welcomeBack') }}
                    </h2>
                    <p class="text-sub text-sm">{{ t('auth.pleaseEnterDetails') }}</p>
                </div>

                <!-- استمارة تسجيل الدخول -->
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- حقل اسم المستخدم -->
                    <div class="flex flex-col gap-1.5">
                        <label for="email" class="form-label">email</label>
                        <div class="relative">
                            <input id="email" type="text" :placeholder="t('auth.usernamePlaceholder')"
                                v-model="formData.email" :class="[
                                    errors.email ? 'border-red-500 focus:ring-red-100' : '',
                                    'form-input pl-11!',
                                ]" />

                            <p v-if="errors.email" class="text-fluid-xs text-red-500 mt-1">
                                {{ errors.email }}
                            </p>
                        </div>
                    </div>

                    <!-- حقل كلمة المرور -->
                    <div class="flex flex-col gap-1.5">
                        <div class="flex justify-between items-center">
                            <label for="password" class="form-label mb-0">{{ t('auth.password') }}</label>
                            <a href="#"
                                class="text-fluid-xs font-semibold text-accent hover:text-accent-dark transition-colors">{{
                                    t('auth.forgotPassword') }}</a>
                        </div>

                        <div class="relative">
                            <input id="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                                v-model="formData.password" :class="[
                                    errors.password ? 'border-red-500 focus:ring-red-100' : '',
                                    'form-input pr-10',
                                ]" />

                            <button type="button" @click="showPassword = !showPassword"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-sub hover:text-accent">
                                <EyeOff v-if="showPassword" class="w-5 h-5" />
                                <Eye v-else class="w-5 h-5" />
                            </button>

                            <p v-if="errors.password" class="text-fluid-xs text-red-500 mt-1">
                                {{ errors.password }}
                            </p>
                        </div>
                    </div>

                    <!-- زر تسجيل الدخول -->
                    <button type="submit" class="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                        :disabled="authStore.isLoading">
                        <span>{{ authStore.isLoading ? t('auth.signingIn') : t('auth.signIn') }}</span>
                    </button>
                </form>
            </div>
        </div>

        <!-- القسم الأيمن: الجزء الجمالي (يظهر فقط في الشاشات الكبيرة lg) -->
        <div
            class="hidden lg:flex lg:w-1/2 relative bg-accent/10 items-center justify-center p-12 overflow-hidden border-l border-line">
            <!-- خلفية وتدرج جمالي (Hero Section / Pattern) -->
            <div class="absolute inset-0 from-accent/20 bg-linear-to-br  via-background to-background opacity-60"></div>

            <!-- محتوى الجانب الأيمن (صورة، ترحيب، إحصائيات، إلخ) -->
            <div class="relative z-10 max-w-lg text-center space-y-6">
                <div class="card bg-card/60 shadow-2xl">
                    <h3 class="text-fluid-h2 font-bold text-accent-light mb-2">
                        Guardian Ultra System
                    </h3>
                    <p class="text-sub text-fluid-p">
                        Manage your media, users, and content dynamically with full control and security.
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>
