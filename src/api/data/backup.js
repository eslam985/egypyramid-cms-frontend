import api from '@/api/auth/interceptors'

/**
 * يقوم بطلب ملف النسخة الاحتياطية من الباك إند
 * ويحدد الـ responseType كـ blob ليتعامل مع مخرجات السيرفر كملف جاهز للتحميل
 */
const handleDownloadBackupFile = async (config = {}) => {
  const result = await api.get('backup/download', { responseType: 'blob', ...config })
  return result.data
}


export {
  handleDownloadBackupFile
}
