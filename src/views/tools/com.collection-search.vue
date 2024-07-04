<template>
    <div id="collection-search">
        <HeadRender></HeadRender>
        <div id="content-area">
            <div id="filter-area">
                <div id="filter-switch">
                    <div :class="filterWith === 'fields' && 'active'" @click="filterWith='fields'">字段检索</div>
                    <div :class="filterWith === 'JMESPath' && 'active'" @click="filterWith='JMESPath'">JMESPath</div>
                </div>
                <div v-if="filterWith === 'fields'" id="field-area">
                    <el-form :model="form">
                        <el-form-item v-for="(_, k) in form" :prop="k" :label="k">
                            <template #label>
                                {{ k }}&emsp;
                                <el-checkbox v-model="enumMark[k].value" title="标记enum"
                                             :disabled="!enumMark[k].canEnum"></el-checkbox>
                            </template>
                            <el-select v-if="enumMark[k].value" v-model="_.value">
                                <el-option v-for="item in getEnumList(k, _.type)" :value="item"
                                           :label="renderLabel(item)"></el-option>
                            </el-select>
                            <template v-else>
                                <el-input v-if="_.type === 'string'" v-model="_.value"></el-input>
                                <el-input v-else-if="_.type === 'number'" v-model="_.value" type="number"></el-input>
                                <template v-else-if="_.type === 'boolean'">
                                    <el-checkbox v-model="_.value"></el-checkbox>
                                    &emsp;
                                    <el-button title="设置值为undefined将不进行过滤" size="small"
                                               @click="_.value = undefined">
                                        clear!
                                    </el-button>
                                </template>
                            </template>
                        </el-form-item>
                    </el-form>
                    <hr>
                    <div class="help-info">
                        <ul>
                            <li>紧邻字段名的是enum标记</li>
                            <li>如果enum标记不能选，则表示该项不可作为enum进行处理</li>
                            <li>clear button是设置undefined，不进行过滤</li>
                        </ul>
                    </div>
                </div>
                <div v-else id="jmespath-area">
                    <el-input v-model="jmespathStr" placeholder="search expression"></el-input>
                    <div class="help-info">
                        <ul>
                            <li>
                                <el-link href="https://jmespath.org/tutorial.html" target="_blank">About JMESPath
                                </el-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="input-area">
                <div>
                    <span>共：{{ readyToRender ? inputData.length : "_" }} 条</span>
                    <div class="buttons-wrapper">
                        <el-button @click="readFromClipboard">读取剪贴板</el-button>
                        <el-button @click="clearInput">清空内容</el-button>
                    </div>
                    <span title="输入数据有效状态">{{ readyToRender ? "✅" : "❌" }}</span>
                </div>
                <el-input v-model="inputValue" type="textarea" placeholder="{}[]"></el-input>
            </div>
            <div id="output-area">
                <div>
                    <span v-if="outputData instanceof Array">共：{{ readyToRender ? outputData.length : "_" }} 条</span>
                </div>
                <pre><code ref="refCode" class="language-json"></code></pre>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "collection-search",
    text: "collection检索",
    icon: "collection-search",
    description: "",
    isBlankPage: true
}
</script>
<script setup lang="ts">

import HeadRender from "@/components/head-render.vue";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {syncRef} from "@/utils";
import {ElMessage} from "element-plus";

const jmespath = require("jmespath")
const prismJs = require("prismjs")

const sampleData = [
    {name: "jack", age: 20, gender: "male", birthday: "1996-01-01", hasTicket: true},
    {name: "rose", age: 20, gender: "female", birthday: "1996-01-01", hasTicket: true},
]

const filterWith = ref<"fields" | "JMESPath">("fields")
const jmespathStr = ref("")
const inputValue = ref(JSON.stringify(sampleData, null, 4))

const readFromClipboard = () => {
    navigator.clipboard.readText().then(text => {
        if(text) inputValue.value = text
    }).catch(e => {
        console.warn("读取失败", e)
        ElMessage.error("读取剪贴板失败！请手动粘贴到输入框！")
    })
}

const clearInput = () => {
    inputValue.value = ""
}

const readyToRender = computed(() => {
    const logErr = (e: any) => console.warn("Not Ready to Render: ", e)
    try {
        const data = JSON.parse(inputValue.value)
        if (filterWith.value === "fields" && !(data instanceof Array)) {
            logErr(new Error("非对象数组"))
        } else return true
    } catch (e) {
        logErr(e)
        return false
    }
})
const form = ref<{
    [index: string]: {
        value: any, type: string
    }
}>({})
const enumMark = ref<{ [index: string]: { value: boolean, canEnum: boolean } }>({})
const buildForm = () => {
    if (!readyToRender.value) return
    if (filterWith.value === "JMESPath") return
    const dataList = JSON.parse(inputValue.value) as { [index: string]: any }[]
    dataList.forEach((item) => {
        for (let k in item) {
            const value = item[k]
            let setValue: any = undefined
            // 初始设undefined是为了默认全部渲染输出结果
            switch (typeof value) {
                case "string":
                    setValue = ""
                    break
                case "number":
                    setValue = undefined
                    break
                case "boolean":
                    setValue = undefined
                    break
            }
            if (typeof form.value[k] === "undefined") {
                form.value[k] = {
                    type: typeof value,
                    value: setValue
                }
            }
            if (!enumMark.value[k]) enumMark.value[k] = {value: false, canEnum: true}
        }
    })
}
const getEnumList = (k: any, t: string) => {
    if (!readyToRender.value) return []
    if (t === "boolean") return [true, false]
    return inputData.value.map(item => item[k])
}
const renderLabel = (label: any) => {
    if (typeof label === "boolean") return label ? "true" : "false"
    return label
}

watch(() => filterWith.value, v => {
    if (v === "fields") buildForm()
})
watch(() => inputValue.value, () => {
    buildForm()
})

const inputData = computed<any[]>(() => {
    return readyToRender.value ? JSON.parse(inputValue.value) : []
})
const refCode = ref()
const outputData = computed(() => {
    if (!readyToRender.value) return ""
    const dataList = JSON.parse(inputValue.value) as any
    if (filterWith.value === "JMESPath") {
        const value = jmespathStr.value.trim()
        if (!value) return dataList
        try {
            // 使用jmespath之后，输出结果就不是单纯的多少条了，也有可能是对象
            return jmespath.search(dataList, value)
        } catch (e) {
            console.warn(e)
            return ""
        }
    } else {
        return (dataList as { [index: string]: any }[]).filter(item => {
            for (let k in form.value) {
                const {value, type} = form.value[k]
                const _value = item[k]
                if (type === "string") {
                    if (!_value.includes(value)) return
                } else if (type === "number") {
                    if (typeof value === "undefined") continue
                    if (isNaN(parseInt(value))) continue
                    if (_value !== parseInt(value)) return
                } else if (type === "boolean") {
                    if (typeof value === "undefined") continue
                    if (value !== _value) return
                }
            }
            return true
        })
    }
})
const outputValue = computed(() => {
    return outputData.value ? JSON.stringify(outputData.value, null, 4) : ""
})

// 注意sync的位置，避免触发不必要的watch
syncRef(filterWith, "com.collection-search.filterWith")

watch(() => outputValue.value, () => {
    update()
})
const update = () => {
    refCode.value.innerHTML = outputValue.value
    nextTick(() => {
        prismJs.highlightAll()
    })
}

onMounted(() => {
    buildForm()
    update()
})

</script>
<style scoped lang="scss">
#collection-search {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    > * {
        width: 100%;
        box-sizing: border-box;
    }
}

#content-area {
    height: 0;
    border-top: 1px solid #999;
    flex-grow: 1;
    display: flex;

    > * {
        height: 100%;
    }

    > *:not(:last-child) {
        box-sizing: border-box;
        border-right: 1px solid #999;
    }
}

#filter-area {
    flex-shrink: 0;
    width: 320px;
    min-height: 250px;
    padding: 12px;
    display: flex;
    flex-direction: column;

    > hr {
        width: 100%;
        margin: 1em 0;
    }
}

#filter-switch {
    width: 100%;
    border-bottom: 1px solid #999;
    margin-bottom: 16px;

    > div {
        display: inline-block;
        width: 50%;
        box-sizing: border-box;
        height: 38px;
        line-height: 38px;
        user-select: none;
        transition: all linear .08s;

        &:hover, &.active {
            background-color: #0077aa;
            color: #fff;
        }
    }
}

#field-area {
    display: flex;
    flex-direction: column;

    :deep(.el-form-item__label) {
        width: 98px;
    }

    > hr {
        width: 100%;
    }
}

.help-info {
    flex-grow: 0;
    flex-shrink: 0;
    text-align: left;

    li {
        line-height: 1.5;
    }
}

#input-area {
    width: calc(50% - 110px)
}

#output-area {
    width: calc(50% - 110px)
}

#input-area, #output-area {
    display: flex;
    flex-direction: column;

    > div:first-child {
        flex-shrink: 0;
        position: sticky;
        top: 0;
        border-bottom: 1px solid #999;
        padding: 0 12px;
        box-sizing: border-box;
        height: 32px;
        line-height: 32px;
        display: flex;
        justify-content: space-between;
        align-content: center;
        user-select: none;
        overflow: hidden;
        > span:first-child {
            flex-grow: 1;
            text-align: left;
        }
        > .buttons-wrapper {
            display: flex;
            align-items: center;
            .el-button {
                border: none;
                border-left: 1px solid #d0d0d0;
                border-radius: 0;
                margin: 0;
                &:last-child {
                    border-right: 1px solid #d0d0d0;
                }
            }
        }
        /* 展示输入有效处理状态的 */
        > span:last-child {
            padding-left: 12px;
            cursor: help;
        }
    }

    > div:last-child {
        flex-grow: 1;
        overflow: auto;
    }
}

.el-textarea {
    width: 100%;
    height: 100%;

    :deep(> textarea) {
        width: 100%;
        height: 100%;
        border-radius: 0;
    }
}

textarea, pre {
    outline: none;
    box-sizing: border-box;
    border: 0;
    width: 100%;
    height: 100%;
    margin: 0 !important;
}

@media screen and (max-width: 820px) {
    #content-area {
        flex-direction: column;

        > * {
            width: 100%;
            height: fit-content;
        }
    }
    #filter-area {
        min-height: auto;
    }
    #field-area {
        height: fit-content;
    }
    #input-area, #output-area {
        min-height: 220px;
    }
}
</style>
