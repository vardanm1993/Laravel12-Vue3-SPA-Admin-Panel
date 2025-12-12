<script setup>
import {onMounted} from 'vue'

import {useFormBuilder} from '@/composables/useFormBuilder.js'
import {useProfileStore} from '@/stores/profile.store.js'

import SmartForm from '@/components/shared/SmartForm.vue'
import AvatarUploader from '@/components/admin/profile/AvatarUploader.vue'

const profileStore = useProfileStore()

const form = useFormBuilder({
    rules: {
        name: ['required'],
        email: ['required', 'email'],
    },
    fields: ['name', 'email'],
    initialValues: {name: '', email: ''},
    backend: true,
})

const fields = [
    {name: 'name', preset: 'name'},
    {name: 'email', preset: 'email'},
]

onMounted(async () => {
    await profileStore.fetchProfile()
    const p = profileStore.profile

    if (p) {
        form.resetForm({
            values: {
                name: p.name || '',
                email: p.email || '',
            },
        })
    }
})

const onSubmit = async (values) => {
    await profileStore.updateProfile(values)
}
</script>

<template>
    <SmartForm
        :form="form"
        titleKey="admin.profile_page.title"
        submitTextKey="buttons.save"
        :fields="fields"
        :loading="profileStore.loading"
        wrapperClass="p-6 max-w-2xl mx-auto space-y-6"
        titleClass="text-2xl font-semibold"
        @submit="onSubmit"
    >
        <template #start>
            <AvatarUploader/>
        </template>
    </SmartForm>
</template>
