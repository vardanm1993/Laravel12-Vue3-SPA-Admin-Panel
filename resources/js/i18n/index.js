import { createI18n } from 'vue-i18n'

const DEFAULT_LOCALE = 'en'

function loadLocaleFromStorage() {
    if (typeof window === 'undefined') return DEFAULT_LOCALE
    const saved = window.localStorage.getItem('locale')
    return ['en', 'ru', 'am'].includes(saved) ? saved : DEFAULT_LOCALE
}

const localeFiles = import.meta.glob('/lang/*.json', { eager: true })

const messages = Object.entries(localeFiles).reduce((acc, [path, module]) => {
    const locale = path.split('/').pop().replace('.json', '')
    acc[locale] = module.default
    return acc
}, {})

export const i18n = createI18n({
    legacy: false,
    locale: loadLocaleFromStorage(),
    fallbackLocale: 'en',
    messages,
})

export function setLocale(locale) {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('locale', locale)
    }
    i18n.global.locale.value = locale
}
