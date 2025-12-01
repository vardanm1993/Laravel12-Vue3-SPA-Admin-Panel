import {defineStore} from 'pinia'
import {toast} from 'vue3-toastify'
import {i18n} from '@/i18n'
import {ref} from "vue";

export const useToastStore = defineStore('toast', () => {

    const flashMessage = ref(null)
    const flashType = ref('success')

    function success(key) {
        toast.success(i18n.global.t(key))
    }

    function error(key) {
        toast.error(i18n.global.t(key))
    }

    function info(key) {
        toast(i18n.global.t(key))
    }

    function setFlash(key, type = 'success') {
        flashMessage.value = key
        flashType.value = type
    }

    function showFlashIfExists() {
        if (flashMessage.value) {
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
    }

    return {
        flashMessage,
        flashType,
        success,
        error,
        info,
        setFlash,
        showFlashIfExists
    }
})
