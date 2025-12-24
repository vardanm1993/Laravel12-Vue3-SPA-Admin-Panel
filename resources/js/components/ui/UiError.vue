<script setup>
import { computed } from "vue"
import { cn } from "@/utils/cn.js"

const props = defineProps({
    message: String,
    class: String
})

const classes = computed(() =>
    cn("text-sm text-red-600", props.class)
)
</script>

<template>
    <p v-if="message" :class="classes">
        {{ message }}
    </p>
</template>
