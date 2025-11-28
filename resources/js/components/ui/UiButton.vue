<script setup>
import { cn } from '@/utils/cn.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    type: { type: String, default: 'button' },
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    loading: Boolean,
    disabled: Boolean,
    class: String,
})

const emit = defineEmits(['click'])

const base =
    'rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50'

const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-200',
    ghost:   'bg-transparent text-gray-700 hover:bg-gray-100',
}

const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
}
</script>

<template>
    <button
        :type="type"
        :disabled="disabled || loading"
        v-bind="$attrs"
        :class="cn(base, variants[variant], sizes[size], props.class)"
        @click="emit('click')"
    >
        <span v-if="loading" class="animate-pulse">...</span>
        <span v-else><slot /></span>
    </button>
</template>
