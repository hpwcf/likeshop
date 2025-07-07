<template>
    <widget-root :styles="styles">
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
            <div>
                <div
                    v-if="content.show_right_btn"
                    class="flex items-center"
                    :style="{ color: content.btnColor }"
                >
                    <span>{{ content.btnText }}</span>
                    <Icon name="el-icon-Arrow-Right" size="12" />
                </div>
            </div>
        </div>
    </widget-root>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'

import WidgetRoot from '../widget-root.vue'
import type options from './options'

type OptionsType = ReturnType<typeof options>
const props = defineProps({
    content: {
        type: Object as PropType<OptionsType['content']>,
        default: () => ({})
    },
    styles: {
        type: Object as PropType<OptionsType['styles']>,
        default: () => ({})
    }
})
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
        height: 60%;
        border-radius: 4px;
        @apply bg-primary;
    }
}
</style>
