<template>
    <widget-root :styles="styles">
        <div class="banner relative">
            <div class="banner-image w-full h-full">
                <decoration-img
                    width="100%"
                    :height="content.style == 1 ? height : '550px'"
                    :src="getImage"
                    :radius="styles.border_radius"
                    fit="contain"
                />
            </div>
            <indicator
                :type="styles.mode"
                :align="styles.indicator_pos"
            />
        </div>
    </widget-root>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'

import DecorationImg from '../../decoration-img.vue'
import WidgetRoot from '../widget-root.vue'
import Indicator from './indicator.vue'
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
    },
    height: {
        type: String,
        default: '170px'
    }
})

const showList = computed(() => {
    return props.content.data?.filter((item: any) => item.is_show == '1') || []
})

const getImage = computed(() => {
    if (Array.isArray(showList.value)) {
        return showList.value[0] ? showList.value[0].image : ''
    }
    return ''
})
</script>

<style lang="scss" scoped></style>
