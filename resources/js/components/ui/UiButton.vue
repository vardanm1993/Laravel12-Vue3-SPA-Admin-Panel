<script setup>
import { computed } from "vue"
import { cn } from "@/utils/cn.js"

const props = defineProps({
    type: { type: String, default: "button" },
    variant: { type: String, default: "primary" },
    size: { type: String, default: "md" },
    loading: Boolean,
    disabled: Boolean,
    class: String
})

const emit = defineEmits(["click"])

const variants = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
    outline:
        "border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300"
}

const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
}

const classes = computed(() =>
    cn(
        "rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 cursor-pointer",
        variants[props.variant],
        sizes[props.size],
        props.class
    )
)
</script>

<template>
    <button
        :type="type"
        :class="classes"
        :disabled="disabled || loading"
        @click="emit('click')"
    >
        <span v-if="loading" class="animate-pulse">...</span>
        <span v-else><slot /></span>
    </button>
</template>
