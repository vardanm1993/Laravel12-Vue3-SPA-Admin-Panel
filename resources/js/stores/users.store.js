import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUsersService } from '@/services/users.service.js'
import { useToastStore } from '@/stores/toast.store.js'

export const useUsersStore = defineStore('users', () => {
    const service = useUsersService()
    const toast = useToastStore()

    const items = ref([])
    const roles = ref([])
    const loading = ref(false)

    const q = ref('')
    const role = ref('')

    const page = ref(1)
    const perPage = ref(15)
    const lastPage = ref(1)
    const total = ref(0)

    async function fetchRoles() {
        const res = await service.roles()
        roles.value = res.roles || []
    }

    async function fetchList(nextPage = 1) {
        loading.value = true
        try {
            const res = await service.index({
                q: q.value,
                role: role.value,
                page: nextPage,
                perPage: perPage.value,
            })

            const p = res.users
            items.value = p?.data || []
            page.value = p?.current_page || nextPage
            perPage.value = p?.per_page || perPage.value
            lastPage.value = p?.last_page || 1
            total.value = p?.total || 0
        } finally {
            loading.value = false
        }
    }

    async function changeRoles(userId, nextRoles) {
        const res = await service.syncRoles(userId, nextRoles)
        const u = items.value.find(x => x.id === userId)
        if (u) u.roles = res.roles || nextRoles
        toast.success(res.message_key || 'users.roles_updated')
    }

    async function updateUser(userId, payload) {
        const res = await service.update(userId, payload)
        const u = items.value.find(x => x.id === userId)
        if (u && res.user) Object.assign(u, res.user)
        toast.success(res.message_key || 'users.updated')
    }

    return {
        items, roles, loading,
        q, role, page, perPage, lastPage, total,
        fetchRoles, fetchList, changeRoles, updateUser,
    }
})
