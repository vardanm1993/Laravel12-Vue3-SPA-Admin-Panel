import { useApi } from '@/composables/useApi.js'

export function useProfileService() {
    const { get, post } = useApi()

    const fetch = () => get('/profile')
    const updateProfile = (data) => post('/profile/update', data)
    const updatePassword = (data) => post('/profile/password', data)
    const uploadAvatar = (formData) => post('/profile/avatar', formData)
    const deleteAccount = (data) => post('/profile/delete', data)

    return {
        fetch,
        updateProfile,
        updatePassword,
        uploadAvatar,
        deleteAccount,
    }
}
