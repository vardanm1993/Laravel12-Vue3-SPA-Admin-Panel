import {defineStore} from "pinia";
import {useAuthApi} from "@/composables/useAuthApi.js";
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const api = useAuthApi()

    async function getUser() {
        try {
            user.value = await api.getUser()
        } catch {
            user.value = null
        }
    }

    async function login(payload) {
        loading.value = true
        error.value = null

        try {
            await api.csrf()
            await api.login(payload)
            await getUser()
        } catch (err) {
            error.value = err.response?.data?.message || 'Login failed'
        } finally {
            loading.value = false
        }
    }

    async function register(payload) {
        loading.value = true
        error.value = null

        try {
            await api.csrf()
            await api.register(payload)
            await api.login({
                email: payload.email,
                password: payload.password,
            })
            await getUser()
        } catch (err) {
            error.value = err.response?.data?.message || 'Register failed'
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        await api.logout()
        user.value = null
    }

    return {
        user,
        loading,
        error,
        getUser,
        login,
        register,
        logout
    }
})
