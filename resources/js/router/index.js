import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('@/pages/HomePage.vue') },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
