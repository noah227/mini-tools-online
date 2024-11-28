<template>
    <pre class="json-highlight"><code ref="refCode" class="language-json"
                                      data-prismjs-copy="复制" data-prismjs-copy-error="复制失败"
                                      data-prismjs-copy-success="已复制"
    ></code></pre>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref, watch} from "vue";
import "prismjs/themes/prism-coy.min.css"
import "prismjs/plugins/toolbar/prism-toolbar.min.css"

const prismJs = require("prismjs")

const pluginInitialized = ref(false)
const initPluginRequirement = () => {
    if (pluginInitialized.value) return
    require("prismjs/plugins/toolbar/prism-toolbar.js")
    require("prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js")
    pluginInitialized.value = true
}

const props = defineProps({
    code: {
        type: String,
        required: true
    },
    enableCopy: {
        type: Boolean
    }
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

onMounted(() => {
    props.enableCopy && initPluginRequirement()
    update()
})
</script>

<style lang="scss" scoped>
.json-highlight {
    height: 100%;
    overflow: auto;
    margin: 0;
}
</style>
