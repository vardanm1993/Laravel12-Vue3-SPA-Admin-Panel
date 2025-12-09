<script setup>
import { computed } from "vue"
import { cn } from "@/utils/cn.js"

const props = defineProps({
    modelValue: Boolean,
    label: String,
    disabled: Boolean,
    class: String
})

const emit = defineEmits(["update:modelValue"])

const classes = computed(() =>
    cn("flex items-center gap-2 cursor-pointer", props.class)
)
</script>

<template>
    <label :class="classes">
        <input
            type="checkbox"
            :checked="modelValue"
            :disabled="disabled"
            class="w-4 h-4"
            @change="emit('update:modelValue', $event.target.checked)"
        />
        <span>{{ label }}</span>
    </label>
</template>
