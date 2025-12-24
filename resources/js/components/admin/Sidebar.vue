<script setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { useAuthStore } from "@/stores/auth.store.js"
import SidebarItem from "./SidebarItem.vue"

const { t } = useI18n()
const route = useRoute()
const auth = useAuthStore()

const items = [
    { label: "admin.dashboard", name: "admin.dashboard" },
    { label: "admin.users.title", name: "admin.users.index", permission: "users.view" },
]

const visibleItems = computed(() => {
    return items.filter((i) => {
        if (!i.permission) return true
        return auth.can(i.permission)
    })
})

function isActive(item) {
    const r = String(route.name || '')
    const n = String(item.name || '')
    return r === n || r.startsWith(n + '.')
}
</script>

<template>
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div class="h-16 flex items-center px-6 border-b">
            <span class="text-lg font-semibold">
                {{ t("admin.panel") }}
            </span>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1">
            <SidebarItem
                v-for="item in visibleItems"
                :key="item.name"
                :item="item"
                :active="isActive(item)"
            />
        </nav>
    </aside>
</template>
