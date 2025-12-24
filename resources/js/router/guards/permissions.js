import { ensureAuthLoaded } from '@/router/guards/auth.js'

export async function checkPermission(permission) {
    const auth = await ensureAuthLoaded()

    if (!auth.user) return { name: 'admin.login' }
    if (!auth.user.email_verified_at) return { name: 'admin.verify-email' }

    if (!auth.can(permission)) return { name: 'admin.dashboard' }

    return true
}
