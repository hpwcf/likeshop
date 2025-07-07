<template>
    <widget-root :styles="styles">
        <div class="search">
            <div
                class="search-con flex items-center px-[15px]"
                :style="{ 'background': styles.component_bg_color }"
            >
                <icon name="el-icon-Search" :size="17" :color="styles.icon_color"/>
                <div
                    class="flex-1"
                    :style="{
                    'text-align': styles.align,
                    'color': styles.text_color
                }"
                >
                    <span class="mr-[5px]">{{ content.placeholder }}</span>
                </div>
            </div>
        </div>
    </widget-root>
</template>
<script lang="ts" setup>
import type {PropType} from 'vue'
import type options from './options'
import WidgetRoot from '../widget-root.vue'

type OptionsType = ReturnType<typeof options>
defineProps({
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
.search {
    padding: 7px 12px;

    .search-con {
        height: 100%;
        height: 36px;
        border-radius: 36px;
        background: #ffffff;
        color: #999999;
    }
}
</style>
