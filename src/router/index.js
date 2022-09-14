import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const loadTools = () => {
    const context = require.context("@/views/tools")
    return context.keys().filter(k => /\.\/com.*\.vue/.test(k)).map(k => require(`@/views/tools/${k.replace("./", "").replace(".vue", "")}.vue`).default)
}

export const tools = loadTools()

const createRoutes = () => {
    return tools.map(tool => ({
        path: tool.name,
        name: tool.name,
        meta: {text: tool.text, icon: tool.icon},
        component: tool
    }))
}

const routes = [
    {
        path: '/',
        name: 'home',
        redirect: "/control-panel"
    },
    {
        path: '/control-panel',
        name: 'control-panel',
        component: () => import('../views/control-panel.vue'),
        children: createRoutes()
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
