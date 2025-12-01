import { useToastStore } from '@/stores/toast.store.js'
import { useRouter } from 'vue-router'

export function useFlashRedirect() {
    const router = useRouter()
    const toast = useToastStore()

    function flashAndRedirect(routeName, key, type = 'success') {
        toast.setFlash(key, type)
        router.push({ name: routeName })
    }

    return { flashAndRedirect }
}
