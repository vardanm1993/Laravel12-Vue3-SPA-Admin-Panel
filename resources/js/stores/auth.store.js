import {defineStore} from 'pinia'
import {useAuthApi} from '@/composables/useAuthApi.js'
import {ref} from 'vue'
import {useErrorStore} from "@/stores/error.store.js";
import {useFlashRedirect} from "@/composables/useFlashRedirect.js";

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
            flashAndRedirect('admin.dashboard', res.message_key || 'auth.login_success')
        } catch (err) {
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
            flashAndRedirect('admin.dashboard', res.message_key || 'auth.register_success')
        }catch (err){
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        try {
            await api.logout()
        } catch (e) {
        }
        user.value = null
    }

    return {
        user, loading,
        getUser, login, register, logout
    }
})
