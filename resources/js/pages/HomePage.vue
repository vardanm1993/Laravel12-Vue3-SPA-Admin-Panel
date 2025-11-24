<script setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <main class="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 class="text-3xl font-bold">
            {{ t('app.title') }}
        </h1>

        <p class="text-gray-600">
            {{ t('app.welcome') }}
        </p>

        <LanguageSwitcher/>
    </main>
</template>

<style scoped>

</style>
