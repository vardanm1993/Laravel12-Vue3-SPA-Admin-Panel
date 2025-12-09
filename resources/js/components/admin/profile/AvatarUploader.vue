<script setup>
import { ref } from 'vue'
import { useProfileStore } from '@/stores/profile.store.js'
import { useI18n } from 'vue-i18n'
import UiButton from "@/components/ui/UiButton.vue";

const { t } = useI18n()
const profileStore = useProfileStore()

const fileInput = ref(null)
const preview = ref(null)

function triggerSelect() {
    fileInput.value?.click()
}

async function onFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    preview.value = URL.createObjectURL(file)

    await profileStore.uploadAvatar(file)
}
</script>

<template>
    <div class="flex flex-col items-start space-y-3">
        <div class="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            <img
                v-if="preview"
                :src="preview"
                alt="Preview"
                class="w-full h-full object-cover"
            />

            <img
                v-else-if="profileStore.profile?.avatar_url"
                :src="profileStore.profile.avatar_url"
                alt="Avatar"
                class="w-full h-full object-cover"
            />

            <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-500 text-sm"
            >
                {{ t('buttons.upload') }}
            </div>
        </div>

        <input
            type="file"
            class="hidden"
            ref="fileInput"
            accept="image/*"
            @change="onFileChange"
        />

        <UiButton variant="outline" @click="triggerSelect">
            {{ t('buttons.upload') }}
        </UiButton>
    </div>
</template>
