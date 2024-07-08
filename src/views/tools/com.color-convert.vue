<template>
    <div id="color-converter">
        <HeadRender></HeadRender>
        <div id="input-area">

        </div>
        <div id="output-area" :style="outputAreaBindStyle">
            <div v-for="k in convertKeys" :key="k">
                <label :for="`input-${k}`">{{ k }}</label>
                <el-input :id="`input-${k}`" v-model="inputMap[k].value" @input="updateInputMap(k)"></el-input>
            </div>
        </div>
        <FAQRender></FAQRender>
    </div>
</template>
<script lang="ts">
export default {
    name: "color-converter",
    text: "颜色快速转换",
    icon: "palette",
    description: "颜色快速转换及预览(Based on color-convert@npm)",
    faqList: [
        {
            title: "Why do the LCH and LAB conversion results differ from those on Chrome?",
            link: "https://github.com/Qix-/color-convert/issues/108"
        }
    ]
}
</script>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import FAQRender from "@/components/faq-render.vue"
import {computed, ref} from "vue";

const convert = require("color-convert")
const convertKeys = Object.keys(convert)
const inputMap = ref<{ [index: string]: { value: any } }>({
    rgb: {value: [100, 100, 0]}
})

const outputAreaBindStyle = computed(() => {
    return {
        boxShadow: `0 0 9px 3px inset rgb(${inputMap.value.rgb.value.toString()})`
    }
})
const buildInputMap = () => {
    convertKeys.forEach(k => {
        if (!inputMap.value[k]) {
            inputMap.value[k] = {value: ""}
        }
    })
}
const updateInputMap = (basedKey: string) => {
    let value = inputMap.value[basedKey].value
    switch (basedKey) {
        case "rgb":
            if (typeof value === "string") {
                value = value.split(/[\s,]+/)
            }
            break
    }
    convertKeys.forEach(k => {
        if (k !== basedKey) {
            inputMap.value[k].value = convert[basedKey][k](value)
        }
    })
}
buildInputMap()
updateInputMap("rgb")
// console.log(convert.rgb.hex([100, 100, 10]))
// hex/hsl/hwb lch/oklch/lab/oklab
</script>

<style lang="scss" scoped>
#color-converter {
    display: flex;
    flex-direction: column;

    > div:first-child {
        border-bottom: 1px solid #f0f0f0;
        box-sizing: border-box;
    }
}

#output-area {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(3, auto);
    padding: 12px;
    box-sizing: border-box;
    align-content: flex-start;
    overflow: hidden;

    > div {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        > label {
            width: 8em;
            margin-right: 12px;
            text-align: right;
        }
    }
}

@media screen and (max-width: 720px) {
    #output-area {
        grid-template-columns: repeat(2, auto);
    }
}

@media screen and (max-width: 520px) {
    #output-area {
        grid-template-columns: repeat(1, auto);
    }
}
</style>
