<template>
    <div id="client-info">
        <HeadRender with-bottom-border></HeadRender>
        <div id="content-area">
            <JsonHighlight :code="clientInfoStr"></JsonHighlight>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "client-info",
    text: "客户端信息",
    icon: "client-info",
    description: "查看基础的客户端设备信息"
}
</script>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import {computed, ref} from "vue";
import debounce from "debounce";
import JsonHighlight from "@/components/json-highlight.vue"
import Bowser from "bowser";

const clientInfo = ref<{ [index: string]: any }>({
    body: {},
    language: "",
    languages: "",
    navigator: {}
})

const indentSize = computed(() => {
    const {clientWidth} = clientInfo.value.body
    if(typeof clientWidth === "undefined") return 4
    return clientWidth < 520 ? 2 : 4
})
const clientInfoStr = computed(() => {
    return JSON.stringify(clientInfo.value, null, indentSize.value)
})

const updateBodyInfo = () => {
    clientInfo.value.body = {
        clientWidth: document.body.clientWidth,
        clientHeight: document.body.clientHeight,
    }
}

const updateNavigatorInfo = () => {
    clientInfo.value.navigator = {
        userAgent: Bowser.getParser(navigator.userAgent).getResult()
    }
}

const update = debounce(() => {
    updateBodyInfo()
    clientInfo.value = {
        ...clientInfo.value,
        language: navigator.language,
        languages: navigator.languages
    }
    updateNavigatorInfo()
})

update()

window.onresize = debounce(updateBodyInfo)
</script>

<style lang="scss">
div#client-info {

}

#content-area {
    flex-grow: 1;
}
</style>
