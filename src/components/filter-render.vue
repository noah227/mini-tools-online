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

    .el-input__wrapper {
        box-shadow: 0 3px 3px -3px #d0d0d0;
        border-bottom: 1px solid #d0d0d0;
        border-radius: 0;
        transition: all linear .12s;
        &.is-focus {
            box-shadow: 0 3px 3px -3px #a0a0a0;
            border-bottom: 1px solid #a0a0a0;
        }
    }
}
</style>
