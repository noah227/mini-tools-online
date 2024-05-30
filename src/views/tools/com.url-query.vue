<template>
    <div id="url-query">
        <HeadRender></HeadRender>
        <div id="filter-area">
            <el-checkbox v-model="decodeValue" label="解码参数值"></el-checkbox>
            <template v-if="decodeValue">
                <el-select v-model="decodeMethod" style="width: 168px;" size="small">
                    <el-option label="decodeURIComponent" value="decodeURIComponent"></el-option>
                    <el-option label="decodeURI" value="decodeURI"></el-option>
                </el-select>
                <el-select v-model="decodeTimes" style="width: 48px;" size="small" title="解码次数">
                    <el-option v-for="i in 5" :value="i" :label="i"></el-option>
                </el-select>
            </template>
            <el-checkbox v-model="compressOutput" label="压缩结果"></el-checkbox>
        </div>
        <div id="content-area">
            <div id="input">
                <el-input v-model.trim="inputValue" type="textarea" placeholder="输入要提取参数的URL地址"></el-input>
            </div>
            <div id="output">
                <pre><code ref="refCode" class="language-json"></code></pre>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "url-query",
    text: "URL参数提取",
    icon: "url-query",
    description: "URL参数提取"
}
</script>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import "prismjs/plugins/toolbar/prism-toolbar.js"
import "prismjs/themes/prism-coy.min.css"
import {computed, nextTick, onMounted, ref, watch} from "vue";

const prismJs = require("prismjs")
const refCode = ref()
const decodeValue = ref(false)
const decodeTimes = ref(1)
const compressOutput = ref("")
const inputValue = ref("https://www.iconfont.cn/search/index?searchType=icon&q=%E6%B5%8B%E8%AF%95&message=%25E4%25BD%25A0%25E5%25A5%25BD")
const decodeMethod = ref<"decodeURI" | "decodeURIComponent">("decodeURIComponent")

const getUrlQuery = (url: string) => {
    const query: { [index: string]: any } = {}
    const urlSplit = url.split("?")
    if (urlSplit.length > 1) {
        const argStr = urlSplit[1]
        argStr.split("&").forEach(item => {
            const itemSplit = item.split("=")
            if (itemSplit.length > 1) query[itemSplit[0]] = itemSplit[1]
            else query[itemSplit[0]] = ""
        })
        if (decodeValue.value) {
            let _decodeMethod = decodeMethod.value === "decodeURI" ? decodeURI : decodeURIComponent
            Object.entries(query).forEach(([k, v]) => {
                query[k] = decodeMultiTimes(_decodeMethod, v, decodeTimes.value)
            })
        }
    }
    return query
}

/**
 * 多次解码
 */
const decodeMultiTimes = (m: (v: string) => string, v: string, t: number): string => {
    if(t === 0) return v
    else return decodeMultiTimes(m, m(v), t - 1)
}

const stringifySpace = computed(() => compressOutput.value ? "" : "\t")
const outputValue = computed(() => {
    let data: string
    try {
        data = JSON.stringify(getUrlQuery(inputValue.value), null, stringifySpace.value)
    } catch (e: any) {
        console.log(e)
        data = e.toString()
    }
    return data
})

watch(() => outputValue.value, () => {
    update()
})
const update = () => {
    refCode.value.innerHTML = outputValue.value
    nextTick(() => {
        prismJs.highlightAll()
    })
}
onMounted(() => update())
</script>

<style lang="scss">
div#url-query {
    overflow: hidden;

    > div#filter-area {
        width: 100%;
        padding: 1rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #aaa;
        border-top: 1px solid #aaa;
        font-size: 14px;

        > * {
            margin: 0 .8rem;
        }
    }

    > div#content-area {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        > div {
            .el-textarea {
                width: 100%;
                height: 100%;

                textarea {
                    width: 100%;
                    height: 100%;
                    font-size: 1.2rem;
                    line-height: 1.2;
                }
            }
        }

        > #input {
            flex-shrink: 0; // flex-shrink也会影响到overflow的，设为0时会导致高度不会限制，overflow不会有滚动条
            height: 128px;
        }

        #output {
            overflow: auto;
            flex-grow: 1;

            > pre {
                height: 100%;
                box-sizing: border-box;
                margin: 0;
            }

            &:hover > .icon-copy {
                display: inline-block;
            }
        }
    }

}
</style>
