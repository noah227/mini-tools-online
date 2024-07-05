<template>
    <div class="site-footer">
        <el-link class="iconfont" href="/" target="_blank">Home</el-link>
        <span class="divider"></span>
        <el-link class="iconfont icon-github" href="https://github.com/noah227/mini-tools-online" target="_blank">
            mini-online-tools
        </el-link>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.site-footer {
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
