<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store.js'
import { useToastStore } from '@/stores/toast.store.js'
import { useFormBuilder } from '@/composables/useFormBuilder.js'

import SmartForm from '@/components/shared/SmartForm.vue'
import UiLink from '@/components/ui/UiLink.vue'

const auth = useAuthStore()

const form = useFormBuilder({
    rules: { email: ['required', 'email'] },
    fields: ['email'],
    initialValues: { email: '' },
    backend: true,
})

const fields = [{ name: 'email', preset: 'email' }]

const onSubmit = async (values) => {
    await auth.forgotPassword(values)
}
</script>

<template>
    <SmartForm
        :form="form"
        titleKey="auth.forgot_password"
        submitTextKey="auth.send_reset_link"
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
