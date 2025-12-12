<script setup>
import { useRouter } from 'vue-router'

import { useFormBuilder } from '@/composables/useFormBuilder.js'
import { useAuthStore } from '@/stores/auth.store.js'

import SmartForm from '@/components/shared/SmartForm.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiLink from '@/components/ui/UiLink.vue'

const router = useRouter()
const auth = useAuthStore()

const form = useFormBuilder({
    rules: {
        name: ['required'],
        email: ['required', 'email'],
        password: ['required', 'min:6'],
        password_confirmation: ['required', 'confirmed:password'],
    },
    fields: ['name', 'email', 'password', 'password_confirmation', 'remember'],
    initialValues: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        remember: false,
    },
    fieldOptions: { remember: { initialValue: false } },
    backend: true,
})

const fields = [
    { name: 'name', preset: 'name' },
    { name: 'email', preset: 'email' },
    { name: 'password', preset: 'password' },
    { name: 'password_confirmation', preset: 'password_confirmation' },
]

const onSubmit = async (values) => {
    await auth.register(values)
    if (auth.user) router.push({ name: 'admin.dashboard' })
}
</script>

<template>
    <SmartForm
        :form="form"
        titleKey="auth.register"
        submitTextKey="auth.register"
        :fields="fields"
        :loading="auth.loading"
        @submit="onSubmit"
    >
        <template #between="{ form }">
            <UiCheckbox v-model="form.model.remember" :label="form.t('auth.remember')" />
        </template>

        <template #after="{ form }">
            <p class="text-center text-sm text-gray-600">
                {{ form.t('auth.have_account') }}
                <UiLink :to="{ name: 'admin.login' }" class="ml-1">
                    {{ form.t('auth.login') }}
                </UiLink>
            </p>
        </template>
    </SmartForm>
</template>
