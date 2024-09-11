import {Ref, watch} from "vue";
import {ElMessage} from "element-plus";

const Cookies = require("js-cookie")


export const CookieGet = (key: string, defaultValue?: any) => {
    return Cookies.get(key) || defaultValue
}

export const CookieSet = (key: string, value: any) => {
    Cookies.set(key, value, {expires: 365})
}

/**
 * 同步初始化和监听保存ref值
 */
export const syncRef = (refTarget: Ref<any>, key: string, initDefault?: any, config?: {
    onLoad?: (value: string | undefined, callback: Function) => void
    onSave?: (value: any, callback: Function) => void
}) => {
    let value = CookieGet(key, initDefault) ?? refTarget.value
    // 目前没有存储number的sync，所以不做额外的处理
    value = value === "true" ? true : value === "false" ? false : value
    if(config?.onLoad) {
        config.onLoad(value, (value: any) => {
            refTarget.value = value
        })
    }
    else refTarget.value = value
    // console.log(refTarget.value)
    watch(() => refTarget.value, v => {
        if(config?.onSave) {
            config.onSave(v, (value: any) => {
                CookieSet(key, value)
            })
        }
        else CookieSet(key, v)
    }, {deep: true})
}

/**
 * 复制内容到剪贴板
 */
export const copyToClipboard = (text: string, errorMessage?: string) => {
    if(!text) return ElMessage.info("没有要复制的内容！")
    navigator.clipboard.writeText(text).then(() => {
        ElMessage.success("已复制到剪贴板")
    }).catch(e => {
        ElMessage.error(errorMessage || e.message || e.toString || "复制失败，请手动重试！")
    })
}
