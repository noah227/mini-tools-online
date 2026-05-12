<template>
    <div id="control-panel" :class="globalState.zenMode && 'zen-mode'">
        <SiteHeader></SiteHeader>
        <div v-if="!showContent" id="filter-area">
            <el-input
                ref="refFilterInput" v-model.trim="filterStr"
                placeholder="/搜索 | Ctrl+U清除 | ESC退出"
                @keydown.stop
                @keydown.ctrl="handleHandleIfClear"
                @keydown.esc="blurFocus"
            ></el-input>
        </div>
        <div v-if="!showContent" id="item-list">
            <router-link
                v-for="{name, text, icon, description, devOnly} in renderTools"
                class="tool-item" :key="name" :to="{name}"
                :class="devOnly && 'dev-only'"
                :title="description"
            >
                <com-svg-loader class="svg-icon" :name="icon"/>
                <span class="text">{{ text || name }}</span>
            </router-link>
        </div>
        <div v-else id="content">
            <div id="nav-wrapper">
                <router-link id="back" class="iconfont icon-back" to="/control-panel"></router-link>
                <a v-if="false" id="zen-mode-entry" class="iconfont icon-zen-mode" title="Zen Mode" href="javascript:void(0);" @click="switchZenMode"></a>
            </div>
            <router-view/>
        </div>
        <SiteFooter :is-home="!showContent"></SiteFooter>
    </div>
</template>

<script lang="ts" setup>
import ComSvgLoader from "@/components/svg-loader.vue"
import SiteHeader from "@/components/site-header.vue"
import SiteFooter from "@/components/site-footer.vue"
import {computed, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {tools} from "@/router";
import {useGlobalStateStore} from "@/store";

const refFilterInput = ref()
const filterStr = ref("")
const handleHandleIfClear = (e: KeyboardEvent) => {
    if (e.code === "KeyU") {
        filterStr.value = ""
        e.stopPropagation()
        e.preventDefault()
    }
}
const blurFocus = () => {
    refFilterInput.value.blur()
}

const renderTools = computed(() => {
    const _tools = tools.filter(tool => {
        const {name, text} = tool
        return (name + text).toLowerCase().includes(filterStr.value.toLowerCase())
    })
    return _tools.length ? _tools : tools
})
const showContent = ref(false)
const route = useRoute()
const updateStatus = () => {
    showContent.value = location.hash.split("/").length > 2
}

watch(() => route.fullPath, () => {
    updateStatus()
})
updateStatus()

const globalState = useGlobalStateStore()
const switchZenMode = () => {
    globalState.switchZenMode()
}

// todo: 完善zen mode
onMounted(() => {
    window.addEventListener("keydown", e => {
        if (e.code === "Slash") {
            setTimeout(() => {
                refFilterInput.value?.focus()
            }, 0)
        }
        // 防止想操作清除输入框的误操作
        else if (e.code === "KeyU") {
            if (e.ctrlKey) e.preventDefault()
        }
    })
})
</script>

<style lang="scss" scoped>
@import "./control-panel";
@import "./control-panel.compatible";
</style>
