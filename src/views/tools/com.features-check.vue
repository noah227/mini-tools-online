<template>
    <div id="string-converter">
        <HeadRender></HeadRender>
        <FilterRender>
            <label>选中符号</label>
            <el-select v-model="checkedChar">
                <el-option v-for="value in checkedCharList" :key="value" :value="value"></el-option>
            </el-select>
            <label>未选中符号</label>
            <el-select v-model="uncheckedChar">
                <el-option v-for="value in uncheckedCharList" :key="value" :value="value"></el-option>
            </el-select>
            <el-button type="primary" plain @click="exportAsMarkdown">导出Markdown</el-button>
            <el-button type="primary" plain @click="exportAsTable">导出Table</el-button>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input v-model="inputValueX" type="text" placeholder="横轴字段，空格分隔" clearable></el-input>
                <el-input v-if="false" v-model="inputValueY" type="text" placeholder="纵轴字段，空格分隔" clearable></el-input>
            </div>
            <div id="action-area">
                <div>{{ simpleMode ? "Simple" : "Complex" }}</div>
                <table v-if="simpleMode" border="1" style="border-collapse: collapse">
                    <thead>
                    <tr>
                        <th v-for="item in axisX">{{ item }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td v-for="item in dataModel">
                            <el-checkbox v-model="item.checked">{{ item.checked ? checkedChar : uncheckedChar }}
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
import {syncRef} from "@/utils";

defineOptions({
    name: "features-check",
    text: "选项表生成",
    icon: "features-check",
    description: "类兼容表生成",
    devOnly: true
})

// 横轴
const inputValueX = ref("Windows MacOs Linux")
// 纵轴
const inputValueY = ref("")

const axisX = computed(() => {
    return getItems(inputValueX.value)
})

const axisY = computed(() => {
    return getItems(inputValueY.value)
})

const getItems = (s: string) => {
    return s.split(/\s+/).filter(_ => _)
}

const simpleMode = computed(() => !axisY.value.length)
type TData = {
    x: number
    y: number
    checked: boolean
}
const dataModel = ref<TData[]>([])
const buildDataModel = () => {
    if (simpleMode.value) {
        dataModel.value = axisX.value.map((item, x) => ({
            x: x, y: 0, checked: false
        }))
        console.log(dataModel.value)
    } else {
        const tempDataModel: TData[] = []
        axisX.value.forEach((item, x) => {
            axisY.value.forEach((itemY, y) => {
                tempDataModel.push({
                    x, y, checked: false
                })
            })
        })
        dataModel.value = [...tempDataModel]
    }

}
watch(() => inputValueX.value + inputValueY.value, () => {
    nextTick(buildDataModel)
})

buildDataModel()


/********** ***********/
const checkedCharList = ["是", "支持", "√", "✔", "✅", "☑"]
const uncheckedCharList = ["否", "不支持", "×", "✖", "❎", "✖"]
const checkedChar = ref(checkedCharList[0])
const uncheckedChar = ref(uncheckedCharList[0])
syncRef(checkedChar, "com.features-checked.checkedChar")
syncRef(uncheckedChar, "com.features-checked.uncheckedChar")

const exportAsMarkdown = () => {

}

const exportAsTable = () => {

}

// todo 支持多行，类功能特性表的模式
</script>

<style lang="scss" scoped>
#content-area {
    display: flex;
    flex-direction: column;
}

#input {
    flex-grow: 0 !important;
    padding: 12px;
    border-bottom: 1px solid #909090;
}

#action-area {
    padding: 12px;
    box-sizing: border-box;
}


table {
    width: 100%;
    text-align: center;

    th, td {
        padding: 6px 12px;
    }
}
</style>
