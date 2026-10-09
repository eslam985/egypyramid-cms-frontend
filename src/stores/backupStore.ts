import { defineStore } from 'pinia'
import { handleDownloadBackupFile } from '@/api/data/backup'
import type { BaseStore } from '@/types/globalTypes'
import type { AxiosProgressEvent } from 'axios'

export interface BackupState extends BaseStore {
    downloadedBytes: number
    elapsedTime: number
    timerInterval: ReturnType<typeof setInterval> | null
}

export const useBackupStore = defineStore('backup', {
    state: (): BackupState => ({
        isLoading: false,
        successMessage: '',
        errorMessage: '',
        downloadedBytes: 0,
        elapsedTime: 0,
        timerInterval: null,
    }),

    actions: {
        async downloadBackup(): Promise<boolean> {
            this.isLoading = true
            this.successMessage = ''
            this.errorMessage = ''
            this.downloadedBytes = 0
            this.elapsedTime = 0

            // بدء العداد الزمني
            this.timerInterval = setInterval(() => {
                this.elapsedTime++
            }, 1000)

            try {
                const result: Blob = await handleDownloadBackupFile({
                    onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
                        this.downloadedBytes = progressEvent.loaded
                    },
                })

                const date: string = new Date().toISOString().slice(0, 10)
                const fileName: string = `backup-${date}.dump`

                const url: string = window.URL.createObjectURL(new Blob([result]))
                const link: HTMLAnchorElement = document.createElement('a')
                link.href = url
                link.setAttribute('download', fileName)

                document.body.appendChild(link)
                link.click()
                link.remove()
                window.URL.revokeObjectURL(url)

                this.successMessage = 'تم إنشاء وتحميل النسخة الاحتياطية بنجاح'
                return true
            } catch (err: any) {
                console.error('Backup download error:', err)
                this.errorMessage =
                    err?.response?.data?.message || 'حدثت مشكلة أثناء إنشاء النسخة الاحتياطية'
                return false
            } finally {
                this.isLoading = false
                if (this.timerInterval !== null) {
                    clearInterval(this.timerInterval)
                    this.timerInterval = null
                }

                setTimeout(() => {
                    this.downloadedBytes = 0
                }, 1500)
            }
        },
    },
})
