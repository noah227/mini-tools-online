<template>
    <div id="case-overview">
        <HeadRender></HeadRender>
        <FilterRender>
            <el-input v-model="inputValue" :placeholder="i18n.t('body.common.placeholders.input')"></el-input>
        </FilterRender>
        <div id="content-area">
            <div>
                <div v-for="({value}) in options" class="case-item" :key="value">
                    <b>{{ value }}</b>
                    <span>
                        {{ getCaseChanged(value) }}
                    </span>
                    <i class="iconfont icon-copy" :title="i18n.t('body.common.buttons.copy')" @click="_copyToClipboard(value)"></i>
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
import {copyToClipboard, withMetaContent} from "@/utils";
import {useRoute} from "vue-router";
import {withI18n} from "@/i18n/i18n";

defineOptions({
    name: "case-overview"
})

const i18n = withI18n()

const options = Object.keys(changeCase).map(k => ({value: k})).filter(({value: k}) => k.endsWith("Case"))
const inputValue = ref("once upon a time")

const getCaseChanged = (c: string) => {
    if(!inputValue.value) return " - "
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
