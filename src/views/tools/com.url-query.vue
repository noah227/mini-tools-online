<template>
    <div id="url-query">
        <h3 id="title">URL参数提取</h3>
        <div id="filter-area">
            <el-checkbox v-model="decodeValue" label="解码参数值"></el-checkbox>
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
    description: ""
}
</script>
<script lang="ts" setup>
import "prismjs/plugins/toolbar/prism-toolbar.js"
import "prismjs/themes/prism-coy.min.css"
import {computed, nextTick, onMounted, ref, watch} from "vue";

const prismJs = require("prismjs")
const refCode = ref()
const decodeValue = ref("")
const compressOutput = ref("")
const inputValue = ref("https://www.iconfont.cn/search/index?searchType=icon&q=%E6%B5%8B%E8%AF%95")

const getUrlQuery = (url: string, decodeType = 0) => {
    const query: { [index: string]: any } = {}
    const urlSplit = url.split("?")
    if (urlSplit.length > 1) {
        const argStr = urlSplit[1]
        argStr.split("&").forEach(item => {
            const itemSplit = item.split("=")
            if (itemSplit.length > 1) query[itemSplit[0]] = itemSplit[1]
            else query[itemSplit[0]] = ""
        })
        if ([2, 3].indexOf(decodeType) >= 0) {
            let decodeMethod: any
            if (decodeType === 1) decodeMethod = decodeURI
            else decodeMethod = decodeURIComponent
            Object.entries(query).forEach(([k, v]) => {
                query[k] = decodeMethod(v)
            })
        }
    }
    return query
}
const decodeType = computed(() => decodeValue.value ? 2 : 0)
const stringifySpace = computed(() => compressOutput.value ? "" : "\t")
const outputValue = computed(() => {
    let data = ""
    try {
        data = JSON.stringify(getUrlQuery(inputValue.value, decodeType.value), null, stringifySpace.value)
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
    width: 70%;
    height: 520px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border: 1px solid #3af;
    border-radius: .5rem;
    overflow: hidden;

    > div#filter-area {
        width: 100%;
        padding: 1rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #aaa;
        border-top: 1px solid #aaa;

        .el-select {
            margin-left: 2rem;
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
