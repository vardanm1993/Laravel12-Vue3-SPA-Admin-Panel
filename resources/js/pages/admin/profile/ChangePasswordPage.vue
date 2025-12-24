<script setup>
import SmartForm from '@/components/shared/SmartForm.vue'
import { useFormBuilder } from '@/composables/useFormBuilder.js'
import { useProfileStore } from '@/stores/profile.store.js'

const profileStore = useProfileStore()

const form = useFormBuilder({
    rules: {
        current_password: ['required'],
        new_password: ['required', 'min:6', 'max:40'],
        new_password_confirmation: ['required', 'confirmed:new_password'],
    },
    fields: ['current_password', 'new_password', 'new_password_confirmation'],
    initialValues: {
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    },
    backend: true,
})

const fields = [
    { name: 'current_password', preset: 'current_password' },
    { name: 'new_password', preset: 'new_password' },
    { name: 'new_password_confirmation', preset: 'new_password_confirmation' },
]

const onSubmit = async (values) => {
    await profileStore.updatePassword(values)
    form.resetForm()
}
</script>

<template>
    <SmartForm
        :form="form"
        titleKey="admin.password_page.title"
        submitTextKey="buttons.save"
        :fields="fields"
        :loading="profileStore.loading"
        wrapperClass="p-6 max-w-2xl mx-auto space-y-6"
        titleClass="text-2xl font-semibold"
        @submit="onSubmit"
    />
</template>
