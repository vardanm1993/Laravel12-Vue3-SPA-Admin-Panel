import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

import {
    ensureAuthLoaded,
    isGuestOnly,
    requiresAuth,
    requiresVerified,
    requiredPermission,
} from '@/router/guards/auth.js'

import { checkPermission } from '@/router/guards/permissions.js'

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
                },
                {
                    path: 'forgot-password',
                    name: 'admin.forgot-password',
                    component: () => import('@/pages/admin/auth/ForgotPasswordPage.vue'),
                    meta: { title: 'auth.forgot_password' },
                },
                {
                    path: 'reset-password',
                    name: 'admin.reset-password',
                    component: () => import('@/pages/admin/auth/ResetPasswordPage.vue'),
                    meta: { title: 'auth.reset_password' },
                },
            ],
        },

        {
            path: '/admin',
            component: AuthLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'verify-email',
                    name: 'admin.verify-email',
                    component: () => import('@/pages/admin/auth/VerifyEmailPage.vue'),
                    meta: { requiresAuth: true, title: 'auth.verify_email' },
                },
            ],
        },

        {
            path: '/admin',
            component: AdminLayout,
            meta: { requiresAuth: true, requiresVerified: true },
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
                },

                {
                    path: 'users',
                    name: 'admin.users.index',
                    component: () => import('@/pages/admin/users/UsersIndexPage.vue'),
                    meta: { requiresAuth: true, requiresVerified: true, permission: 'users.view', title: 'admin.users.title' },
                },
            ],
        },

        { path: '/', redirect: '/admin/dashboard' },
    ],
})

router.beforeEach(async (to) => {
    const auth = await ensureAuthLoaded()

    if (requiresAuth(to) && !auth.user) {
        return { name: 'admin.login' }
    }

    if (requiresVerified(to) && auth.user && !auth.user.email_verified_at) {
        return { name: 'admin.verify-email' }
    }

    if (isGuestOnly(to) && auth.user) {
        if (!auth.user.email_verified_at) return { name: 'admin.verify-email' }
        return { name: 'admin.dashboard' }
    }

    const perm = requiredPermission(to)
    if (perm) {
        return await checkPermission(perm)
    }

    return true
})

export default router
