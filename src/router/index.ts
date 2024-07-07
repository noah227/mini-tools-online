import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const loadTools = () => {
    const context = require.context("@/views/tools")

    return context.keys().filter(k => /\.\/com.*\.vue/.test(k)).map(k => require(`@/views/tools/${k.replace("./", "").replace(".vue", "")}.vue`).default)
}

export const tools = loadTools()
const toolsAsChildren = tools.filter(tool => !tool.isLBlankPage)
const toolsAsBlankPage = tools.filter(tool => tool.isBlankPage)

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        redirect: "/control-panel"
    },
    {
        path: '/control-panel',
        name: 'control-panel',
        component: () => import('../views/control-panel.vue'),
        children: toolsAsChildren.map(tool => ({
            path: tool.name,
            name: tool.name,
            meta: {
                text: tool.text, icon: tool.icon, description: tool.description,
                faqList: tool.faqList
            },
            component: tool
        }))
    },
    ...toolsAsBlankPage.map(tool => ({
        path: "/" + tool.name,
        name: tool.name,
        meta: {text: tool.text, icon: tool.icon, description: tool.description},
        component: tool
    }))
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router
