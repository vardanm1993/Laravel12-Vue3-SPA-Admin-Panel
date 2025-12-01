<script setup>
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.store.js'
import { useRouter } from 'vue-router'
import {onMounted} from "vue";
import {useToastStore} from "@/stores/toast.store.js";

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const toast = useToastStore()


onMounted(() => {
    toast.showFlashIfExists()
})

async function logout() {
    await auth.logout()
    await router.push({name: "admin.login"})
}

</script>

<template>
    <div class="max-w-3xl mx-auto mt-10">
        <h1 class="text-2xl">{{ t('app.dashboard') }}</h1>

        <p class="mt-2">{{ t('app.welcome') }}: {{ auth.user?.name }}</p>

        <UiButton variant="outline" class="mt-4" @click="logout">
            {{ t('auth.logout') }}
        </UiButton>
    </div>
</template>
