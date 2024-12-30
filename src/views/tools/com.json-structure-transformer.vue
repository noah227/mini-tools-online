<template>
    <div id="json-structure-connector">
        <HeadRender></HeadRender>
        <FilterRender>
            <el-checkbox v-model="reverseSplit" label="逆向拆分"></el-checkbox>
            <el-checkbox v-model="compressOutput" label="压缩结果"></el-checkbox>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input v-model.trim="inputValue" type="textarea" :placeholder="inputPlaceholder"></el-input>
            </div>
            <div id="output">
                <JsonHighlight :code="outputValue"></JsonHighlight>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"

import JsonHighlight from "@/components/json-highlight.vue"
import {syncRef} from "@/utils";

defineOptions({
    name: "json-structure-transformer",
    text: "JSON结构转换",
    icon: "json-structure-transformer",
    description: "对json进行拍平/逆拍平"
})

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

const sampleData = {"a": {"b": {"c": "9999"}}}

const reverseSplit = ref(false)
const compressOutput = ref(false)
const inputValue = ref("")
const inputPlaceholder = "输入要处理的对象，如：" + JSON.stringify(sampleData)
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

syncRef(reverseSplit, "com.json-structure-transformer.reverseSplit")
syncRef(compressOutput, "com.json-structure-transformer.compressOutput")
</script>

<style lang="scss">
div#json-structure-connector {
    overflow: hidden;

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

            &:hover > .icon-copy {
                display: inline-block;
            }
        }
    }

}
</style>
