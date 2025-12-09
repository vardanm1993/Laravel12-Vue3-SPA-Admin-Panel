<script setup>
import Sidebar from '@/components/admin/Sidebar.vue'
import AppHeader from '@/components/admin/AppHeader.vue'
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
