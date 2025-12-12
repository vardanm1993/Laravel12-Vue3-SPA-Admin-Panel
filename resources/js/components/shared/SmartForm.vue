<script setup>
import { computed } from 'vue'

import UiFormField from '@/components/ui/UiFormField.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiButton from '@/components/ui/UiButton.vue'

const props = defineProps({
    form: { type: Object, required: true },
    titleKey: String,

    fields: { type: Array, default: () => [] },
    submitTextKey: { type: String, default: 'buttons.save' },
    submitVariant: { type: String, default: 'primary' },

    loading: { type: Boolean, default: false },

    wrapperClass: { type: String, default: 'max-w-md mx-auto p-6 space-y-6' },
    formClass: { type: String, default: 'space-y-6' },
    titleClass: { type: String, default: 'text-2xl font-semibold text-center' },

    errorMode: { type: String, default: 'raw' }, // ui | raw | auto
})

const emit = defineEmits(['submit'])

const titleText = computed(() => (props.titleKey ? props.form.t(props.titleKey) : ''))
const submitText = computed(() => props.form.t(props.submitTextKey))

const disabled = computed(() => {
    return props.loading || Boolean(props.form.submitting) || !Boolean(props.form.canSubmit)
})

const modelOf = (name) =>
    computed({
        get: () => props.form.model?.[name],
        set: (v) => {
            props.form.model[name] = v
        },
    })

const pickError = (name) => {
    const f = props.form

    const raw =
        (f.rawError && f.rawError[name]) ||
        (f.fieldError && f.fieldError[name]) ||
        ''

    const ui =
        (f.error && f.error[name]) ||
        ''

    if (props.errorMode === 'ui') return ui || ''
    if (props.errorMode === 'raw') return raw || ''
    return ui || raw || ''
}

const errorOf = (name) => computed(() => pickError(name))

const pickStatus = (name) => {
    const f = props.form
    const e = pickError(name)

    if (e) return 'error'
    if (f.status && f.status[name]) return f.status[name]
    return 'default'
}

const statusOf = (name) => computed(() => pickStatus(name))
const blurOf = (name) => (e) => props.form.blur?.[name]?.(e)

const labelOf = (f) => {
    const key = f.labelKey || `fields.${f.name}`
    return props.form.t(key)
}

const onSubmit = props.form.handleSubmit((values) => emit('submit', values))
</script>

<template>
    <div :class="wrapperClass">
        <h1 v-if="titleText" :class="titleClass">{{ titleText }}</h1>

        <slot name="start" :form="form" />

        <form :class="formClass" @submit.prevent="onSubmit">
            <template v-for="f in fields" :key="f.name">
                <template v-if="f.component === 'checkbox'">
                    <UiCheckbox
                        v-model="modelOf(f.name).value"
                        :label="f.label ? f.label : labelOf(f)"
                        v-bind="f.props"
                    />
                </template>

                <template v-else>
                    <UiFormField :label="labelOf(f)" :error="errorOf(f.name).value">
                        <UiInput
                            v-model="modelOf(f.name).value"
                            :preset="f.preset || f.name"
                            :type="f.type"
                            :status="statusOf(f.name).value"
                            @blur="blurOf(f.name)"
                            v-bind="f.props"
                        />
                    </UiFormField>
                </template>
            </template>

            <slot name="between" :form="form" />

            <UiButton
                type="submit"
                class="w-full justify-center"
                :variant="submitVariant"
                :loading="loading || form.submitting"
                :disabled="disabled"
            >
                {{ submitText }}
            </UiButton>

            <slot name="after" :form="form" />
        </form>
    </div>
</template>
