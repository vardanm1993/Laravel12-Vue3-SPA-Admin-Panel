<script setup>
import {onMounted} from "vue";
import {useToastStore} from "@/stores/toast.store.js";

const toast = useToastStore()

onMounted(() => {
    toast.showFlashIfExists()
})
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
            <router-view />
        </div>
    </div>
</template>

<style scoped>

</style>
