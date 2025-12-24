import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthApi } from '@/composables/auth/useAuthApi.js'
import { useErrorStore } from '@/stores/error.store.js'
import { useFlashRedirect } from '@/composables/useFlashRedirect.js'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const roles = ref([])
    const permissions = ref([])
    const loading = ref(false)

    const api = useAuthApi()
    const errors = useErrorStore()
    const { flashAndRedirect } = useFlashRedirect()

    function can(p) {
        return permissions.value.includes(p)
    }

    async function getUser() {
        try {
            const res = await api.getUser()
            user.value = res?.user || null
            roles.value = res?.roles || []
            permissions.value = res?.permissions || []
        } catch {
            user.value = null
            roles.value = []
            permissions.value = []
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
                query: { verify: 'sent' },
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
        roles.value = []
        permissions.value = []
    }

    async function sendVerification() {
        try {
            await api.csrf()
            return await api.sendVerification()
        } catch {
            return null
        }
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
        user,
        roles,
        permissions,
        can,
        loading,
        getUser,
        login,
        register,
        logout,
        sendVerification,
        forgotPassword,
        resetPassword,
    }
})
