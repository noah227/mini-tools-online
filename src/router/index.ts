import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const loadTools = () => {
    const context = require.context("@/views/tools")

    return context.keys().filter(k => /\.\/com.*\.vue/.test(k)).map(k => require(`@/views/tools/${k.replace("./", "").replace(".vue", "")}.vue`).default)
}

type TToolItem = {
    name: string
    text: string,
    icon: string,
    description: string
    isBlankPage?: boolean
    devOnly?: boolean
    faqList?: {
        title: string
        link?: string
    }[]
}

export const tools = (loadTools() as TToolItem[]).filter(tool => {
    // 过滤仅dev显示的内容
    return process.env.NODE_ENV === "development" ? true : !tool.devOnly
})

const toolsAsChildren = tools.filter(tool => !tool.isBlankPage)
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
