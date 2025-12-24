<script setup>
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { cn } from "@/utils/cn.js"

const { t } = useI18n()

const props = defineProps({
    modelValue: [String, Number],

    id: String,
    preset: String,
    name: String,

    type: String,
    placeholder: String,
    disabled: Boolean,
    autocomplete: String,
    inputmode: String,

    status: { type: String, default: "default" },
    class: String,
})

const emit = defineEmits(["update:modelValue", "blur", "change"])

const localId = ref(`ui-${Math.random().toString(36).slice(2)}`)
const inputId = computed(() => props.id || localId.value)

const pwd = (autocomplete, name) => ({ type: "password", autocomplete, name })

const presets = {
    email: { type: "email", autocomplete: "email", inputmode: "email", name: "email" },

    name: { type: "text", autocomplete: "name", name: "name" },
    surname: { type: "text", autocomplete: "family-name", name: "surname" },
    category: { type: "text", autocomplete: "off", name: "category" },

    password: pwd("current-password", "password"),
    current_password: pwd("current-password", "current_password"),
    password_confirmation: pwd("new-password", "password_confirmation"),
    new_password: pwd("new-password", "new_password"),
    new_password_confirmation: pwd("new-password", "new_password_confirmation"),

    text: { type: "text", autocomplete: "off" },
}

const presetConf = computed(() => presets[props.preset] || presets.text)

const resolvedName = computed(() => {
    if (props.name) return props.name
    if (presetConf.value.name) return presetConf.value.name
    return props.preset || ""
})

const autoPlaceholder = computed(() => {
    const n = resolvedName.value
    if (!n) return ""
    const key = `fields.${n}`
    const translated = t(key)
    return translated !== key ? translated : ""
})

const config = computed(() => ({
    name: resolvedName.value || undefined,

    type: props.type ?? presetConf.value.type ?? "text",
    autocomplete: props.autocomplete ?? presetConf.value.autocomplete,
    inputmode: props.inputmode ?? presetConf.value.inputmode,

    placeholder: props.placeholder ?? autoPlaceholder.value,
}))
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
