import {createI18n} from "vue-i18n";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import am from "@/locales/am.json"

const DEFAULT_LOCALE = 'en'

function loadLocaleFromStorage() {
    if (typeof window === 'undefined') return DEFAULT_LOCALE
    const saved = window.localStorage.getItem('locale')
    if (!saved) return DEFAULT_LOCALE
    return ['en', 'ru', 'am'].includes(saved) ? saved : DEFAULT_LOCALE
}

export const i18n = createI18n({
    legacy: false,
    locale: loadLocaleFromStorage(),
    fallbackLocale: 'en',
    messages: {
        en,
        ru,
        am
    }

})

export function setLocale(locale) {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('locale', locale)
    }
    i18n.global.locale.value = locale
}
