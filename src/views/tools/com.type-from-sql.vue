<template>
    <div id="type-from-sql">
        <HeadRender></HeadRender>
        <FilterRender>
            <div>
                <label>数据库类型</label>
                <el-select v-model="sqlType" style="width: 120px">
                    <el-option v-for="{value} in options" :key="value" :value="value"></el-option>
                </el-select>
            </div>
            <div>
                <label>转换风格</label>
                <el-select v-model="caseOption" style="width: 168px">
                    <el-option v-for="item in caseOptions" :key="item.value" :value="item.value">{{ item.value }}
                    </el-option>
                </el-select>
            </div>
            <el-checkbox v-model="instantConvert" label="实时转换" title="随输入内容变化实时进行转换提取"></el-checkbox>
            <div>
                <el-button type="primary" plain @click="doConvert" size="small">内容转换</el-button>
                <el-button type="primary" plain @click="clearInput" size="small">清空输入</el-button>
                <el-button type="primary" plain @click="copyConverted" size="small">复制结果</el-button>
            </div>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input v-model="inputValue" type="textarea" placeholder="输入要转换的内容"></el-input>
            </div>
            <div id="output">
                <div id="output-mode">
                    <div :class="outputMode === 'type' && 'current'" @click="outputMode = 'type'">类型提取</div>
                    <div :class="outputMode === 'init' && 'current'" @click="outputMode = 'init'">数据初始化</div>
                </div>
                <el-input v-if="outputMode === 'type'" v-model="outputValue" type="textarea"
                          placeholder="输出的内容"></el-input>
                <el-input v-else v-model="outputDataInitValue" type="textarea" placeholder="输出的内容"></el-input>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "type-from-sql",
    text: "sql字段ts提取",
    icon: "data-and-sql",
    description: "从sql字段定义获取typescript类型定义"
}
</script>
<script lang="ts" setup>
import * as changeCase from "change-case"
import {nextTick, ref, watch} from "vue";
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"
import {copyToClipboard, syncRef} from "@/utils";

const caseOptions = Object.keys(changeCase).map(k => ({value: k})).filter(({value: k}) => k.endsWith("Case"))

const options = [
    {value: "mysql"}
]

const sqlType = ref("mysql")
const caseOption = ref("camelCase")
const instantConvert = ref(true)

syncRef(sqlType, "com.type-from-sql.sqlType")
syncRef(sqlType, "com.type-from-sql.caseOption")
syncRef(instantConvert, "com.type-from-sql.instantConvert")

const sampleInput = `id\tint
name\tvarchar
created_by\tint
created_at\tdatetime
updated_by\tint
updated_at\tdatetime
is_delete\tint
`
const inputValue = ref("")

type TConvertedItem = {
    field: string
    type: string
    init: any
}

/**
 * mysql类型向typescript类型转换映射
 * 这里只写了前端可能会用到的常用数据类型
 */
const fieldConvertMap: { [index: string]: string } = {
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

const initConvertMap: { [index: string]: any } = {
    // Number
    int: 0,
    tinyint: 0,
    bigint: 0,
    float: 0,
    double: 0,
    decimal: 0,
    // String
    varchar: '""',
    char: '""',
    text: '""',
    tinytext: '""',
    // 其他
    datetime: '""',
    // 待续
}

const outputMode = ref<"type" | "init">("type")
const outputValue = ref("")
const outputDataInitValue = ref("")

const convertValue = () => {

    const outputValueList = inputValue.value.split("\n").reduce((dataGroup, s) => {
        // s: id\tint
        const _ = s.split("\t")
        const fieldName = _[0], fieldType = _[1]
        const t = fieldConvertMap[fieldType]
        if (t) {
            dataGroup.push({
                field: (changeCase as any)[caseOption.value](fieldName),
                type: t,
                init: initConvertMap[fieldType] ?? null
            })
        }
        return dataGroup
    }, [] as TConvertedItem[])

    outputValue.value = outputValueList.map(item => {
        return `${item.field}: ${item.type}`
    }).join("\n")

    outputDataInitValue.value = outputValueList.map(item => {
        return `${item.field}: ${item.init}`
    }).join(",\n")
}

watch(() => instantConvert.value, (v) => {
    v && convertValue()
})

watch(() => inputValue.value, () => {
    instantConvert.value && convertValue()
})

watch(() => caseOption.value, () => {
    instantConvert.value && convertValue()
})

const doConvert = () => {
    convertValue()
}

const clearInput = () => {
    inputValue.value = ""
}

const copyConverted = () => {
    copyToClipboard(outputMode.value === "type" ? outputValue.value : outputDataInitValue.value)
}

nextTick(() => {
    inputValue.value = sampleInput
})
</script>

<style lang="scss">
div#type-from-sql {

    .filter-render > div {
        flex-shrink: 0;
        display: inherit;
        justify-content: inherit;
        align-items: inherit;
        > *:not(:last-child) {
            margin-right: inherit;
        }
    }

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
    @media screen and (max-width: 1080px) {
        .filter-render {
            flex-wrap: wrap;
            line-height: 3.8;
        }
    }

    @media screen and (max-width: 520px) {
        div#content-area {
            flex-direction: column
        }
    }

}

#output {
    display: flex;
    flex-direction: column;

    > div {
        &:first-child {
            flex-shrink: 0;
            flex-grow: 0;
        }

        &:last-child {
            flex-shrink: 1;
            flex-grow: 1;
        }
    }
}

#output-mode {
    display: flex;

    > div {
        width: 50%;
        padding: 8px 16px;
        box-sizing: border-box;
        text-align: center;
        font-size: 14px;
        user-select: none;

        &.current, &:hover {
            background-color: #0077aa;
            color: #fff;
        }
    }
}
</style>
