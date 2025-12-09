import {defineStore} from 'pinia'
import {toast} from 'vue3-toastify'
import {i18n} from '@/i18n'
import {ref} from 'vue'

export const useToastStore = defineStore('toast', () => {

    const flashMessage = ref(null)
    const flashType = ref('success')

    const lastKey = ref(null)
    const lastTime = ref(0)

    const DEDUP_INTERVAL = 2000
    const DEBOUNCE_INTERVAL = 300

    function shouldSkip(key) {
        const now = Date.now()

        if (now - lastTime.value < DEBOUNCE_INTERVAL) return true

        if (key === lastKey.value && now - lastTime.value < DEDUP_INTERVAL) return true

        lastKey.value = key
        lastTime.value = now

        return false
    }

    function success(key) {
        if (shouldSkip(key)) return
        toast.success(i18n.global.t(key))
    }

    function error(key) {
        if (shouldSkip(key)) return
        toast.error(i18n.global.t(key))
    }

    function info(key) {
        if (shouldSkip(key)) return
        toast(i18n.global.t(key))
    }

    function setFlash(key, type = 'success') {
        flashMessage.value = key
        flashType.value = type
    }

    function showFlashIfExists() {
        if (!flashMessage.value) return

        if (flashType.value === 'error') {
            error(flashMessage.value)
        } else if (flashType.value === 'info') {
            info(flashMessage.value)
        } else {
            success(flashMessage.value)
        }

        flashMessage.value = null
        flashType.value = 'success'
    }

    return {
        flashMessage,
        flashType,
        success,
        error,
        info,
        setFlash,
        showFlashIfExists,
    }
})
