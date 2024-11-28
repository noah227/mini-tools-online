<template>
    <div id="url-query">
        <HeadRender></HeadRender>
        <FilterRender>
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
            <el-checkbox v-model="allowMultiValue" label="允许多值参数"></el-checkbox>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input v-model.trim="inputValue" type="textarea" placeholder="输入要提取参数的URL地址"></el-input>
            </div>
            <div id="output">
                <JsonHighlight :code="outputValue" enable-copy></JsonHighlight>
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
import FilterRender from "@/components/filter-render.vue"
import JsonHighlight from "@/components/json-highlight.vue"
import {computed, ref} from "vue";
import {syncRef} from "@/utils";

const decodeValue = ref(false)
const decodeTimes = ref(1)
const compressOutput = ref("")
const allowMultiValue = ref(false)
const inputValue = ref("https://www.iconfont.cn/search/index?searchType=icon&q=%E6%B5%8B%E8%AF%95&message=%25E4%25BD%25A0%25E5%25A5%25BD&say=hi&say=there!")
const decodeMethod = ref<"decodeURI" | "decodeURIComponent">("decodeURIComponent")

syncRef(decodeValue, "com.url-query.decodeValue")
syncRef(compressOutput, "com.url-query.compressOutput")
syncRef(allowMultiValue, "com.url-query.allowMultiValue")
syncRef(decodeMethod, "com.url-query.decodeMethod")

const getUrlQuery = (url: string) => {
    const query: { [index: string]: any[] } = {}
    const urlSplit = url.split("?")
    if (urlSplit.length > 1) {
        const argStr = urlSplit[1]
        argStr.split("&").forEach(item => {
            const itemSplit = item.split("=")
            const name = itemSplit[0]
            if (!query[name]) query[name] = []
            if (itemSplit.length > 1) query[name].push(itemSplit[1])
            else query[name].push(null)
        })
        if (decodeValue.value) {
            let _decodeMethod = decodeMethod.value === "decodeURI" ? decodeURI : decodeURIComponent
            Object.entries(query).forEach(([k, vList]) => {
                query[k] = decodeMultiTimes(_decodeMethod, vList, decodeTimes.value)
            })
        }
    }
    return Object.entries(query).reduce((query, [k, vList]) => {
        let v: any
        if (allowMultiValue.value && vList.length > 1) v = vList
        else v = vList[0]
        query[k] = v
        return query
    }, {} as { [index: string]: any })
}

/**
 * 多次解码
 */
const decodeMultiTimes = (m: (v: any) => string, vList: any[], t: number): any[] => {
    if (t === 0) return vList
    else return decodeMultiTimes(m, vList.map(v => m(v)), t - 1)
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
</script>

<style lang="scss">
div#url-query {
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
            height: 128px;
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
