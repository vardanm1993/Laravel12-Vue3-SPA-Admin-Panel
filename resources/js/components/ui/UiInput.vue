<script setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { cn } from "@/utils/cn.js"

const { t } = useI18n()

const props = defineProps({
    modelValue: [String, Number],
    id: String,
    name: String,
    type: String,
    placeholder: String,
    disabled: Boolean,
    autocomplete: String,
    inputmode: String,
    preset: String,
    status: { type: String, default: "default" },
    class: String,
})

const emit = defineEmits(["update:modelValue", "blur", "change"])

const inputId = props.id || `ui-${Math.random().toString(36).slice(2)}`

const presets = {
    email: {
        name: "email",
        type: "email",
        autocomplete: "email",
        inputmode: "email",
        placeholderKey: "fields.email"
    },
    password: {
        name: "password",
        type: "password",
        autocomplete: "current-password",
        placeholderKey: "fields.password"
    },
    newPassword: {
        name: "new_password",
        type: "password",
        autocomplete: "new-password",
        placeholderKey: "fields.new_password"
    },
    text: {
        type: "text",
        autocomplete: "off"
    }
}

const config = computed(() => {
    const preset = presets[props.preset] || {}

    return {
        type: props.type ?? preset.type ?? "text",
        name: props.name ?? preset.name,
        autocomplete: props.autocomplete ?? preset.autocomplete,
        inputmode: props.inputmode ?? preset.inputmode,

        placeholder:
            props.placeholder ??
            (preset.placeholderKey ? t(preset.placeholderKey) : preset.placeholder)
    }
})

const statusClasses = {
    default: "border-gray-300 focus:ring-blue-300",
    success: "border-green-500 focus:ring-green-300",
    error: "border-red-500 focus:ring-red-300",
    warning: "border-yellow-500 focus:ring-yellow-300",
}

const classes = computed(() =>
    cn(
        "w-full px-3 py-2 rounded-xl border text-sm outline-none transition bg-white",
        statusClasses[props.status],
        props.disabled && "bg-gray-100 cursor-not-allowed",
        props.class
    )
)
</script>

<template>
    <input
        :id="inputId"
        :value="modelValue"
        :name="config.name"
        :type="config.type"
        :placeholder="config.placeholder"
        :autocomplete="config.autocomplete"
        :inputmode="config.inputmode"
        :disabled="disabled"
        :class="classes"
        @input="emit('update:modelValue', $event.target.value)"
        @blur="emit('blur', $event)"
        @change="emit('change', $event)"
    />
</template>
