<script setup>
import Sidebar from '@/components/admin/Sidebar.vue'
import AppHeader from '@/components/admin/AppHeader.vue'
import {onMounted} from "vue";
import {useToastStore} from "@/stores/toast.store.js";

const toast = useToastStore()

onMounted(() => {
    toast.showFlashIfExists()
})
</script>

<template>
    <div class="min-h-screen flex bg-gray-100">
        <Sidebar />

        <div class="flex-1 flex flex-col">
            <AppHeader />
            <main class="flex-1 p-6">
                <router-view />
            </main>
        </div>
    </div>
</template>
