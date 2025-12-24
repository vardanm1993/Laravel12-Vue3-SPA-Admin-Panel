<script setup>
import { cn } from "@/utils/cn.js"
import UiRadio from "@/components/ui/UiRadio.vue";

const props = defineProps({
    modelValue: [String, Number],
    options: { type: Array, required: true },
    name: String,
    class: String
})

const emit = defineEmits(["update:modelValue"])
</script>

<template>
    <div :class="cn('space-y-2', class)">
        <UiRadio
            v-for="opt in options"
            :key="opt.value"
            :name="name"
            :value="opt.value"
            :label="opt.label"
            :modelValue="modelValue"
            @update:modelValue="emit('update:modelValue', $event)"
        />
    </div>
</template>
