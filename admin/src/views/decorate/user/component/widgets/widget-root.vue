<template>
    <div
        class="widget-root"
        :style="{
            padding: `${styles.padding_top}px ${styles.padding_horizontal}px ${styles.padding_bottom}px`,
            'background-color': styles.root_bg_color
        }"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    styles: {
        root_bg_color: string
        padding_top: number
        padding_horizontal: number
        padding_bottom: number
    }
}>()
</script>