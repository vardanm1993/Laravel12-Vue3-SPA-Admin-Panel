<script setup>
import { computed } from "vue"
import { cn } from "@/utils/cn.js"

const props = defineProps({
    for: String,
    required: Boolean,
    class: String
})

const classes = computed(() =>
    cn(
        "text-sm font-medium",
        props.required && 'after:content-["*"] after:text-red-500',
        props.class
    )
)
</script>

<template>
    <label :for="for" :class="classes">
        <slot />
    </label>
</template>
