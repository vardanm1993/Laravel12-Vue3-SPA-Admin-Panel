import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useErrorStore } from '@/stores/error.store.js'

export function useBackendValidation(setErrors) {
    const { t, locale } = useI18n()
    const errorStore = useErrorStore()

    function formatErrors(errs) {
        if (!errs || Object.keys(errs).length === 0) return {}

        const out = {}

        Object.entries(errs).forEach(([field, messages]) => {
            const e = (messages && messages[0]) || {}
            const params = { ...(e.params || {}) }

            if (params.attribute) {
                const key = `fields.${params.attribute}`
                const translated = t(key)
                params.attribute = translated !== key ? translated : params.attribute
            }

            out[field] = t(e.message_key, params)
        })

        return out
    }

    const apply = () => setErrors(formatErrors(errorStore.formErrors))

    watch(() => errorStore.formErrors, apply, { deep: true })
    watch(() => locale.value, apply)
}
