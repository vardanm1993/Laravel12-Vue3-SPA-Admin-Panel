import { useToastStore } from '@/stores/toast.store.js'
import router from "@/router/index.js";

export function useFlashRedirect() {
    const toast = useToastStore()

    function flashAndRedirect(target, messageKey, options = {}) {
        if (messageKey) toast.setFlash(messageKey, 'success')

        const route =
            typeof target === 'string'
                ? { name: target, ...(options || {}) }
                : { ...(target || {}), ...(options || {}) }

        return router.push(route)
    }

    return { flashAndRedirect }
}
