<script setup>

import {useI18n} from "vue-i18n";

const { t } = useI18n()
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
})
</script>

<template>
    <RouterLink
        :to="{ name: item.name }"
        class="block px-3 py-2 rounded-lg text-sm font-medium transition"
        :class="active ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'"
    >
        {{ t(item.label) }}
    </RouterLink>
</template>
