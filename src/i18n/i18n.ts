import messages from "./i18n.auto-messages-entry"
import {computed} from "vue";
import {flatten} from "flat";
import {TI18nData} from "@/i18n/_shared.types";
import {defaultI18nLanguage, useGlobalStateStore} from "@/store";

export const withI18n = () => {
    const m = messages
    const cachedFlattenData: Record<string, any | undefined> = {}
    const getLocaledData = () => {
        let locale = useGlobalStateStore().userLang
        if (!locale) {
            locale = defaultI18nLanguage
            console.warn("Use default locale!")
        }
        return m[locale]
    }
    return computed(() => ({
        t(key: string) {
            const locale = useGlobalStateStore().userLang
            if (!locale) return ""
            const data = getLocaledData()
            let flatData = cachedFlattenData[key]
            if (!flatData) flatData = flatten<TI18nData, Record<string, any>>(data, {safe: true})
            const ret = flatData[key]
            return ret ? ret : ""
        }
    }))
}