import {defineStore} from "pinia";
import {ref} from "vue";

export const useUiStore = defineStore('ui', () => {
    const isLoading = ref(false)
    const modal = ref(null)

    function setLoading(value) {
        isLoading.value = value
    }

    function openModal(name, data = null) {
        modal.value = {name, data}
    }

    function closeModal(){
        modal.value = null
    }

    return {
        isLoading,
        modal,
        setLoading,
        openModal,
        closeModal
    }
})
