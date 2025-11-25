<script setup>
import {useUiStore} from "@/stores/ui.store.js";

const ui = useUiStore()
</script>

<template>
    <div class="p-6 flex flex-col gap-4">
        <button @click="ui.setLoading(!ui.isLoading)" class="bg-indigo-800 text-white px-4 py-2 rounded">
            Toggle Loading (Current: {{ ui.isLoading }})
        </button>

        <button @click="ui.openModal('example', { foo: 'bar' })" class="bg-green-600 text-white px-4 py-2 rounded">
            Open Modal
        </button>

        <button @click="ui.closeModal()" class="bg-red-600 text-white px-4 py-2 rounded">
            Close Modal
        </button>

        <pre>{{ ui.modal }}</pre>
    </div>
</template>

<style scoped>

</style>
