<script setup>
import { onMounted } from 'vue'

import { useFormBuilder } from '@/composables/useFormBuilder.js'
import { useAuthStore } from '@/stores/auth.store.js'
import { useToastStore } from '@/stores/toast.store.js'

import SmartForm from '@/components/shared/SmartForm.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiLink from '@/components/ui/UiLink.vue'

const auth = useAuthStore()
const toast = useToastStore()

onMounted(() => toast.showFlashIfExists())

const form = useFormBuilder({
    rules: {
        email: ['required', 'email'],
        password: ['required', 'min:6'],
    },
    fields: ['email', 'password', 'remember'],
    initialValues: { email: '', password: '', remember: false },
    fieldOptions: { remember: { initialValue: false } },
    backend: true,
})

const fields = [
    { name: 'email', preset: 'email' },
    { name: 'password', preset: 'password' },
]

const onSubmit = async (values) => {
    await auth.login(values)
}
</script>

<template>
    <SmartForm
        :form="form"
        titleKey="auth.login"
        submitTextKey="auth.login"
        :fields="fields"
        :loading="auth.loading"
        @submit="onSubmit"
    >
        <template #between="{ form }">
            <UiCheckbox v-model="form.model.remember" :label="form.t('auth.remember')" />
        </template>

        <template #after="{ form }">
            <p class="text-center text-sm text-gray-600">
                {{ form.t('auth.no_account') }}
                <UiLink :to="{ name: 'admin.register' }" class="ml-1">
                    {{ form.t('auth.register') }}
                </UiLink>
            </p>
        </template>
    </SmartForm>
</template>
