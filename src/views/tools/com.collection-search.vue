<template>
    <div id="collection-search">
        <HeadRender></HeadRender>
        <div id="content-area">
            <div id="filter-area">
                <div id="filter-switch">
                    <div :class="filterWith === 'fields' && 'active'" @click="switchFilter('fields')">字段检索</div>
                    <div :class="filterWith === 'JMESPath' && 'active'" @click="switchFilter('JMESPath')">JMESPath</div>
                </div>
                <div v-if="filterWith === 'fields'" id="field-area">
                    <el-form v-if="willRenderForm" :model="form">
                        <el-form-item v-for="(_, k) in form" :prop="k" :label="k">
                            <template #label>
                                {{ k }}&emsp;
                                <el-checkbox v-model="enumMark[k].value" title="标记enum"
                                             :disabled="!enumMark[k].canEnum"></el-checkbox>
                            </template>
                            <el-select v-if="enumMark[k].value" v-model="_.value" clearable>
                                <el-option v-for="item in getEnumList(k, _.type)" :value="item"
                                           :label="renderLabel(item)"></el-option>
                            </el-select>
                            <template v-else>
                                <el-input v-if="_.type === 'string'" v-model="_.value" :placeholder="_.type" clearable></el-input>
                                <el-input v-else-if="_.type === 'number'" v-model="_.value" type="number" :placeholder="_.type" clearable></el-input>
                                <template v-else-if="_.type === 'boolean'">
                                    <el-radio-group v-model="_.value" size="small">
                                        <el-radio-button :value="true">true</el-radio-button>
                                        <el-radio-button :value="false">false</el-radio-button>
                                    </el-radio-group>
                                    &emsp;
                                    <el-button title="设置值为undefined将不进行过滤" size="small"
                                               @click="_.value = undefined">
                                        clear!
                                    </el-button>
                                </template>
                            </template>
                        </el-form-item>
                    </el-form>
                    <div v-else id="form-cant-be-used">仅当数据为对象数组时，字段检索可用</div>
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
                    <div>
                        <el-autocomplete
                            v-model.trim="preJmespathStr" placeholder="Pre Filter Expression"
                            type="textarea"
                            :fetch-suggestions="fetchSuggestions"
                            clearable
                        >
                            <template #default="{item,index, $index}">
                                <div class="suggest-item-wrapper">
                                    <div>
                                        <div :title="item.value">{{item.value}}</div>
                                        <div>
                                            <el-button
                                                class="iconfont" type="primary" size="small" plain circle
                                                @click.stop="appendFromCommonlyUsed(item)"
                                                title="追加条件"
                                            >+</el-button>
                                            <el-button
                                                class="iconfont icon-delete" type="danger" size="small" plain circle
                                                @click.stop.prevent="removeFromCommonlyUsed(item)"
                                                title="从存储中移除"
                                            ></el-button>
                                        </div>
                                    </div>
                                    <div :title="item.comment">{{item.comment}}</div>
                                </div>
                            </template>
                        </el-autocomplete>
                        &nbsp;
                        <el-checkbox v-model="preFilterEnabled" title="使用前置条件"></el-checkbox>
                    </div>
                    <div>
                        <el-autocomplete
                            v-model.trim="jmespathStr" placeholder="Search Expression"
                            type="textarea"
                            :fetch-suggestions="fetchSuggestions"
                            @keydown.ctrl="handleCommonCtrl"
                            @keydown.ctrl.shift.enter="removeAllCommonlyUsed"
                            @keydown.ctrl.enter="triggerAddEvent"
                            clearable
                        >
                            <template #default="{item,index, $index}">
                                <div class="suggest-item-wrapper">
                                    <div>
                                        <div :title="item.value">{{item.value}}</div>
                                        <div>
                                            <el-button
                                                class="iconfont" type="primary" size="small" plain circle
                                                @click.stop="appendFromCommonlyUsed(item)"
                                                title="追加条件"
                                            >+</el-button>
                                            <el-button
                                                class="iconfont icon-delete" type="danger" size="small" plain circle
                                                @click.stop.prevent="removeFromCommonlyUsed(item)"
                                                title="从存储中移除"
                                            ></el-button>
                                        </div>
                                    </div>
                                    <div :title="item.comment">{{item.comment}}</div>
                                </div>
                            </template>
                        </el-autocomplete>
<!--                        <el-input v-model="jmespathStr" placeholder="search expression"></el-input>-->
                        &nbsp;
                        <el-button
                            type="primary" title="把当前查询条件存储下来，方便以后快速输入；内容存储在Cookie中"
                            plain @click="addToCommonlyUsed" :disabled="!jmespathStr"
                        >+</el-button>
                    </div>
                    <div class="help-info">
                        <ul>
                            <li>
                                <el-link href="javascript:void(0);" @click="viewInputHelpMessage(1)">条件输入说明（首次使用，建议查看）</el-link>
                            </li>
                            <li>
                                <el-link href="javascript:void(0);" @click="viewInputHelpMessage(2)">常见使用要点（推荐查看）</el-link>
                            </li>
                            <li>
                                <el-link href="javascript:void(0);" style="color: darkorange" @click="viewInputHelpMessage(3)">关于前置过滤条件</el-link>
                            </li>
                            <li>
                                <el-link href="https://jmespath.org/tutorial.html#filter-projections" target="_blank">JMESPath条件过滤
                                </el-link>
                            </li>
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
                    <span v-if="inputData instanceof Array">共：{{ readyToRender ? inputData.length : "_" }} 条</span>
                    <span v-else></span>
                    <div class="conditions-wrapper">
                        <el-button @click="readFromClipboard">读取剪贴板</el-button>
                        <el-button @click="inputFromSampleData">样例输入</el-button>
                        <el-button @click="formatInput" title="JSON.stringify(JSON.parse({input}))" :disabled="!canClearInput">格式化</el-button>
                        <el-button @click="clearInput" :disabled="!canClearInput">清空内容</el-button>
                        <el-checkbox v-model="dontShowInput" label="不显示输入" title="当数据量过大时，显示会造成浏览器卡顿，可以勾选此项取消输入内容的显示"></el-checkbox>
                    </div>
                    <span title="输入数据有效状态">{{ readyToRender ? "✅" : "❌" }}</span>
                </div>
                <el-input v-if="dontShowInput" type="textarea" placeholder="已关闭输入显示" readonly resize="none"></el-input>
                <el-input v-else v-model="inputValue" type="textarea" placeholder="{}[]" resize="none"></el-input>
            </div>
            <div id="output-area">
                <div>
                    <span v-if="outputData instanceof Array">共：{{ readyToRender ? outputData.length : "_" }} 条</span>
                    <span v-else></span>
                    <div class="conditions-wrapper">
                        <el-checkbox v-model="compressOutput" label="压缩结果"></el-checkbox>
                        <el-button @click="_copyToClipboard" :disabled="!readyToCopy">复制内容</el-button>
                        <el-button title="导出到json文件" @click="_exportContent" :disabled="!readyToExport">导出</el-button>
                    </div>
                </div>
                <JsonHighlight :code="outputValue"></JsonHighlight>
            </div>
        </div>
        <el-dialog v-model="showSampleSelect">
            <el-radio-group v-model="selectedSampleDataIndex">
                <el-radio-button v-for="(item, index) in sampleDataList" :value="index">{{item.title}}</el-radio-button>
            </el-radio-group>
            <el-divider></el-divider>
            <el-card>
                <div>测试输入条件：{{renderSampleJMESInput}}</div>
                <hr>
                <pre v-html="renderSamplePreSelect"></pre>
            </el-card>
            <el-divider></el-divider>
            <div style="text-align: right">
                <el-button @click="showSampleSelect=false">关闭</el-button>
                <el-button type="primary" @click="useSample">输入此样例</el-button>
            </div>
        </el-dialog>
        <SiteFooter></SiteFooter>
    </div>
</template>
<script setup lang="ts">

import HeadRender from "@/components/head-render.vue";
import JsonHighlight from "@/components/json-highlight.vue"
import SiteFooter from "@/components/site-footer.vue"
import {computed, onMounted, ref, watch} from "vue";
import {copyToClipboard, syncRef} from "@/utils";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRoute} from "vue-router";
import router from "@/router";
import debounce from "debounce";

defineOptions({
    name: "collection-search",
    text: "collection检索",
    icon: "collection-search",
    description: "结构化数据检索，支持JMESPath",
    isBlankPage: true
})

const jmespath = require("jmespath")

const sampleData = [
    {name: "jack", age: 20, gender: "male", birthday: "1996-01-01", hasTicket: true},
    {name: "rose", age: 20, gender: "female", birthday: "1996-01-01", hasTicket: true},
    {name: "unnamed", age: 18, gender: "male", birthday: "1996-01-01", hasTicket: false},
]

const sampleDataList = [
    {title: "对象数组{}[]", data: sampleData, inputValue: "[].name"},
    {title: "类响应值对象内数组{data: {}[]}", data: {data: sampleData}, inputValue: "data[].name"},
    {title: "字符串数组string[]", data: sampleData.map(item => item.name), inputValue: "[].length(@)"},
    {title: "单个对象{}", data: sampleData[0], inputValue: "[name, age, gender == `male`]"},
]

const filterWith = ref<"fields" | "JMESPath">("fields")
const preJmespathStr = ref("")
const jmespathStr = ref("")
const inputValue = ref("")
const preFilterEnabled = ref(true)

const execJmespathStr = computed(() => {
    if(!preFilterEnabled.value) return jmespathStr.value
    return preJmespathStr.value + jmespathStr.value
})

const dontShowInput = ref(false)

const switchFilter = (filter: "fields" | "JMESPath") => {
    if(filterWith.value === filter) return
    filterWith.value = filter
    // 更新query，使其不受页面刷新影响
    const route = router.currentRoute.value
    router.push({
        path: route.path,
        query: {
            ...route.query,
            filterWith: filter
        }
    })
}

const commonUsedJMESPathQueryList = ref<{value: string, comment: string}[]>([])
syncRef(
    commonUsedJMESPathQueryList, "com.collection-search.commonUsedJMESPathQueryList",
    "",
    {
        onLoad(value, callback){
            callback(value ? JSON.parse(value) : [])
        },
        onSave(value, callback){
            callback(JSON.stringify(value))
        }
    }
)
syncRef(dontShowInput, "com.collection-search.dontShowInput")
syncRef(preJmespathStr, "com.collection-search.preJmespathStr")
syncRef(preFilterEnabled, "com.collection-search.preFilterEnabled")

/**
 * 把当前查询条件存储下来，方便以后快速输入；内容存储在Cookie中
 */
const addToCommonlyUsed = () => {
    const value = jmespathStr.value
    const filterResult = commonUsedJMESPathQueryList.value.filter(item => item.value === value)
    if(filterResult.length) {
        return ElMessageBox.alert(undefined, {
            message: [
                "<strong/>已存在同条件的记录！</strong>",
                `<pre>${JSON.stringify(filterResult, null, 4)}</pre>`
            ].join(""),
            dangerouslyUseHTMLString: true
        }).catch(() =>{})
    }
    ElMessageBox.prompt(undefined, {
        title: "添加备注",
        confirmButtonText: "添加", cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        message: `添加：<b>${value}</b>`,
        inputPlaceholder: "请输入备注"
    }).then(res => {
        if(res.action === "confirm") {
            commonUsedJMESPathQueryList.value.push({
                value,
                comment: res.value
            })
        }
    }).catch(() => {})
}

/**
 * 追加查询条件（字符串拼接）
 * @param item
 */
const appendFromCommonlyUsed = (item: any) => {
    jmespathStr.value = jmespathStr.value + item.value
}

const removeFromCommonlyUsed = (item: any) => {
    const index = commonUsedJMESPathQueryList.value.findIndex(_ => _.value.includes(item.value))
    commonUsedJMESPathQueryList.value.splice(index, 1)
}

const removeAllCommonlyUsed = () => {
    ElMessageBox.confirm("提示", {
        type: "warning",
        message: "将移除所有已记录查询条件，是否继续",
        confirmButtonText: "继续",
        cancelButtonText: "取消",
    }).then(() => {
        commonUsedJMESPathQueryList.value = []
        ElMessage.success("已移除！")
    }).catch(() => {})
}

const fetchSuggestions = (s: string, cb: Function) => {
    s = s.trim()
    // 如果要过滤，使用特殊符号起始，进行搜索
    if(s.startsWith(":")) cb(commonUsedJMESPathQueryList.value.filter(item => item.value.includes(s.slice(1))))
    else cb(commonUsedJMESPathQueryList.value)
}
const handleCommonCtrl = (e: KeyboardEvent) => {
    if(e.code === "KeyU") {
        jmespathStr.value = ""
        e.preventDefault()
    }
}

const triggerAddEvent = (e: KeyboardEvent) => {
    if(e.shiftKey) return
    if(!jmespathStr.value) return
    addToCommonlyUsed()
}

enum EHelperMessageTarget {
    aboutToolsInput = 1,
    aboutJmespathKeyPoint = 2,
    aboutPreFilter = 3
}
const viewInputHelpMessage = (t: EHelperMessageTarget) => {
    let title: string
    let messageSource: string[]
    switch (t) {
        case EHelperMessageTarget.aboutToolsInput:
            title = "输入说明"
            messageSource = [
                "<li><b>Ctrl+U</b>清空输入框</li>",
                "<li>输入框下拉提示支持两种模式：<b>条件追加</b>和<b>条件设定</b>；直接点击下拉选项为赋值，点击下拉选项中的加号按钮则是追加条件</li>",
                "<li>点击输入框右侧的加号按钮，可以记录当前的查询条件（输入框<b>Ctrl+Enter</b>也可触发该操作）</li>",
                "<li>以冒号（<b>:</b>）起始输入，筛选已记录的条件</li>",
                "<li>如果需要清空记录，清除Cookie或者清除Cookie中对应<b>Name</b>为<b>com.collection-search.commonUsedJMESPathQueryList</b>条目即可</li>",
                "<li>输入框<b>Ctrl+Shift+Enter</b>也可进入清空记录的确认界面</li>",
            ]
            break
        case EHelperMessageTarget.aboutJmespathKeyPoint:
            title = "使用要点"
            messageSource = [
                "<li>数字等值判断要使用<b>反引号（`）</b>括起来</li>"
            ]
            break
        case EHelperMessageTarget.aboutPreFilter:
            title = "关于前置过滤条件"
            messageSource = [
                "<li><strong>前置过滤条件</strong>（如果有）与<strong>Search Expression</strong>输入字符串拼接共同作为jmespath的条件输入</li>",
                "<li>所以使用前置条件的时候，输入就需要注意拼接符号了</li>",
                "<li>比如想获取<code>res.data.user[age]</code>，前置已经输入了<code>res.data</code>，那么Search Expression则需要输入<code>.user[age]</code>，" +
                "<strong>注意有个标点拼接</strong></li>",
            ]
            break
        default:
            title = ""
            messageSource = []
    }
    ElMessageBox.alert(undefined, {
        title,
        type: "info",
        dangerouslyUseHTMLString: true,
        customStyle: {
            width: "600px",
            maxWidth: "unset"
        },
        message: [
            "<ul>",
            ...messageSource,
            "</ul>"
        ].join("")
    }).catch(() => {})
}

const readFromClipboard = () => {
    navigator.clipboard.readText().then(text => {
        if(text) inputValue.value = text
    }).catch(e => {
        console.warn("读取失败", e)
        ElMessage.error("读取剪贴板失败！请手动粘贴到输入框！")
    })
}

const showSampleSelect = ref(false)
const selectedSampleDataIndex = ref(-1)
const renderSamplePreSelect = computed(() => {
    const index = selectedSampleDataIndex.value
    if(index < 0) return ""
    return JSON.stringify(sampleDataList[index].data, null, 4)
})
const renderSampleJMESInput = computed(() => {
    return getSampleJMESInput()
})

const getSampleJMESInput = () => {
    return sampleDataList[selectedSampleDataIndex.value]?.inputValue
}

const inputFromSampleData = () => {
    selectedSampleDataIndex.value = 0
    showSampleSelect.value = true
}
const formatInput = () => {
    try {
        inputValue.value= JSON.stringify(JSON.parse(inputValue.value), null, 4)
    }
    catch (e) {
        ElMessage.error("格式化失败！")
        console.error(e)
    }
}

const useSample = () => {
    inputValue.value = renderSamplePreSelect.value
    showSampleSelect.value = false
    if(!jmespathStr.value) jmespathStr.value = getSampleJMESInput() || ""
    selectedSampleDataIndex.value = -1
}

const canClearInput = computed(() => inputValue.value)
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
const willRenderForm = computed(() => {
    return Object.keys(form.value).length
})
const enumMark = ref<{
    [index: string]: {
        /* 是否枚举（枚举则驱动下拉选项） */
        value: boolean
        /* 标记是否允许枚举 */
        canEnum: boolean
    }
}>({})
const buildForm = () => {
    if (!readyToRender.value) {
        form.value = {}
        return
    }
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
    return Array.from(new Set((inputData.value as any[]).map(item => item[k])))
}
const renderLabel = (label: any) => {
    if (typeof label === "boolean") return label ? "true" : "false"
    return label
}

watch(() => form.value, debounce(() => {
    if(filterWith.value === "JMESPath") return
    updateOutput()
}), {deep: true})

watch(() => filterWith.value, v => {
    if (v === "fields") buildForm()
})
watch(() => inputValue.value, () => {
    buildForm()
})

const inputData = computed<any[]>(() => {
    return readyToRender.value ? JSON.parse(inputValue.value) : []
})

const outputData = ref<any>("")
const computeOutputData = () => {
    if (!readyToRender.value) return ""
    const dataList = JSON.parse(inputValue.value) as any
    if (filterWith.value === "JMESPath") {
        const value = execJmespathStr.value
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
                const {value: v, type} = form.value[k]
                const value = processValue(v, type)
                const _value = item[k]
                // 枚举需要等值判断
                if(enumMark.value[k].value) {
                    console.log(_value, value, "<<<<", type, k)
                    if(typeof value !== "number" && !value) continue
                    if(typeof value === "undefined") continue
                    if(value !== _value) return
                }
                else {
                    if (type === "string") {
                        if (!_value.includes(value)) return
                    } else if (type === "number") {
                        if (isNaN(value)) continue
                        if (_value !== value) return
                    } else if (type === "boolean") {
                        if(typeof value === "undefined") continue
                        if (value !== _value) return
                    }
                }
            }
            return true
        })
    }
}

const updateOutput = () => {
    outputData.value = computeOutputData()
}

const updateWatch = computed(() => {
    return [filterWith.value, inputValue.value, execJmespathStr.value]
})
watch(() => updateWatch.value, debounce(() => {
    updateOutput()
}, 150), {deep: true})

const processValue = (value: any, type: any) => {
    return type === "number" ? parseFloat(value) : value
}

const outputValue = computed(() => {
    return outputData.value ? JSON.stringify(outputData.value, null, compressOutput.value ? 0 : 4) : ""
})

const readyToCopy = computed(() => readyToRender.value && outputValue.value)
const readyToExport = computed(() => readyToCopy.value)

const compressOutput = ref(false)

const _copyToClipboard = () => {
    copyToClipboard(outputValue.value)
}

const _exportContent = () => {
    const a = document.createElement("a")
    a.href = window.URL.createObjectURL(new Blob([outputValue.value]))
    a.download = `${Math.random().toString(16).slice(2)}.json`
    a.click()
}

// 注意sync的位置，避免触发不必要的watch
syncRef(filterWith, "com.collection-search.filterWith")

// 如果参数指定了过滤模式，那么将使用指定的模式
const {filterWith: _} = useRoute().query as any
if(["fields", "JMESPath"].includes(_)) filterWith.value = _

onMounted(() => {
    buildForm()
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
        text-align: center;

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

#jmespath-area {
    > div:not(:last-child) {
        display: flex;
        margin-bottom: 16px;
        > .el-checkbox {
            align-self: center;
            display: flex;
            justify-content: center;
        }
        > .el-button {
            height: auto;
        }
        > * {
            width: 48px;
            height: 100%;
            flex-shrink: 0;
        }
    }
}

#form-cant-be-used {
    font-size: 14px;
    padding: 32px 0;
    text-align: center;
    color: #999;
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
        > .conditions-wrapper {
            display: flex;
            align-items: center;
            > * {
                border: none;
                border-left: 1px solid #d0d0d0;
                border-radius: 0;
                margin: 0;
                /* 和el-button默认的一样 */
                padding: 8px 15px;
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

textarea {
    outline: none;
    box-sizing: border-box;
    border: 0;
    width: 100%;
    height: 100%;
    margin: 0 !important;
}

.suggest-item-wrapper {
    line-height: normal;
    padding: 3px 0;
    box-sizing: border-box;

    > div:first-child{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
    }
    > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    > div:nth-child(2) {
        color: #999;
    }
    > .el-button {

    }
}

@media screen and (max-width: 820px) {
    #content-area {
        height: auto;
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
    #input-area > div:first-child {
        box-shadow: 0 0 3px #999;
    }
    #output-area {
        flex-grow: 1;
    }
}
</style>
