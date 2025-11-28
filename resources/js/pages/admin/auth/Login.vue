<script setup>
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.store.js";
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import {Field, Form} from "vee-validate";
import {useI18n} from "vue-i18n";

const auth = useAuthStore()
const router = useRouter()
const {t} = useI18n()

const schema = toTypedSchema(yup.object({
    email: yup.string().required(t('validation.required')).email(t('validation.email')),
    password: yup.string().required(t('validation.required')).min(6)
}))

async function submit(values) {
    await auth.login(values)
    if (auth.user) {
        await router.push({ name: 'admin.dashboard' })
    }
}

</script>

<template>
    <div>
        <Form
            :validation-schema="schema"
            @submit="submit"
            class="max-w-md mx-auto mt-10 space-y-4"
        >
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

            <p v-if="auth.error" class="text-red-600 text-sm">
                {{ auth.error }}
            </p>

            <UiButton
                type="submit"
                :loading="auth.loading"
                class="w-full mt-2"
            >
                {{ t('auth.login') }}
            </UiButton>
        </Form>
    </div>
</template>

<style scoped>

</style>
