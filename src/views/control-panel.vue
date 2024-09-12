<template>
    <div id="control-panel">
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
                v-for="{name, text, icon, description} in renderTools"
                class="tool-item" :key="name" :to="{name}"
                :title="description"
            >
                <com-svg-loader class="svg-icon" :name="icon"/>
                <span class="text">{{ text || name }}</span>
            </router-link>
        </div>
        <div v-else id="content">
            <router-link id="back" class="iconfont icon-back" to="/control-panel"></router-link>
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

onMounted(() => {
    window.addEventListener("keydown", e => {
        if (e.code === "Slash") {
            setTimeout(() => {
                refFilterInput.value?.focus()
            }, 0)
        }
        // 防止想操作清除输入框的误操作
        else if (e.code === "KeyU") {
            if(e.ctrlKey) e.preventDefault()
        }
    })
})
</script>

<style lang="scss" scoped>
div#control-panel {
    width: 100%;
    height: 100vh;
    padding: 1.2rem 0 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    > div {
        width: 75%;
    }

    > div#filter-area {
        margin: 0 auto;

        > div {
            height: 42px;
        }

        :deep(.el-input__wrapper) {
            box-shadow: 0 3px 6px #f0f0f0;
            border-bottom: 1px solid #d0d0d0;

            &.is-focus {
                box-shadow: 0 3px 6px -3px #6af;
            }

            input {
                text-align: center;
            }
        }
    }

    > div#item-list {
        flex-grow: 1;
        margin: 0 auto;
        padding: 3rem 0;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(auto-fill, 8.8rem);
        justify-content: center;
        justify-items: center;
        align-content: flex-start;
        grid-gap: 1.7rem;
        // display: grid;
        .tool-item {
            width: 8.8rem;
            height: 8.8rem;
            padding: 1rem;
            box-sizing: border-box;
            box-shadow: 0 0 5px #aaa;
            transition: all ease-out .12s;

            &:hover {
                box-shadow: 0 0 8px #6af;
                transform: scale(1.05);
            }

            border-radius: .5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            cursor: pointer;
            user-select: none;

            .svg-icon {
                width: 3rem
            }

            .text {
                font-weight: bold;
            }
        }
    }

    > div#content {
        flex-grow: 1;
        margin: 2em auto;
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: flex-start;

        > div {
            flex-grow: 1;
            width: 100%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            border: 1px solid #3af;
            border-radius: .5rem;
        }

        > #back {
            display: inline-block;
            width: 3rem;
            padding: 0 .8rem;
            font-size: 3rem;
            border-radius: .5rem;
            box-shadow: 0 0 3px #888;
            background-color: #fcfcfc;
            z-index: 333;
            cursor: pointer;
            transition: background-color linear .12s;
            margin-bottom: .5em;

            &:hover {
                background-color: rgb(140 116 255);
                color: #fff;
            }
        }
    }
}

a {
    //color: unset!important;
    color: unset;
    text-decoration: none;
}

@media screen and (max-width: 660px) {
    #item-list, #content {
        width: 90%!important;
    }
}

@media screen and (max-width: 520px) {
    #item-list {
        display: grid !important;
        grid-template-columns: repeat(2, auto) !important;
        width: fit-content;
    }
}

@media screen and (max-width: 520px) {
    #control-panel {
        padding-top: 1rem !important;
    }
    #footer {
        height: 3rem !important;
    }
    #content {
        width: 100% !important;
    }
    > div#item-list {
        display: grid !important;
        grid-template-columns: repeat(2, auto);
        width: fit-content;
    }
    // todo这里要不要套个通用容器，子组件全部100%
    #content > div {
        width: 90% !important;
    }
    #back {
        display: none !important;
    }
}

</style>
