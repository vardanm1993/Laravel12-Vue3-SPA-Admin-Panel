import { watch } from 'vue'
import { useErrorStore } from '@/stores/error.store.js'
import { useI18n } from 'vue-i18n'

export function useBackendValidation(setErrors) {
    const { t, locale } = useI18n()
    const errorStore = useErrorStore()

    function formatErrors(errs) {
        if (!errs || Object.keys(errs).length === 0) return {}

        const out = {}

        Object.entries(errs).forEach(([field, messages]) => {
            const e = messages[0] || {}
            const params = { ...(e.params || {}) }

            if (params.attribute) {
                params.attribute = t(`fields.${params.attribute}`)
            }

            out[field] = t(e.message_key, params)
        })

        return out
    }

    // 1️⃣ Backend error → translate & setErrors
    watch(
        () => errorStore.formErrors,
        (errs) => {
            const translated = formatErrors(errs)
            setErrors(translated)
        },
        { deep: true }
    )

    // 2️⃣ Language changed → re-translate backend errors
    watch(
        () => locale.value,
        () => {
            const translated = formatErrors(errorStore.formErrors)
            setErrors(translated)
        }
    )
}
