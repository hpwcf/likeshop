<template>
    <div class="user-order bg-white mx-[10px] mt-[10px] rounded-lg p-[15px]">
        <div
            v-if="content.title"
            class="title flex justify-between font-medium text-lg"
        >
            <div>{{ content.title }}</div>
            <div class="flex items-center text-tx-secondary font-normal text-xs">
                <span class="mr-1">查看全部订单</span>
                <Icon name="el-icon-Arrow-Right" />
            </div>
        </div>
        <div class="order-nav flex">
            <div class="nav-item flex flex-col items-center justify-center" v-if="content.pay_show">
                <DecorationImg width="34" height="34" :src="content.pay_icon" alt="" />
                <div class="text-xs mt-2">{{ content.pay_name }}</div>
            </div>
            <div class="nav-item flex flex-col items-center justify-center" v-if="content.subscribe_show">
                <DecorationImg width="34" height="34" :src="content.subscribe_icon" alt="" />
                <div class="text-xs mt-2">{{ content.subscribe_name }}</div>
            </div>
            <div class="nav-item flex flex-col items-center justify-center" v-if="content.service_show">
                <DecorationImg width="34" height="34" :src="content.service_icon" alt="" />
                <div class="text-xs mt-2">{{ content.service_name }}</div>
            </div>
            <div class="nav-item flex flex-col items-center justify-center" v-if="content.completed_show">
                <DecorationImg width="34" height="34" :src="content.completed_icon" alt="" />
                <div class="text-xs mt-2">{{ content.completed_name }}</div>
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
</script>

<style lang="scss" scoped>
.user-order {
    .order-title {
        padding: 12px 15px;
    }
    .order-nav {
        padding: 13px 0 0 0;
        .nav-item {
            flex: 1;
            .nav-icon {
                width: 26px;
                height: 26px;
                margin-bottom: 6px;
            }
        }
    }
}
</style>
