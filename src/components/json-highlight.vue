<template>
    <pre class="json-highlight"><code ref="refCode" class="language-json"></code></pre>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref, watch} from "vue";
import "prismjs/themes/prism-coy.min.css"

const prismJs = require("prismjs")

const props = defineProps({
    code: {
        type: String,
        required: true
    }
})

const refCode = ref()

const update = () => {
    refCode.value.innerHTML = props.code
    nextTick(() => {
        prismJs.highlightAll()
    })
}

watch(() => props.code, () => {
    update()
})

onMounted(() => {
    update()
})
</script>

<style lang="scss" scoped>
.json-highlight {
    height: 100%;
    overflow: auto;
    margin: 0;
}
</style>
