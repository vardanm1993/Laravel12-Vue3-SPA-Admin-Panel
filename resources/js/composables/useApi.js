import { useUiStore } from '@/stores/ui.store.js'
import { ref } from 'vue'
import { api } from '@/libs/axios.js'

export function useApi() {
    const ui = useUiStore()

    const loading = ref(false)
    const error = ref(null)

    async function request(method, url, data = null) {
        loading.value = true
        error.value = null
        ui.setLoading(true)

        try {
            const response = await api({ method, url, data })
            return response.data

        } catch (err) {

            const data = err.response?.data

            if (data?.message_key) {
                error.value = data.message_key
            } else if (data?.message) {
                error.value = data.message
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
        get:   (url, params = null) => request('GET', url, { params }),
        post:  (url, data)          => request('POST', url, data),
        put:   (url, data)          => request('PUT', url, data),
        patch: (url, data)          => request('PATCH', url, data),
        del:   (url)                => request('DELETE', url),
        loading,
        error
    }
}
