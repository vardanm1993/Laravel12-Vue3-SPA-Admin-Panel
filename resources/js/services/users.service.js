import { useApi } from '@/composables/useApi.js'

export function useUsersService() {
    const { get, put, patch } = useApi()

    const roles = () => get('/admin/roles')

    const index = ({ q = '', role = '', page = 1, perPage = 15 } = {}) => {
        const sp = new URLSearchParams()
        if (q) sp.set('q', q)
        if (role) sp.set('role', role)
        sp.set('page', String(page))
        sp.set('per_page', String(perPage))
        return get(`/admin/users?${sp.toString()}`)
    }

    const update = (id, data) => patch(`/admin/users/${id}`, data)

    const syncRoles = (id, roles) => put(`/admin/users/${id}/roles`, { roles })

    return { roles, index, update, syncRoles }
}
