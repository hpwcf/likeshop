<template>
    <view class="user-recharge">
        <z-paging
            auto-show-back-to-top
            ref="paging"
            v-model="dataList"
            @query="queryList"
            :fixed="false"
            height="100%"
        >
            <template v-for="(item, index) in dataList" :key="index">
                <view class="wrapper">
                    <view class="left">
                        <view class="title text-lg">余额充值</view>
                        <view class="time">{{ item.create_time }}</view>
                    </view>
                    <view class="right"> +{{ item.order_amount }} </view>
                </view>
            </template>
        </z-paging>
    </view>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import { apiRechargeLogLists } from '@/api/wallet'

const paging = shallowRef<any>(null)
const dataList = ref<any>([])
const queryList = async (page_no: number, page_size: number) => {
    try {
        const { lists } = await apiRechargeLogLists({
            page_no,
            page_size
        })
        paging.value.complete(lists)
    } catch (e) {
        console.log('报错=>', e)
        //TODO handle the exception
        paging.value.complete(false)
    }
}
</script>

<style lang="scss" scoped>
.user-recharge {
    height: calc(100vh - env(safe-area-inset-bottom));
    padding-top: 15rpx;
    .wrapper {
        padding: 20rpx 21rpx;
        background-color: rgba(255, 255, 255, 1);
        border-top: 1px solid rgba(234, 234, 234, 1);
        display: flex;
        justify-content: space-between;
        .left {
            .time {
                margin-top: 10rpx;
                font-size: 24rpx;
                color: #999;
            }
        }
        .right {
            color: #ff2c3c;
            font-size: 38rpx;
        }
    }
}
</style>
