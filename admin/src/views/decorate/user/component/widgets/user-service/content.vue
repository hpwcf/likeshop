<template>
    <div class="my-service bg-white mx-[10px] mt-[10px] rounded-lg p-[15px]">
        <div
            v-if="content.title"
            class="title font-medium text-lg"
        >
            <div>{{ content.title }}</div>
        </div>
        <div v-if="content.style == 1" class="grid grid-cols-4 gap-x-9 gap-y-7">
            <div
                v-for="(item, index) in showList"
                :key="index"
                class="flex flex-col items-center pt-[20px]"
            >
                <DecorationImg width="34" height="34" :src="item.image" alt="" />
                <div class="mt-[11px] text-xs">{{ item.name }}</div>
            </div>
        </div>
        <div v-if="content.style == 2">
            <div
                v-for="(item, index) in showList"
                :key="index"
                class="flex items-center h-[50px] px-[12px]"
            >
                <DecorationImg width="34" height="34" :src="item.image" alt="" />
                <div class="ml-[10px] flex-1 text-xs">{{ item.name }}</div>
                <div class="text-muted">
                    <Icon name="el-icon-Arrow-Right" />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'

import DecorationImg from '../../decoration-img.vue'
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
    return props.content.data?.filter((item: any) => item.is_show == '1') || []
})
</script>
