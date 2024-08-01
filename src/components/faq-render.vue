<template>
    <div v-if="faqList.length" class="faq-list">
        <b>FAQ</b>
        <ul>
            <li v-for="(item, index) in faqList" :key="index">
                <el-link v-if="item.link" :href="item.link" target="_blank">{{ item.title }}</el-link>
                <span v-else>{{ item.title }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute()
const faqList = computed(() => (route.meta.faqList || []) as any[])
</script>

<style lang="scss" scoped>
.faq-list {
    text-align: left;
    display: flex;
    background-color: #f0f0f0;
    font-size: 14px;

    > b {
        display: inline-block;
        width: 1rem;
        word-break: break-all;
        padding: 12px;
        background-color: #63a35c;
    }

    > ul {
        flex-grow: 1;
    }
}
</style>
