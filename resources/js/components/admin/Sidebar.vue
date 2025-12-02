<script setup>
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import SidebarItem from "./SidebarItem.vue"

const { t } = useI18n()
const route = useRoute()

const items = [
    { label: "admin.dashboard", name: "admin.dashboard" },
]
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
                v-for="item in items"
                :key="item.name"
                :item="item"
                :active="route.name === item.name"
            />
        </nav>
    </aside>
</template>
