<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'

import { useAuthStore } from '@/stores/auth.store.js'
import { useBackendValidation } from '@/composables/useBackendValidation.js'

import UiFormField from '@/components/ui/UiFormField.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiLink from "@/components/ui/UiLink.vue";

const { t, locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const schema = ref(buildSchema())

function buildSchema() {
    return toTypedSchema(
        yup.object({
            name: yup.string().required(
                t('validation.required', { attribute: t('fields.name') })
            ),

            email: yup
                .string()
                .required(t('validation.required', { attribute: t('fields.email') }))
                .email(t('validation.email', { attribute: t('fields.email') })),

            password: yup
                .string()
                .required(t('validation.required', { attribute: t('fields.password') }))
                .min(6, ({ min }) =>
                    t('validation.min', { attribute: t('fields.password'), min })
                ),

            password_confirmation: yup
                .string()
                .required(
                    t('validation.required', {
                        attribute: t('fields.password_confirmation'),
                    })
                )
                .oneOf(
                    [yup.ref('password')],
                    t('validation.confirmed')
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
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: true,
})

const { value: name, errorMessage: nameError, meta: nameMeta, handleBlur: nameBlur } =
    useField('name')

const { value: email, errorMessage: emailError, meta: emailMeta, handleBlur: emailBlur } =
    useField('email')

const { value: password, errorMessage: passwordError, meta: passwordMeta, handleBlur: passwordBlur } =
    useField('password')

const {
    value: password_confirmation,
    errorMessage: confirmError,
    meta: confirmMeta,
    handleBlur: confirmBlur,
} = useField('password_confirmation')

const { value: remember } = useField('remember', undefined, {
    initialValue: false,
})

useBackendValidation(setErrors)

const fieldStatus = (e, m) =>
    e ? 'error' : m.valid && m.dirty ? 'success' : 'default'

const onSubmit = handleSubmit(async (values) => {
    await auth.register(values)
    if (auth.user) router.push({ name: 'admin.dashboard' })
})
</script>

<template>
    <div class="max-w-md mx-auto p-6 space-y-6">
        <h1 class="text-2xl font-semibold text-center">
            {{ t("auth.register") }}
        </h1>

        <form class="space-y-6" @submit.prevent="onSubmit">

            <UiFormField :label="t('fields.name')" :error="nameError">
                <UiInput
                    v-model="name"
                    @blur="nameBlur"
                    :status="fieldStatus(nameError, nameMeta)"
                    required
                />
            </UiFormField>

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

            <UiFormField :label="t('fields.password_confirmation')" :error="confirmError">
                <UiInput
                    v-model="password_confirmation"
                    preset="password"
                    @blur="confirmBlur"
                    :status="fieldStatus(confirmError, confirmMeta)"
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
                {{ t("auth.register") }}
            </UiButton>

            <p class="text-center text-sm text-gray-600">
                {{ t("auth.have_account") }}
                <UiLink :to="{ name: 'admin.login' }" class="ml-1">
                    {{ t("auth.login") }}
                </UiLink>
            </p>

        </form>
    </div>
</template>
