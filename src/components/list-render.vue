<script setup lang="ts">
defineOptions({
    name: "list-render"
})

export type TListData = {
    text?: string
    // prior than text if exist
    html?: string
    subDataList?: TListData
}[]

defineProps({
    dataList: {
        type: Object as () => TListData
    }
})

</script>

<template>
    <ul v-if="dataList">
        <template v-for="item in dataList">
            <li v-if="item.text || item.html">
                <span v-if="item.html" v-html="item.html"></span>
                <template v-else>{{ item.text }}</template>
                <ListRender v-if="item.subDataList" :data-list="item.subDataList"></ListRender>
            </li>
        </template>
    </ul>
</template>

<style scoped lang="scss">

</style>