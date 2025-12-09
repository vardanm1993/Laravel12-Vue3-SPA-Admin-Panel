import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'

import AuthLayout from '@/layouts/AuthLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: '/admin',
            component: AuthLayout,
            meta: { guestOnly: true },
            children: [
                {
                    path: 'login',
                    name: 'admin.login',
                    component: () => import('@/pages/admin/auth/Login.vue'),
                    meta: { guestOnly: true, title: 'auth.login' },
                },
                {
                    path: 'register',
                    name: 'admin.register',
                    component: () => import('@/pages/admin/auth/Register.vue'),
                    meta: { guestOnly: true, title: 'auth.register' },
                }
            ]
        },

        {
            path: '/admin',
            component: AdminLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'dashboard',
                    name: 'admin.dashboard',
                    component: () => import('@/pages/admin/Dashboard.vue'),
                    meta: { requiresAuth: true, title: 'admin.dashboard' },
                },
                {
                    path: 'profile',
                    name: 'admin.profile',
                    component: () => import('@/pages/admin/profile/ProfilePage.vue'),
                    meta: { requiresAuth: true, title: 'admin.profile_page.title' },
                },
                {
                    path: 'profile/password',
                    name: 'admin.profile.password',
                    component: () => import('@/pages/admin/profile/ChangePasswordPage.vue'),
                    meta: { requiresAuth: true, title: 'admin.password_page.title' },
                },
                {
                    path: 'profile/delete',
                    name: 'admin.profile.delete',
                    component: () => import('@/pages/admin/profile/DeleteAccountPage.vue'),
                    meta: { requiresAuth: true, title: 'admin.delete_page.title' },
                }
            ]
        },

        { path: '/', redirect: '/admin/dashboard' },
    ]
})

let initialized = false

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (!initialized) {
        initialized = true
        try { await auth.getUser() } catch {}
    }

    if (to.meta.requiresAuth && !auth.user) {
        return { name: 'admin.login' }
    }

    if (to.meta.guestOnly && auth.user) {
        return { name: 'admin.dashboard' }
    }
})

export default router
