<script setup>
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { useAuthStore } from '@/stores/auth.store.js'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const auth = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const schema = toTypedSchema(yup.object({
    name: yup.string().required(t('validation.required')),
    email: yup.string().required(t('validation.required')).email(t('validation.email')),
    password: yup.string().required(t('validation.required')).min(6),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password')], t('validation.password_match'))
}))

async function submit(values) {
    await auth.register(values)
    if (auth.user) {
        await router.push({name: 'admin.dashboard'})
    }
}
</script>

<template>
    <Form
        :validation-schema="schema"
        @submit="submit"
        class="max-w-md mx-auto mt-10 space-y-4"
    >
        <Field name="name" v-slot="{ field, errorMessage, meta }">
            <UiInput
                v-bind="field"
                :label="t('auth.name')"
                :placeholder="t('auth.name')"
                required
                :status="errorMessage ? 'error' : (meta.dirty && meta.valid ? 'success' : 'default')"
                :message="errorMessage"
                wrapperClass="w-full"
            />
        </Field>

        <Field name="email" v-slot="{ field, errorMessage, meta }">
            <UiInput
                v-bind="field"
                :label="t('auth.email')"
                :placeholder="t('auth.email')"
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
                :label="t('auth.password')"
                :placeholder="t('auth.password')"
                required
                :status="errorMessage ? 'error' : (meta.dirty && meta.valid ? 'success' : 'default')"
                :message="errorMessage"
                wrapperClass="w-full"
            />
        </Field>

        <Field name="password_confirmation" v-slot="{ field, errorMessage, meta }">
            <UiInput
                v-bind="field"
                type="password"
                :label="t('auth.password_confirm')"
                :placeholder="t('auth.password_confirm')"
                required
                :status="errorMessage ? 'error' : (meta.dirty && meta.valid ? 'success' : 'default')"
                :message="errorMessage"
                wrapperClass="w-full"
            />
        </Field>

        <p v-if="auth.error" class="text-red-600 text-sm">
            {{ auth.error }}
        </p>

        <UiButton
            type="submit"
            :loading="auth.loading"
            class="w-full mt-2"
        >
            {{ t('auth.register') }}
        </UiButton>
    </Form>
</template>
