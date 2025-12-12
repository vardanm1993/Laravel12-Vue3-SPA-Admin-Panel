<script setup>
import SmartForm from '@/components/shared/SmartForm.vue'

import { useFormBuilder } from '@/composables/useFormBuilder.js'
import { useProfileStore } from '@/stores/profile.store.js'
import { useAuthStore } from '@/stores/auth.store.js'
import { useFlashRedirect } from '@/composables/useFlashRedirect.js'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const { flashAndRedirect } = useFlashRedirect()

const form = useFormBuilder({
    rules: { current_password: ['required'] },
    fields: ['current_password'],
    initialValues: { current_password: '' },
    backend: true,
})

const fields = [{ name: 'current_password', preset: 'current_password' }]

const onSubmit = async (values) => {
    await profileStore.deleteAccount(values)
    await authStore.logout()
    form.resetForm()
    flashAndRedirect('admin.login', 'messages.account_deleted')
}
</script>

<template>
    <SmartForm
        :form="form"
        submitTextKey="messages.delete_account"
        submitVariant="danger"
        :fields="fields"
        :loading="profileStore.loading"
        wrapperClass="p-6 max-w-lg mx-auto space-y-6"
        titleClass="text-2xl font-bold text-red-600"
        @submit="onSubmit"
    >
        <template #start="{ form }">
            <p class="text-gray-600">
                {{ form.t('messages.delete_account_confirm') }}
            </p>
        </template>
    </SmartForm>
</template>
