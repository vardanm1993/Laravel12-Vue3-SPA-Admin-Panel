<script setup>
import { computed } from "vue"
import { cn } from "@/utils/cn.js"

const props = defineProps({
    modelValue: [String, Number],
    id: String,
    options: { type: Array, required: true },
    disabled: Boolean,
    status: { type: String, default: "default" },
    class: String
})

const emit = defineEmits(["update:modelValue", "blur", "change"])

const selectId = props.id || `ui-${Math.random().toString(36).slice(2)}`

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
    <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :class="classes"
        @change="emit('update:modelValue', $event.target.value)"
        @blur="emit('blur', $event)"
    >
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
        </option>
    </select>
</template>
