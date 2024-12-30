<template>
    <div id="case-overview">
        <HeadRender></HeadRender>
        <FilterRender>
            <el-input v-model="inputValue" placeholder="请输入"></el-input>
        </FilterRender>
        <div id="content-area">
            <div>
                <div v-for="({value}) in options" class="case-item" :key="value">
                    <b>{{ value }}</b>
                    <i class="iconfont icon-copy" title="复制" @click="_copyToClipboard(value)"></i>
                    <span>
                        {{ getCaseChanged(value) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as changeCase from "change-case"
import {ref} from "vue";
import HeadRender from "@/components/head-render.vue"
import FilterRender from "@/components/filter-render.vue"
import {copyToClipboard} from "@/utils";

defineOptions({
    name: "case-overview",
    text: "case一览",
    icon: "string-converter",
    description: "case一览、快速查看"
})

const options = Object.keys(changeCase).map(k => ({value: k})).filter(({value: k}) => k.endsWith("Case"))
const inputValue = ref("once upon a time")

const getCaseChanged = (c: string) => {
    return (changeCase as any)[c](inputValue.value)
}

const _copyToClipboard = (key: string) => {
    copyToClipboard((changeCase as any)[key](inputValue.value))
}
</script>

<style lang="scss" scoped>
#case-overview {
    text-align: left;
    :deep(.filter-render .el-input__wrapper){
        box-shadow: 0 3px 3px -3px #d0d0d0;
        border-bottom: 1px solid #d0d0d0;
        border-radius: 0;
        transition: all linear .12s;
        &:hover {
            box-shadow: 0 3px 3px -3px #d0d0d0;
        }
        &.is-focus {
            box-shadow: 0 3px 3px -3px #a0a0a0;
            border-bottom: 1px solid #a0a0a0;
        }
    }
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
