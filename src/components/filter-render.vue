<template>
    <div class="filter-render">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";

const props = defineProps({
    justifyContent: {
        type: String as () => "flex-start" | "center" | "space-between" | "space-around" | "flex-end" | string,
        default: "center"
    },
    flexWrap: {
        type: String as () => "nowrap" | "wrap",
        default: "nowrap"
    },
    itemSpace: {
        type: [Number, String],
        default: "12px"
    }
})


const renderItemSpace = computed(() => {
    const _ = props.itemSpace
    return _ ? (typeof _ === "number" ? _ + "px" : _) : "0px"
})
</script>

<style lang="scss">
.filter-render {
    padding: 1rem 12px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: v-bind(justifyContent);
    flex-wrap: v-bind(flexWrap);
    border-bottom: 1px solid #aaa;
    border-top: 1px solid #aaa;
    font-size: 14px;

    > label {
        flex-shrink: 0;
    }
    > *:not(:last-child) {
        margin-right: v-bind(renderItemSpace)!important;
    }

    > .el-button {
        margin-left: 0;
    }
}
</style>
