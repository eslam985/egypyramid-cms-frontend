<script setup>
import { Mail, CalendarDays, Link, Camera, Trash2, History, ImagePlus } from '@lucide/vue'

import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore';
import { formatDate, confirmAndDelete } from '@/utils/global'
import { useNotificationStore } from '@/stores/notificationStore'


const userStore = useUserStore()
const notiStore = useNotificationStore()

// المتغيرات المتفاعلة الجديدة
const selectedFile = ref(null)       // لتخزين كائن الملف الصافي لإرساله للسيرفر لاحقاً
const avatarPreview = ref(null)      // لتخزين رابط المعاينة المؤقت في الشاشة
// متغيرات التحكم في فتح وإغلاق الواجهات
const isDropdownOpen = ref(false)  // التحكم في قائمة الخيارات
const isModalOpen = ref(false)     // التحكم في نافذة السجل القديم

// دالة التقاط الملف وتوليد المعاينة
const handleFileChange = (event) => {
  const file = event.target.files[0] // التقاط أول ملف اختاره المستخدم
  if (!file) return

  selectedFile.value = file // حفظ الملف الصافي في المتغير

  // توليد رابط المعاينة المؤقت وتخزينه ليعرض في الـ <img> فوراً
  avatarPreview.value = URL.createObjectURL(file)
}

// دالة رفع الصورة الفعلية إلى السيرفر (يتم استدعاؤها عند الضغط على زر حفظ الخاص بك)
const handleUpload = async () => {
  if (!selectedFile.value) return null

  // الملفات لا تُرسل كـ JSON عادي، يجب وضعها داخل FormData
  const formData = new FormData()
  formData.append('profileImage', selectedFile.value)

  const isSuccess = await userStore.uploadAvatar(formData)

  if (isSuccess) {
    notiStore.triggerNotification(userStore.successMessage || 'تم تحديث الصورة الشخصية بنجاح')
  }
  selectedFile.value = null // تصفير الملف بعد النجاح
}

const handleDelete = () => {
  confirmAndDelete({
    message: 'هل انت متأكد من حذف هذة الصورة ؟',
    action: () => userStore.deleteAvatar(),
    store: userStore,
    notiStore,
    fallbackSuccess: 'تم حذف الصورة بنجاح',
    fallbackError: 'حدث خطأ أثناء الحذف',
  })
}



// دالة تفعيل صورة قديمة من السجل
const handleSelectHistory = async (url) => {
  const isSuccess = await userStore.setAvatarFromHistory(url)
  if (isSuccess) {
    notiStore.triggerNotification(userStore.successMessage || 'تم تعيين الصورة من السجل بنجاح')
    await userStore.getUserById()
    isModalOpen.value = false // إغلاق النافذة بعد النجاح
  } else {
    notiStore.triggerNotification(userStore.errorMessages || 'حدث خطأ أثناء التبديل')
  }
}
const role = () => userStore.userInfo?.roles === "5150" ? "Admin" : userStore.userInfo?.roles === "1984" ? 'Editor' : userStore.userInfo?.roles === "2001" ? 'User' : "N/A"
</script>
<template>
  <section>
    <div @click.self="isDropdownOpen ? isDropdownOpen = false : isDropdownOpen"
      class="space-y-6 max-w-6xl mx-auto w-full min-w-0 overflow-x-hidden">
      <h2 class="text-fluid-h2 mb-4">Profile Information</h2>

      <!-- container -->
      <div @click.self="isDropdownOpen ? isDropdownOpen = false : isDropdownOpen"
        class="flex flex-col card md:flex-row gap-4 border lg:gap-8 justify-between p-fluid-section bg-card shadow mb-8 rounded-3xl">

        <div @click.self="isDropdownOpen ? isDropdownOpen = false : isDropdownOpen"
          class="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 lg:gap-8">
          <div @click.self="isDropdownOpen ? isDropdownOpen = false : isDropdownOpen"
            class="flex flex-col items-center sm:items-start gap-4">

            <!-- حاوية الصورة والأيقونة معاً -->
            <div class="relative w-26 h-26 md:w-32 md:h-32 group">

              <!-- Avatar -->
              <label class="block w-full h-full rounded-full overflow-hidden cursor-pointer">
                <!-- الـ src هنا ذكي: يعرض المعاينة المؤقتة أولاً، وإذا لم توجد يعرض صورة المستخدم الفعلية أو صورة افتراضية -->
                <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  :src="avatarPreview || userStore.userInfo?.avatar_url" alt="profile" fetchpriority="high"
                  loading="eager" decoding="async">

                <!-- ربط حدث التغيير بالـ input -->
                <input type="file" accept="image/*" class="hidden" @change="handleFileChange">
              </label>

              <!-- زر الكاميرا مثبت بدقة على حافة الصورة -->
              <!-- زر الكاميرا مدمج معه القائمة المنبثقة (Dropdown) -->
              <div class="absolute inset-e-0 bottom-0 z-50">
                <button type="button" @click="isDropdownOpen = !isDropdownOpen"
                  class="text-accent bg-white dark:bg-[#1a2640] shadow-md rounded-full p-1 md:p-2 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <Camera :stroke-width="1" />
                </button>

                <!-- القائمة المنبثقة لخيارات الصورة -->
                <!-- التعديل الصحيح والمحمي 100% ضد انكماش الأيقونات -->
                <div v-if="isDropdownOpen"
                  class="absolute inset-e-0 top-full mt-2 z-100 min-w-[150px] bg-white dark:bg-[#151f35] border border-line rounded-2xl shadow-xl p-2 flex flex-col md:flex-row-reverse gap-2 items-center justify-center animate-fade-in">

                  <!-- خيار 1: رفع صورة جديدة (مغلف داخل label) -->
                  <label
                    class="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-accent-light/10 text-text-primary transition-colors duration-200">
                    <ImagePlus class="w-5 h-5 text-accent" />
                    <input type="file" accept="image/*" class="hidden"
                      @change="(e) => { handleFileChange(e); isDropdownOpen = false; }">
                  </label>

                  <!-- خيار 2: اختيار من الصور السابقة (قمنا بتغليفه داخل button أصيل) -->
                  <button v-if="userStore.userInfo?.avatar_history?.length > 0" type="button"
                    @click="isModalOpen = true; isDropdownOpen = false;"
                    class="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-accent-light/10 text-accent transition-colors duration-200">
                    <History class="w-5 h-5" />
                  </button>

                  <!-- خيار 3: حذف الصورة الحالية والعودة للافتراضية (قمنا بتغليفه داخل button أصيل) -->
                  <button
                    v-if="userStore.userInfo?.avatar_url && userStore.userInfo?.avatar_url !== 'https://cloudinary.com'"
                    type="button" @click="handleDelete"
                    class="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-danger/10 text-danger transition-colors duration-200">
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>

              </div>
            </div>

            <!--  الزر الجديد يظهر فقط عند وجود صورة جديدة مجهزة للرفع -->
            <button v-if="selectedFile" type="button" @click="handleUpload" :disabled="userStore.isLoading"
              class="relative z-40 text-fluid-xs px-3 py-1.5 font-medium rounded-xl text-white bg-success hover:bg-success/90 active:scale-95 transition-all shadow-md flex items-center gap-1 cursor-pointer disabled:opacity-50">
              {{ userStore.isLoading ? 'Uploading...' : 'Save Photo' }}
            </button>
          </div>
          <!-- info -->
          <div @click.self="isDropdownOpen ? isDropdownOpen = false : isDropdownOpen" class="flex flex-col gap-4">
            <router-link to="/profile" class="text-fluid-h3 lg:hover:text-line-strong">{{ userStore.userInfo?.username
              }}</router-link>

            <div class="flex gap-2">
              <Mail :stroke-width="1" class="text-accent" />
              <a target="_blank" href="mailto:ee17172@gmail.com" class="text-text-primary lg:hover:text-link-hover">
                {{ userStore.userInfo?.email }}
              </a>
            </div>

            <div class="flex gap-2">
              <CalendarDays :stroke-width="1" class="text-accent" />
              <span
                class="py-1 px-2 rounded-xl max-w-[270px] text-fluid-p text-foreground dark:bg-[#151f35] bg-accent-light">
                Member since {{ formatDate(userStore.userInfo?.created_at) }}
              </span>
            </div>

            <div class="flex gap-3">
              <Link :stroke-width="1" class="w-full max-w-6 text-accent" />
              <a target="_blank" :href="userStore.userInfo?.avatar_url"
                class="text-fluid-xs text-link truncate lg:hover:text-link-hover cursor-pointer transition-colors">
                Avatar URL {{ userStore.userInfo?.avatar_url ? userStore.userInfo?.avatar_url :
                  'https://edn.egypyramid.io/avatars/ahmed.png' }}
              </a>
            </div>
          </div>
        </div>

        <!-- Right -->
        <div class="grid grid-cols-3 md:flex md:flex-col self-center gap-2 md:gap-4">
          <span
            class="self-center text-nowrap text-fluid-xs px-3 py-1.5 rounded-full bg-success/10 text-success flex items-center justify-center gap-1">
            <span class="w-2 h-2 bg-success text-center self-center rounded-full animate-pulse-glow"></span> Active
          </span>
          <span
            class="self-center text-nowrap text-fluid-xs text-center px-3 py-1.5 rounded-full bg-accent-light/20 text-accent-dark transition-transform lg:hover:scale-105">
            {{ role() }}
          </span>
          <p
            class="self-center text-sub text-nowrap text-fluid-xs px-3 py-2 rounded-full bg-accent-light/20  transition-transform lg:hover:scale-105 ">
            {{ userStore.sessions.length }} Active Sessions
          </p>
        </div>

      </div>
    </div>

    <!-- نافذة عرض سجل الصور المرفوعة سابقاً (History Modal) -->
    <div @click.self="isModalOpen = false" v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        class="bg-white dark:bg-[#151f35] border border-line rounded-3xl max-w-md w-full p-fluid-section shadow-2xl space-y-6 animate-fade-in">

        <!-- رأس النافذة -->
        <div class="flex justify-between items-center border-b border-line pb-3">
          <div class="flex items-center gap-2">
            <History class="text-accent" />
            <span class="text-fluid-h3">Photo History</span>
          </div>
          <button @click="isModalOpen = false"
            class="text-sub hover:text-text-primary text-fluid-p cursor-pointer">&times;</button>
        </div>

        <!-- شبكة عرض الصور القديمة -->
        <div class="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-1">
          <div v-for="(url, index) in userStore.userInfo?.avatar_history" :key="index"
            class="relative aspect-square rounded-full overflow-hidden border border-line group cursor-pointer shadow-sm hover:border-accent transition-all duration-300"
            @click="handleSelectHistory(url)">
            <img :src="url" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              alt="Previous avatar">
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-white text-[10px] font-medium bg-accent px-2 py-0.5 rounded-full">Select</span>
            </div>
          </div>
        </div>

        <!-- تذييل النافذة -->
        <div class="flex justify-end pt-3 border-t border-line">
          <button type="button" @click="isModalOpen = false"
            class="btn-secondary text-fluid-xs px-4 py-2">Close</button>
        </div>

      </div>
    </div>

  </section>
</template>
