<template>
    <div id="bbcode">
        <HeadRender></HeadRender>
        <div id="content-area">
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
    description: "bbcode",
    faqList: [
        {
            title: "关于bbcode",
            link: "https://www.bbcode.org/reference.php"
        },
        {
            title: "颜色要使用十六进制的",
            link: ""
        }
    ]
}
</script>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import FAQRender from "@/components/faq-render.vue"
import {ref, watch} from "vue";

const sampleContent = `[url=https://www.bbcode.org/reference.php][b][color=#f780ff]b[/color][color=#e4a3ff]b[/color][color=#d0c6ff]c[/color][color=#bde9ff]d[/color][/b][/url]

[color=#ffa500]hello[/color]
[img]https://avatars.githubusercontent.com/u/0?v=4[/img]
`
const inputValue = ref(sampleContent)
const renderContent = ref("")

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
        removeMisalignedTags: false,
        // 识别换行符
        addInLineBreaks: false
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
div#bbcode {
    overflow: hidden;

    a {
        text-underline: none;
    }

    > div#content-area {
        flex-grow: 1;
        display: flex;
        flex-direction: column-reverse;
        overflow: hidden;
        border-top: 1px solid #aaa;

        > div {
            width: 100%;
            height: 50%;
            box-sizing: border-box;
            overflow: auto;
            flex-shrink: 0;
        }

        #input {
            border-top: 1px solid #aaa;

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
        }
    }
}
</style>
