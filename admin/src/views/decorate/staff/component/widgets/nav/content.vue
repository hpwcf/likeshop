<template>
    <widget-root :styles="styles">
        <div class="nav">
            <div
                class="grid grid-rows-auto gap-y-3 w-full bg-white p-[10px]"
                :style="{
                    'grid-template-columns': `repeat(${content.per_line}, 1fr)`,
                    'background-color': styles.component_bg_color,
                    'border-radius': `${styles.border_top_radius}px ${styles.border_top_radius}px ${styles.border_bottom_radius}px ${styles.border_bottom_radius}px`
                }"
            >
                <div v-for="(item, index) in showList" :key="index" class="flex flex-col items-center gap-y-[7px]">
                    <decoration-img
                        v-if="content.navigator_type == 1 || content.navigator_type == 2"
                        width="41px"
                        height="41px"
                        :src="item.image"
                        :radius="styles.image_radius"
                        alt=""
                    />
                    <div
                        :style="{ color: styles.text_color }"
                        v-if="content.navigator_type == 1 || content.navigator_type == 3"
                    >
                        {{ item.name }}
                    </div>
                </div>
            </div>
        </div>
    </widget-root>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'

import DecorationImg from '../../decoration-img.vue'
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

const showList = computed(() => {
    const data = props.content.data?.filter((item: any) => item.is_show == '1') || []
    return data.slice(0, props.content.show_line * props.content.per_line)
})
</script>

<style lang="scss" scoped></style>
