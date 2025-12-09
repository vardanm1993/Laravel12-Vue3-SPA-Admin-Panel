import {defineStore} from 'pinia'
import {ref} from 'vue'
import {useProfileService} from '@/services/profile.service.js'
import {useToastStore} from '@/stores/toast.store.js'
import {useAuthStore} from '@/stores/auth.store.js'

export const useProfileStore = defineStore('profile', () => {
    const service = useProfileService()
    const toast = useToastStore()

    const profile = ref(null)
    const loading = ref(false)
    const auth = useAuthStore()



    async function fetchProfile() {
        loading.value = true
        try {
            const res = await service.fetch()
            profile.value = res.user || null
        }  finally {
            loading.value = false
        }
    }

    async function updateProfile(data) {
        loading.value = true
        try {
            const res = await service.updateProfile(data)
            profile.value = res.user

            if (auth.user) {
                auth.user.name = res.user.name
                auth.user.email = res.user.email
            }

            toast.success(res.message_key || 'messages.profile_updated')
        } finally {
            loading.value = false
        }
    }

    async function updatePassword(data) {
        loading.value = true
        try {
            const res = await service.updatePassword(data)
            toast.success(res.message_key || 'messages.password_updated')
        } finally {
            loading.value = false
        }
    }

    async function uploadAvatar(file) {
        const formData = new FormData()
        formData.append('avatar', file)

        const res = await service.uploadAvatar(formData)

        if (profile.value) {
            profile.value.avatar_url = res.avatar_url
        }

        if (auth.user) {
            auth.user.avatar_url = res.avatar_url
        }

        toast.success(res.message_key || 'messages.avatar_updated')
    }

    async function deleteAccount(data) {
        loading.value = true
        try {
            const res = await service.deleteAccount(data)
            profile.value = null
            return res
        }  finally {
            loading.value = false
        }
    }

    return {
        profile,
        loading,
        fetchProfile,
        updateProfile,
        updatePassword,
        uploadAvatar,
        deleteAccount
    }
})
