<template>
    <div id="type-from-sql">
        <HeadRender></HeadRender>
        <FilterRender>
            <label>数据库类型</label>
            <el-select v-model="sqlType" style="width: 120px">
                <el-option v-for="{value} in options" :key="value" :value="value"></el-option>
            </el-select>
            <el-checkbox v-model="instantConvert" label="实时转换" title="随输入内容变化实时进行转换提取"></el-checkbox>
            <el-button type="primary" plain @click="doConvert" size="small">类型提取</el-button>
            <el-button type="primary" plain @click="copyConverted" size="small">复制结果</el-button>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input v-model="inputValue" type="textarea" placeholder="输入要转换的内容"></el-input>
            </div>
            <div id="output">
                <el-input v-model="outputValue" type="textarea" placeholder="输出的内容"></el-input>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "type-from-sql",
    text: "sql字段ts提取",
    icon: "url-query",
    description: "从sql字段定义获取typescript类型定义"
}
</script>
<script lang="ts" setup>
import * as changeCase from "change-case"
import {ref, watch} from "vue";
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"
import {copyToClipboard, syncRef} from "@/utils";

const options = [
    {value: "mysql"}
]

const sqlType = ref("mysql")
const instantConvert = ref(true)

syncRef(sqlType, "com.type-from-sql.sqlType")
syncRef(instantConvert, "com.type-from-sql.instantConvert")

const sampleInput = `id\tint
name\tvarchar
created_by\tint
creater_name\tvarchar
created_time\tdatetime
updated_by\tint
updated_time\tdatetime
deletemark\tint
V01\tvarchar
V02\tvarchar
V03\tvarchar
V04\tvarchar
V05\tvarchar
`
const inputValue = ref(sampleInput)

type TConvertedItem = {
    filed: string
    type: string
}

/**
 * mysql类型向typescript类型转换映射
 * 这里只写了前端可能会用到的常用数据类型
 */
const filedConvertMap: { [index: string]: string } = {
    // Number
    int: "number",
    tinyint: "number",
    bigint: "number",
    float: "number",
    double: "number",
    decimal: "number",
    // String
    varchar: "string",
    char: "string",
    text: "string",
    tinytext: "string",
    // 其他
    datetime: "Date",
    // 待续
}

const outputValue = ref("")

const convertValue = () => {
    outputValue.value = inputValue.value.split("\n").reduce((dataGroup, s) => {
        // s: id\tint
        const _ = s.split("\t")
        const fieldName = _[0], fieldType = _[1]
        const t = filedConvertMap[fieldType]
        if (t) {
            dataGroup.push({
                filed: changeCase.camelCase(fieldName),
                type: t
            })
        }
        return dataGroup
    }, [] as TConvertedItem[]).map(item => {
        return `${item.filed}: ${item.type}`
    }).join("\n")
}

watch(() => instantConvert.value, (v) => {
    v && convertValue()
})

watch(() => inputValue.value, () => {
    instantConvert.value && convertValue()
})

const doConvert = () => {
    convertValue()
}

const copyConverted = () => {
    copyToClipboard(outputValue.value)
}
</script>

<style lang="scss">
div#type-from-sql {

    > div#content-area {
        flex-grow: 1;
        display: flex;

        > div {
            flex-grow: 1;

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
    }

    @media screen and (max-width: 520px) {
        div#content-area {
            flex-direction: column
        }
    }

}
</style>
