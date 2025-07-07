<template>
    <view
        class="widget-root"
        :style="{
             padding: `${styles.padding_top}px ${styles.padding_horizontal }px ${styles.padding_bottom}px`,
             'background-color': styles.root_bg_color,
             'border-radius': `${styles.radius}px`,
        }"
    >
        <slot></slot>
    </view>
</template>

<script setup lang="ts">
defineProps({
    styles: {
        type: Object,
        default: () => ({})
    }
})
</script>
