<template>
    <div id="bbcode">
        <HeadRender></HeadRender>
        <FilterRender>
            <el-checkbox v-model="addInLineBreaks" label="识别空白行"></el-checkbox>
            <el-select v-model="displayOrient" style="width: 128px;">
                <el-option value="horizontal" label="横向"></el-option>
                <el-option value="vertical" label="纵向"></el-option>
            </el-select>
        </FilterRender>
        <div id="content-area" :class="[`display-${displayOrient}`]">
            <div id="input">
                <el-input v-model="inputValue" type="textarea" placeholder="输入bbcode代码"></el-input>
            </div>
            <div id="output" v-html="renderContent"></div>
        </div>
        <FAQRender></FAQRender>
    </div>
</template>
<script lang="ts">
export default {
    name: "bbcode",
    text: "bbcode",
    icon: "code",
    description: "bbcode在线编辑与预览",
    faqList: [
        {
            title: "关于bbcode",
            link: "https://www.bbcode.org/reference.php"
        },
        {
            title: "bbcode在不同的平台上的支持可能还不是很一致"
        }
    ]
}
</script>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"
import FAQRender from "@/components/faq-render.vue"
import {computed, ref, watch} from "vue";
import {syncRef} from "@/utils";

const sampleContent = `[url=https://www.bbcode.org/reference.php]bbcode.org[/url]
[url]https://www.bbcode.org/reference.php[/url]

[b]粗体[/b]
[i]斜体[/i]
[u]下划线[/u]
[s]删除线[/s]
[size=18]字体大小[/size]

[color=#ffa500]颜色（十六进制）[/color]
[color=orange]颜色（名称）[/color]
[b][color=#f780ff]渐[/color][color=#e4a3ff]变[/color][color=#d0c6ff]色[/color][color=#bde9ff]（伪）[/color][/b]

[img=200x100]https://i0.wp.com/www.bbcode.org/wp-content/uploads/2022/03/bbcode_example.jpg?resize=150%2C150&ssl=1[/img]
`
const inputValue = ref(sampleContent)
const renderContent = ref("")

const removeMisalignedTags = ref(false)
// 识别空白行
const addInLineBreaks = ref(false)
const displayOrient = ref<"horizontal" | "vertical">("horizontal")

syncRef(addInLineBreaks, "com.bbcode.addInLineBreaks")
syncRef(displayOrient, "com.bbcode.displayOrient")

const processConfig = computed(() => ({
    removeMisalignedTags: removeMisalignedTags.value,
    addInLineBreaks: addInLineBreaks.value,
}))

watch(() => processConfig.value, () => update())
watch(() => inputValue.value, () => {
    update()
})

const xBBCode = require("xbbcode-parser")
const update = () => {
    // bbcode.parse(inputValue.value, (content: any) => {
    //     renderContent.value = content
    // })
    const result = xBBCode.process({
        text: inputValue.value,
        ...processConfig.value
    })
    if(result.error) console.error(result.error)
    else renderContent.value = result.html
}

update()

const tipList = [
    {text: "颜色要使用十六进制的"}
]
</script>

<style lang="scss">
@import "xbbcode-parser/xbbcode.css";
div#bbcode {
    overflow: hidden;

    a {
        text-underline: none;
    }

    > div#content-area {
        height: 0;
        flex-grow: 1;
        display: flex;
        overflow: hidden;

        &.display-horizontal {
            > div {
                width: 50%;
                height: 100%;
            }
        }

        &.display-vertical {
            flex-direction: column-reverse;
            > div {
                width: 100%;
                height: 50%;
            }
            #input {
                border-top: 1px solid #aaa;
            }
        }

        > div {
            box-sizing: border-box;
            overflow: auto;
            flex-shrink: 0;
        }

        #input {
            .el-textarea {
                width: 100%;
                height: 100%;

                textarea {
                    width: 100%;
                    height: 100%;
                    font-size: 1.2rem;
                    line-height: 1.2;
                    border-radius: 0;
                    padding: 12px;
                }
            }
        }

        #output {
            overflow: auto;
            flex-grow: 1;
            padding: 12px;

            &:hover > .icon-copy {
                display: inline-block;
            }

            img {
                width: fit-content;
            }
        }
    }
}
</style>
