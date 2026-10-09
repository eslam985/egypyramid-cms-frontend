// /src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import ar from '../locales/ar.json'
import en from '../locales/en.json'

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('lang') || 'ar',
    fallbackLocale: 'ar',
    messages: {
        ar,
        en,
    },
})

export default i18n
