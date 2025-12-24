import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { buildYupSchema } from '@/utils/yupBuilder.js'
import { useBackendValidation } from '@/composables/useBackendValidation.js'

export function useFormBuilder({
                                   rules,
                                   fields,
                                   initialValues = {},
                                   formOptions = {},
                                   fieldOptions = {},
                                   showErrors = 'always',
                                   successWhen = 'dirty',
                                   backend = false,
                               } = {}) {
    const { t, locale } = useI18n()

    const schema = computed(() => {
        locale.value
        return toTypedSchema(buildYupSchema(rules, t))
    })

    const {
        handleSubmit,
        setErrors,
        resetForm,
        validate,
        validateField,
        setFieldTouched,
        setFieldValue,

        errors,
        isSubmitting,
        meta,
        submitCount,
    } = useForm({
        validationSchema: schema,
        initialValues,
        validateOnMount: false,
        validateOnBlur: true,
        validateOnChange: true,
        validateOnInput: true,
        ...formOptions,
    })

    const model = reactive({})
    const rawError = reactive({})
    const error = reactive({})
    const fieldMeta = reactive({})
    const blur = {}
    const status = reactive({})

    const requiredFields = computed(() =>
        Object.entries(rules)
            .filter(([, r]) => Array.isArray(r) && r.includes('required'))
            .map(([k]) => k)
    )

    const submitted = computed(() => (submitCount.value || 0) > 0)

    const shouldShowError = (name) => {
        const m = fieldMeta[name]
        if (showErrors === 'always') return true
        if (showErrors === 'submit') return submitted.value
        if (showErrors === 'touched') return Boolean(m?.touched) || submitted.value
        return Boolean(m?.dirty) || Boolean(m?.touched) || submitted.value
    }

    const errorOf = (name) => {
        const e = rawError[name]
        if (!e) return ''
        return shouldShowError(name) ? e : ''
    }

    const successOf = (name) => {
        const m = fieldMeta[name]
        if (!m) return false
        if (successWhen === 'touched') return m.touched && m.valid && m.dirty
        if (successWhen === 'validated') return m.validated && m.valid && m.dirty
        return m.dirty && m.valid
    }

    const statusOf = (name) => {
        const e = error[name]
        if (e) return 'error'
        if (successOf(name)) return 'success'
        return 'default'
    }

    fields.forEach((name) => {
        const opts = {
            initialValue: initialValues?.[name],
            validateOnValueUpdate: true,
            ...(fieldOptions[name] || {}),
        }

        const { value, errorMessage, meta: m, handleBlur } = useField(name, undefined, opts)

        fieldMeta[name] = m

        Object.defineProperty(model, name, {
            enumerable: true,
            get: () => value.value,
            set: (v) => {
                value.value = v
            },
        })

        Object.defineProperty(rawError, name, {
            enumerable: true,
            get: () => errorMessage.value,
        })

        Object.defineProperty(error, name, {
            enumerable: true,
            get: () => errorOf(name),
        })

        Object.defineProperty(status, name, {
            enumerable: true,
            get: () => statusOf(name),
        })

        blur[name] = (e) => handleBlur(e)
    })

    const canSubmitCalc = computed(() => {
        if (isSubmitting.value) return false

        const errs = errors.value || {}
        if (Object.keys(errs).length > 0) return false

        for (const f of requiredFields.value) {
            const v = model[f]
            if (v === null || v === undefined) return false
            if (typeof v === 'string' && v.trim() === '') return false
        }

        return true
    })

    const api = reactive({
        handleSubmit,
        setErrors,
        resetForm,
        validate,
        validateField,
        setFieldTouched,
        setFieldValue,

        t,
        locale,
        schema,

        model,
        rawError,
        error,
        fieldMeta,
        status,
        blur,

        get submitting() {
            return Boolean(isSubmitting.value)
        },
        get canSubmit() {
            return Boolean(canSubmitCalc.value)
        },
        get formMeta() {
            return meta.value
        },
        get formErrors() {
            return errors.value || {}
        },
        get submitted() {
            return submitted.value
        },
    })

    if (backend) {
        useBackendValidation(api.setErrors)
    }

    return api
}
