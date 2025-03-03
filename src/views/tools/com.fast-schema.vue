<template>
    <div id="fast-schema">
        <HeadRender></HeadRender>
        <FilterRender>
            <el-button type="primary" plain size="small" @click="clearInput">清空输入</el-button>
            <el-checkbox v-model="evalObject" label="eval对象"></el-checkbox>
            <span v-show="evalObject"></span>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input v-model.trim="inputValue"
                          type="textarea"
                          placeholder="在此处输入json内容或拖放json文件到此处"
                          @drop="handleDrop"
                ></el-input>
            </div>
            <div id="output">
                <JsonHighlight :code="outputValue" enable-copy enable-download></JsonHighlight>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"

import JsonHighlight from "@/components/json-highlight.vue"

/**
 * 此文件的生成在vue.config.js里
 */
const jsonSchemaGenerator = require("json-schema-generator/lib/jsg-browser.js")

defineOptions({
    name: "fast-schema",
    text: "fast schema",
    icon: "json-structure-transformer",
    description: "快速json schema生成"
})

const sampleData = [
    {name: "jack", age: 22, gender: "male"},
    {name: "rose", age: 22, gender: "female"},
    {name: "jane"},
]

const inputValue = ref("")
const evalObject = ref(false)

const clearInput = () => {
    inputValue.value = ""
}
const handleDrop = (e: DragEvent) => {
    const files = e.dataTransfer?.files
    if (files?.length) {
        const file = files[0]
        const fr = new FileReader()
        fr.readAsText(file)
        fr.onload = e => {
            inputValue.value = e.target?.result?.toString() || inputValue.value
        }
    }
    e.preventDefault()
}

const outputValue = computed(() => {
    if (!inputValue.value) return ""
    try {
        let data: object
        if (evalObject.value) data = eval(`(() => (${inputValue.value}))()`)
        else data = JSON.parse(inputValue.value)
        return JSON.stringify(jsonSchemaGenerator(data), null, 4)
    } catch (e: any) {
        console.error(e)
        return e.toString()
    }
})
</script>

<style lang="scss">
div#fast-schema {
    overflow: hidden;

    > div#content-area {
        flex-grow: 1;
        display: flex;
        overflow: hidden;

        > * {
            width: 50%;
            height: 100%;
            flex-shrink: 0;
        }

        .el-textarea, .el-textarea > textarea {
            height: 100%;
        }

        > div {
            height: 100%;
        }

        #output {
            overflow: auto;
            flex-grow: 1;

            &:hover > .icon-copy {
                display: inline-block;
            }
        }
    }

    @media screen and (max-width: 520px) {
        > div#content-area {
            flex-direction: column;

            > div {
                width: 100%;
                height: 50%;
            }
        }
    }
}

</style>
