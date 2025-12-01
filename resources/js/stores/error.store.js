import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
    const formErrors = ref({})

    function setErrors(errors) {
        formErrors.value = {...errors}
    }

    function clearErrors() {
        formErrors.value = {}
    }

    return { formErrors, setErrors, clearErrors }
})
