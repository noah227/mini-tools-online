<template>
    <ul class="list-help">
        <li v-for="(item, index) in renderHelpList" :key="index">
            <el-link v-if="item.link" :href="item.link" :style="item.style" target="_blank"
                     v-html="item.text"></el-link>
            <el-link v-else-if="item.helpInfo" href="javascript:void(0)" :style="item.style" @click="viewHelpInfo(item)"
                     v-html="item.text"></el-link>
            <span v-else v-html="item.text" :style="item.style"></span>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {ElMessageBox} from "element-plus";

export type THelpListObject = {
    // 以html模式渲染
    text: string
    title?: string
    link?: string
    // 有link时helpInfo无效
    helpInfo?: THelpInfo
    // 对话框宽度
    width?: string
    style?: string | object
}

export type THelpListItem = string | THelpListObject

type THelpInfo = string | Function | string[] | {
    // tag构建模式
    tag: string
    list: string[]
}

const props = defineProps({
    helpList: {
        type: Object as () => THelpListItem[],
        required: true
    },
    lineHeight: {
        type: Number,
        default: 1.5
    },
    // 全局对话框宽度设定
    dialogWidth: String
})

type TRenderHelpListItem = THelpListObject

const renderHelpList = computed<TRenderHelpListItem[]>(() => {
    return props.helpList.map(item => {
        return typeof item === "string" ? {text: item} : item
    })
})

const viewHelpInfo = ({helpInfo, text, title = text, width = props.dialogWidth}: TRenderHelpListItem) => {
    if (!helpInfo) return
    let info: string

    if (typeof helpInfo === "function") info = helpInfo()
    else if (helpInfo instanceof Array) info = helpInfo.join("")
    else if (typeof helpInfo === "object") {
        info = helpInfo.list.map(item => `<${helpInfo.tag}>${item}</${helpInfo.tag}>`).join("\n")
    } else info = helpInfo

    ElMessageBox.alert(undefined, {
        title,
        type: "info",
        dangerouslyUseHTMLString: true,
        message: info,
        customStyle: width ? {
            width,
            maxWidth: "unset"
        } : undefined
    }).catch(() => {
    })
}
</script>

<style lang="scss" scoped>
.list-help {
    li {
        line-height: v-bind(lineHeight);
        font-size: 14px;
        * {
            color: #606060;
        }
    }
}
</style>
