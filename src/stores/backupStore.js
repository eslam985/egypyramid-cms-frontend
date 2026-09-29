import { defineStore } from 'pinia'
import { handleDownloadBackupFile } from '@/api/data/backup'

export const useBackupStore = defineStore('backup', {
  state: () => ({
    isLoading: false,
    successMessage: '',
    errorMessages: '',
    // 💡 متغيرات الـ Progress الجديدة
    downloadedBytes: 0,
    elapsedTime: 0,
    timerInterval: null
  }),
  actions: {
    async downloadBackup() {
      this.isLoading = true
      this.successMessage = ''
      this.errorMessages = ''
      this.downloadedBytes = 0
      this.elapsedTime = 0

      // بدء العداد الزمني للثواني المستغرقة
      this.timerInterval = setInterval(() => {
        this.elapsedTime++
      }, 1000)

      try {
        // 💡 قمنا بتعديل الـ API المستدعاة لتمرير خيار تتبع الـ Progress لـ Axios
        // سنضيف كائن الإعدادات مباشرة هنا لعدم تشتيت ملف الـ API
        const result = await handleDownloadBackupFile({
          onDownloadProgress: (progressEvent) => {
            // تحديث حجم البيانات المحملة لحظياً بالـ Bytes
            this.downloadedBytes = progressEvent.loaded
          }
        })

        const date = new Date().toISOString().slice(0, 10)
        const fileName = `backup-${date}.dump`

        const url = window.URL.createObjectURL(new Blob([result]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)

        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(url)

        this.successMessage = 'تم إنشاء وتحميل النسخة الاحتياطية بنجاح'
        return true
      } catch (err) {
        console.error('Backup download error:', err)
        this.errorMessages = err.response?.data?.message || 'حدثت مشكلة أثناء إنشاء النسخة الاحتياطية'
        return false
      } finally {
        this.isLoading = false
        clearInterval(this.timerInterval)
        // 💡 تصفير الـ Bytes بعد ثانية واحدة من انتهاء التحميل ليعطي سلاسة قبل الاختفاء
        setTimeout(() => {
          this.downloadedBytes = 0
        }, 1500)
      }
    }
  }
})
