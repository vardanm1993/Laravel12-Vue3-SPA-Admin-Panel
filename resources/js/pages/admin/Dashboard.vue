<script setup>
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.store.js'
import { useToastStore } from '@/stores/toast.store.js'
import { onMounted, ref } from 'vue'
import UiButton from "@/components/ui/UiButton.vue";

const { t } = useI18n()
const auth = useAuthStore()
const toast = useToastStore()

const stats = ref({
    products: 0,
    categories: 0,
    users: 0,
})

onMounted(async () => {
    toast.showFlashIfExists()

    stats.value = {
        products: 124,
        categories: 12,
        users: 823,
    }
})
</script>

<template>
    <div class="max-w-6xl mx-auto py-8 space-y-10">

        <section>
            <h1 class="text-3xl font-bold tracking-tight">
                {{ t('admin.dashboard') }}
            </h1>

            <p class="text-gray-600 mt-2 text-lg">
                {{ t('app.welcome') }},
                <b class="text-gray-800">{{ auth.user?.name }}</b>
            </p>
        </section>


        <section>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <div class="p-6 bg-white rounded-2xl shadow flex flex-col">
                    <span class="text-gray-500 text-sm">
                        {{ t('admin.products') }}
                    </span>
                    <span class="text-3xl font-semibold mt-2">
                        {{ stats.products }}
                    </span>
                </div>

                <div class="p-6 bg-white rounded-2xl shadow flex flex-col">
                    <span class="text-gray-500 text-sm">
                        {{ t('admin.categories') }}
                    </span>
                    <span class="text-3xl font-semibold mt-2">
                        {{ stats.categories }}
                    </span>
                </div>

                <div class="p-6 bg-white rounded-2xl shadow flex flex-col">
                    <span class="text-gray-500 text-sm">
                        {{ t('admin.users') }}
                    </span>
                    <span class="text-3xl font-semibold mt-2">
                        {{ stats.users }}
                    </span>
                </div>

            </div>
        </section>


        <section>
            <h2 class="text-xl font-semibold mb-4">
                Quick Actions
            </h2>

            <div class="flex flex-wrap gap-4">
                <UiButton variant="primary">
                    + {{ t('admin.products') }}
                </UiButton>

                <UiButton variant="outline">
                    + {{ t('admin.categories') }}
                </UiButton>

                <UiButton variant="outline">
                    {{ t('admin.users') }}
                </UiButton>
            </div>
        </section>

    </div>
</template>
