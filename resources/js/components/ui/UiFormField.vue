<script setup>
import { computed } from "vue"
import UiLabel from "@/components/ui/UiLabel.vue"
import UiError from "@/components/ui/UiError.vue"

const props = defineProps({
    label: String,
    for: String,
    required: Boolean,
    error: String,
    class: String,
})

const classes = computed(() => props.class)
</script>

<template>
    <div :class="classes">
        <UiLabel
            v-if="label"
            :for="for"
            :required="required"
        >
            {{ label }}
        </UiLabel>

        <div class="mt-1">
            <slot />
        </div>

        <UiError :message="error" class="mt-1" />
    </div>
</template>
