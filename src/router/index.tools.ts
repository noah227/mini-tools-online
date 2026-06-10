import router, {routeControlPanel, tools} from "@/router/index";
import {RouteMeta, RouteRecordRaw} from "vue-router";
import {useGlobalStateStore} from "@/store";


const isDevelopment = process.env.NODE_ENV === "development"

export const updateRoutes = (callback?: Function) => {
    // 调用时这里已经能拿到locale了
    const lang = useGlobalStateStore().userLang.replace("-", "_")
    return new Promise(async (resolve, reject) => {
        const routesAsChildren: RouteRecordRaw[] = []
        const routesAsBlankPage: RouteRecordRaw[] = []
        for (let tool of tools) {
            const metaImport = () => import(`@/views/tools/com.${tool.name}/index.meta.${lang}.ts`) as Promise<{
                meta: RouteMeta
            }>
            const {meta} = await metaImport()
            if (!isDevelopment && meta.devOnly) continue

            const route = {
                name: tool.name,
                path: "",
                component: tool.component,
                meta: {
                    ...meta,
                    isTool: true
                }
            }
            if (meta.isBlankPage) {
                route.path = "/" + tool.name
                routesAsBlankPage.push(route)
            } else {
                route.path = tool.name
                routesAsChildren.push(route)
            }
        }

        routeControlPanel.children = []

        routeControlPanel.children.push(...routesAsChildren)
        routesAsBlankPage.forEach(router.addRoute)

        router.addRoute(routeControlPanel)

        // console.log(router.getRoutes())
        callback && callback()
        resolve(true)
    })
}