<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { useProfileStore } from '@/stores/profile.store.js'
import { useBackendValidation } from '@/composables/useBackendValidation.js'

import UiFormField from '@/components/ui/UiFormField.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiButton from '@/components/ui/UiButton.vue'

const { t, locale } = useI18n()
const profileStore = useProfileStore()

const schema = ref(buildSchema())

function buildSchema() {
    return toTypedSchema(
        yup.object({
            current_password: yup
                .string()
                .required(
                    t('validation.required', {
                        attribute: t('fields.current_password'),
                    })
                ),

            new_password: yup
                .string()
                .required(
                    t('validation.required', {
                        attribute: t('fields.new_password'),
                    })
                )
                .min(
                    6,
                    ({ min }) =>
                        t('validation.min', {
                            attribute: t('fields.new_password'),
                            min,
                        })
                )
                .max(
                    40,
                    ({ max }) =>
                        t('validation.max', {
                            attribute: t('fields.new_password'),
                            max,
                        })
                ),

            new_password_confirmation: yup
                .string()
                .required(
                    t('validation.required', {
                        attribute: t('fields.new_password_confirmation'),
                    })
                )
                .oneOf([yup.ref('new_password')], t('validation.password_match')),
        })
    )
}

watch(locale, () => {
    schema.value = buildSchema()
})

const {
    handleSubmit,
    setErrors,
    isSubmitting,
    meta: formMeta
} = useForm({
    validationSchema: schema,
    validateOnBlur: true,
    validateOnInput: true,
    validateOnChange: true,
})

const {
    value: current_password,
    errorMessage: currentError,
    meta: currentMeta,
    handleBlur: currentBlur
} = useField('current_password')

const {
    value: new_password,
    errorMessage: newError,
    meta: newMeta,
    handleBlur: newBlur
} = useField('new_password')

const {
    value: new_password_confirmation,
    errorMessage: confirmError,
    meta: confirmMeta,
    handleBlur: confirmBlur
} = useField('new_password_confirmation')

useBackendValidation(setErrors)

const fieldStatus = (err, meta) => {
    if (err) return 'error'
    if (meta.valid && meta.dirty) return 'success'
    return 'default'
}

const onSubmit = handleSubmit(async (values) => {
    await profileStore.updatePassword(values)
})
</script>

<template>
    <div class="p-6 max-w-2xl mx-auto space-y-6">

        <form class="space-y-6" @submit.prevent="onSubmit">

            <UiFormField :label="t('fields.current_password')" :error="currentError">
                <UiInput
                    v-model="current_password"
                    type="password"
                    @blur="currentBlur"
                    :status="fieldStatus(currentError, currentMeta)"
                    required
                />
            </UiFormField>

            <UiFormField :label="t('fields.new_password')" :error="newError">
                <UiInput
                    v-model="new_password"
                    type="password"
                    @blur="newBlur"
                    :status="fieldStatus(newError, newMeta)"
                    required
                />
            </UiFormField>

            <UiFormField :label="t('fields.new_password_confirmation')" :error="confirmError">
                <UiInput
                    v-model="new_password_confirmation"
                    type="password"
                    @blur="confirmBlur"
                    :status="fieldStatus(confirmError, confirmMeta)"
                    required
                />
            </UiFormField>

            <UiButton
                type="submit"
                class="w-full justify-center"
                :loading="isSubmitting || profileStore.loading"
                :disabled="!formMeta.valid || isSubmitting || profileStore.loading"
            >
                {{ t('buttons.save') }}
            </UiButton>

        </form>
    </div>
</template>
