import { defineStore } from 'pinia'

export interface NotificationState {
    isShowSideBar: boolean
    notification: {
        show: boolean
        message: string
    }
    confirmModal: {
        show: boolean
        message: string
        resolvePromise: ((value: boolean) => void) | null
    }
}

export const useNotificationStore = defineStore('noti', {
    state: (): NotificationState => ({
        isShowSideBar: false,
        notification: {
            show: false,
            message: '',
        },
        confirmModal: {
            show: false,
            message: '',
            resolvePromise: null,
        },
    }),

    actions: {
        triggerConfirm(msg: string): Promise<boolean> {
            this.confirmModal.message = msg
            this.confirmModal.show = true

            return new Promise<boolean>((resolve) => {
                this.confirmModal.resolvePromise = resolve
            })
        },

        handleConfirmResult(result: boolean): void {
            if (this.confirmModal.resolvePromise) {
                this.confirmModal.resolvePromise(result)
            }
            this.confirmModal.show = false
            this.confirmModal.message = ''
            this.confirmModal.resolvePromise = null
        },

        triggerNotification(msg: string): void {
            this.notification.show = true
            this.notification.message = msg

            setTimeout(() => {
                this.notification.show = false
                this.notification.message = ''
            }, 3000)
        },

        openSide(): void {
            this.isShowSideBar = !this.isShowSideBar
        },
    },
})
