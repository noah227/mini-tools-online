<template>
    <div class="common-title-wrapper" :title="renderBindTitle">
        <slot name="title-before"></slot>
        <span class="common-title">{{ renderTitle }}</span>
        <slot name="title-after"></slot>
    </div>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

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

    > .common-title {
        font-size: 1.17em;
        font-weight: bold;
        user-select: none;
    }
}
</style>
