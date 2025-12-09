import {useUiStore} from '@/stores/ui.store.js'
import {ref} from 'vue'
import {api} from '@/libs/axios.js'

export function useApi() {
    const ui = useUiStore()

    const loading = ref(false)
    const error = ref(null)

    async function request(method, url, data = null, params = null) {
        loading.value = true
        error.value = null
        ui.setLoading(true)

        try {
            const response = await api({
                method,
                url,
                data,
                params,
            })

            return response.data

        } catch (err) {
            const res = err.response?.data

            if (res?.message_key) {
                error.value = res.message_key
            } else if (res?.message) {
                error.value = res.message
            } else {
                error.value = 'messages.unknown_error'
            }

            throw err

        } finally {
            loading.value = false
            ui.setLoading(false)
        }
    }

    return {
        request,
        get: (url, params = null) => request('GET', url, null, params),
        post: (url, data) => request('POST', url, data),
        put: (url, data) => request('PUT', url, data),
        patch: (url, data) => request('PATCH', url, data),
        delete: (url) => request('DELETE', url),
        loading,
        error
    }
}
