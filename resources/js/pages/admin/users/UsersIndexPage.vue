<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users.store.js'
import UiButton from '@/components/ui/UiButton.vue'
import UiInput from '@/components/ui/UiInput.vue'

const users = useUsersStore()

onMounted(async () => {
    await users.fetchRoles()
    await users.fetchList(1)
})

function applyFilters() {
    users.fetchList(1)
}

function currentRole(u) {
    return (u.roles && u.roles[0]) ? u.roles[0] : 'user'
}

function onRoleChange(u, e) {
    users.changeRoles(u.id, [e.target.value])
}

function prev() {
    if (users.page <= 1) return
    users.fetchList(users.page - 1)
}

function next() {
    if (users.page >= users.lastPage) return
    users.fetchList(users.page + 1)
}
</script>

<template>
    <div class="p-6 max-w-6xl mx-auto space-y-4">
        <div class="flex items-end gap-3">
            <div class="flex-1">
                <UiInput v-model="users.q" :placeholder="$t('users.search_placeholder')" />
            </div>

            <div>
                <select v-model="users.role" class="h-10 rounded-xl border px-3">
                    <option value="">{{ $t('users.role_all') }}</option>
                    <option v-for="r in users.roles" :key="r" :value="r">{{ r }}</option>
                </select>
            </div>

            <UiButton variant="primary" :disabled="users.loading" @click="applyFilters">
                {{ $t('buttons.search') }}
            </UiButton>
        </div>

        <div class="rounded-2xl border overflow-hidden">
            <table class="w-full text-sm">
                <thead class="bg-gray-50">
                <tr>
                    <th class="text-left p-3">ID</th>
                    <th class="text-left p-3">{{ $t('fields.name') }}</th>
                    <th class="text-left p-3">{{ $t('fields.email') }}</th>
                    <th class="text-left p-3">Verified</th>
                    <th class="text-left p-3">Role</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="u in users.items" :key="u.id" class="border-t">
                    <td class="p-3">{{ u.id }}</td>
                    <td class="p-3">{{ u.name }}</td>
                    <td class="p-3">{{ u.email }}</td>
                    <td class="p-3">{{ u.email_verified_at ? 'Yes' : 'No' }}</td>
                    <td class="p-3">
                        <select class="h-9 rounded-xl border px-3" :value="currentRole(u)" @change="onRoleChange(u, $event)">
                            <option v-for="r in users.roles" :key="r" :value="r">{{ r }}</option>
                        </select>
                    </td>
                </tr>

                <tr v-if="!users.loading && users.items.length === 0">
                    <td class="p-6 text-center text-gray-500" colspan="5">Empty</td>
                </tr>

                <tr v-if="users.loading">
                    <td class="p-6 text-center text-gray-500" colspan="5">Loading...</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
                {{ users.total }} total
            </div>

            <div class="flex gap-2 items-center">
                <UiButton variant="outline" :disabled="users.loading || users.page <= 1" @click="prev">
                    Prev
                </UiButton>

                <div class="px-3 py-2 text-sm">
                    {{ users.page }} / {{ users.lastPage }}
                </div>

                <UiButton variant="outline" :disabled="users.loading || users.page >= users.lastPage" @click="next">
                    Next
                </UiButton>
            </div>
        </div>
    </div>
</template>
