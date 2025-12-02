<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

async function logout() {
    await auth.logout()
    await router.push({ name: 'admin.login' })
}
</script>

<template>
    <header class="h-16 bg-white border-b px-6 flex items-center justify-between">
        <h1 class="text-xl font-semibold">
            {{ t(route.meta.title) }}
        </h1>

        <div class="flex items-center gap-4">
            <LanguageSwitcher />

            <UiButton variant="outline" size="sm" @click="logout">
                {{ t('auth.logout') }}
            </UiButton>
        </div>
    </header>
</template>
