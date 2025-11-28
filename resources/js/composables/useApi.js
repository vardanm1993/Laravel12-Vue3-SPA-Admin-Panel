import {useUiStore} from "@/stores/ui.store.js";
import {ref} from "vue";
import {api} from "@/libs/axios.js";

export function useApi() {
    const ui = useUiStore()

    const loading = ref(false)
    const error = ref(null)

    async function request(method, url, data = null) {
        loading.value = true
        error.value = null
        ui.setLoading(true)

        try {
            const response = await api({method, url, data})

            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Unknown error'
            throw err
        } finally {
            loading.value = false
            ui.setLoading(false)
        }
    }

    const get    = (url, params = null) => request("GET", url, { params })
    const post   = (url, data)          => request("POST", url, data)
    const put    = (url, data)          => request("PUT", url, data)
    const patch  = (url, data)          => request("PATCH", url, data)
    const del    = (url)                => request("DELETE", url)

    return {
        request,
        get,
        post,
        put,
        patch,
        del,
        loading,
        error
    }
}
