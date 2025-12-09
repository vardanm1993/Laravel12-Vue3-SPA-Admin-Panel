<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'

import { useAuthStore } from '@/stores/auth.store.js'
import { useToastStore } from '@/stores/toast.store.js'
import { useBackendValidation } from '@/composables/useBackendValidation.js'

import UiFormField from '@/components/ui/UiFormField.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiLink from "@/components/ui/UiLink.vue";

const { t, locale } = useI18n()
const auth = useAuthStore()
const toast = useToastStore()

onMounted(() => toast.showFlashIfExists())

const schema = ref(buildSchema())

function buildSchema() {
    return toTypedSchema(
        yup.object({
            email: yup
                .string()
                .required(t('validation.required', { attribute: t('fields.email') }))
                .email(t('validation.email', { attribute: t('fields.email') })),

            password: yup
                .string()
                .required(t('validation.required', { attribute: t('fields.password') }))
                .min(6, ({ min }) => t('validation.min', {
                    attribute: t('fields.password'), min
                })),
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
    validateOnBlur: true,
    validateOnInput: true,
    validateOnChange: true,
})

const { value: email, errorMessage: emailError, meta: emailMeta, handleBlur: emailBlur } =
    useField('email')

const { value: password, errorMessage: passwordError, meta: passwordMeta, handleBlur: passwordBlur } =
    useField('password')

const { value: remember } = useField('remember', undefined, {
    initialValue: false,
})

useBackendValidation(setErrors)

const fieldStatus = (e, m) =>
    e ? 'error' : m.valid && m.dirty ? 'success' : 'default'

const onSubmit = handleSubmit(async (values) => {
    await auth.login(values)
})
</script>

<template>
    <div class="max-w-md mx-auto p-6 space-y-6">

        <h1 class="text-2xl font-semibold">
            {{ t('auth.login') }}
        </h1>

        <form class="space-y-6" @submit.prevent="onSubmit">

            <UiFormField :label="t('fields.email')" :error="emailError">
                <UiInput
                    v-model="email"
                    preset="email"
                    @blur="emailBlur"
                    :status="fieldStatus(emailError, emailMeta)"
                    required
                />
            </UiFormField>

            <UiFormField :label="t('fields.password')" :error="passwordError">
                <UiInput
                    v-model="password"
                    preset="password"
                    @blur="passwordBlur"
                    :status="fieldStatus(passwordError, passwordMeta)"
                    required
                />
            </UiFormField>

            <UiCheckbox v-model="remember" :label="t('auth.remember')" />

            <UiButton
                type="submit"
                class="w-full justify-center"
                :loading="isSubmitting || auth.loading"
                :disabled="!formMeta.valid || isSubmitting || auth.loading"
            >
                {{ t('auth.login') }}
            </UiButton>

            <p class="text-center text-sm text-gray-600">
                {{ t("auth.no_account") }}
                <UiLink :to="{ name: 'admin.register' }" class="ml-1">
                    {{ t("auth.register") }}
                </UiLink>
            </p>

        </form>
    </div>
</template>
