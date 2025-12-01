import { useToastStore } from '@/stores/toast.store.js'
import { useErrorStore } from '@/stores/error.store.js'
import { i18n } from '@/i18n'
import axios from 'axios'

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    }
})

api.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.global.locale.value
    return config
})

api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status
        const data   = error.response?.data
        const toast  = useToastStore()
        const errors = useErrorStore()
        const { url } = error.config || {}

        if (status === 401 && url === '/user') {
            return Promise.reject(error)
        }


        if (status === 422 && data?.errors) {
            errors.setErrors(data.errors)
            toast.error('validation.failed')
            return Promise.reject(error)
        }

        if (status === 401 && data?.message_key) {
            toast.error(data.message_key)
            return Promise.reject(error)
        }

        const key = data?.message_key || 'messages.unknown_error'
        toast.error(key)

        return Promise.reject(error)
    }
)
