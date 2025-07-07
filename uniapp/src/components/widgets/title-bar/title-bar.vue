<template>
    <widget-root :styles="styles" v-if="content.enabled">
        <div class="title-bar flex justify-between">
            <div class="flex items-baseline ml-2">
                <div
                    class="font-medium"
                    :style="{
                        color: styles.title_color,
                        'font-size': styles.title_size / 2 + 'px'
                    }"
                >
                    {{ content.title }}
                </div>
                <div
                    class="ml-2"
                    :style="{
                        color: styles.subtitle_color,
                        'font-size': styles.subtitle_size / 2 + 'px'
                    }"
                >
                    {{ content.subtitle }}
                </div>
            </div>

            <div
                v-if="content.show_right_btn"
                class="flex items-center"
                :style="{ color: content.btnColor }"
                @click="handleClick(content.link)"
            >
                <text class="mr-1">{{ content.btnText }}</text>
                <u-icon name="arrow-right" size="24" color="inherit" />
            </div>
        </div>
    </widget-root>
</template>

<script setup lang="ts">
import { navigateTo } from '@/utils/util'

defineProps({
    content: {
        type: Object,
        default: () => ({})
    },
    styles: {
        type: Object,
        default: () => ({})
    }
})
const handleClick = (link: any) => {
	let navigateType = 'navigateTo'
	if (['/pages/index/index','/pages/category/index','/pages/order/index','/pages/user/user'].indexOf(link.path || '') != -1) {
		navigateType = 'switchTab'
	}
	navigateTo(link,navigateType)
}
</script>

<style lang="scss" scoped>
.title-bar {
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        width: 4px;
        height: 70%;
        border-radius: 4px;
        @apply bg-primary;
    }
}
</style>
