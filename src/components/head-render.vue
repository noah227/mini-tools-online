<template>
    <h3 class="common-title" :title="renderBindTitle">{{ renderTitle }}</h3>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute()
const renderTitle = computed(() => route.meta.text)
const renderBindTitle = computed(() => route.meta.description)
</script>

<style lang="scss" scoped>
.common-title {
    user-select: none;
    text-align: center;
}
</style>
