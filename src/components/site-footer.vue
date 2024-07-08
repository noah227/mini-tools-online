<template>
    <div class="site-footer">
        <template v-if="!isHome">
            <el-link class="iconfont" href="/" :title="siteTitle" target="_blank">
                <img src="/favicon.png" alt="" style="width: 16px;">
                <span>Home</span>
            </el-link>
            <span class="divider"></span>
        </template>
        <el-link class="iconfont icon-github" href="https://github.com/noah227/mini-tools-online/issues" target="_blank">
            issues
        </el-link>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    isHome: Boolean
})

const siteTitle = location.origin
</script>

<style lang="scss" scoped>
.site-footer {
    width: 100%!important;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5rem;
    font-size: 1.5rem !important;
    box-shadow: 0 -8px 6px -6px #aaa;
    z-index: 333;
    background-color: #fff;

    .el-link {
        color: #6af;
    }

    .divider {
        height: 12px;
        width: 1px;
        background-color: #6af;
        margin: 0 12px;
    }
}
</style>
