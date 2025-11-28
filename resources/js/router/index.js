import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/auth.store.js'

const routes = [
    {path: '/', component: () => import('@/pages/HomePage.vue')},
    {path: '/ui-test', component: () => import('@/pages/UiTestPage.vue')},
    {path: '/api-test', component: () => import('@/pages/ApiTestPage.vue')},

    {
        path: '/admin/login',
        name: 'admin.login',
        meta: {guestOnly: true},
        component: () => import('@/pages/admin/auth/Login.vue')
    },
    {
        path: '/admin/register',
        name: 'admin.register',
        meta: {guestOnly: true},
        component: () => import('@/pages/admin/auth/Register.vue')
    },

    {
        path: '/admin/dashboard',
        name: 'admin.dashboard',
        meta: {requiresAuth: true},
        component: () => import('@/pages/admin/Dashboard.vue')
    },

    {path: '/admin', redirect: '/admin/dashboard'},
    {path: '/admin/:pathMatch(.*)*', redirect: '/admin/dashboard'}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    try {
        await auth.getUser()
    } catch (e) {}

    if (to.meta.requiresAuth && !auth.user) {
        return { name: 'admin.login' }
    }

    if (to.meta.guestOnly && auth.user) {
        return { name: 'admin.dashboard' }
    }
})

export default router
