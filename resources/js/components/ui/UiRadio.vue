<script setup>
import { cn } from "@/utils/cn.js"

const props = defineProps({
    modelValue: [String, Number],
    value: [String, Number],
    label: String,
    name: String,
    class: String
})

const emit = defineEmits(["update:modelValue"])
</script>

<template>
    <label :class="cn('flex items-center gap-2 cursor-pointer', class)">
        <input
            :name="name"
            type="radio"
            :checked="modelValue === value"
            @change="emit('update:modelValue', value)"
        />
        <span>{{ label }}</span>
    </label>
</template>
