<script setup>
import {useApi} from "@/composables/useApi.js";

const { request, loading, error } = useApi()

async function testApi(){
    try{
        const data = await request('GET', '/test')
        console.log('API Result:', data)
    } catch {}
}


</script>

<template>
    <div class="p-6 flex flex-col gap-2">
        <button
            @click="testApi"
            class="bg-indigo-600 text-white px-4 py-2 rounded">
            Test API
        </button>

        <div v-if="loading">Loading...</div>
        <div v-if="error" class="text-red-500">{{ error }}</div>
    </div>
</template>

<style scoped>

</style>
