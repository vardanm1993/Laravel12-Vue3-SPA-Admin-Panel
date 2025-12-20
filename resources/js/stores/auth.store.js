import {defineStore} from 'pinia'
import {useAuthApi} from '@/composables/auth/useAuthApi.js'
import {ref} from 'vue'
import {useErrorStore} from "@/stores/error.store.js";
import {useFlashRedirect} from "@/composables/useFlashRedirect.js";
import {useToastStore} from "@/stores/toast.store.js";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const loading = ref(false)

    const api = useAuthApi()
    const errors = useErrorStore()

    const {flashAndRedirect} = useFlashRedirect()

    async function getUser() {
        try {
            user.value = await api.getUser()
        } catch {
            user.value = null
        }
    }

    async function login(payload) {
        loading.value = true
        errors.clearErrors()

        try {
            await api.csrf()
            const res = await api.login(payload)
            await getUser()

            const target = (user.value && !user.value.email_verified_at)
                ? 'admin.verify-email'
                : 'admin.dashboard'

            flashAndRedirect(target, res.message_key || 'auth.login_success')
        } finally {
            loading.value = false
        }
    }

    async function register(payload) {
        loading.value = true
        errors.clearErrors()

        try {
            await api.csrf()
            const res = await api.register(payload)
            await getUser()

            const target = (user.value && !user.value.email_verified_at)
                ? 'admin.verify-email'
                : 'admin.dashboard'

            flashAndRedirect(target, res.message_key || 'auth.register_success', {
                query: { verify: 'sent' }
            })
        } finally {
            loading.value = false
        }
    }


    async function logout() {
        try {
            await api.csrf()
            await api.logout()
        } catch {}
        user.value = null
    }

    async function sendVerification() {
        try {
            await api.csrf()
            await api.sendVerification()
        } catch {}
    }

    async function forgotPassword(payload) {
        loading.value = true
        errors.clearErrors()

        try {
            await api.csrf()
            const res = await api.forgotPassword(payload)
            flashAndRedirect('admin.login', res.message_key || 'auth.reset_link_sent')
        } finally {
            loading.value = false
        }
    }

    async function resetPassword(payload) {
        loading.value = true
        errors.clearErrors()

        try {
            await api.csrf()
            const res = await api.resetPassword(payload)
            flashAndRedirect('admin.login', res.message_key || 'auth.password_reset_success')
        } finally {
            loading.value = false
        }
    }


    return {
        user, loading,
        getUser, login, register, logout, sendVerification,forgotPassword,resetPassword
    }
})
