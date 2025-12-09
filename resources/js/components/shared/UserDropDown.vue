<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store.js'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import UiBadge from "@/components/ui/UiBadge.vue";

const open = ref(false)
const auth = useAuthStore()
const { t } = useI18n()
const router = useRouter()

function toggle() {
    open.value = !open.value
}

function close() {
    open.value = false
}

async function logout() {
    await auth.logout()
    router.push({ name: 'admin.login' })
}
</script>

<template>
    <div class="relative" v-click-outside="close">

        <button @click="toggle" class="flex items-center gap-2">
            <img
                :src="auth.user?.avatar_url || '/default-avatar.png'"
                class="w-9 h-9 rounded-full border object-cover cursor-pointer"
             :alt="auth.user?.name"/>
        </button>

        <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
        >
            <div
                v-if="open"
                class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border z-50 overflow-hidden"
            >

                <div class="px-4 py-3 border-b bg-gray-50">
                    <div class="font-semibold text-gray-800">
                        {{ auth.user?.name }}
                    </div>
                    <div class="text-xs text-gray-500">
                        {{ auth.user?.email }}
                    </div>
                    <div class="mt-2">
                        <UiBadge :variant="auth.user?.role">
                            {{ t('roles.' + auth.user?.role) }}
                        </UiBadge>
                    </div>
                </div>

                <RouterLink
                    :to="{ name: 'admin.profile' }"
                    class="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                >
                    {{ t('admin.profile_page.title') }}
                </RouterLink>

                <RouterLink
                    :to="{ name: 'admin.profile.password' }"
                    class="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                >
                    {{ t('admin.password_page.title') }}
                </RouterLink>

                <RouterLink
                    :to="{ name: 'admin.profile.delete' }"
                    class="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                >
                    {{ t('admin.delete_page.title') }}
                </RouterLink>

                <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                    {{ t('auth.logout') }}
                </button>
            </div>
        </transition>
    </div>
</template>
