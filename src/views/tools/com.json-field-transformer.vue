<template>
    <div id="json-field-connector">
        <HeadRender></HeadRender>
        <div id="filter-area">
            <el-checkbox v-model="reverseSplit" label="逆向拆分"></el-checkbox>
            <el-checkbox v-model="compressOutput" label="压缩结果"></el-checkbox>
        </div>
        <div id="content-area">
            <div id="input">
                <el-input v-model.trim="inputValue" type="textarea" placeholder="输入要处理的对象"></el-input>
            </div>
            <div id="output">
                <pre><code ref="refCode" class="language-json"></code></pre>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "json-field-transformer",
    text: "JSON字段转换",
    icon: "json-field-transformer",
    description: "对json进行拍平/逆拍平"
}
</script>
<script lang="ts" setup>
import "prismjs/plugins/toolbar/prism-toolbar.js"
import "prismjs/themes/prism-coy.min.css"
import {computed, nextTick, onMounted, ref, watch} from "vue";
import HeadRender from "@/components/head-render.vue"
import {syncRef} from "@/utils";

const prismJs = require("prismjs")
const refCode = ref()
const isObject = (o: any) => Object.prototype.toString.call(o) === "[object Object]"
/**
 * 连接键，一级提升
 */
const connectField = (jsonObj: object, ret: { [index: string]: any } = {}, cacheStr = "") => {
    const tempCacheStr = cacheStr
    Object.entries(jsonObj).forEach(([k, v]) => {
        cacheStr = cacheStr ? cacheStr + "_" + k : k
        if (isObject(v)) connectField(v, ret, cacheStr)
        else ret[cacheStr] = v
        cacheStr = tempCacheStr
    })
    return ret
}

const deepConstruct = (kSplit: string[] = [], cacheObj: { [index: string]: any } = {}, setValue: any) => {
    if (kSplit.length) {
        const key = kSplit.pop() as string
        if (kSplit.length) {
            cacheObj[key] = cacheObj[key] || {}
            deepConstruct(kSplit, cacheObj[key], setValue)
        } else cacheObj[key] = setValue
    }
    return cacheObj
}
/**
 * 反向拆分
 */
const splitField = (jsonObj: { [index: string]: any }) => {
    let ret = {}
    Object.entries(jsonObj).forEach(([k, v]) => {
        const kSplit = k.split("_")
        deepConstruct(kSplit.reverse(), ret, v)
    })
    return ret
}

const reverseSplit = ref(false)
const compressOutput = ref(false)
const inputValue = ref("")
const outputValue = computed(() => {
    try {
        if (inputValue.value) {
            let retValue
            if (reverseSplit.value) {
                retValue = splitField(JSON.parse(inputValue.value))
            } else {
                retValue = connectField(JSON.parse(inputValue.value))
            }
            return JSON.stringify(retValue, null, compressOutput.value ? "" : "\t")
        } else return ""
    } catch (e: any) {
        return e.toString()
    }
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

syncRef(reverseSplit, "com.json-field-transformer.reverseSplit")
syncRef(compressOutput, "com.json-field-transformer.compressOutput")
onMounted(() => update())
</script>

<style lang="scss">
div#json-field-connector {
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
            height: 168px;
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
