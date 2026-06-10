import {RouteRecordRaw} from "vue-router";


export type TFaqItem = {
    title: string
    link?: string
}

export type TMetaContent = {
    labels?: Record<string, string>
    checks?: Record<string, string>
    // not used yet
    inputs?: Record<string, string>
    placeholders?: Record<string, string>
    options?: Record<string, string>
    buttons?: Record<string, string>
    titles?: Record<string, string>
    legends?: Record<string, string>
    switches?: Record<string, string>
}

export type TMetaStatic = {
    name: string
    text: string
    icon: string
    description: string
    isBlankPage?: boolean
    devOnly?: boolean
    faqList?: TFaqItem[]
    content?: TMetaContent
}

export type TMetaRuntime = Omit<TMetaStatic, "name"> & {
    update: (route: RouteRecordRaw) => Promise<void>
}