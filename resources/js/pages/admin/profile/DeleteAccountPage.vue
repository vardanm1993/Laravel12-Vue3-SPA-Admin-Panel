<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'

import { useProfileStore } from '@/stores/profile.store.js'
import { useAuthStore } from '@/stores/auth.store.js'
import { useBackendValidation } from '@/composables/useBackendValidation.js'
import { useFlashRedirect } from '@/composables/useFlashRedirect.js'

import UiFormField from '@/components/ui/UiFormField.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiButton from '@/components/ui/UiButton.vue'

const { t, locale } = useI18n()
const profileStore = useProfileStore()
const authStore = useAuthStore()
const { flashAndRedirect } = useFlashRedirect()

const schema = ref(buildSchema())

function buildSchema() {
    return toTypedSchema(
        yup.object({
            current_password: yup.string().required(
                t('validation.required', {
                    attribute: t('fields.current_password'),
                })
            ),
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
    meta: formMeta,
} = useForm({
    validationSchema: schema,
    validateOnInput: true,
    validateOnChange: true,
    validateOnBlur: true,
})

const {
    value: current_password,
    errorMessage: currentError,
    meta: currentMeta,
    handleBlur: currentBlur,
} = useField('current_password')

useBackendValidation(setErrors)

const fieldStatus = (e, m) =>
    e ? 'error' : m.valid && m.dirty ? 'success' : 'default'

const onSubmit = handleSubmit(async (values) => {
    await profileStore.deleteAccount(values)
    await authStore.logout()
    flashAndRedirect('admin.login', 'messages.account_deleted')
})
</script>

<template>
    <div class="p-6 max-w-lg mx-auto space-y-6">
        <h1 class="text-2xl font-bold text-red-600">
            {{ t('messages.delete_account') }}
        </h1>

        <p class="text-gray-600">
            {{ t('messages.delete_account_confirm') }}
        </p>

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

            <UiButton
                type="submit"
                variant="danger"
                class="w-full justify-center"
                :loading="isSubmitting || profileStore.loading"
                :disabled="!formMeta.valid || isSubmitting || profileStore.loading"
            >
                {{ t('messages.delete_account') }}
            </UiButton>

        </form>
    </div>
</template>
