<template>
    <div id="string-converter">
        <h3 id="title">字符格式转换</h3>
        <div id="filter-area">
            <label>目标格式</label>
            <el-select v-model="convertMethod">
                <el-option v-for="{value} in options" :key="value" :value="value"></el-option>
            </el-select>
        </div>
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
    text: "字符转换",
    icon: "string-converter",
    description: ""
}
</script>
<script lang="ts" setup>
import * as changeCase from "change-case"
import {computed, ref} from "vue";

const options = Object.keys(changeCase).map(k => ({value: k}))
const convertMethod = ref("camelCase")
const inputValue = ref("")
const converter = computed<(...args: any) => string>(() => (changeCase as any)[convertMethod.value])
const outputValue = computed(() => {
    return converter.value(inputValue.value.replace(/\n/g, "2233")).replace(/2233/g, "\n")
})
</script>

<style lang="scss">
div#string-converter {
    width: 70%;
    height: 520px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border: 1px solid #3af;
    border-radius: .5rem;

    > div#filter-area {
        width: 100%;
        padding: 1rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #aaa;
        border-top: 1px solid #aaa;

        .el-select {
            margin-left: 2rem;
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

    @media screen and (max-width: 520px) {
        div#content-area {
            flex-direction: column
        }
    }

}
</style>
