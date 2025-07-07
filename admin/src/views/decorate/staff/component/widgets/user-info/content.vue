<template>
    <div class="user-info">
        <div class="flex justify-center flex-1">
            <div class="flex items-center flex-1">
                <img src="./images/default_avatar.png" class="w-[54px] h-[54px]" alt="" />
                <div class="ml-2 text-[#ffffff]">
                    <div class="text-lg font-medium">爱按摩的派大星</div>
                    <div class="text-[#ffffff] text-sm mt-1" v-if="content.user_info == 1">
                        账户: 2265895
                    </div>
                    <div class="text-[#ffffff] text-sm mt-1" v-else>手机号: 13000130000</div>
                </div>
            </div>
            <!-- <div class="flex items-center flex-none">
                <Icon name="el-icon-Arrow-Right" size="18" />
            </div> -->
        </div>

        <div class="bg-body mt-4 rounded-xl p-[10px]">
            <div class="flex justify-around py-2">
                <div class="text-center" v-if="content.content?.includes('value1')">
                    <div class="text-[18px] font-bold text-[#F56C6C]">100.00</div>
                    <div class="text-xs text-tx-secondary">保证金</div>
                </div>
                <div class="text-center" v-if="content.content?.includes('value2')">
                    <div class="text-[18px] font-bold text-[#F56C6C]">100.00</div>
                    <div class="text-xs">佣金</div>
                </div>
                <div class="text-center" v-if="content.content?.includes('value3')">
                    <div class="text-[18px] font-bold text-[#F56C6C]">16</div>
                    <div class="text-xs">服务项目</div>
                </div>
            </div>
            <!-- <div class="flex gap-x-[10px] mt-2">
                <div class="comment flex-1">
                    <div class="text-base text-[#38866C]">我的评价</div>
                    <div>
                        <span class="text-xl font-medium text-[#38866C]">28</span>
                        <span class="text-tx-secondary">条</span>
                    </div>
                </div>
                <div class="wallet flex-1">
                    <div class="text-base text-[#967242]">我的钱包</div>
                    <div>
                        <span class="text-xl font-medium text-[#967242]">2844.00</span>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
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
.user-info {
    padding: 24px 12px 0 12px;
    //height: 115px;
    //background-position: bottom;
    //background-size: 100% auto;
    .comment {
        background-color: #effbf6;
        background-image: url('./images/comment.png');
        background-size: 100% auto;
        border-radius: 10px;
        padding: 16px 10px;
    }
    .wallet {
        background-color: #fcf6ec;
        background-image: url('./images/wallet.png');
        background-size: 100% auto;
        border-radius: 10px;
        padding: 16px 10px;
    }
}
</style>
