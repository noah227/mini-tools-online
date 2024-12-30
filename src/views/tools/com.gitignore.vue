<template>
    <div id="client-info">
        <HeadRender with-bottom-border></HeadRender>
        <div id="content-area">
        </div>
    </div>
</template>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"

defineOptions({
    name: "gitignore-overview",
    text: ".gitignore一览",
    icon: "client",
    description: "常用.gitignore配置",
    faqList: [
        {
            title: "基于gitignore@github创建",
            link: "https://github.com/github/gitignore"
        }
    ],
    devOnly: true
})

</script>

<style lang="scss">
div#client-info {

}

#content-area {
    flex-grow: 1;
    overflow: auto;
    height: 0;
}
</style>
