<script setup>
import { SquarePen, SaveCheck, ShieldLock, KeyRound } from '@lucide/vue'
import { onMounted, ref, toRaw } from 'vue'
import { useUserStore } from '@/stores/userStore';
import { useFormValidation } from '@/composables/useFormValidation'
import { updateUserByIdSchema, changePasswordSchema } from '@/schemas/authSchema'
import { useNotificationStore } from '@/stores/notificationStore'

const userStore = useUserStore()
const { validate: validateProfile, errors: profileErrors } = useFormValidation(updateUserByIdSchema)
const { validate: validatePassword, errors: passwordErrors } = useFormValidation(changePasswordSchema)

const notiStore = useNotificationStore()

const userInfo = () => userStore.getUserById()

let formData = ref({
  username: '',
  email: '',
  avatar_url: '',
})

let formPasswordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const data = () => {
  formData.value.username = userStore.userInfo?.username ?? ''
  formData.value.email = userStore.userInfo?.email ?? ''
  formData.value.avatar_url = userStore.userInfo?.avatar_url ?? ''
}

const utilsSubmit = async (formData, validateSchema, apiCall) => {
  const rawFormData = toRaw(formData)
  const { isValid, data } = validateSchema(rawFormData)


  console.log("هل البيانات صالحة؟", isValid)
  console.log(data)
  if (!isValid) return

  const isSuccess = await apiCall(data)
  console.log(isSuccess)
  if (isSuccess) {
    notiStore.triggerNotification(userStore.successMessage || 'تم تحديث البيانات بنجاح')
  } else {
    notiStore.triggerNotification(userStore.errorMessages || 'حدثت مشكله اثناء تحديث البيانات!')
  }
}

const handleSubmitFormData = async () => {

  if (!formData.value) {
    notiStore.triggerNotification = 'يجب ارسال بيانات اولا!'
    return null
  }

  utilsSubmit(formData.value, validateProfile, userStore.updateUserInfo)
}

const handleSubmitFormPasswordData = async () => {

  if (!formPasswordData.value) {
    notiStore.triggerNotification = 'يجب ارسال بيانات اولا!'
    return null
  }

  console.log(formPasswordData.value)
  utilsSubmit(formPasswordData.value, validatePassword, userStore.ChangePassword)

}


onMounted(async () => {
  await userInfo()
  data()
})

</script>
<template>
  <!-- container -->
  <section
    class="grid grid-cols-1 gap-fluid-gap md:grid-cols-2 space-y-6 max-w-6xl mx-auto mb-8 w-full min-w-0 overflow-x-hidden">
    <!-- left -->
    <div>
      <!-- form edit  -->
      <form @submit.prevent="handleSubmitFormData" class="max-w-xl card space-y-5">
        <!-- header h2 & P -->
        <div>
          <div class="flex gap-2">
            <SquarePen :stroke-width="1" class="text-accent" />
            <span class="text-fluid-h2">Edit Profile</span>
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
            class=" btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
            <SaveCheck />
            Save Change
          </button>
        </div>
      </form>
    </div>



    <!-- right -->
    <div>
      <!-- form edit  -->
      <form @submit.prevent="handleSubmitFormPasswordData" class="max-w-xl card space-y-5">
        <!-- header h2 & P -->
        <div>
          <div class="flex gap-2">
            <ShieldLock :stroke-width="1" class="text-accent" />
            <span class="text-fluid-h2">Change Password</span>
          </div>
          <p class="text-fluid-xs text-sub">Update your personal password</p>
        </div>

        <div>
          <label for="currentPassword" class="form-label">Current Password</label>
          <input id="currentPassword" type="password" placeholder="********" required class="form-input"
            v-model="formPasswordData.currentPassword" />
          <p v-if="passwordErrors?.currentPassword" class="form-error">
            {{ passwordErrors.currentPassword }}
          </p>
        </div>

        <div>
          <label for="newPassword" class="form-label">New Password</label>
          <input id="newPassword" type="password" placeholder="**********" required class="form-input"
            v-model="formPasswordData.newPassword" />
          <p v-if="passwordErrors?.newPassword" class="form-error">
            {{ passwordErrors.newPassword }}
          </p>
        </div>

        <div>
          <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
          <input id="confirmNewPassword" type="password" class="form-input" placeholder="**********" required
            v-model="formPasswordData.confirmNewPassword" />
          <p v-if="passwordErrors?.confirmNewPassword" class="form-error">
            {{ passwordErrors.confirmNewPassword }}
          </p>
        </div>


        <!-- الأزرار -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <button type="button" class="btn-secondary">cancel</button>
          <button type="submit" :disabled="userStore.isLoading"
            class=" btn-outline shadow-glow/10 text-fluid-xs lg:text-fluid-p text-accent-dark hover:text-slate-900 hover:bg-accent/70">
            <KeyRound />
            Change Password
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
