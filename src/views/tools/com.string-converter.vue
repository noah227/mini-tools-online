<template>
    <div id="string-converter">
        <HeadRender></HeadRender>
        <FilterRender>
            <label>目标格式</label>
            <el-select v-model="convertMethod">
                <el-option v-for="{value} in options" :key="value" :value="value"></el-option>
            </el-select>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input v-model="inputValue" type="textarea" placeholder="输入要转换的内容"></el-input>
            </div>
            <div id="output">
                <el-input v-model="outputValue" type="textarea" placeholder="输出的内容" readonly></el-input>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: "string-converter",
    text: "字符格式转换",
    icon: "string-converter",
    description: "各种风格的字符转换"
}
</script>
<script lang="ts" setup>
import * as changeCase from "change-case"
import {computed, ref, watch} from "vue";
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"
import {syncRef} from "@/utils";

const options = Object.keys(changeCase).map(k => ({value: k})).filter(({value: k}) => k.endsWith("Case"))

const convertMethod = ref("camelCase")
syncRef(convertMethod, "com.string-converter.convertMethod")
watch(() => convertMethod.value, v => console.log((changeCase as any)[convertMethod.value]))
const inputValue = ref("")
const converter = computed<(...args: any) => string>(() => (changeCase as any)[convertMethod.value])
const outputValue = computed(() => {
    return converter.value(inputValue.value.replace(/\n/g, "2233")).replace(/2233/g, "\n")
})
</script>

<style lang="scss">
div#string-converter {
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
