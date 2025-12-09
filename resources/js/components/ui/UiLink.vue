<script setup>
import { computed } from "vue"
import { RouterLink } from "vue-router"
import { cn } from "@/utils/cn.js"

const props = defineProps({
    to: [String, Object],
    href: String,
    variant: { type: String, default: "primary" },
    size: { type: String, default: "md" },
    underline: { type: String, default: "hover" },
    external: Boolean,
    disabled: Boolean,
    block: Boolean,
    class: String,
})

const variants = {
    primary: "text-blue-600 hover:text-blue-700",
    muted: "text-gray-600 hover:text-gray-800",
    danger: "text-red-600 hover:text-red-700",
    white: "text-white hover:text-gray-200",
    subtle: "text-gray-500 hover:text-gray-700",
}

const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
}

const underlineClasses = {
    hover: "hover:underline",
    always: "underline",
    none: "no-underline",
}

const classes = computed(() =>
    cn(
        "inline-flex items-center gap-1 transition-colors",
        props.disabled && "opacity-50 pointer-events-none",
        props.block && "w-full",
        variants[props.variant] || variants.primary,
        sizes[props.size],
        underlineClasses[props.underline],
        props.class
    )
)
</script>

<template>
    <RouterLink
        v-if="to && !external"
        :to="to"
        :class="classes"
    >
        <slot name="icon-left" />
        <slot />
        <slot name="icon-right" />
    </RouterLink>

    <a
        v-else-if="external"
        :href="href || to"
        target="_blank"
        rel="noopener"
        :class="classes"
    >
        <slot name="icon-left" />
        <slot />
        <slot name="icon-right" />
    </a>

    <a
        v-else
        :href="href"
        :class="classes"
    >
        <slot name="icon-left" />
        <slot />
        <slot name="icon-right" />
    </a>
</template>
