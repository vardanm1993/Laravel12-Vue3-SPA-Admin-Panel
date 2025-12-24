import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFlashRedirect } from '@/composables/useFlashRedirect.js'

const KEY = 'verification_flow_ctx'
const LAST_KEY = 'verification_flow_last_next'
const LAST_TTL_MS = 30 * 60 * 1000

export const useVerificationFlowStore = defineStore('verificationFlow', () => {
    const ctx = ref(load())
    const finishing = ref(false)
    const lastFinishAt = ref(0)

    function load() {
        try {
            const raw = localStorage.getItem(KEY)
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }

    function save(v) {
        try {
            if (!v) localStorage.removeItem(KEY)
            else localStorage.setItem(KEY, JSON.stringify(v))
        } catch {}
    }

    function saveLastNext(next) {
        try {
            if (!next) return
            localStorage.setItem(LAST_KEY, JSON.stringify({ next, at: Date.now() }))
        } catch {}
    }

    function loadLastNext() {
        try {
            const raw = localStorage.getItem(LAST_KEY)
            if (!raw) return null
            const data = JSON.parse(raw)
            if (!data?.next || !data?.at) return null

            const now = Date.now()
            if (now - data.at > LAST_TTL_MS) return null

            return data.next
        } catch {
            return null
        }
    }

    function set(payload) {
        ctx.value = payload || null
        save(ctx.value)
        if (payload?.next) saveLastNext(payload.next)
    }

    function consume() {
        if (!ctx.value) ctx.value = load()

        const out = ctx.value
        ctx.value = null
        save(null)
        return out
    }

    async function finish(
        defaultNext = { name: 'admin.dashboard' },
        defaultFlashKey = 'auth.email_verified'
    ) {
        if (finishing.value) return
        const now = Date.now()
        if (now - lastFinishAt.value < 1500) return

        finishing.value = true
        lastFinishAt.value = now

        try {
            const { flashAndRedirect } = useFlashRedirect()

            const c = consume()
            const fallbackNext = loadLastNext()

            const next = c?.next || fallbackNext || defaultNext
            const key = c?.flashKey || defaultFlashKey

            return await flashAndRedirect(next, key)
        } finally {
            finishing.value = false
        }
    }

    return { ctx, set, consume, finish }
})
