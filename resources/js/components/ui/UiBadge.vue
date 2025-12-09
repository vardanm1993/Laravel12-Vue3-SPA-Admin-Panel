<script setup>
import { computed } from "vue"
import { cn } from "@/utils/cn.js"

const props = defineProps({
    variant: {
        type: String,
        default: "default",
        validator: (val) =>
            ["default", "admin", "manager", "user"].includes(val),
    },
    class: String,
})

const variants = {
    default: "bg-gray-100 text-gray-800",
    admin: "bg-red-100 text-red-700",
    manager: "bg-blue-100 text-blue-700",
    user: "bg-green-100 text-green-700",
}

const classes = computed(() =>
    cn(
        "px-2 py-0.5 text-xs font-medium rounded-full",
        variants[props.variant] || variants.default,
        props.class
    )
)
</script>

<template>
    <span :class="classes">
        <slot />
    </span>
</template>
