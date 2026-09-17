// src/stores/tasksStore.js
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('noti', {
    state: () => ({
        isShowSideBar: false,
        notification: {
            show: false,
            message: '',
        },
        confirmModal: {
            show: false,
            message: '',
            resolvePromise: null, // لتخزين الدالة التي ستعيد النتيجة (true/false)
        },
    }),

    actions: {
        triggerConfirm(msg) {
            this.confirmModal.message = msg
            this.confirmModal.show = true

            // نُرجع Promise لكي نتمكن من استخدام await
            return new Promise((resolve) => {
                this.confirmModal.resolvePromise = resolve
            })
        },

        handleConfirmResult(result) {
            if (this.confirmModal.resolvePromise) {
                this.confirmModal.resolvePromise(result) // نرسل true أو false
            }
            // إعادة تعيين الحالة
            this.confirmModal.show = false
            this.confirmModal.message = ''
            this.confirmModal.resolvePromise = null
        },
        triggerNotification(msg) {
            this.notification.show = true
            this.notification.message = msg

            setTimeout(() => {
                this.notification.show = false
                this.notification.message = ''
            }, 3000)
        },
        openSide() {
            this.isShowSideBar = !this.isShowSideBar
        },
    },
})
