<script setup>
import {onMounted, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth.store.js'
import {useToastStore} from '@/stores/toast.store.js'
import UiButton from '@/components/ui/UiButton.vue'
import {useVerificationFlowStore} from "@/stores/verificationFlow.store.js";

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const flow = useVerificationFlowStore()


async function consumeVerifyQuery(v) {
    const s = String(v || '')
    if (!s) return

    await router.replace({query: {...route.query, verify: undefined}})

    if (s === 'invalid') {
        toast.error('auth.email_verify_invalid')
        return
    }

    if (s === 'verified') {
        await auth.getUser()

        toast.success('auth.email_verified')
        return
    }

    if (s === 'sent') {
        toast.success('auth.verification_sent')
    }
}

onMounted(async () => {
    await auth.getUser()
})

watch(
    () => route.query.verify,
    (v) => {
        consumeVerifyQuery(v)
    },
    {immediate: true}
)

async function goNext() {
    await auth.getUser()

    if (!auth.user) return router.push({name: 'admin.login'})

    if (!auth.user.email_verified_at) {
        return
    }

    return flow.finish()
}

async function resend() {
    await auth.sendVerification()
    router.replace({query: {...route.query, verify: 'sent'}})
}
</script>

<template>
    <div class="space-y-4">
        <h1 class="text-2xl font-semibold">
            {{ auth.user ? auth.user.name : '' }} {{ $t('auth.verify_email') }}
        </h1>

        <p class="text-gray-600">
            {{ $t('auth.verify_email_hint') }}
        </p>

        <div class="flex gap-3">
            <UiButton variant="primary" @click="goNext">
                {{ $t('buttons.continue') }}
            </UiButton>

            <UiButton
                v-if="auth.user && !auth.user.email_verified_at"
                variant="outline"
                @click="resend"
            >
                {{ $t('auth.resend_verification') }}
            </UiButton>
        </div>
    </div>
</template>
