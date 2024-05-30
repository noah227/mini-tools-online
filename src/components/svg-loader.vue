<template>
    <svg class="icon" aria-hidden="true">
        <use :xlink:href="`#icon-${name}`"></use>
    </svg>
</template>

<script lang="ts" setup>
defineProps({
    name: {type: String, required: true}
})
</script>

<style>

</style>
