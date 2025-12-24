import { computed } from 'vue'
import { api } from '@/libs/axios'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

export function useLocale() {
    const { locale } = useI18n()

    function changeLocale(lang) {
        setLocale(lang)
        api.defaults.headers.common['Accept-Language'] = lang
    }

    return {
        currentLocale: computed(() => locale.value),
        availableLocales: [
            { code: 'en', label: 'EN' },
            { code: 'ru', label: 'RU' },
            { code: 'am', label: 'AM' }
        ],
       changeLocale
    }
}
