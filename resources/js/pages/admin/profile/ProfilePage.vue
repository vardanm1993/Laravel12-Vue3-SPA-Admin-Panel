<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'

import { useProfileStore } from '@/stores/profile.store.js'
import { useBackendValidation } from '@/composables/useBackendValidation.js'

import UiFormField from '@/components/ui/UiFormField.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiButton from '@/components/ui/UiButton.vue'
import AvatarUploader from "@/components/admin/profile/AvatarUploader.vue";

const { t, locale } = useI18n()
const profileStore = useProfileStore()

const schema = ref(buildSchema())

function buildSchema() {
    return toTypedSchema(
        yup.object({
            name: yup
                .string()
                .required(t('validation.required', { attribute: t('fields.name') })),

            email: yup
                .string()
                .required(t('validation.required', { attribute: t('fields.email') }))
                .email(t('validation.email', { attribute: t('fields.email') })),
        })
    )
}

watch(locale, () => {
    schema.value = buildSchema()
})

const {
    handleSubmit,
    resetForm,
    setErrors,
    isSubmitting,
    meta: formMeta,
} = useForm({
    validationSchema: schema,
    validateOnInput: true,
    validateOnChange: true,
    validateOnBlur: true,
})

const {
    value: name,
    errorMessage: nameError,
    meta: nameMeta,
    handleBlur: nameBlur,
} = useField('name')

const {
    value: email,
    errorMessage: emailError,
    meta: emailMeta,
    handleBlur: emailBlur,
} = useField('email')

useBackendValidation(setErrors)

const fieldStatus = (e, m) =>
    e ? 'error' : m.valid && m.dirty ? 'success' : 'default'

onMounted(async () => {
    await profileStore.fetchProfile()
    const profile = profileStore.profile

    if (profile) {
        resetForm({
            values: {
                name: profile.name || '',
                email: profile.email || '',
            },
        })
    }
})

const onSubmit = handleSubmit(async (values) => {
    await profileStore.updateProfile(values)
})
</script>

<template>
    <div class="p-6 max-w-2xl mx-auto space-y-6">

        <AvatarUploader />

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
                    type="email"
                    @blur="emailBlur"
                    :status="fieldStatus(emailError, emailMeta)"
                    required
                />
            </UiFormField>

            <UiButton
                type="submit"
                class="w-full justify-center"
                :loading="isSubmitting || profileStore.loading"
                :disabled="!formMeta.valid || isSubmitting || profileStore.loading"
            >
                {{ t('buttons.save') }}
            </UiButton>

        </form>
    </div>
</template>
