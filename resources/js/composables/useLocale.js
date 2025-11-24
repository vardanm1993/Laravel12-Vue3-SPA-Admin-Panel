import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

export function useLocale() {
    const { locale } = useI18n()

    const availableLocales = [
        { code: 'en', label: 'EN' },
        { code: 'ru', label: 'RU' },
        { code: 'am', label: 'AM' },
    ]

    const currentLocale = computed(() => locale.value)

    return {
        currentLocale,
        availableLocales,
        setLocale,
    }
}
