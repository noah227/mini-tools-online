<template>
    <div id="case-overview">
        <HeadRender></HeadRender>
        <hr style="width: 100%;">
        <div id="content-area">
            <el-input v-model="inputValue"></el-input>
            <hr style="width: 100%;">
            <div>
                <div v-for="({value}) in options" class="case-item" :key="value">
                    <b>{{ value }}</b>
                    <i class="iconfont icon-copy" title="复制" @click="copyToClipboard(value)"></i>
                    <span>
                        {{ changeCase[value](inputValue) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "case-overview",
    text: "case一览",
    icon: "string-converter",
    description: "case一览、快速查看"
}
</script>
<script lang="ts" setup>
import * as changeCase from "change-case"
import {ref} from "vue";
import HeadRender from "@/components/head-render.vue"

const options = Object.keys(changeCase).map(k => ({value: k})).filter(({value: k}) => k.endsWith("Case"))
const inputValue = ref("once upon a time")

const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText((changeCase as any)[key](inputValue.value))
}
</script>

<style lang="scss" scoped>
#case-overview {
    text-align: left;
}

#content-area {
    box-sizing: border-box;

    > div:last-child {
        padding: 12px;
        box-sizing: border-box;

        .case-item {
            display: flex;
            align-items: center;

            &:hover {
                background-color: #f0f0f0;
            }

            > b {
                display: inline-block;
                width: 148px;
                line-height: 1.5;
                flex-shrink: 0;
            }
            > i {
                margin-right: 3px;
                &:hover{
                    transform: scale(1.05);
                    color: #223;
                }
            }

            > span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

}
</style>
