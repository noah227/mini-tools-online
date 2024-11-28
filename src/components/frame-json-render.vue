<template>
    <iframe class="frame-json-render" v-if="renderJsonUrl" :src="renderJsonUrl"></iframe>
</template>

<script lang="ts" setup>
// 依赖于浏览器原生的json渲染
import {ref, watch} from "vue";

const props = defineProps({
    code: {
        type: String,
        required: true
    }
})
const renderJsonUrl = ref("")
const update = () => {
    renderJsonUrl.value = props.code ? window.URL.createObjectURL(new Blob([props.code], {type: "application/json"})) : ""
}
watch(() => props.code, update)
update()
</script>

<style lang="scss" scoped>
.frame-json-render {
    width: 100%;
    height: 100%;
    border: 0;
    display: inline-block;
}
</style>
