<template>
    <div id="string-converter">
        <HeadRender></HeadRender>
        <FilterRender>

            <label>{{metaContent.labels.inputRadix}}</label>
            <el-select v-model="sourceRadix">
                <el-option v-for="item in radixList" :key="item.radix" :value="item.radix"></el-option>
            </el-select>
            <label>{{ metaContent.labels.inputLength }}: {{ inputValue.length }}</label>
            <label>{{ metaContent.labels.validInputLength }}: {{ validInputValue.length }}</label>
            <label>{{ metaContent.labels.outputRadix }}</label>
            <el-select v-model="targetRadix">
                <el-option v-for="item in radixList" :key="item.radix" :value="item.radix"></el-option>
            </el-select>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input ref="refInput" v-model="inputValue" @selectionchange="handleInputSelectChange"
                          type="textarea"
                          :placeholder="i18n.t('body.common.placeholders.input')"></el-input>
            </div>
            <div id="output">
                <el-input v-model="outputValue" type="textarea" :placeholder="i18n.t('body.common.placeholders.output')" readonly></el-input>
            </div>
        </div>
        <FAQRender></FAQRender>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"
import FAQRender from "@/components/faq-render.vue"

import debounce from "debounce";
import {syncRef, withMetaContent} from "@/utils";
import {withI18n} from "@/i18n/i18n";

defineOptions({
    name: "radix-converter"
})

const metaContent = withMetaContent<"labels">()
const i18n = withI18n()

type TRadix = 2 | 8 | 10 | 16 | 32
const radixList: {
    radix: TRadix
    label: string
}[] = [
    {radix: 2, label: "二进制"},
    {radix: 8, label: "八进制"},
    {radix: 10, label: "十进制"},
    {radix: 16, label: "十六进制"},
    {radix: 32, label: "三十二进制"},
]
const sourceRadix = ref(10)
const targetRadix = ref(16)

syncRef(
    sourceRadix, "com.radix-converter.sourceRadix",
    sourceRadix.value,
    {
        onLoad(value, callback) {
            callback(value ? parseInt(value) : sourceRadix.value)
        }
    }
)
syncRef(
    targetRadix, "com.radix-converter.targetRadix",
    targetRadix.value,
    {
        onLoad(value, callback) {
            callback(value ? parseInt(value) : targetRadix.value)
        }
    }
)

const refInput = ref()
const inputValue = ref("")

const inputRange = ref({
    start: 0,
    end: 0
})

// todo 使用template dom绑定refInput
const handleInputSelectChange = debounce((e: Event) => {
    if (!refInput.value) return
    const textarea = refInput.value.textarea as HTMLTextAreaElement
    const start: number = textarea.selectionStart
    const end: number = textarea.selectionEnd
    if (start !== end) inputRange.value = {start, end}
    else inputRange.value = {start: 0, end: 0}
    console.log("CHANGE: ", start, end)
})

const validInputValue = computed(() => {
    const {start, end} = inputRange.value
    const value = inputValue.value.toString()
    return start !== end ? value.slice(start, end) : value
})

watch(() => validInputValue.value, debounce(() => computeOutput(), 100))
watch(() => [sourceRadix.value, targetRadix.value], debounce(() => computeOutput(), 100))
const outputValue = ref("")
const computeOutput = () => {
    let outValue: string
    // 先转到十进制
    const dValue = parseInt(validInputValue.value, sourceRadix.value)
    // 再转到目标进制
    if (targetRadix.value !== 10) outValue = dValue.toString(targetRadix.value)
    else outValue = dValue.toString()

    console.log("COMPUTED: ", inputValue.value, outValue, targetRadix.value !== 10, targetRadix.value)
    outputValue.value = outValue
}
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
