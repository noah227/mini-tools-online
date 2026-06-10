import {createRouter, createWebHashHistory, RouteComponent, RouteRecordRaw} from 'vue-router'
import {useGlobalStateStore} from "@/store";
import {updateRoutes} from "@/router/index.tools";

const loadTools = () => {
    const context = require.context("@/views/tools")

    return context.keys()
        .filter(k => /\.\/com.*\/*\.vue$/.test(k))
        .map(k => {
            const name = k.replace(/^\.\/com\./, "").replace(/\/index\.vue/, "")
            return {
                name,
                component: () => import(`@/views/tools/com.${name}/index.vue`) as Promise<RouteComponent>
            }
        })
}

export const tools = loadTools()

export const routeControlPanel: RouteRecordRaw = {
    path: '/control-panel',
    name: 'control-panel',
    component: () => import('../views/control-panel.vue'),
    children: []
}

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        redirect: "/control-panel"
    },
    routeControlPanel,
    {
        path: "/:pathMatch(.*)*",
        name: "stand-by",
        component: () => import("@/views/Stand.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

router.beforeResolve((to, from) => {
    // console.log("Router GO!", to.name, to.path, to.matched)
    const globalState = useGlobalStateStore()
    if (!globalState.userLang) {
        globalState.init()
        updateRoutes().then(() => {
            globalState.updateSeed()
            void router.push({path: to.path})
        })
        return false
    }
})

export default router
