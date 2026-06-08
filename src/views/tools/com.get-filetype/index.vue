<template>
    <div id="get-filetype">
        <HeadRender with-bottom-border></HeadRender>
        <div id="content-area">
            <input ref="refFileInput" type="file" @change="handleFileChange">
            <hr>
            <div>
                <fieldset>
                    <legend>匹配对照表</legend>
                    <pre>{{ magicMatchMap }}</pre>
                </fieldset>
                <fieldset>
                    <legend>匹配结果</legend>
                    <div v-if="magicMatch">
                        {{ magicMatch.desc }}
                    </div>
                    <div v-else>未匹配</div>
                </fieldset>
            </div>
        </div>
        <FAQRender></FAQRender>
    </div>
</template>

<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import {ref} from "vue";
import FAQRender from "@/components/faq-render.vue"

defineOptions({
    name: "get-filetype",
    text: "获取文件类型",
    icon: "get-filetype",
    description: "查看文件的真实类型",
    devOnly: true,
    faqList: [
        {
            title: "基于文件匹配获取文件真实类型"
        }
    ]
})
type TMagicItem = Record<"desc", string>
const magicMatchMap: Record<string, TMagicItem | undefined> = {
    "89504e47": {
        desc: "png"
    },
    "ffd8ffe0": {
        desc: "jpeg"
    },
    "25504446": {
        desc: "pdf"
    },
    // 待确认对照补充
    "47494638": {
        desc: "gif"
    }
}

const refFileInput = ref()
const magicMatch = ref<TMagicItem>()

// todo: use node package instead for better detect.
// https://www.npmjs.com/package/file-type
const handleFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (files?.length) {
        const file = files[0]
        // 取前几位字符
        const fileHeader = new Uint8Array(await files[0].arrayBuffer()).subarray(0, 4)
        console.log(fileHeader)
        const fileHeaderHex = Array.from(fileHeader).map(n => n.toString(16).padStart(2, "0")).join("")
        magicMatch.value = magicMatchMap[fileHeaderHex]
        console.log(fileHeaderHex)
    }
}
</script>

<style lang="scss" scoped>
#get-filetype {

}

#content-area {
    box-sizing: border-box;
    padding: 16px;

}
</style>
