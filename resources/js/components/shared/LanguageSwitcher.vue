<script setup>
import { useLocale } from '@/composables/useLocale.js'
const { currentLocale, availableLocales, changeLocale} = useLocale()
</script>

<template>
    <div class="flex items-center gap-2">
        <select
            class="border px-3 py-2 rounded bg-white shadow-sm"
            :value="currentLocale"
            @change="changeLocale($event.target.value)"
        >
            <option
                v-for="l in availableLocales"
                :value="l.code"
                :key="l.code"
            >
                {{ l.label }}
            </option>
        </select>
    </div>
</template>
