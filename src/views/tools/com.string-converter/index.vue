<template>
    <div id="string-converter">
        <HeadRender></HeadRender>
        <FilterRender>
            <label>{{ metaContent.labels.targetCase }}</label>
            <el-select v-model="convertMethod">
                <el-option v-for="{value} in options" :key="value" :value="value"></el-option>
            </el-select>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input v-model="inputValue" type="textarea" :placeholder="i18n.t('body.common.placeholders.input')"></el-input>
            </div>
            <div id="output">
                <el-input v-model="outputValue" type="textarea" :placeholder="i18n.t('body.common.placeholders.output')" readonly></el-input>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
// 此模块依然有存在的必要（大文本转换）
import * as changeCase from "change-case"
import {computed, ref, watch} from "vue";
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"
import {syncRef, withMetaContent} from "@/utils";
import {withI18n} from "@/i18n/i18n";

defineOptions({
    name: "string-converter"
})

const metaContent = withMetaContent<"labels" | "placeholders">()
const i18n = withI18n()

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
