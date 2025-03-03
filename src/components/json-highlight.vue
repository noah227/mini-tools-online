<template>
    <div class="json-highlight" :class="toolbarEnabled && 'toolbar-enabled'">
        <pre><code ref="refCode" class="language-json"
                   :data-toolbar-order="dataToolbarOrder"
                   data-prismjs-copy="复制" data-prismjs-copy-error="复制失败"
                   data-prismjs-copy-success="已复制"
                   data-prismjs-copy-timeout="3000"
        ></code></pre>
    </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import "prismjs/themes/prism-coy.min.css"
import "prismjs/plugins/toolbar/prism-toolbar.min.css"

const prismJs = require("prismjs")

const toolbarEnabled = computed(() => {
    return props.enableCopy || props.enableFullscreen
})

const initPluginRequirement = () => {
    require("prismjs/plugins/toolbar/prism-toolbar.js")
}
const initPluginCopyRequirement = () => {
    require("prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js")
}

const dataToolbarOrder = computed(() => {
    const tools = []
    if (props.enableCopy) tools.push("copy-to-clipboard")
    if (props.enableFullscreen) tools.push("view-in-fullscreen")
    if (props.enableDownload) tools.push("download-file")
    return tools.join(",")
})

const registerFullScreenButton = () => {
    prismJs.plugins.toolbar.registerButton("view-in-fullscreen", {
        text: "全屏",
        onClick(env: any) {
            // 热更新后element会丢失，仅开发模式会遇到，忽视即可
            env.element.requestFullscreen()
        }
    })
}

const registerDownloadButton = () => {
    prismJs.plugins.toolbar.registerButton("download-file", {
        text: "下载",
        onClick(env: any) {
            const a = document.createElement("a")
            a.download = "download.json"
            a.href = window.URL.createObjectURL(new Blob([props.code]))
            a.click()
        }
    })
}

const props = defineProps({
    code: {
        type: String,
        required: true
    },
    enableCopy: {
        type: Boolean
    },
    enableFullscreen: Boolean,
    enableDownload: Boolean,
})

const refCode = ref()

const update = () => {
    refCode.value.innerHTML = props.code
    nextTick(() => {
        prismJs.highlightAll()
    })
}

watch(() => props.code, () => {
    update()
})

let oldWarnFn = console.warn
let privateWarnFn = (message: any, ...res: any) => {
    if (typeof message === "string" && message.startsWith("There is a button with the key")) {
        // 组件复用的重复注册警告问题暂时无法处理，所以忽略warning
    } else oldWarnFn(message, ...res)
}

const doInit = () => {
    toolbarEnabled.value && initPluginRequirement()
    props.enableCopy && initPluginCopyRequirement()
    props.enableFullscreen && registerFullScreenButton()
    props.enableDownload && registerDownloadButton()
}

onMounted(() => {
    console.warn = privateWarnFn
    update()
    doInit()
})

onUnmounted(() => {
    console.warn = oldWarnFn
})
</script>

<style lang="scss">
.json-highlight {
    height: 100%;
    overflow: auto;

    &.toolbar-enabled {
        overflow: unset;
    }

    > .code-toolbar {
        height: 100%;
        overflow: auto;

        > pre {
            margin: 0;
            height: 100%;
            overflow: visible;
        }

        /* 没法同时处理coy主题的滚动条与toolbar按钮的位置问题，所以只能强制加个右边距 */
        > .toolbar {
            margin-right: 1.2em;
        }
    }

    > pre {
        margin: 0;
        height: 100%;
    }
}
</style>
<style lang="scss">
.code-toolbar .toolbar-item {
    &:not(:last-child) {
        margin-right: 6px;
    }
}
</style>
