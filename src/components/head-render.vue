<template>
    <div class="common-title" :title="renderBindTitle">
        <slot name="title-before"></slot>
        {{ renderTitle }}
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
.common-title {
    font-size: 1.17em;
    font-weight: bold;
    padding-block-start: 1em;
    padding-block-end: 1em;
    user-select: none;
    text-align: center;
}
</style>
