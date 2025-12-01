import { watch } from 'vue'
import { useErrorStore } from '@/stores/error.store.js'
import { useI18n } from 'vue-i18n'

export function useBackendValidation(setErrors) {
    const { t } = useI18n()
    const errorStore = useErrorStore()

    watch(() => errorStore.formErrors, (errs) => {
        if (!errs) return setErrors({})

        const formatted = {}

        Object.entries(errs).forEach(([field, messages]) => {
            const e = messages[0] || {}
            const params = { ...(e.params || {}) }

            if (params.attribute) {
                params.attribute = t(`fields.${params.attribute}`)
            }

            formatted[field] = t(e.message_key, params)
        })

        setErrors(formatted)
    }, { deep: true })
}
