import { useAuthStore } from '@/stores/auth.store.js'

let initialized = false

export async function ensureAuthLoaded() {
    const auth = useAuthStore()

    if (!initialized) {
        initialized = true
        try { await auth.getUser() } catch {}
    }

    return auth
}

export function isGuestOnly(to) {
    return to.matched.some(r => r.meta.guestOnly)
}

export function requiresAuth(to) {
    return to.matched.some(r => r.meta.requiresAuth)
}

export function requiresVerified(to) {
    return to.matched.some(r => r.meta.requiresVerified)
}

export function requiredPermission(to) {
    return to.matched
        .map(r => r.meta.permission)
        .find(Boolean)
}
