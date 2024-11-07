<template>
    <div class="common-title-wrapper" :class="withBottomBorder && 'with-bottom-border'" :title="renderBindTitle">
        <slot name="title-before"></slot>
        <span class="common-title">{{ renderTitle }}</span>
        <slot name="title-after"></slot>
    </div>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const props = defineProps({
    withBottomBorder: Boolean
})

const route = useRoute()
const renderTitle = computed(() => route.meta.text)
const renderBindTitle = computed(() => route.meta.description as any)
</script>

<style lang="scss" scoped>
.common-title-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-block-start: 1em;
    padding-block-end: 1em;

    &.with-bottom-border {
        box-sizing: border-box;
        border-bottom: 1px solid #aaa;
    }

    > .common-title {
        font-size: 1.17em;
        font-weight: bold;
        user-select: none;
    }
}
</style>
