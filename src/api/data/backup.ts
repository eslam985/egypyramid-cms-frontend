// /src/api/data/backup.ts
import api from '@/api/auth/interceptors'
import type { AxiosRequestConfig } from 'axios'

/**
 * يقوم بطلب ملف النسخة الاحتياطية من الباك إند
 * ويحدد الـ responseType كـ blob ليتعامل مع مخرجات السيرفر كملف جاهز للتحميل
 */

export const handleDownloadBackupFile = async ( config?: AxiosRequestConfig ): Promise<Blob> => {

  const result = await api.get('backup/download', {
    responseType: 'blob',
    ...config
  })

  return result.data
}
