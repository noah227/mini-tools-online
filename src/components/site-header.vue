<template>
    <div class="site-header">
        <strong>{{i18n.t("head.title")}}</strong>
    </div>
</template>
<script lang="ts" setup>
import {withI18n} from "@/i18n/i18n";

const i18n = withI18n()

</script>

<style lang="scss">
.site-header {
    width: 100%;
    text-align: center;
    height: 3rem;
    line-height: 3rem;
    box-sizing: border-box;
    box-shadow: 0 8px 6px -6px #aaa;
    user-select: none;
    overflow: hidden;
    margin-bottom: 1rem;
}
</style>
