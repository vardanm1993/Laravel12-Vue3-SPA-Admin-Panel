<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'
import { useToastStore } from '@/stores/toast.store.js'
import { useFormBuilder } from '@/composables/useFormBuilder.js'

import SmartForm from '@/components/shared/SmartForm.vue'
import UiLink from '@/components/ui/UiLink.vue'

const route = useRoute()
const auth = useAuthStore()

const token = String(route.query.token || '')
const email = String(route.query.email || '')

const form = useFormBuilder({
    rules: {
        email: ['required', 'email'],
        password: ['required', 'min:6'],
        password_confirmation: ['required', 'confirmed:password'],
        token: ['required'],
    },
    fields: ['email', 'password', 'password_confirmation', 'token'],
    initialValues: {
        email,
        password: '',
        password_confirmation: '',
        token,
    },
    backend: true,
})

const fields = [
    { name: 'email', preset: 'email' },
    { name: 'password', preset: 'password' },
    { name: 'password_confirmation', preset: 'password_confirmation' },
]

const onSubmit = async (values) => {
    await auth.resetPassword(values)
}
</script>

<template>
    <SmartForm
        :form="form"
        titleKey="auth.reset_password"
        submitTextKey="auth.reset_password"
        :fields="fields"
        :loading="auth.loading"
        @submit="onSubmit"
    >
        <template #after="{ form }">
            <p class="text-center text-sm text-gray-600">
                <UiLink :to="{ name: 'admin.login' }">
                    {{ form.t('auth.back_to_login') }}
                </UiLink>
            </p>
        </template>
    </SmartForm>
</template>
