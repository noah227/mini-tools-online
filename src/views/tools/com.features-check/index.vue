<template>
    <div id="string-converter">
        <HeadRender></HeadRender>
        <FilterRender>
            <label>{{ metaContent.labels.checkedChar }}</label>
            <el-autocomplete v-model="checkedChar" :fetch-suggestions="fetchSuggestions(checkedCharList)" clearable></el-autocomplete>
            <label>{{ metaContent.labels.uncheckedChar }}</label>
            <el-autocomplete v-model="uncheckedChar" :fetch-suggestions="fetchSuggestions(uncheckedCharList)" clearable></el-autocomplete>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <div>
                    <el-checkbox v-model="xEnabled" label="X" disabled></el-checkbox>
                    <el-input v-model="inputValueX" id="inputValueX" type="text" :placeholder="metaContent.placeholders.inputX"
                              clearable></el-input>
                </div>
                <div>
                    <el-checkbox v-model="yEnabled" label="Y"></el-checkbox>
                    <el-input v-model="inputValueY" id="inputValueY" type="text" :placeholder="metaContent.placeholders.inputY"
                              clearable></el-input>
                </div>
            </div>
            <div id="buttons">
                <el-button type="primary" plain @click="importJSON">{{metaContent.buttons.importJSON}}</el-button>
                <el-button type="primary" plain @click="switchAxis">{{ metaContent.buttons.switchAxis }}</el-button>
                <el-button type="primary" plain @click="exportAsMarkdown">{{metaContent.buttons.exportMarkdown}}</el-button>
                <el-button type="primary" plain @click="exportAsImage">{{metaContent.buttons.exportImage}}</el-button>
                <el-button type="primary" plain @click="exportAsJSON">{{metaContent.buttons.exportJSON}}</el-button>
            </div>
            <div id="action-area">
                <div>{{ simpleMode ? "Simple" : "Complex" }}</div>
                <table v-if="simpleMode" ref="refTable">
                    <thead>
                    <tr>
                        <th v-for="item in axisX">{{ item }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td v-for="item in dataModel">
                            <el-checkbox v-model="item.checked" @change="cacheItemStatus(item)">
                                {{ item.checked ? checkedChar : uncheckedChar }}
                            </el-checkbox>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table v-else ref="refTable">
                    <thead>
                    <tr>
                        <th>-</th>
                        <th v-for="item in axisX">{{ item }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(y, yIndex) in axisY">
                        <th>{{ y }}</th>
                        <td v-if="modelReady" v-for="item in getAxisModelItems(yIndex)">
                            <span v-if="tableShowAsReadonly">{{ item.checked ? checkedChar : uncheckedChar }}</span>
                            <el-checkbox v-else v-model="item.checked" @change="cacheItemStatus(item)">
                                {{ item.checked ? checkedChar : uncheckedChar }}
                            </el-checkbox>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, nextTick, ref, watch} from "vue";
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"
import {syncRef, withMetaContent} from "@/utils";
import {createMdTableRowFromStringList} from "@/views/tools/com.features-check/index.utils";
import html2canvas from "html2canvas";
import {saveAs} from "file-saver";
import debounce from "debounce";

defineOptions({
    name: "features-check"
})

const metaContent = withMetaContent<"labels" | "buttons" | "placeholders">()

const xEnabled = ref(true)
const yEnabled = ref(true)

// 横轴
const inputValueX = ref("Windows MacOs Linux")
// 纵轴
const inputValueY = ref("Feature-A Feature-B Feature-C")

const axisX = computed(() => {
    return getItems(inputValueX.value)
})

const axisY = computed(() => {
    return getItems(inputValueY.value)
})

const getItems = (s: string) => {
    return s.split(/\s+/).filter(_ => _)
}

const simpleMode = computed(() => {
    return !(yEnabled.value && axisY.value.length)
})
type TData = {
    x: number
    y: number
    checked: boolean
}
const dataModel = ref<TData[]>([])
const modelReady = computed(() => {
    if (simpleMode.value) return dataModel.value.length === axisX.value.length
    else return dataModel.value.length === axisX.value.length * axisY.value.length
})

const buildDataModel = () => {
    if (simpleMode.value) {
        dataModel.value = axisX.value.map((item, x) => ({
            x: x, y: 0, checked: getCachedChecked(x, 0) ?? false
        }))
    } else {
        const tempDataModel: TData[] = []
        axisY.value.forEach((itemY, y) => {
            axisX.value.forEach((item, x) => {
                tempDataModel.push({
                    x, y, checked: getCachedChecked(x, y) ?? false
                })
            })
        })

        dataModel.value = [...tempDataModel]
    }

}

const refTable = ref<HTMLTableElement>()
const tableShowAsReadonly = ref(false)

const getAxisModelItems = (yIndex: number) => {
    const dataRowLength = axisX.value.length
    const start = yIndex * dataRowLength
    return dataModel.value.slice(start, start + dataRowLength)
}

const dataCache = ref<Record<string, boolean>>({})
const cacheItemStatus = (item: TData) => {
    const {x, y, checked} = item
    const cacheKey = getCacheKey(x, y)
    dataCache.value[cacheKey] = checked

    const cacheKeyReversed = getCacheKey(x, y, true)
    if(cacheKey !== cacheKeyReversed) dataCache.value[cacheKeyReversed] = checked
}
const getCachedChecked = (x: number, y: number) => {
    return dataCache.value[getCacheKey(x, y)]
}

const getCacheKey =  (x: number, y: number, tryReverse=false) => {
    if (simpleMode.value) return axisX.value[x]
    // 缓存的key由横纵坐标轴(名称)决定
    const keyParts = [
        axisY.value[y],
        axisX.value[x]
    ]
    if(tryReverse) keyParts.reverse()
    return keyParts.join(":")
}

watch(() => [
    inputValueX.value + inputValueY.value,
    simpleMode.value
], () => {
    nextTick(buildDataModel)
})

buildDataModel()


/********** ***********/
const checkedCharList = [
    "是", "支持", "Yes",
    "√", "✔", "✅", "☑"
]
const uncheckedCharList = [
    "否", "不支持", "No",
    "×", "✖", "❎", "✖"
]
const checkedChar = ref(checkedCharList[0])
const uncheckedChar = ref(uncheckedCharList[0])
syncRef(checkedChar, "com.features-checked.checkedChar")
syncRef(uncheckedChar, "com.features-checked.uncheckedChar")

const fetchSuggestions = (dataList: string[]) => {
    return dataList.map(v => ({value: v}))
}

const importJSON = () => {

}

const switchAxis = () => {
    [inputValueX.value, inputValueY.value] = [inputValueY.value, inputValueX.value]
}

const exportAsMarkdown = () => {
    const lines: string[][] = []
    if (simpleMode.value) {
        lines.push(axisX.value)
        lines.push(new Array(axisX.value.length).fill("-".repeat(3)))
        lines.push(dataModel.value.map((item) => {
            return item.checked ? checkedChar.value : uncheckedChar.value
        }))
    } else {
        lines.push(["-", ...axisX.value])
        lines.push(new Array(axisX.value.length + 1).fill("-".repeat(3)))

        axisY.value.forEach((itemY, y) => {
            const l = axisX.value.length
            const start = y * l
            const end = start + l
            lines.push([
                itemY,
                ...dataModel.value.slice(start, end).map(item => {
                    return item.checked ? checkedChar.value : uncheckedChar.value
                })
            ])
        })
    }
    navigator.clipboard.writeText(lines.map(l => createMdTableRowFromStringList(l)).join("\n"))
}

// html-2-canvas
const exportAsImage = debounce(() => {
    const table = refTable.value
    if(table) {
        tableShowAsReadonly.value = true
        nextTick(() => {
            html2canvas(table).then(cvs => {
                cvs.toBlob(b => {
                    if(b) {
                        saveAs(b, `export.png`)
                    }
                })
            }).finally(() => {
                setTimeout(() => {
                    tableShowAsReadonly.value = false
                }, 1000)
            })
        })
    }
})

const exportAsJSON = () => {

}

// todo 支持多行，类功能特性表的模式
</script>

<style lang="scss" scoped>
#content-area {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

#input {
    flex-grow: 0 !important;
    padding: 12px;
    border-bottom: 1px solid #909090;

    > div {
        display: flex;
        align-items: center;

        > .el-checkbox {
            margin-right: 12px;
        }

        &:not(:last-child) {
            margin-bottom: 12px;
        }
    }
}

#buttons {
    display: flex;
    padding: 12px;
    align-items: center;
    flex-wrap: wrap;
    grid-gap: 12px;
    :deep(.el-button+.el-button) {
        margin-left: 0;
    }
}

#action-area {
    padding: 12px;
    box-sizing: border-box;
    overflow: auto;
    height: 0;
    flex-grow: 1;
}


table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    $table-border-color: #ddd;
    border-left: 1px solid $table-border-color;
    border-top: 1px solid $table-border-color;

    th, td {
        padding: 6px 12px;
        border-right: 1px solid $table-border-color;
        border-bottom: 1px solid $table-border-color;
    }
}
</style>
