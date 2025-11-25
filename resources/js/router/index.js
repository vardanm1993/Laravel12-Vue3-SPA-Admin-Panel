import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/pages/HomePage.vue')
    },
    {
        path: '/ui-test',
        component: () => import('@/pages/UiTestPage.vue')
    }

]

export default createRouter({
    history: createWebHistory(),
    routes,
})
