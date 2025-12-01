<script setup>
import {useAuthStore} from '@/stores/auth.store.js'
import {useI18n} from 'vue-i18n'
import {useBackendValidation} from '@/composables/useBackendValidation.js'

import {useForm, Field} from 'vee-validate'
import * as yup from 'yup'
import {toTypedSchema} from '@vee-validate/yup'

const auth = useAuthStore()
const {t} = useI18n()

const schema = toTypedSchema(yup.object({
    email: yup
        .string()
        .required(() => t('validation.required', {attribute: t('fields.email')}))
        .email(() => t('validation.email', {attribute: t('fields.email')})),
    password: yup
        .string()
        .required(() => t('validation.required', {attribute: t('fields.password')}))
        .min(6, ({min}) => t('validation.min', {attribute: t('fields.password'), min}))
        .max(10, ({max}) => t('validation.max', {attribute: t('fields.password'), max})),
}))

const {handleSubmit, setErrors} = useForm({
    validationSchema: schema
})

useBackendValidation(setErrors)

const onSubmit = handleSubmit(async (values) => {
    await auth.login(values).catch(() => {
    })
})
</script>

<template>
    <form @submit.prevent="onSubmit" class="max-w-md mx-auto mt-10 space-y-4">
        <Field name="email" v-slot="{ field, errorMessage, meta }">
            <UiInput
                v-bind="field"
                :label="t('fields.email')"
                :placeholder="t('fields.email')"
                required
                :status="errorMessage ? 'error' : (meta.dirty && meta.valid ? 'success' : 'default')"
                :message="errorMessage"
                wrapperClass="w-full"
            />
        </Field>

        <Field name="password" v-slot="{ field, errorMessage, meta }">
            <UiInput
                v-bind="field"
                type="password"
                :label="t('fields.password')"
                :placeholder="t('fields.password')"
                required
                :status="errorMessage ? 'error' : (meta.dirty && meta.valid ? 'success' : 'default')"
                :message="errorMessage"
                wrapperClass="w-full"
            />
        </Field>

        <UiButton type="submit" :loading="auth.loading" class="w-full mt-2">
            {{ t('fields.login') }}
        </UiButton>
    </form>
</template>
